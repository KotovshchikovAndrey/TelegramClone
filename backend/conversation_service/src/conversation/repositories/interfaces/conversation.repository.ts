import {
  CreateConversationDTO,
  CreateMemberDTO,
  CreateMessageDTO,
  UpdateMessageDTO,
} from "src/conversation/conversation.dto"
import {
  Conversation,
  Member,
  Message,
} from "src/conversation/conversation.entity"

export interface IConversationRepository {
  findPersonalConversation({
    first_user,
    second_user,
  }: {
    first_user: string
    second_user: string
  }): Promise<Conversation | null>

  findConversationMember({
    user,
    conversation,
  }: {
    user: string
    conversation: string
  }): Promise<Member | null>

  findGroupConversation(uuid: string): Promise<Conversation | null>

  findMessage(uuid: string): Promise<Message | null>

  createConversation(dto: CreateConversationDTO): Promise<Conversation>

  createMembers(dto: CreateMemberDTO[]): Promise<Member[]>

  createMessage(dto: CreateMessageDTO): Promise<Message>

  updateMessage(
    dto: UpdateMessageDTO & { media_url?: string },
  ): Promise<Message>
}
