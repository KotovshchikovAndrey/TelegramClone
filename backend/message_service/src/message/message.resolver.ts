import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { MessageService } from "./message.service"
import { Message } from "./message.entity"
import {
  CreateMessageDTO,
  CurrentUserDTO,
  GetMessageListDTO,
} from "./message.dto"
import { UseGuards } from "@nestjs/common"
import { GetMessageListGuard } from "./message.guard"
import { CurrentUser } from "./decorators/auth.decorator"
import { ConfigService } from "@nestjs/config"

@Resolver()
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query(() => [Message], { nullable: "items" })
  async getMessagesForMe(
    @CurrentUser() currentUser: CurrentUserDTO,
    @Args("dto") dto: GetMessageListDTO,
  ) {
    return this.messageService.getMessagesForMe(currentUser, dto)
  }

  @Query(() => [Message], { nullable: "items" })
  async getNotRecievedMessages(@CurrentUser() currentUser: CurrentUserDTO) {
    return this.messageService.getNotReceivedMessages(currentUser)
  }

  @Query(() => [String], { nullable: "items" })
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
