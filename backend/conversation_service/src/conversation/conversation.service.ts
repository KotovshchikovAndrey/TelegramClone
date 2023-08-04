import { Inject, Injectable } from "@nestjs/common"
import { IConversationRepository } from "./repositories/interfaces/conversation.repository"
import { User } from "src/app.entity"
import {
  CreateConversationDTO,
  CreateMemberDTO,
  CreateMembersDTO,
  CreateMessageDTO,
} from "./conversation.dto"

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

    const currentMember =
      conversation.members.find(
        (member) => member.user === currentUser.user_uuid,
      ) ?? null

    if (!currentMember || !currentMember.is_admin) {
      throw Error("Forbidden!")
    }

    const newMembers = await this.repository.createConversationMembers(dto)
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
      sender: currentMember.user,
    })

    return newMessage
  }
}
