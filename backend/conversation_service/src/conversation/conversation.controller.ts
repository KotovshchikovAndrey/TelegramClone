import { Controller, Get } from "@nestjs/common"
import { ConversationService } from "./conversation.service"
import { CurrentUser } from "src/message/decorators/auth.decorator"
import { User } from "src/app.entity"

@Controller("conversation")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  findAll(@CurrentUser() currentUser: User) {
    return this.conversationService.getAllUserConversations(currentUser)
  }
}
