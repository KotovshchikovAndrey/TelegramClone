import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { MessageService } from "./message.service"
import { Interlocutor, MediaHistory, Message } from "./message.entity"
import { CurrentUser } from "./decorators/auth.decorator"
import { User } from "src/app.entity"

import * as GraphQLUpload from "graphql-upload/GraphQLUpload.js"
import { FileUpload } from "src/file/file.types"

import { FileDTO } from "src/file/file.dto"
import {
  CreateMessageDTO,
  FindAllMediaDTO,
  MessageHistoryDTO,
  UpdateMessageDTO,
  UpdateMessageStatusDTO,
} from "./message.dto"

@Resolver()
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query(() => [Message], { nullable: "items" })
  async getMessageHistory(
    @CurrentUser() currentUser: User,
    @Args("dto") dto: MessageHistoryDTO,
  ) {
    return this.messageService.getMessageHistory(currentUser, dto)
  }

  @Query(() => [Message], { nullable: "items" })
  async getNotRecievedMessages(@CurrentUser() currentUser: User) {
    return this.messageService.getNotReceivedMessages(currentUser)
  }

  @Query(() => [Interlocutor], { nullable: "items" })
  async getAllInterlocutors(@CurrentUser() currentUser: User) {
    return this.messageService.getAllInterlocutors(currentUser)
  }

  @Query(() => MediaHistory)
  async getAllMediaInChat(
    @CurrentUser() currentUser: User,
    @Args("dto") dto: FindAllMediaDTO,
  ) {
    return this.messageService.getAllMediaInChat(currentUser, dto)
  }

  @Mutation(() => Message)
  async createMessage(
    @CurrentUser() currentUser: User,
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
    @CurrentUser() currentUser: User,
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

  @Mutation(() => Message)
  async setMessageStatus(
    @CurrentUser() currentUser: User,
    @Args("dto") dto: UpdateMessageStatusDTO,
  ) {
    return this.messageService.setMessageStatus(currentUser, dto)
  }
}
