import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, ObjectId } from "mongoose"
import { CreateConversationDTO } from "./conversation.dto"
import { randomUUID } from "crypto"
import {
  Message,
  Conversation,
  ConversationMember,
} from "./conversation.entity"

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel("Conversation")
    private readonly conversationModel: Model<Conversation>,
    @InjectModel("ConversationMember")
    private readonly conversationMemberModel: Model<ConversationMember>,
    @InjectModel("Message") private readonly messageModel: Model<Message>,
  ) {}

  async getAllConversations() {
    const conversations = await this.conversationModel.find().exec()
    console.log(conversations[0].name)
    return conversations
  }

  async createGroupConversation(dto: CreateConversationDTO) {
    const createdGroup = new this.conversationModel({
      is_group: true,
      ...dto,
    })

    return await createdGroup.save()
  }
}
