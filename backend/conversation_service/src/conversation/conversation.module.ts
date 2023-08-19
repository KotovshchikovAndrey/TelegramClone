import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import {
  AccountSchema,
  ConversationSchema,
  MemberSchema,
  MessageObserverSchema,
  MessageSchema,
} from "./conversation.entity"
import { ConversationService } from "./conversation.service"
import { MongoConversationRepository } from "./repositories/conversation.repository"
import { ConversationController } from "./conversation.controller"
// import { ConversationResolver } from "./conversation.resolver"
import { FileModule } from "src/file/file.module"

@Module({
  imports: [
    FileModule,
    MongooseModule.forFeature([
      { name: "Account", schema: AccountSchema },
      { name: "Conversation", schema: ConversationSchema },
      { name: "Member", schema: MemberSchema },
      { name: "Message", schema: MessageSchema },
      { name: "MessageObserver", schema: MessageObserverSchema },
    ]),
  ],
  exports: [ConversationService],
  providers: [
    ConversationService,
    {
      provide: "ConversationRepository",
      useClass: MongoConversationRepository,
    },
    // ConversationResolver,
  ],
  controllers: [ConversationController],
})
export class ConversationModule {}
