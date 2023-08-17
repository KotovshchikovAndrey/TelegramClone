import { Injectable, Inject } from "@nestjs/common"
import axios from "axios"
import { IMessageRepository } from "./repositories/interfaces/message.repository"
import { FileService } from "src/file/file.service"
import { FileDTO } from "src/file/file.dto"
import { User } from "src/app.entity"
import {
  CreateMessageDTO,
  FindAllMediaDTO,
  MessageHistoryDTO,
  UpdateMessageDTO,
  UpdateMessageStatusDTO,
} from "./message.dto"
import { MediaHistory } from "./message.entity"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class MessageService {
  constructor(
    @Inject("MessageRepository")
    private readonly repository: IMessageRepository,
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
  ) {}

  async getMessageHistory(currentUser: User, dto: MessageHistoryDTO) {
    const userUUID = currentUser.user_uuid
    return this.repository.findMessages({
      ...dto,
      send_to: userUUID,
    })
  }

  async getNotReceivedMessages(currentUser: User) {
    const userUUID = currentUser.user_uuid
    return this.repository.findMessagesBy({
      send_to: userUUID,
      status: "sent",
    })
  }

  async getAllInterlocutors(currentUser: User) {
    const userUUID = currentUser.user_uuid
    const sendersUUIDS = await this.repository.findAllSenders(userUUID)

    return await this.fetchUsersInfo(sendersUUIDS)
  }

  async createMessage(
    currentUser: User,
    dto: CreateMessageDTO,
    messageFiles: FileDTO[],
  ) {
    const usersInfo = await this.fetchUsersInfo([dto.send_to])
    if (usersInfo.length === 0) {
      throw Error("User does not exists!")
    }

    const userUUID = currentUser.user_uuid
    dto.media_url = await this.fileService.uploadFiles(messageFiles)

    return this.repository.createMessage({
      ...dto,
      send_from: userUUID,
    })
  }

  async updateMessage(
    currentUser: User,
    dto: UpdateMessageDTO,
    messageFiles: FileDTO[],
  ) {
    const message = await this.repository.findMessageByUUID(dto.uuid)
    if (!message) {
      throw Error("Message does not exists!")
    }

    const userUUID = currentUser.user_uuid
    if (message.send_from !== userUUID) {
      throw Error("Forbidden!")
    }

    dto.media_url =
      message.media_url !== null
        ? await this.fileService.updateFiles(message.media_url, messageFiles)
        : await this.fileService.uploadFiles(messageFiles)

    return this.repository.updateMessage(dto)
  }

  async setMessageStatus(currentUser: User, dto: UpdateMessageStatusDTO) {
    const message = await this.repository.findMessageByUUID(dto.uuid)
    if (!message) {
      throw Error("Message does not exists!")
    }

    if (message.send_to !== currentUser.user_uuid) {
      throw Error("forbidden!")
    }

    const updatedMessage = await this.repository.updateMessageStatus(dto)
    return updatedMessage
  }

  async getAllMediaInChat(currentUser: User, dto: FindAllMediaDTO) {
    const mediaUrls = await this.repository.findAllMedia({
      ...dto,
      send_from: currentUser.user_uuid,
    })

    const mediaHistory = new MediaHistory()
    mediaHistory.media_urls = mediaUrls

    return mediaHistory
  }

  private async fetchUsersInfo(usersUUIDS: string[]) {
    try {
      const authServiceHost = this.configService.get("AUTH_SERVICE_HOST")
      const response = await axios.post(authServiceHost + "/get-users-info", {
        user_uuids: usersUUIDS,
      })

      return response.data
    } catch (error) {
      throw Error("Service Unavailable!")
    }
  }
}
