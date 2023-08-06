import { Inject, Injectable } from "@nestjs/common"
import { IConversationRepository } from "./repositories/interfaces/conversation.repository"
import { User } from "src/app.entity"
import {
  CreateConversationDTO,
  CreateMemberDTO,
  CreateMembersDTO,
  CreateMessageDTO,
} from "./conversation.dto"
import { ConversationMember } from "./conversation.entity"

@Injectable()
export class ConversationService {
  constructor(
    @Inject("ConversationRepository")
    private readonly repository: IConversationRepository,
  ) {}

  async getConversation(uuid: string) {
    const conversation = await this.repository.findConversationByUUID(uuid)
    return conversation
  }

  async getAllUserConversations(currentUser: User) {
    const conversations = await this.repository.findAllUserConversations(
      currentUser.user_uuid,
    )

    return conversations
  }

  async createConversation(dto: CreateConversationDTO) {
    const newConversation = await this.repository.createConversation(dto)
    return newConversation
  }

  async addMemberToConservation(dto: CreateMemberDTO) {
    const newMember = await this.repository.createConversationMember(dto)
    return newMember
  }

  async addMembersToConservation(currentUser: User, dto: CreateMembersDTO) {
    const conversation = await this.repository.findConversationByUUID(
      dto.conversation,
    )

    if (!conversation) {
      throw Error("Conservation does not exists!")
    }

    const { members } = conversation
    const currentMember =
      members.find((member) => member.user === currentUser.user_uuid) ?? null

    if (!currentMember || !currentMember.is_admin) {
      throw Error("Forbidden!")
    }

    const membersForCreate = this.excludeDuplicateMembers(members, dto)
    const newMembers = await this.repository.createConversationMembers({
      conversation: dto.conversation,
      members: membersForCreate,
    })

    return newMembers
  }

  async createConversationMessage(currentUser: User, dto: CreateMessageDTO) {
    const conversation = await this.repository.findConversationByUUID(
      dto.conversation,
    )

    if (!conversation) {
      throw Error("Conservation does not exists!")
    }

    const currentMember =
      conversation.members.find(
        (member) => member.user === currentUser.user_uuid,
      ) ?? null

    if (!currentMember) {
      throw Error("Forbidden!")
    }

    const newMessage = await this.repository.createMessage({
      ...dto,
      sender: currentMember.uuid,
    })

    return newMessage
  }

  private excludeDuplicateMembers(
    existsMembers: ConversationMember[],
    newMembers: CreateMembersDTO,
  ) {
    const existsMembersSet = new Set(existsMembers.map((member) => member.user))
    const membersWithoutDuplicate = newMembers.members.filter(
      (member) => !existsMembersSet.has(member.user),
    )

    return membersWithoutDuplicate
  }
}
