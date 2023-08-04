import {
  CreateMessageDTO,
  FindAllMediaDTO,
  FindMessageDTO,
  MessageHistoryDTO,
  UpdateMessageDTO,
  UpdateMessageStatusDTO,
} from "src/message/message.dto"
import { Message } from "src/message/message.entity"

export interface IMessageRepository {
  findMessages(dto: MessageHistoryDTO & { send_to: string }): Promise<Message[]>
  findMessagesBy(dto: FindMessageDTO & { send_to: string }): Promise<Message[]>
  findAllMedia(dto: FindAllMediaDTO & { send_from: string }): Promise<string[]>
  findAllSenders(send_to: string): Promise<string[]>
  findMessageByUUID(uuid: string): Promise<Message | null>
  createMessage(dto: CreateMessageDTO & { send_from: string }): Promise<Message>
  updateMessage(dto: UpdateMessageDTO): Promise<Message>
  updateMessageStatus(dto: UpdateMessageStatusDTO): Promise<Message>
}
