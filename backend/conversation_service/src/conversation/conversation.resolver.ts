import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql"
import { FileUpload } from "src/file/file.types"
import { ConversationWithLastMessage, Message } from "./conversation.entity"
import * as GraphQLUpload from "graphql-upload/GraphQLUpload.js"
import { CurrentUser } from "./decorators/auth.decorator"
import { User } from "src/app.entity"
import { CreatePersonalMessageDTO } from "./conversation.dto"
import { ConversationService } from "./conversation.service"
import { FileDTO } from "src/file/file.dto"

@Resolver()
export class ConversationResolver {
  constructor(private readonly conversationService: ConversationService) {}

  @Query(() => [ConversationWithLastMessage], { nullable: "items" })
  async getUserConversations(
    @CurrentUser() currentUser: User,
    @Args("limit", { type: () => Int, defaultValue: 10 })
    limit: number,
    @Args("offset", { type: () => Int, defaultValue: 0 })
    offset: number,
  ) {
    return this.conversationService.getUserConversations(currentUser, {
      limit: limit,
      offset: offset,
    })
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
}
