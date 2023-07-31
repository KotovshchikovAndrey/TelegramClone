import { InjectModel } from "@nestjs/mongoose"
import { IMessageRepository } from "./interfaces/message.repository"
import { Message } from "../message.entity"
import { Model } from "mongoose"
import {
  CreateMessageDTO,
  FilterMessageListDTO,
  GetMessageListDTO,
} from "../message.dto"
import { randomUUID } from "crypto"

export class MongoMessageRepository implements IMessageRepository {
  constructor(
    @InjectModel("Message") private readonly messageModel: Model<Message>,
  ) {}

  async findAll(dto: GetMessageListDTO) {
    const messages = await this.messageModel
      .find({
        send_from: dto.send_from,
        send_to: dto.send_to,
      })
      .skip(dto.offset)
      .limit(dto.limit)
      .exec()

    return messages
  }

  async findBy(dto: FilterMessageListDTO) {
    // delete undefined values
    Object.keys(dto).forEach((key: string) => !dto[key] && delete dto[key])

    const messages = await this.messageModel.find(dto).exec()
    return messages
  }

  async findAllSenders(
    userUUID: string,
  ): Promise<Pick<Message, "send_from">[]> {
    const senders = await this.messageModel
      .find({
        send_to: userUUID,
      })
      .distinct("send_from")

    return senders
  }

  async create(dto: CreateMessageDTO) {
    const createdMessage = new this.messageModel({
      ...dto,
      uuid: randomUUID().toString(),
      status: "sent",
    })

    return await createdMessage.save()
  }
}
