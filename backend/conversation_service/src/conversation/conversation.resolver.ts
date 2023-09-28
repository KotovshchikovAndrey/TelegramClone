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
import { Inject, UseGuards } from "@nestjs/common"
import { AuthGuard } from "src/user-account/auth.guard"
import { IKafkaProducer } from "src/kafka/kafka.types"

@Resolver()
export class ConversationResolver {
  constructor(
    // @Inject("KAFKA_PRODUCER")
    // private readonly kafkaProducer: IKafkaProducer,
    private readonly conversationService: ConversationService,
  ) {}

  @Query(() => [ConversationWithMessageSummary], { nullable: "items" })
  @UseGuards(AuthGuard)
  async getAllConversationsForCurrentUser(
    @CurrentUser() currentUser: User,
    @Args("limit", { type: () => Int, defaultValue: 10 })
    limit: number,
    @Args("offset", { type: () => Int, defaultValue: 0 })
    offset: number,
  ) {
    return this.conversationService.getAllConversationsForCurrentUser({
      currentUser: currentUser,
      limit: limit,
      offset: offset,
    })
  }

  @Query(() => Int, { defaultValue: 0 })
  @UseGuards(AuthGuard)
  async getUnreadMessageCountForCurrentUser(
    @CurrentUser() currentUser: User,
    @Args("conversation") conversation: string,
  ) {
    return this.conversationService.getUnreadMessageCountForCurrentUser({
      currentUser: currentUser,
      conversation: conversation,
    })
  }

  @Query(() => [Message], { nullable: "items" })
  @UseGuards(AuthGuard)
  async getMessageHistoryInConversation(
    @CurrentUser() currentUser: User,
    @Args("dto") dto: GetMessageHistoryDTO,
  ) {
    return this.conversationService.getMessageHistoryInConversation({
      currentUser: currentUser,
      dto: dto,
    })
  }

  @Mutation(() => Message, { nullable: true })
  @UseGuards(AuthGuard)
  async createPersonalMessage(
    @CurrentUser() currentUser: User,
    @Args("dto") dto: CreatePersonalMessageDTO,
    @Args({ name: "files", type: () => [GraphQLUpload], defaultValue: [] })
    files: Promise<FileUpload>[],
  ) {
    new Promise(async (resolve, reject) => {
      let messageFiles: FileDTO[] = []
      if (files.length !== 0) {
        messageFiles = await FileDTO.fromFileUploadArray(files)
      }

      const newMessage = await this.conversationService.createPersonalMessage({
        currentUser: currentUser,
        dto: dto,
        files: messageFiles,
      })

      const kafkaMessage = JSON.stringify(newMessage)
      const topicName = process.env["KAFKA_PRODUCER_TOPIC"]

      // this.kafkaProducer.sendMessage(topicName, {
      //   key: newMessage.uuid,
      //   value: kafkaMessage,
      //   partition: 1,
      // })
    })
  }

  @Mutation(() => Conversation)
  @UseGuards(AuthGuard)
  async createNewGroup(
    @CurrentUser() currentUser: User,
    @Args("dto") dto: CreateGroupDTO,
    @Args({ name: "avatar", type: () => GraphQLUpload, nullable: true })
    avatar?: FileUpload,
  ) {
    const groupAvatar = avatar ? await FileDTO.fromFileUpload(avatar) : null
    return this.conversationService.createNewGroup({
      currentUser: currentUser,
      dto: dto,
      avatar: groupAvatar,
    })
  }

  @Mutation(() => Message)
  @UseGuards(AuthGuard)
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

    return this.conversationService.updateMessage({
      currentUser: currentUser,
      dto: dto,
      files: messageFiles,
    })
  }

  @Mutation(() => AccountMessageStatus)
  @UseGuards(AuthGuard)
  async setMessageStatusForCurrentUser(
    @CurrentUser() currentUser: User,
    @Args("dto") dto: SetUserMessageStatusDTO,
  ) {
    return this.conversationService.setMessageStatusForUser({
      currentUser: currentUser,
      dto: dto,
    })
  }
}
