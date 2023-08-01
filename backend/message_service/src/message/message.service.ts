import { Injectable, Inject } from "@nestjs/common"
import { IMessageRepository } from "./repositories/interfaces/message.repository"
import {
  CreateMessageDTO,
  CurrentUserDTO,
  GetMessageListDTO,
} from "./message.dto"

@Injectable()
export class MessageService {
  constructor(
    @Inject("MessageRepository")
    private readonly messageRepository: IMessageRepository,
  ) {}

  async getMessagesForMe(currentUser: CurrentUserDTO, dto: GetMessageListDTO) {
    const userUUID = currentUser.user_uuid
    return this.messageRepository.findAll({
      ...dto,
      send_to: userUUID,
    })
  }

  async getNotReceivedMessages(currentUser: CurrentUserDTO) {
    const userUUID = currentUser.user_uuid
    return this.messageRepository.findBy({
      send_to: userUUID,
      status: "sent",
    })
  }

  async getAllInterlocutors(currentUser: CurrentUserDTO) {
    const userUUID = currentUser.user_uuid
    const interlocutors = await this.messageRepository.findAllSenders(userUUID)

    return interlocutors
  }

  async createMessage(currentUser: CurrentUserDTO, dto: CreateMessageDTO) {
    const userUUID = currentUser.user_uuid
    return this.messageRepository.create({
      ...dto,
      send_from: userUUID,
    })
  }

  // async updateMessage()
}
