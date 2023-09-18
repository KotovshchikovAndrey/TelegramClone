import { Resolver, Query, Args, Mutation } from "@nestjs/graphql"
import { CurrentUser } from "./decorators/auth.decorator"
import { Account, User } from "./user-account.entity"
import { UserAccountService } from "./user-account.service"
import { UseGuards } from "@nestjs/common"
import { AuthGuard } from "./auth.guard"
import * as GraphQLUpload from "graphql-upload/GraphQLUpload.js"
import { FileUpload } from "../file/file.types"
import { FileDTO } from "src/file/file.dto"
import { phone } from "phone"

@Resolver()
export class UserAccountResolver {
  constructor(private readonly userAccountService: UserAccountService) {}

  @Query(() => Account, { nullable: true })
  // @UseGuards(AuthGuard)
  async findAccountByPhoneNumber(
    @Args({ name: "phoneNumber", type: () => String })
    phoneNumber: string,
  ) {
    if (!phone(phoneNumber).isValid) {
      throw Error(`Invalid phone number ${phoneNumber}`)
    }

    return this.userAccountService.findAccountByPhoneNumber(phoneNumber)
  }

  @Mutation(() => Account)
  @UseGuards(AuthGuard)
  async setAccountOnlineStatus(
    @CurrentUser() currentUser: User,
    @Args("is_online") is_online: boolean,
  ) {
    return this.userAccountService.setAccountOnlineStatus(
      currentUser,
      is_online,
    )
  }

  @Mutation(() => Account)
  @UseGuards(AuthGuard)
  async setAccountAvatar(
    @CurrentUser() currentUser: User,
    @Args({ name: "avatar", type: () => GraphQLUpload, nullable: false })
    avatar: FileUpload,
  ) {
    const file = await FileDTO.fromFileUpload(avatar)
    return this.userAccountService.setAccountAvatar(currentUser, file)
  }
}
