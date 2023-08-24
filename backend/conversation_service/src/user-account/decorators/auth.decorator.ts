import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { User } from "../user-account.entity"

export const CurrentUser = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    // const gqlContext = GqlExecutionContext.create(context).getContext()
    // const headers = gqlContext.req.headers

    // const authorizer = headers["authorizer"]
    // if (!authorizer) {
    //   throw Error("Unauthorized!")
    // }

    // const currentUser = JSON.parse(authorizer)
    // return currentUser

    // Заглушка
    const currentUser = new User()
    currentUser.user_uuid = "32146edb-a9db-4acb-bf99-d0f5cd777cdc"

    return currentUser
  },
)
