import { InjectModel } from "@nestjs/mongoose"
import { IMessageRepository } from "./interfaces/message.repository"
import { Message } from "../message.entity"
import { Model } from "mongoose"
import { randomUUID } from "crypto"
import {
  CreateMessageDTO,
  FilterMessageListDTO,
  GetMessageListDTO,
} from "../message.dto"

export class MongoMessageRepository implements IMessageRepository {
  constructor(
    @InjectModel("Message") private readonly messageModel: Model<Message>,
  ) {}

  async findAll(dto: GetMessageListDTO & { send_to: string }) {
    const messages = await this.messageModel
      .find({
        send_to: dto.send_to,
        send_from: dto.send_from,
      })
      .skip(dto.offset)
      .limit(dto.limit)
      .exec()

    return messages
  }

  async findBy(dto: FilterMessageListDTO & { send_to: string }) {
    // delete undefined values
    Object.keys(dto).forEach((key: string) => !dto[key] && delete dto[key])

    const messages = await this.messageModel.find(dto).exec()
    return messages
  }

  async findAllSenders(send_to: string) {
    const senders = await this.messageModel
      .find({
        send_to,
      })
      .distinct("send_from")

    return senders
  }

  async create(dto: CreateMessageDTO & { send_from: string }) {
    const createdMessage = new this.messageModel({
      ...dto,
      uuid: randomUUID().toString(),
      status: "sent",
    })

    return await createdMessage.save()
  }
}
