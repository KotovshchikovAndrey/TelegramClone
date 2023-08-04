import { InjectModel } from "@nestjs/mongoose"
import { IMessageRepository } from "./interfaces/message.repository"
import { Message } from "../message.entity"
import { Model } from "mongoose"
import { randomUUID } from "crypto"
import {
  CreateMessageDTO,
  FindMessageDTO,
  MessageHistoryDTO,
  UpdateMessageDTO,
} from "../message.dto"

export class MongoMessageRepository implements IMessageRepository {
  constructor(
    @InjectModel("Message") private readonly messages: Model<Message>,
  ) {}

  async findMessages(dto: MessageHistoryDTO & { send_to: string }) {
    const messages = await this.messages
      .find({
        $or: [
          {
            send_to: dto.send_to,
            send_from: dto.send_from,
          },
          {
            send_to: dto.send_from,
            send_from: dto.send_to,
          },
        ],
      })
      .skip(dto.offset)
      .limit(dto.limit)
      .sort("created_at")
      .exec()

    return messages
  }

  async findMessagesBy(dto: FindMessageDTO & { send_to: string }) {
    // delete undefined values
    Object.keys(dto).forEach((key: string) => !dto[key] && delete dto[key])

    const messages = await this.messages.find(dto).exec()
    return messages
  }

  async findAllSenders(send_to: string) {
    const senders = await this.messages
      .find({
        send_to,
      })
      .distinct("send_from")

    return senders
  }

  async findMessageByUUID(uuid: string) {
    const message = await this.messages.findOne({
      uuid,
    })

    return message
  }

  async createMessage(dto: CreateMessageDTO & { send_from: string }) {
    const createdMessage = new this.messages({
      ...dto,
      uuid: randomUUID().toString(),
      status: "sent",
    })

    return await createdMessage.save()
  }

  async updateMessage(dto: UpdateMessageDTO) {
    const updatedMessage = await this.messages.findOneAndUpdate(
      {
        uuid: dto.uuid,
      },
      { text: dto.text, media_url: dto.media_url },
      { new: true },
    )

    return updatedMessage
  }
}
