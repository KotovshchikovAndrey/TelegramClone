import { randomUUID } from "crypto"
import { Model } from "mongoose"
import { IConversationRepository } from "./interfaces/conversation.repository"
import { InjectModel } from "@nestjs/mongoose"
import {
  Conversation,
  ConversationMember,
  ConversationMessage,
} from "../conversation.entity"
import {
  ConversationMemberDTO,
  CreateConversationDTO,
} from "../conversation.dto"

export class MongoConversationRepository implements IConversationRepository {
  constructor(
    @InjectModel("Conversation")
    private readonly conversations: Model<Conversation>,
    @InjectModel("ConversationMember")
    private readonly conversationMembers: Model<ConversationMember>,
    @InjectModel("ConversationMessage")
    private readonly conversationMessages: Model<ConversationMessage>,
  ) {}

  async findConversationByUUID(uuid: string) {
    const conversation = await this.conversations
      .findOne({
        uuid,
      })
      .exec()

    return conversation
  }

  async createConversation(dto: CreateConversationDTO) {
    const newConversation = new this.conversations({
      ...dto,
      uuid: randomUUID().toString(),
    })

    return newConversation.save()
  }

  async updateConversationMembers(
    conversation: string,
    members: ConversationMemberDTO[],
  ) {
    const updatedConversation = await this.conversations.findOneAndUpdate(
      {
        uuid: conversation,
      },
      { members },
      { new: true },
    )

    return updatedConversation
  }
}
