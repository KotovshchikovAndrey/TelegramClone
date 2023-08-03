import { Module } from "@nestjs/common"
import { MessageService } from "./services/message.service"
import { MessageResolver } from "./message.resolver"
import { MongoMessageRepository } from "./repositories/message.repository"
import { MongooseModule } from "@nestjs/mongoose"
import { MessageSchema } from "./message.entity"
import { FileService } from "./services/file.service"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Message", schema: MessageSchema }]),
  ],
  providers: [
    MessageService,
    MessageResolver,
    {
      provide: "MessageRepository",
      useClass: MongoMessageRepository,
    },
    FileService,
  ],
})
export class MessageModule {}
