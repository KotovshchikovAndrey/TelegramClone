import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { MessageService } from "./message.service"
import { Interlocutor, Message } from "./message.entity"
import {
  CreateMessageDTO,
  CurrentUserDTO,
  MessageHistoryDTO,
} from "./message.dto"
import { CurrentUser } from "./decorators/auth.decorator"

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
  ) {
    return this.messageService.createMessage(currentUser, dto)
  }
}
