import {
  CreateMessageDTO,
  FilterMessageListDTO,
  GetMessageListDTO,
} from "src/message/message.dto"
import { Message } from "src/message/message.entity"

export interface IMessageRepository {
  findAll(dto: GetMessageListDTO): Promise<Message[]>
  findBy(dto: FilterMessageListDTO): Promise<Message[]>
  findAllSenders(userUUID: string): Promise<Pick<Message, "send_from">[]>
  create(dto: CreateMessageDTO): Promise<Message>
}
