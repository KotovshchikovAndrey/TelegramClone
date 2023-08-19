import { Inject, Injectable } from "@nestjs/common"
import { IConversationRepository } from "./repositories/interfaces/conversation.repository"
import {
  CreateGroupDTO,
  CreateGroupMessageDTO,
  CreateMemberDTO,
  CreatePersonalMessageDTO,
  UpdateMessageDTO,
} from "./conversation.dto"
import { User } from "src/app.entity"
import { FileDTO } from "src/file/file.dto"
import { FileService } from "src/file/file.service"

@Injectable()
export class ConversationService {
  constructor(
    @Inject("ConversationRepository")
    private readonly repository: IConversationRepository,
    private readonly fileService: FileService,
  ) {}

  async getUserConversations() {}

  async createPersonalMessage(
    currentUser: User,
    dto: CreatePersonalMessageDTO,
    files: FileDTO[],
  ) {
    if (files.length === 0 && dto.text == null) {
      throw Error("Message must be not empty!")
    }

    // Проверка на существование аккаунта

    let personalConversation = await this.repository.findPersonalConversation({
      first_user: currentUser.user_uuid,
      second_user: dto.reciever_uuid,
    })

    if (personalConversation === null) {
      personalConversation = await this.repository.createConversation({
        is_group: false,
      })

      await this.addUsersToConversation({
        conversation: personalConversation.uuid,
        users: [
          {
            account: currentUser.user_uuid,
            is_admin: false,
          },
          {
            account: dto.reciever_uuid,
            is_admin: false,
          },
        ],
      })
    }

    return this.repository.createMessage({
      conversation: personalConversation.uuid,
      sender: currentUser.user_uuid,
      media_url: await this.fileService.uploadFiles(files),
      text: dto.text,
    })
  }

  async createGroupMessage(
    currentUser: User,
    dto: CreateGroupMessageDTO,
    files: FileDTO[],
  ) {
    const group = await this.repository.findGroupConversation(dto.conversation)
    if (group === null) {
      throw Error("Conversation does not exists!")
    }

    const userIsMember =
      (await this.repository.findConversationMember({
        conversation: dto.conversation,
        user: currentUser.user_uuid,
      })) ?? false

    if (!userIsMember || !userIsMember.is_active) {
      throw Error("Forbidden!")
    }

    return this.repository.createMessage({
      conversation: dto.conversation,
      sender: currentUser.user_uuid,
      media_url: await this.fileService.uploadFiles(files),
      text: dto.text,
    })
  }

  async createNewGroup(
    currentUser: User,
    dto: CreateGroupDTO,
    avatar?: FileDTO,
  ) {
    const newGroup = await this.repository.createConversation({
      is_group: true,
      ...dto,
    })

    const groupMembers = Array.from(new Set(dto.users)) // remove duplicate values
    await this.addUsersToConversation({
      conversation: newGroup.uuid,
      users: [
        ...groupMembers.map((user) => {
          return {
            account: user,
            is_admin: false,
          }
        }),
        { account: currentUser.user_uuid, is_admin: true },
      ],
    })

    return newGroup
  }

  async addUsersToConversation({
    conversation,
    users,
  }: {
    conversation: string
    users: Omit<CreateMemberDTO, "conversation">[]
  }) {
    const membersForCreate: CreateMemberDTO[] = []
    for (const user of users) {
      const dto = new CreateMemberDTO()
      dto.conversation = conversation
      dto.account = user.account
      dto.is_admin = user.is_admin

      membersForCreate.push(dto)
    }

    const createdMembers = await this.repository.createMembers(membersForCreate)
    return createdMembers
  }

  async updateMessage(
    currentUser: User,
    dto: UpdateMessageDTO,
    files: FileDTO[],
  ) {
    const message = await this.repository.findMessage(dto.uuid)
    if (message === null) {
      throw Error("Message does not exists!")
    }

    if (message.sender !== currentUser.user_uuid) {
      throw Error("Forbidden!")
    }

    const media_url =
      message.media_url !== null
        ? await this.fileService.updateFiles(message.media_url, files)
        : await this.fileService.uploadFiles(files)

    return this.repository.updateMessage({
      ...dto,
      media_url,
    })
  }

  // private excludeDuplicateMembers(
  //   existsMembers: ConversationMember[],
  //   newMembers: CreateMembersDTO,
  // ) {
  //   const existsMembersSet = new Set(existsMembers.map((member) => member.user))
  //   const membersWithoutDuplicate = newMembers.members.filter(
  //     (member) => !existsMembersSet.has(member.user),
  //   )

  //   return membersWithoutDuplicate
  // }
}
