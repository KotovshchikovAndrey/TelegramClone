import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { MessageService } from "./services/message.service"
import { Interlocutor, Message } from "./message.entity"
import { CurrentUser } from "./decorators/auth.decorator"

import * as GraphQLUpload from "graphql-upload/GraphQLUpload.js"
import * as Upload from "graphql-upload/Upload.js"

import { FileUpload } from "./messages.types"
import {
  CreateMessageDTO,
  CurrentUserDTO,
  FileDTO,
  MessageHistoryDTO,
  UpdateMessageDTO,
} from "./message.dto"

@Resolver()
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query(() => [Message], { nullable: "items" })
  async getMessageHistory(
    @CurrentUser() currentUser: CurrentUserDTO,
    @Args("dto") dto: MessageHistoryDTO,
  ) {
    return this.messageService.getMessageHistory(currentUser, dto)
  }

  @Query(() => [Message], { nullable: "items" })
  async getNotRecievedMessages(@CurrentUser() currentUser: CurrentUserDTO) {
    return this.messageService.getNotReceivedMessages(currentUser)
  }

  @Query(() => [Interlocutor], { nullable: "items" })
  async getAllInterlocutors(@CurrentUser() currentUser: CurrentUserDTO) {
    return this.messageService.getAllInterlocutors(currentUser)
  }

  @Mutation(() => Message)
  async createMessage(
    @CurrentUser() currentUser: CurrentUserDTO,
    @Args("dto") dto: CreateMessageDTO,
    @Args({ name: "files", type: () => [GraphQLUpload], defaultValue: [] })
    files: Promise<FileUpload>[],
  ) {
    let messageFiles: FileDTO[]
    if (files.length !== 0) {
      messageFiles = await FileDTO.fromFileUploadArray(files)
    }

    return this.messageService.createMessage(currentUser, dto, messageFiles)
  }

  @Mutation(() => Message)
  async updateMessage(
    @CurrentUser() currentUser: CurrentUserDTO,
    @Args("dto") dto: UpdateMessageDTO,
    @Args({ name: "files", type: () => [GraphQLUpload], defaultValue: [] })
    files: Promise<FileUpload>[],
  ) {
    let messageFiles: FileDTO[] = []
    if (files.length !== 0) {
      messageFiles = await FileDTO.fromFileUploadArray(files)
    }

    return this.messageService.updateMessage(currentUser, dto, messageFiles)
  }
}
