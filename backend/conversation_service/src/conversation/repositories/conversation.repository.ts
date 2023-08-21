import { Model } from "mongoose"
import {
  AccountMessageStatus,
  Conversation,
  Member,
  Message,
} from "../conversation.entity"
import { IConversationRepository } from "./interfaces/conversation.repository"
import { InjectModel } from "@nestjs/mongoose"
import {
  CreateConversationDTO,
  CreateMemberDTO,
  CreateMessageDTO,
  SetAccountMessageStatusDTO,
  SetMessageStatusDTO,
  UpdateConversationDTO,
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

    @InjectModel("AccountMessageStatus")
    private readonly accountMessageStatuses: Model<AccountMessageStatus>,
  ) {}

  async findAllUserConversations({
    user_account,
    limit,
    offset,
  }: {
    user_account: string
    limit: number
    offset: number
  }) {
    const conversations = await this.conversations
      .aggregate([
        {
          $lookup: {
            from: "members",
            localField: "uuid",
            foreignField: "conversation",
            as: "members",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  account: 1,
                },
              },
            ],
          },
        },
        { $match: { "members.account": user_account } },
        {
          $lookup: {
            from: "messages",
            localField: "uuid",
            foreignField: "conversation",
            as: "messages",
            pipeline: [
              {
                $lookup: {
                  from: "accounts",
                  localField: "sender",
                  foreignField: "uuid",
                  as: "sender",
                },
              },
              {
                $unwind: "$sender",
              },
              {
                $project: {
                  _id: 0,
                  uuid: 1,
                  text: 1,
                  media_url: 1,
                  created_at: 1,
                  status: 1,
                  sender: 1,
                },
              },
              {
                $sort: { created_at: -1 },
              },
              {
                $limit: 1,
              },
            ],
          },
        },
        {
          $addFields: { last_message: { $arrayElemAt: ["$messages", -1] } },
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
            last_message_at: 1,
            last_message: 1,
          },
        },
      ])
      .skip(offset)
      .limit(limit)
      .sort("-last_message_at")
      .exec()

    return conversations
  }

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

  async findPersonalConversationByName(name: string) {
    const conversation = await this.conversations
      .findOne({
        name,
        is_group: false,
      })
      .exec()

    return conversation
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

  async findAllMembersInConversation(conversation: string) {
    const members = await this.members
      .find({
        conversation,
      })
      .exec()

    return members
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
      newMembers.push({
        uuid: `${member.account}_${member.conversation}`,
        ...member,
      })
    }

    const createdMembers = await this.members.create(newMembers)
    return createdMembers
  }

  async createMessage(dto: CreateMessageDTO) {
    const newMessage = new this.messages({
      uuid: randomUUID(),
      ...dto,
    })

    const createdMessage = newMessage.save().then((message) => {
      this.updateLastMessageDate(message.conversation)
      return message.populate({
        path: "sender",
        foreignField: "uuid",
      })
    })

    return createdMessage
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
      .populate({
        path: "sender",
        foreignField: "uuid",
      })
      .exec()

    return updatedMessage
  }

  async updateConversation(
    conversation_uuid: string,
    dto: UpdateConversationDTO,
  ) {
    // remove undefined values
    Object.keys(dto).forEach((key) => dto[key] === undefined && delete dto[key])
    const updatedConversation = this.conversations
      .findOneAndUpdate(
        {
          uuid: conversation_uuid,
        },
        {
          ...dto,
        },
        { new: true },
      )
      .exec()

    return updatedConversation
  }

  async setMessageStatus(dto: SetMessageStatusDTO) {
    const updatedMessage = await this.messages.findOneAndUpdate(
      {
        uuid: dto.uuid,
      },
      { status: dto.status },
      { new: true },
    )

    return updatedMessage
  }

  async setAccountMessageStatus(dto: SetAccountMessageStatusDTO) {
    let accountMessageStatuses = await this.accountMessageStatuses
      .findOneAndUpdate(
        {
          account: dto.account,
          message: dto.message,
        },
        {
          status: dto.status,
        },
        { new: true },
      )
      .exec()

    if (accountMessageStatuses == null) {
      const newMemberMessageStatus = new this.accountMessageStatuses(dto)
      accountMessageStatuses = await newMemberMessageStatus.save()
    }

    return accountMessageStatuses
  }

  async countMembersInConversation(conversation: string) {
    const membersCount = await this.members
      .countDocuments({
        conversation: conversation,
      })
      .exec()

    return membersCount
  }

  async countAccountMesssageStatusesInConversation(conversation: string) {
    const aggregation = await this.accountMessageStatuses
      .aggregate([
        {
          $lookup: {
            from: "messages",
            localField: "message",
            foreignField: "uuid",
            as: "message",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  conversation: 1,
                },
              },
            ],
          },
        },
        { $match: { "message.conversation": conversation } },
        {
          $group: {
            _id: null,
            delivered: {
              $sum: {
                $cond: [{ $eq: ["$status", "delivered"] }, 1, 0],
              },
            },
            readed: {
              $sum: {
                $cond: [{ $eq: ["$status", "readed"] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            delivered: 1,
            readed: 1,
          },
        },
      ])
      .exec()

    return aggregation ? aggregation[0] : { delivered: 0, readed: 0 }
  }

  private async updateLastMessageDate(conversation: string) {
    await this.conversations.updateOne(
      {
        uuid: conversation,
      },
      {
        $set: {
          last_message_at: new Date(Date.now()),
        },
      },
    )

    return null
  }
}
