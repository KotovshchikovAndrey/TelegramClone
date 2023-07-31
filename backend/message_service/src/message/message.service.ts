import { Injectable, Inject } from "@nestjs/common"
import { IMessageRepository } from "./repositories/interfaces/message.repository"
import { CreateMessageDTO, GetMessageListDTO } from "./message.dto"

@Injectable()
export class MessageService {
  constructor(
    @Inject("MessageRepository")
    private readonly messageRepository: IMessageRepository,
  ) {}

  async getMessages(dto: GetMessageListDTO) {
    return this.messageRepository.findAll(dto)
  }

  async getNotReceivedMessages(userUUID: string) {
    return this.messageRepository.findBy({
      send_to: userUUID,
      status: "sent",
    })
  }

  async getAllInterlocutors(userUUID: string) {
    const interlocutors = await this.messageRepository.findAllSenders(userUUID)
    return interlocutors
  }

  async createMessage(dto: CreateMessageDTO) {
    return this.messageRepository.create(dto)
  }
}
