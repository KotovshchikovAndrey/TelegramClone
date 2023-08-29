import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql"
import { FileUpload } from "../file/file.types"
import {
  AccountMessageStatus,
  Conversation,
  ConversationWithMessageSummary,
  Message,
} from "./conversation.entity"
import * as GraphQLUpload from "graphql-upload/GraphQLUpload.js"
import { CurrentUser } from "../user-account/decorators/auth.decorator"
import {
  CreateGroupDTO,
  CreatePersonalMessageDTO,
  GetMessageHistoryDTO,
  SetUserMessageStatusDTO,
  UpdateMessageDTO,
} from "./conversation.dto"
import { ConversationService } from "./conversation.service"
import { FileDTO } from "../file/file.dto"
import { User } from "../user-account/user-account.entity"

@Resolver()
export class ConversationResolver {
  constructor(private readonly conversationService: ConversationService) {}

  @Query(() => [ConversationWithMessageSummary], { nullable: "items" })
  async getAllConversationsForCurrentUser(
    @CurrentUser() currentUser: User,
    @Args("limit", { type: () => Int, defaultValue: 10 })
    limit: number,
    @Args("offset", { type: () => Int, defaultValue: 0 })
    offset: number,
  ) {
    return this.conversationService.getAllConversationsForCurrentUser(
      currentUser,
      {
        limit: limit,
        offset: offset,
      },
    )
  }

  @Query(() => Int, { defaultValue: 0 })
  async getUnreadMessageCountForCurrentUser(
    @CurrentUser() currentUser: User,
    @Args("conversation") conversation: string,
  ) {
    return this.conversationService.getUnreadMessageCountForCurrentUser(
      currentUser,
      conversation,
    )
  }

  @Query(() => [Message], { nullable: "items" })
  async getMessageHistoryInConversation(
    @CurrentUser() currentUser: User,
    @Args("dto") dto: GetMessageHistoryDTO,
  ) {
    return this.conversationService.getMessageHistoryInConversation(
      currentUser,
      dto,
    )
  }

  @Mutation(() => Message)
  async createPersonalMessage(
    @CurrentUser() currentUser: User,
    @Args("dto") dto: CreatePersonalMessageDTO,
    @Args({ name: "files", type: () => [GraphQLUpload], defaultValue: [] })
    files: Promise<FileUpload>[],
  ) {
    let messageFiles: FileDTO[] = []
    if (files.length !== 0) {
      messageFiles = await FileDTO.fromFileUploadArray(files)
    }

    return this.conversationService.createPersonalMessage(
      currentUser,
      dto,
      messageFiles,
    )
  }

  @Mutation(() => Conversation)
  async createNewGroup(
    @CurrentUser() currentUser: User,
    @Args("dto") dto: CreateGroupDTO,
    @Args({ name: "avatar", type: () => GraphQLUpload, nullable: true })
    avatar?: FileUpload,
  ) {
    const groupAvatar = avatar ? await FileDTO.fromFileUpload(avatar) : null
    return this.conversationService.createNewGroup(
      currentUser,
      dto,
      groupAvatar,
    )
  }

  @Mutation(() => Message)
  async updateMessage(
    @CurrentUser() currentUser: User,
    @Args("dto") dto: UpdateMessageDTO,
    @Args({ name: "files", type: () => [GraphQLUpload], defaultValue: [] })
    files: Promise<FileUpload>[],
  ) {
    let messageFiles: FileDTO[] = []
    if (files.length !== 0) {
      messageFiles = await FileDTO.fromFileUploadArray(files)
    }

    return this.conversationService.updateMessage(
      currentUser,
      dto,
      messageFiles,
    )
  }

  @Mutation(() => AccountMessageStatus)
  async setMessageStatusForCurrentUser(
    @CurrentUser() currentUser: User,
    @Args("dto") dto: SetUserMessageStatusDTO,
  ) {
    return this.conversationService.setMessageStatusForUser(currentUser, dto)
  }
}
