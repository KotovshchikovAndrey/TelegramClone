import { Model } from "mongoose"
import { Conversation, Member, Message } from "../conversation.entity"
import { IConversationRepository } from "./interfaces/conversation.repository"
import { InjectModel } from "@nestjs/mongoose"
import {
  CreateConversationDTO,
  CreateMemberDTO,
  CreateMessageDTO,
  UpdateMessageDTO,
} from "../conversation.dto"
import { randomUUID } from "crypto"

export class MongoConversationRepository implements IConversationRepository {
  constructor(
    @InjectModel("Conversation")
    private readonly conversations: Model<Conversation>,

    @InjectModel("Message")
    private readonly messages: Model<Message>,

    @InjectModel("Member")
    private readonly members: Model<Member>,
  ) {}

  async findPersonalConversation({
    first_user,
    second_user,
  }: {
    first_user: string
    second_user: string
  }) {
    const conversation = await this.conversations
      .aggregate([
        {
          $lookup: {
            from: "members",
            localField: "uuid",
            foreignField: "conversation",
            as: "members",
          },
        },
        {
          $match: {
            is_group: false,
            "members.account": { $in: [first_user, second_user] },
          },
        },
        {
          $project: {
            _id: 0,
            uuid: 1,
            is_group: 1,
            name: 1,
            description: 1,
            avatar: 1,
            created_at: 1,
          },
        },
      ])
      .exec()

    return conversation.length !== 0 ? conversation[0] : null
  }

  async findConversationMember({
    user,
    conversation,
  }: {
    user: string
    conversation: string
  }) {
    const member = await this.members
      .findOne({
        account: user,
        conversation: conversation,
      })
      .exec()

    return member
  }

  async findGroupConversation(uuid: string) {
    const conversation = await this.conversations
      .findOne({
        uuid,
        is_group: true,
      })
      .exec()

    return conversation
  }

  async findMessage(uuid: string) {
    const message = await this.messages
      .findOne({
        uuid,
      })
      .exec()

    return message
  }

  async createConversation(dto: CreateConversationDTO) {
    const newConversation = new this.conversations({
      uuid: randomUUID(),
      ...dto,
    })

    return newConversation.save()
  }

  async createMembers(dto: CreateMemberDTO[]) {
    const newMembers = []
    for (const member of dto) {
      newMembers.push({ uuid: randomUUID(), ...member })
    }

    const createdMembers = await this.members.create(newMembers)
    return createdMembers
  }

  async createMessage(dto: CreateMessageDTO) {
    const newMessage = new this.messages({
      uuid: randomUUID(),
      ...dto,
    })

    return newMessage.save()
  }

  async updateMessage(dto: UpdateMessageDTO & { media_url?: string }) {
    const updatedMessage = await this.messages
      .findOneAndUpdate(
        {
          uuid: dto.uuid,
        },
        {
          text: dto.text,
          media_url: dto.media_url,
        },
        { new: true },
      )
      .exec()

    return updatedMessage
  }
}
