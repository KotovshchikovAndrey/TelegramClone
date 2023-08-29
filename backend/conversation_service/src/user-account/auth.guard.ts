import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common"
import { UserAccountService } from "./user-account.service"
import { GqlExecutionContext } from "@nestjs/graphql"
import { User } from "./user-account.entity"

Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(UserAccountService)
    private readonly userAccountService: UserAccountService,
  ) {}

  async canActivate(context: ExecutionContext) {
    // Заглушка
    // const gqlContext = GqlExecutionContext.create(context).getContext()
    // const currentUser = new User()
    // currentUser.user_uuid = "32146edb-a9db-4acb-bf99-d0f5cd777cdc"
    // gqlContext.req.currentUser = currentUser
    // return true

    const gqlContext = GqlExecutionContext.create(context).getContext()
    const headers = gqlContext.req.headers

    const authorizer = headers["authorizer"]
    if (!authorizer) {
      throw Error("Unauthorized!")
    }

    const currentUser = JSON.parse(authorizer)
    gqlContext.req.currentUser = currentUser

    const isUserAccountsExists =
      await this.userAccountService.findAccountByUUID(currentUser.user_uuid)

    return !!isUserAccountsExists
  }
}
