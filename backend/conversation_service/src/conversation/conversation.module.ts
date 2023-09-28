import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import {
  AccountMessageStatusSchema,
  ConversationSchema,
  MemberSchema,
  MessageSchema,
} from "./conversation.entity"
import { ConversationService } from "./conversation.service"
import { MongoConversationRepository } from "./repositories/mongo.conversation.repository"
import { ConversationController } from "./conversation.controller"
import { ConversationResolver } from "./conversation.resolver"
import { FileModule } from "src/file/file.module"
import { UserAccountModule } from "src/user-account/user-account.module"
// import { KafkaModule } from "src/kafka/kafka.module"

@Module({
  imports: [
    // KafkaModule,
    FileModule,
    UserAccountModule,
    MongooseModule.forFeature([
      { name: "Conversation", schema: ConversationSchema },
      { name: "Member", schema: MemberSchema },
      { name: "Message", schema: MessageSchema },
      { name: "AccountMessageStatus", schema: AccountMessageStatusSchema },
    ]),
  ],
  exports: [ConversationService],
  providers: [
    ConversationService,
    {
      provide: "ConversationRepository",
      useClass: MongoConversationRepository,
    },
    ConversationResolver,
  ],
  controllers: [ConversationController],
})
export class ConversationModule {}
