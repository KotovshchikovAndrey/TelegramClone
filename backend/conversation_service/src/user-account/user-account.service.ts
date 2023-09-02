import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Account, User } from "./user-account.entity"
import { CreateUserAccountDTO } from "./user-account.dto"

@Injectable()
export class UserAccountService {
  constructor(
    @InjectModel("Account")
    private readonly accounts: Model<Account>,
  ) {}

  async findAccountByUUID(uuid: string) {
    const account = await this.accounts
      .findOne({
        uuid,
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
}
