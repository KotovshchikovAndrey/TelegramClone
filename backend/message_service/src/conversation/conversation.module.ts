import { Module } from "@nestjs/common"
import { ConversationService } from "./conversation.service"
import { ConversationResolver } from "./conversation.resolver"
import { MongooseModule } from "@nestjs/mongoose"
import {
  ConversationMemberSchema,
  ConversationSchema,
  MessageSchema,
} from "./conversation.entity"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Conversation", schema: ConversationSchema },
      { name: "ConversationMember", schema: ConversationMemberSchema },
      { name: "Message", schema: MessageSchema },
    ]),
  ],
  providers: [ConversationService, ConversationResolver],
})
export class ConversationModule {}
