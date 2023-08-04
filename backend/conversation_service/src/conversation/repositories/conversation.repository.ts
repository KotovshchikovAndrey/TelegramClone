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
  CreateConversationDTO,
  CreateMemberDTO,
  CreateMembersDTO,
  CreateMessageDTO,
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

  async createMessage(dto: CreateMessageDTO & { sender: string }) {
    const newMessage = new this.conversationMessages({
      ...dto,
      uuid: randomUUID().toString(),
      status: "sent",
    })

    return newMessage.save()
  }

  async createConversation(dto: CreateConversationDTO) {
    const newConversation = new this.conversations({
      ...dto,
      uuid: randomUUID().toString(),
    })

    return newConversation.save()
  }

  async createConversationMember(dto: CreateMemberDTO) {
    const newMember = new this.conversationMembers({
      ...dto,
      uuid: randomUUID().toString(),
      is_active: true,
    })

    return newMember.save()
  }

  async createConversationMembers(dto: CreateMembersDTO) {
    const members = dto.members.map((member) => {
      return {
        uuid: randomUUID().toString(),
        is_active: true,
        user: member.user,
        is_admin: member.is_admin,
        conservation: dto.conversation,
      }
    })

    const newMembers = await this.conversationMembers.create(members)
    return newMembers
  }
}
