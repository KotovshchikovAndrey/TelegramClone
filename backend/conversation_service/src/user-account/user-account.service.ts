import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Account } from "./user-account.entity"
import { CreateUserAccountDTO } from "./user-account.dto"

@Injectable()
export class UserAccountService {
  constructor(
    @InjectModel("Account")
    private readonly accounts: Model<Account>,
  ) {}

  async createAccountForUser(dto: CreateUserAccountDTO) {
    const new_account = new this.accounts(dto)
    return new_account.save()
  }

  async findAccountByUUID(uuid: string) {
    const account = await this.accounts
      .findOne({
        uuid,
      })
      .exec()

    return account
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
}
