import {
  CreateConversationDTO,
  CreateMemberDTO,
  CreateMessageDTO,
  GetMessageHistoryDTO,
  SetAccountMessageStatusDTO,
  SetMessageStatusDTO,
  UpdateConversationDTO,
  UpdateMessageDTO,
} from "src/conversation/conversation.dto"
import {
  AccountMessageStatus,
  Conversation,
  Member,
  Message,
} from "src/conversation/conversation.entity"

export interface IConversationRepository {
  findConversationsWhereAccountIsMember({
    account,
    limit,
    offset,
  }: {
    account: string
    limit: number
    offset: number
  }): Promise<Conversation[]>

  findConversationByUUID(uuid: string): Promise<Conversation>

  findPersonalConversation({
    first_user,
    second_user,
  }: {
    first_user: string
    second_user: string
  }): Promise<Conversation | null>

  findPersonalConversationByName(name: string): Promise<Conversation | null>

  findConversationMember({
    account,
    conversation,
  }: {
    account: string
    conversation: string
  }): Promise<Member | null>

  findGroupConversation(uuid: string): Promise<Conversation | null>

  findMessage(uuid: string): Promise<Message | null>

  findAllMembersInConversation(conversation: string): Promise<Member[]>

  findAllMessagesByConversation(dto: GetMessageHistoryDTO): Promise<Message[]>

  createConversation(dto: CreateConversationDTO): Promise<Conversation>

  createMembers(dto: CreateMemberDTO[]): Promise<Member[]>

  createMessage(dto: CreateMessageDTO): Promise<Message>

  updateConversation(
    conversation_uuid: string,
    dto: UpdateConversationDTO,
  ): Promise<Conversation>

  updateMessage(
    dto: UpdateMessageDTO & { media_path?: string },
  ): Promise<Message>

  setMessageStatus(dto: SetMessageStatusDTO): Promise<Message>

  setMessageStatusForAccount(
    dto: SetAccountMessageStatusDTO,
  ): Promise<AccountMessageStatus>

  countMembersInConversation(conversation: string): Promise<number>

  countMesssageStatusesSummary(
    message: string,
  ): Promise<{ total: number; delivered: number; readed: number }>

  countUnreadMessagesForAccount({
    account,
    conversation,
  }: {
    account: string
    conversation: string
  }): Promise<{ count: number }>
}
