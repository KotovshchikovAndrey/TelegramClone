import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Message } from "./conversation.entity"
import { Model } from "mongoose"

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel("Message") private readonly messageModel: Model<Message>,
  ) {}

  async getOne(): Promise<Message> {
    return this.messageModel.findOne().exec()
  }
}
