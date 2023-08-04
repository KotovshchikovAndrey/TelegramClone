import {
  ConversationMemberDTO,
  CreateConversationDTO,
} from "src/conversation/conversation.dto"
import { Conversation } from "src/conversation/conversation.entity"

export interface IConversationRepository {
  findConversationByUUID(uuid: string): Promise<Conversation | null>
  createConversation(dto: CreateConversationDTO): Promise<Conversation>
  updateConversationMembers(
    conversation: string,
    members: ConversationMemberDTO[],
  ): Promise<Conversation>
}
