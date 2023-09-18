import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Account, User } from "./user-account.entity"
import { CreateUserAccountDTO } from "./user-account.dto"
import { FileDTO } from "src/file/file.dto"
import { FileService } from "src/file/file.service"

@Injectable()
export class UserAccountService {
  constructor(
    @InjectModel("Account")
    private readonly accounts: Model<Account>,
    private readonly fileService: FileService,
  ) {}

  async findAccountByUUID(uuid: string) {
    const account = await this.accounts
      .findOne({
        uuid,
      })
      .exec()

    return account
  }

  async findAccountByPhoneNumber(phoneNumber: string) {
    const account = await this.accounts
      .findOne({
        phone: phoneNumber,
      })
      .exec()

    return account
  }

  async createAccountForUser(dto: CreateUserAccountDTO) {
    const new_account = new this.accounts(dto)
    return new_account.save()
  }

  async checkUserAccountsExists(user_accounts: { account: string }[]) {
    const accounts = await this.accounts
      .find({
        uuid: {
          $in: user_accounts.map((user_account) => user_account.account),
        },
      })
      .exec()

    return accounts.length === user_accounts.length
  }

  async setAccountOnlineStatus(currentUser: User, is_online: boolean) {
    const updatedAccount = await this.accounts
      .findOneAndUpdate(
        {
          uuid: currentUser.user_uuid,
        },
        {
          is_online,
        },
        { new: true },
      )
      .exec()

    if (!updatedAccount) {
      throw Error("Account does not exists!")
    }

    return updatedAccount
  }

  async setAccountAvatar(currentUser: User, file: FileDTO) {
    const account = await this.accounts
      .findOne({
        uuid: currentUser.user_uuid,
      })
      .exec()

    if (!account) {
      throw Error("Account does not exists!")
    }

    const avatarUrl = await this.fileService.uploadSingleFile(file)
    const updatedAccount = await this.accounts.findOneAndUpdate(
      {
        uuid: currentUser.user_uuid,
      },
      {
        avatar: avatarUrl,
      },
      { new: true },
    )

    return updatedAccount
  }
}
