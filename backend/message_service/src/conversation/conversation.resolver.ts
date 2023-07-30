import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { Conversation, Message } from "./conversation.entity"
import { ConversationService } from "./conversation.service"
import { CreateConversationDTO } from "./conversation.dto"

@Resolver()
export class ConversationResolver {
  constructor(private readonly conversationService: ConversationService) {}

  @Query(() => [Conversation], { nullable: true })
  async getAllConversations() {
    return this.conversationService.getAllConversations()
  }

  @Mutation(() => Conversation)
  async createGroupConversation(@Args("dto") dto: CreateConversationDTO) {
    return this.conversationService.createGroupConversation(dto)
  }
}
