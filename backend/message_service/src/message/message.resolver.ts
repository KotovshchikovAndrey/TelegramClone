import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { MessageService } from "./message.service"
import { Message } from "./message.entity"
import { CreateMessageDTO, GetMessageListDTO } from "./message.dto"
import { UseGuards } from "@nestjs/common"
import { GetMessageListGuard } from "./message.guard"

@Resolver()
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(GetMessageListGuard)
  @Query(() => [Message], { nullable: "items" })
  async getMessages(@Args("dto") dto: GetMessageListDTO) {
    return this.messageService.getMessages(dto)
  }

  @UseGuards(GetMessageListGuard)
  @Query(() => [Message], { nullable: "items" })
  async getNotRecievedMessages(@Args("userUUID") userUUID: string) {
    return this.messageService.getNotReceivedMessages(userUUID)
  }

  @UseGuards(GetMessageListGuard)
  @Query(() => [String], { nullable: "items" })
  async getAllInterlocutors(@Args("userUUID") userUUID: string) {
    return this.messageService.getAllInterlocutors(userUUID)
  }

  @Mutation(() => Message)
  async createMessage(@Args("dto") dto: CreateMessageDTO) {
    return this.messageService.createMessage(dto)
  }
}
