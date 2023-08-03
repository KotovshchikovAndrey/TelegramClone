import { Injectable, Inject } from "@nestjs/common"
import { IMessageRepository } from "../repositories/interfaces/message.repository"
import {
  CreateMessageDTO,
  CurrentUserDTO,
  FileDTO,
  MessageHistoryDTO,
  UpdateMessageDTO,
} from "../message.dto"
import axios from "axios"
import { FileService } from "./file.service"

@Injectable()
export class MessageService {
  constructor(
    @Inject("MessageRepository")
    private readonly messageRepository: IMessageRepository,
    private readonly fileService: FileService,
  ) {}

  async getMessageHistory(currentUser: CurrentUserDTO, dto: MessageHistoryDTO) {
    const userUUID = currentUser.user_uuid
    return this.messageRepository.findMessages({
      ...dto,
      send_to: userUUID,
    })
  }

  async getNotReceivedMessages(currentUser: CurrentUserDTO) {
    const userUUID = currentUser.user_uuid
    return this.messageRepository.findMessagesBy({
      send_to: userUUID,
      status: "sent",
    })
  }

  async getAllInterlocutors(currentUser: CurrentUserDTO) {
    const userUUID = currentUser.user_uuid
    const sendersUUIDS = await this.messageRepository.findAllSenders(userUUID)

    try {
      const authServiceHost = "http://127.0.0.1:8000/api/v1"
      const response = await axios.post(authServiceHost + "/get-users-info", {
        user_uuids: sendersUUIDS,
      })

      return response.data
    } catch (error) {
      console.log(error)
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

    return this.messageRepository.createMessage({
      ...dto,
      send_from: userUUID,
    })
  }

  async updateMessage(
    currentUser: CurrentUserDTO,
    dto: UpdateMessageDTO,
    messageFiles?: FileDTO[],
  ) {
    const message = await this.messageRepository.findMessageByUUID(dto.uuid)
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

    return this.messageRepository.updateMessage(dto)
  }
}
