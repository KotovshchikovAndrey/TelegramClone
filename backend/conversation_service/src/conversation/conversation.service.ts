import { Inject, Injectable } from "@nestjs/common"
import { IConversationRepository } from "./repositories/interfaces/conversation.repository"
import { ConversationMember } from "./conversation.entity"
import { ConversationMemberDTO } from "./conversation.dto"

@Injectable()
export class ConversationService {
  constructor(
    @Inject("ConversationRepository")
    private readonly repository: IConversationRepository,
  ) {}

  async getConversation(uuid: string) {
    const conversation = await this.repository.findConversationByUUID(uuid)
    if (conversation) {
      return conversation
    }

    const newConversation = await this.createDialog()
    return newConversation
  }

  async createDialog() {
    const newConversation = await this.repository.createConversation({
      is_group: false,
    })

    return newConversation
  }

  async setConversationMembers(conversation: string, users: string[]) {
    const members = users.map((user) => {
      const member = new ConversationMemberDTO()
      member.conversation = conversation
      member.user = user
      member.is_active = true

      return member
    })

    return this.repository.updateConversationMembers(conversation, members)
  }
}
