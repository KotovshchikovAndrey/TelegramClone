import { Inject, Injectable } from "@nestjs/common"
import { IConversationRepository } from "./repositories/interfaces/conversation.repository"
import { User } from "src/app.entity"
import {
  CreateConversationDTO,
  CreateMemberDTO,
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

  async createConversationMessage(currentUser: User, dto: CreateMessageDTO) {}
}
