import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import {
  ConversationMemberSchema,
  ConversationMessageSchema,
  ConversationSchema,
} from "./conversation.entity"
import { ConversationService } from "./conversation.service"
import { MongoConversationRepository } from "./repositories/conversation.repository"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Conversation", schema: ConversationSchema },
      { name: "ConversationMember", schema: ConversationMemberSchema },
      { name: "ConversationMessage", schema: ConversationMessageSchema },
    ]),
  ],
  providers: [
    ConversationService,
    {
      provide: "ConversationRepository",
      useClass: MongoConversationRepository,
    },
  ],
  exports: [ConversationService],
})
export class ConversationModule {}
