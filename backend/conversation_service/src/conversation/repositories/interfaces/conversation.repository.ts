import {
  Conversation,
  ConversationMember,
  ConversationMessage,
} from "src/conversation/conversation.entity"
import {
  CreateConversationDTO,
  CreateMemberDTO,
  CreateMembersDTO,
  CreateMessageDTO,
} from "src/conversation/conversation.dto"

export interface IConversationRepository {
  findAllUserConversations(user: string): Promise<Conversation[]>
  findConversationByUUID(uuid: string): Promise<Conversation | null>
  createConversation(dto: CreateConversationDTO): Promise<Conversation>
  createConversationMember(dto: CreateMemberDTO): Promise<ConversationMember>
  createMessage(
    dto: CreateMessageDTO & { sender: string },
  ): Promise<ConversationMessage>
  createConversationMembers(
    dto: CreateMembersDTO,
  ): Promise<ConversationMember[]>
}
