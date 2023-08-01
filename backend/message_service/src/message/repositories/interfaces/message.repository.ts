import {
  CreateMessageDTO,
  FilterMessageListDTO,
  GetMessageListDTO,
} from "src/message/message.dto"
import { Message } from "src/message/message.entity"

export interface IMessageRepository {
  findAll(dto: GetMessageListDTO & { send_to: string }): Promise<Message[]>
  findBy(dto: FilterMessageListDTO & { send_to: string }): Promise<Message[]>
  findAllSenders(send_to: string): Promise<string[]>
  create(dto: CreateMessageDTO & { send_from: string }): Promise<Message>
}
