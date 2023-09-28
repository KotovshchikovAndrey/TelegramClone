import { User } from "src/user-account/user-account.entity"
import {
  CreateGroupDTO,
  CreateGroupMessageDTO,
  CreateMemberDTO,
  CreatePersonalMessageDTO,
  GetMessageHistoryDTO,
  SetUserMessageStatusDTO,
  UpdateMessageDTO,
} from "./conversation.dto"
import { FileDTO } from "src/file/file.dto"
import { Member } from "./conversation.entity"

export type GetAllConversationsForCurrentUserArgs = {
  currentUser: User
  limit: number
  offset: number
}

export type GetUnreadMessageCountForCurrentUserArgs = {
  currentUser: User
  conversation: string
}

export type GetMessageHistoryInConversationArgs = {
  currentUser: User
  dto: GetMessageHistoryDTO
}

export type CreatePersonalMessageArgs = {
  currentUser: User
  dto: CreatePersonalMessageDTO
  files: FileDTO[]
}

export type CreateGroupMessageArgs = {
  currentUser: User
  dto: CreateGroupMessageDTO
  files: FileDTO[]
}

export type CreateNewGroupArgs = {
  currentUser: User
  dto: CreateGroupDTO
  avatar?: FileDTO
}

export type AddUsersToConversationArgs = {
  conversation: string
  users: Omit<CreateMemberDTO, "conversation">[]
}

export type UpdateMessageArgs = {
  currentUser: User
  dto: UpdateMessageDTO
  files: FileDTO[]
}

export type SetMessageStatusForAccountArgs = {
  currentUser: User
  dto: SetUserMessageStatusDTO
}

export type GetNameForPersonalConversationArgs = {
  first_user: string
  second_user: string
}

export type ExcludeDuplicateMembersArgs = {
  membersInConversation: Member[]
  newMembers: CreateMemberDTO[]
}
