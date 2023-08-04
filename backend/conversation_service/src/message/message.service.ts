import { Injectable, Inject } from "@nestjs/common"
import axios from "axios"
import { IMessageRepository } from "./repositories/interfaces/message.repository"
import { FileService } from "src/file/file.service"
import { ConversationService } from "src/conversation/conversation.service"
import { FileDTO } from "src/file/file.dto"
import {
  CreateMessageDTO,
  CurrentUserDTO,
  MessageHistoryDTO,
  UpdateMessageDTO,
} from "./message.dto"

@Injectable()
export class MessageService {
  constructor(
    @Inject("MessageRepository")
    private readonly repository: IMessageRepository,
    private readonly fileService: FileService,
    private readonly conversationService: ConversationService,
  ) {}

  async getMessageHistory(currentUser: CurrentUserDTO, dto: MessageHistoryDTO) {
    const userUUID = currentUser.user_uuid
    return this.repository.findMessages({
      ...dto,
      send_to: userUUID,
    })
  }

  async getNotReceivedMessages(currentUser: CurrentUserDTO) {
    const userUUID = currentUser.user_uuid
    return this.repository.findMessagesBy({
      send_to: userUUID,
      status: "sent",
    })
  }

  async getAllInterlocutors(currentUser: CurrentUserDTO) {
    const userUUID = currentUser.user_uuid
    const sendersUUIDS = await this.repository.findAllSenders(userUUID)

    try {
      const authServiceHost = "http://127.0.0.1:8000/api/v1"
      const response = await axios.post(authServiceHost + "/get-users-info", {
        user_uuids: sendersUUIDS,
      })

      return response.data
    } catch (error) {
      throw Error("Service Unavailable!")
    }
  }

  async createMessage(
    currentUser: CurrentUserDTO,
    dto: CreateMessageDTO,
    messageFiles?: FileDTO[],
  ) {
    const userUUID = currentUser.user_uuid
    if (messageFiles) {
      dto.media_url = await this.fileService.uploadFiles(messageFiles)
    }

    return this.repository.createMessage({
      ...dto,
      send_from: userUUID,
    })
  }

  async updateMessage(
    currentUser: CurrentUserDTO,
    dto: UpdateMessageDTO,
    messageFiles?: FileDTO[],
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
      message.media_url !== undefined
        ? await this.fileService.updateFiles(message.media_url, messageFiles)
        : await this.fileService.uploadFiles(messageFiles)

    return this.repository.updateMessage(dto)
  }
}
