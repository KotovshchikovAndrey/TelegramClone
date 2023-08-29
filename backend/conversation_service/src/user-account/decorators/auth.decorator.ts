import { createParamDecorator, ExecutionContext, Inject } from "@nestjs/common"
import { UserAccountService } from "../user-account.service"
import { GqlExecutionContext } from "@nestjs/graphql"

export const CurrentUser = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context).getContext()
    const currentUser = gqlContext.req.currentUser

    return currentUser
  },
)
