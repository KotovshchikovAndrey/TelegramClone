import { Inject, Injectable } from "@nestjs/common"
import { IConversationRepository } from "./repositories/interfaces/conversation.repository"
import {
  CreateGroupDTO,
  CreateGroupMessageDTO,
  CreateMemberDTO,
  CreatePersonalMessageDTO,
  SetUserMessageStatusDTO,
  UpdateMessageDTO,
} from "./conversation.dto"
import { FileDTO } from "../file/file.dto"
import { FileService } from "../file/file.service"
import { Member } from "./conversation.entity"
import { createHash } from "crypto"
import { User } from "../user-account/user-account.entity"

@Injectable()
export class ConversationService {
  constructor(
    @Inject("ConversationRepository")
    private readonly repository: IConversationRepository,
    private readonly fileService: FileService,
  ) {}

  async getAllConversationsForCurrentUser(
    currentUser: User,
    {
      limit,
      offset,
    }: {
      limit: number
      offset: number
    },
  ) {
    const conversations =
      await this.repository.findConversationsWhereAccountIsMember({
        account: currentUser.user_uuid,
        limit,
        offset,
      })

    return conversations
  }

  async getUnreadMessageCountForCurrentUser(
    currentUser: User,
    conversation: string,
  ) {
    const unreadMessageCount =
      await this.repository.countUnreadMessagesForAccount({
        account: currentUser.user_uuid,
        conversation: conversation,
      })

    return unreadMessageCount.count
  }

  async createPersonalMessage(
    currentUser: User,
    dto: CreatePersonalMessageDTO,
    files: FileDTO[],
  ) {
    // Заглушка
    if (currentUser.user_uuid === dto.reciever) {
      throw Error("Bad request!")
    }

    if (files.length === 0 && dto.text == null) {
      throw Error("Message must be not empty!")
    }

    const conversationName = this.getNameForPersonalConversation({
      first_user: currentUser.user_uuid,
      second_user: dto.reciever,
    })

    let personalConversation =
      await this.repository.findPersonalConversationByName(conversationName)

    if (personalConversation === null) {
      personalConversation = await this.repository.createConversation({
        name: conversationName,
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
            account: dto.reciever,
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
        account: currentUser.user_uuid,
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
      avatar: avatar ? await this.fileService.uploadSingleFile(avatar) : null,
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
    const isUserAccountsExists = await this.checkAccountsExists(users)
    if (!isUserAccountsExists) {
      throw Error("User account(s) do not exists!")
    }

    const newMembers: CreateMemberDTO[] = []
    for (const user of users) {
      const dto = new CreateMemberDTO()
      dto.conversation = conversation
      dto.account = user.account
      dto.is_admin = user.is_admin
      newMembers.push(dto)
    }

    const membersInConversation =
      await this.repository.findAllMembersInConversation(conversation)

    const membersForCreate = this.excludeDuplicateMembers({
      membersInConversation,
      newMembers,
    })

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

  async setMessageStatusForUser(
    currentUser: User,
    dto: SetUserMessageStatusDTO,
  ) {
    const message = await this.repository.findMessage(dto.message)
    if (message == null) {
      throw Error("Message does not exists!")
    }

    // current user can't read messages from himself
    if (message.sender === currentUser.user_uuid) {
      throw Error("Bad request!")
    }

    const member = await this.repository.findConversationMember({
      account: currentUser.user_uuid,
      conversation: message.conversation,
    })

    if (member == null) {
      throw Error("Forbidden!")
    }

    const accountMessageStatus = this.repository
      .setMessageStatusForAccount({
        account: currentUser.user_uuid,
        message: dto.message,
        status: dto.status,
      })
      .then((accountMessageStatus) => {
        this.updateMessageStatus(dto.message)
        return accountMessageStatus
      })

    return accountMessageStatus
  }

  private getNameForPersonalConversation({
    first_user,
    second_user,
  }: {
    first_user: string
    second_user: string
  }) {
    const conversationName = createHash("sha256")
      .update([first_user, second_user].sort().join("."))
      .digest("hex")
      .toString()

    return conversationName
  }

  private excludeDuplicateMembers({
    membersInConversation,
    newMembers,
  }: {
    membersInConversation: Member[]
    newMembers: CreateMemberDTO[]
  }) {
    const membersInConversationSet = new Set(
      membersInConversation.map((member) => member.account),
    )

    const membersWithoutDuplicate = newMembers.filter(
      (member) => !membersInConversationSet.has(member.account),
    )

    return membersWithoutDuplicate
  }

  private async updateMessageStatus(message: string) {
    // info about the number of accounts (members) who received and read the message
    const { total, delivered, readed } =
      await this.repository.countMesssageStatusesSummary(message)

    const messageIsDelivered = total === delivered + readed
    if (messageIsDelivered) {
      await this.repository.setMessageStatus({
        uuid: message,
        status: "delivered",
      })
    }

    const messageIsReaded = total === readed
    if (messageIsReaded) {
      await this.repository.setMessageStatus({
        uuid: message,
        status: "readed",
      })
    }
  }

  private async checkAccountsExists(user_accounts: { account: string }[]) {
    return true
  }
}
