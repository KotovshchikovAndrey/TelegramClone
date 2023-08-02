import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { MessageService } from "./services/message.service"
import { Interlocutor, Message } from "./message.entity"
import {
  CreateMessageDTO,
  CurrentUserDTO,
  MessageHistoryDTO,
} from "./message.dto"
import { CurrentUser } from "./decorators/auth.decorator"

import * as GraphQLUpload from "graphql-upload/GraphQLUpload.js"
import * as Upload from "graphql-upload/Upload.js"

@Resolver()
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query(() => [Message], { nullable: "items" })
  async getMessageHistory(
    @CurrentUser() currentUser: CurrentUserDTO,
    @Args("dto") dto: MessageHistoryDTO,
  ) {
    return this.messageService.getMessageHistory(currentUser, dto)
  }

  @Query(() => [Message], { nullable: "items" })
  async getNotRecievedMessages(@CurrentUser() currentUser: CurrentUserDTO) {
    return this.messageService.getNotReceivedMessages(currentUser)
  }

  @Query(() => [Interlocutor], { nullable: "items" })
  async getAllInterlocutors(@CurrentUser() currentUser: CurrentUserDTO) {
    return this.messageService.getAllInterlocutors(currentUser)
  }

  @Mutation(() => Message)
  async createMessage(
    @CurrentUser() currentUser: CurrentUserDTO,
    @Args("dto") dto: CreateMessageDTO,
  ) {
    return this.messageService.createMessage(currentUser, dto)
  }

  @Mutation(() => Boolean)
  async testUpload(
    @Args({ name: "files", type: () => [GraphQLUpload] })
    files: Upload[],
  ) {
    const fileBuffers = await Promise.all(
      files.map((file) => {
        return new Promise(async (resolve, reject) => {
          const chunks: Buffer[] = []
          const fileContent = await file
          const stream = fileContent.createReadStream()

          stream.on("data", (chunk: Buffer) => {
            chunks.push(chunk)
          })

          stream.on("end", () => {
            const buffer = Buffer.concat(chunks)
            console.log(file)
            resolve({
              filename: fileContent.filename,
              mimetype: fileContent.mimetype,
              content: buffer,
            })
          })
        })
      }),
    )

    console.log(fileBuffers)
    return true
  }
}
