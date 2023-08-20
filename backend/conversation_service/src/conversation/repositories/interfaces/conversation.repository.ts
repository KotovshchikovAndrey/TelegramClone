import {
  CreateConversationDTO,
  CreateMemberDTO,
  CreateMessageDTO,
  SetMemberMessageStatusDTO,
  SetMessageStatusDTO,
  UpdateConversationDTO,
  UpdateMessageDTO,
} from "src/conversation/conversation.dto"
import {
  Conversation,
  Member,
  MemberMessageStatus,
  Message,
} from "src/conversation/conversation.entity"

export interface IConversationRepository {
  findAllUserConversations({
    user_account,
    limit,
    offset,
  }: {
    user_account: string
    limit: number
    offset: number
  }): Promise<Conversation[]>

  findPersonalConversation({
    first_user,
    second_user,
  }: {
    first_user: string
    second_user: string
  }): Promise<Conversation | null>

  findPersonalConversationByName(name: string): Promise<Conversation | null>

  findConversationMember({
    user,
    conversation,
  }: {
    user: string
    conversation: string
  }): Promise<Member | null>

  findGroupConversation(uuid: string): Promise<Conversation | null>

  findMessage(uuid: string): Promise<Message | null>

  findAllMembersInConversation(conversation: string): Promise<Member[]>

  createConversation(dto: CreateConversationDTO): Promise<Conversation>

  createMembers(dto: CreateMemberDTO[]): Promise<Member[]>

  createMessage(dto: CreateMessageDTO): Promise<Message>

  updateConversation(
    conversation_uuid: string,
    dto: UpdateConversationDTO,
  ): Promise<Conversation>

  updateMessage(
    dto: UpdateMessageDTO & { media_url?: string },
  ): Promise<Message>

  setMessageStatus(dto: SetMessageStatusDTO): Promise<Message>

  setMemberMessageStatus(
    dto: SetMemberMessageStatusDTO,
  ): Promise<MemberMessageStatus>

  aggregateMembersCountInConversation(conversation: string): Promise<number>

  aggregateMemberMesssageStatusesCountInConversation(
    conversation: string,
  ): Promise<{ delivered: number; readed: number }>
}
