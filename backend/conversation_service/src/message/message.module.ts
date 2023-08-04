import { Module } from "@nestjs/common"
import { MessageService } from "./message.service"
import { MessageResolver } from "./message.resolver"
import { MongoMessageRepository } from "./repositories/message.repository"
import { MongooseModule } from "@nestjs/mongoose"
import { MessageSchema } from "./message.entity"
// import { DefaultFileService, FileService } from "./services/file.service"
import { ConversationModule } from "src/conversation/conversation.module"
import { FileModule } from "src/file/file.module"

@Module({
  imports: [
    FileModule,
    ConversationModule,
    MongooseModule.forFeature([{ name: "Message", schema: MessageSchema }]),
  ],
  providers: [
    MessageService,
    MessageResolver,
    {
      provide: "MessageRepository",
      useClass: MongoMessageRepository,
    },
    // {
    //   provide: FileService,
    //   useClass: DefaultFileService,
    // },
  ],
})
export class MessageModule {}
