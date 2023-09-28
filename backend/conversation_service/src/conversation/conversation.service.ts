import { Inject, Injectable } from "@nestjs/common"
import { IConversationRepository } from "./repositories/interfaces/conversation.repository"
import { CreateMemberDTO } from "./conversation.dto"
import { FileService } from "../file/file.service"
import { createHash } from "crypto"
import { UserAccountService } from "src/user-account/user-account.service"
import {
  AddUsersToConversationArgs,
  CreateGroupMessageArgs,
  CreateNewGroupArgs,
  CreatePersonalMessageArgs,
  ExcludeDuplicateMembersArgs,
  GetAllConversationsForCurrentUserArgs,
  GetMessageHistoryInConversationArgs,
  GetNameForPersonalConversationArgs,
  GetUnreadMessageCountForCurrentUserArgs,
  SetMessageStatusForAccountArgs,
  UpdateMessageArgs,
} from "./conversation.types"

@Injectable()
export class ConversationService {
  constructor(
    @Inject("ConversationRepository")
    private readonly repository: IConversationRepository,
    private readonly fileService: FileService,
    private readonly userAccountService: UserAccountService,
  ) {}

  async getAllConversationsForCurrentUser(
    args: GetAllConversationsForCurrentUserArgs,
  ) {
    const { currentUser, limit, offset } = args
    const conversations =
      await this.repository.findConversationsWhereAccountIsMember({
        account: currentUser.user_uuid,
        limit: limit,
        offset: offset,
      })

    return conversations
  }

  async getUnreadMessageCountForCurrentUser(
    args: GetUnreadMessageCountForCurrentUserArgs,
  ) {
    const { currentUser, conversation } = args
    const unreadMessageCount =
      await this.repository.countUnreadMessagesForAccount({
        account: currentUser.user_uuid,
        conversation: conversation,
      })

    return unreadMessageCount.count
  }

  async getMessageHistoryInConversation(
    args: GetMessageHistoryInConversationArgs,
  ) {
    const { currentUser, dto } = args
    const isConversationExists = await this.repository.findConversationByUUID(
      dto.conversation,
    )

    if (!isConversationExists) {
      throw Error("Conversation does not exists!")
    }

    const isUserMember = await this.repository.findConversationMember({
      account: currentUser.user_uuid,
      conversation: dto.conversation,
    })

    if (!isUserMember) {
      throw Error("Forbidden!")
    }

    const messages = await this.repository.findAllMessagesByConversation(dto)
    return messages
  }

  async createPersonalMessage(args: CreatePersonalMessageArgs) {
    const { currentUser, dto, files } = args

    // Заглушка
    // if (currentUser.user_uuid === dto.reciever) {
    //   throw Error("Bad request!")
    // }

    if (files.length === 0 && dto.text == null) {
      throw Error("Message must be not empty!")
    }

    const conversationName = this.getNameForPersonalConversation({
      first_user: currentUser.user_uuid,
      second_user: dto.reciever,
    })

    let personalConversation =
      await this.repository.findPersonalConversationByName(conversationName)

    if (!personalConversation) {
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
      media_path: await this.fileService.uploadMultipleMedia(files),
      text: dto.text,
    })
  }

  async createGroupMessage(args: CreateGroupMessageArgs) {
    const { currentUser, dto, files } = args
    const group = await this.repository.findGroupConversation(dto.conversation)
    if (!group) {
      throw Error("Conversation does not exists!")
    }

    const groupMember = await this.repository.findConversationMember({
      conversation: dto.conversation,
      account: currentUser.user_uuid,
    })

    if (!groupMember || !groupMember.is_active) {
      throw Error("Forbidden!")
    }

    return this.repository.createMessage({
      conversation: dto.conversation,
      sender: currentUser.user_uuid,
      media_path: await this.fileService.uploadMultipleMedia(files),
      text: dto.text,
    })
  }

  async createNewGroup(args: CreateNewGroupArgs) {
    const { currentUser, dto, avatar } = args
    const newGroup = await this.repository.createConversation({
      avatar: avatar ? await this.fileService.uploadMedia(avatar) : null,
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

  async addUsersToConversation(args: AddUsersToConversationArgs) {
    const { conversation, users } = args
    const isUserAccountsExists =
      await this.userAccountService.checkUserAccountsExists(users)

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

  async updateMessage(args: UpdateMessageArgs) {
    const { currentUser, dto, files } = args
    const message = await this.repository.findMessage(dto.uuid)
    if (!message) {
      throw Error("Message does not exists!")
    }

    if (message.sender !== currentUser.user_uuid) {
      throw Error("Forbidden!")
    }

    const media_path =
      message.media_path !== null
        ? await this.fileService.updateMultipleMedia(message.media_path, files)
        : await this.fileService.uploadMultipleMedia(files)

    return this.repository.updateMessage({
      ...dto,
      media_path,
    })
  }

  async setMessageStatusForUser(args: SetMessageStatusForAccountArgs) {
    const { currentUser, dto } = args
    const message = await this.repository.findMessage(dto.message)
    if (!message) {
      throw Error("Message does not exists!")
    }

    // current user can't read messages from himself
    if (message.sender === currentUser.user_uuid) {
      throw Error("Bad request!")
    }

    const isUserMember = await this.repository.findConversationMember({
      account: currentUser.user_uuid,
      conversation: message.conversation,
    })

    if (!isUserMember) {
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

  private getNameForPersonalConversation(
    args: GetNameForPersonalConversationArgs,
  ) {
    const { first_user, second_user } = args
    const conversationName = createHash("sha256")
      .update([first_user, second_user].sort().join("."))
      .digest("hex")
      .toString()

    return conversationName
  }

  private excludeDuplicateMembers(args: ExcludeDuplicateMembersArgs) {
    const { membersInConversation, newMembers } = args
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

    const isMessageDelivered = total === delivered + readed
    if (isMessageDelivered) {
      await this.repository.setMessageStatus({
        uuid: message,
        status: "delivered",
      })
    }

    const isMessageReaded = total === readed
    if (isMessageReaded) {
      await this.repository.setMessageStatus({
        uuid: message,
        status: "readed",
      })
    }
  }
}
