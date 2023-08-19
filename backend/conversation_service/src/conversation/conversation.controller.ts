import {
  Controller,
  Get,
  Body,
  Post,
  Query,
  DefaultValuePipe,
} from "@nestjs/common"

import { ConversationService } from "./conversation.service"
import { CurrentUser } from "src/conversation/decorators/auth.decorator"
import { User } from "src/app.entity"
import { CreatePersonalMessageDTO } from "./conversation.dto"

@Controller("conversation")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  async findAll(
    @Query("limit", new DefaultValuePipe(10)) limit: number,
    @Query("offset", new DefaultValuePipe(0)) offset: number,
  ) {
    const currentUser = new User()
    currentUser.user_uuid = "32146edb-a9db-4acb-bf99-d0f5cd777cdc"

    return this.conversationService.getUserConversations(currentUser, {
      limit,
      offset,
    })
  }

  @Post()
  async create(
    // @CurrentUser() currentUser: User,
    @Body() dto: CreatePersonalMessageDTO,
  ) {
    const currentUser = new User()
    currentUser.user_uuid = "32146edb-a9db-4acb-bf99-d0f5cd777cdc"

    return this.conversationService.createPersonalMessage(currentUser, dto, [])
  }
}
