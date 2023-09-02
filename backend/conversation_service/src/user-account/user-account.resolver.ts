import { Resolver, Query, Args, Mutation } from "@nestjs/graphql"
import { CurrentUser } from "./decorators/auth.decorator"
import { Account, User } from "./user-account.entity"
import { UserAccountService } from "./user-account.service"
import { UseGuards } from "@nestjs/common"
import { AuthGuard } from "./auth.guard"

@Resolver()
export class UserAccountResolver {
  constructor(private readonly userAccountService: UserAccountService) {}

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
}
