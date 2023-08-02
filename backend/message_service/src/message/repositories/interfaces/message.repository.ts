import {
  CreateMessageDTO,
  FindMessageDTO,
  MessageHistoryDTO,
} from "src/message/message.dto"
import { Message } from "src/message/message.entity"

export interface IMessageRepository {
  findMessages(dto: MessageHistoryDTO & { send_to: string }): Promise<Message[]>
  findMessagesBy(dto: FindMessageDTO & { send_to: string }): Promise<Message[]>
  findAllSenders(send_to: string): Promise<string[]>
  createMessage(dto: CreateMessageDTO & { send_from: string }): Promise<Message>
}
