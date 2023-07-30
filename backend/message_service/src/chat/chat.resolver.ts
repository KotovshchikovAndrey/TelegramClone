import { Resolver, Query } from "@nestjs/graphql"
import { ChatService } from "./chat.service"
import { Chat } from "./chat.entity"

@Resolver()
export class ChatResolver {
  constructor(private chatService: ChatService) {}

  @Query(() => Chat)
  chat() {
    return this.chatService.getOne()
  }
}
