import {
  Conversation,
  ConversationMember,
} from "src/conversation/conversation.entity"
import {
  CreateConversationDTO,
  CreateMemberDTO,
} from "src/conversation/conversation.dto"

export interface IConversationRepository {
  findConversationByUUID(uuid: string): Promise<Conversation | null>
  createConversation(dto: CreateConversationDTO): Promise<Conversation>
  createConversationMember(dto: CreateMemberDTO): Promise<ConversationMember>
}
