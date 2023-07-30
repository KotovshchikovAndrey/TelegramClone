import { Query, Resolver } from "@nestjs/graphql"
import { Message } from "./conversation.entity"
import { ConversationService } from "./conversation.service"

@Resolver()
export class ConversationResolver {
  constructor(private readonly conversationService: ConversationService) {}

  @Query(() => Message, { nullable: true })
  getOne() {
    return this.conversationService.getOne()
  }
}
