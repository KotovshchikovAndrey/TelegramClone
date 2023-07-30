import { Injectable } from "@nestjs/common"
import { Chat } from "./chat.entity"

@Injectable()
export class ChatService {
  async getOne() {
    const chat = new Chat()
    chat.id = 1
    chat.title = "FirstChat"
    chat.description = null

    return chat
  }
}
