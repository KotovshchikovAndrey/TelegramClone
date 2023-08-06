import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import axios from "axios"

export const CurrentUser = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context).getContext()
    const headers = gqlContext.req.headers

    const authorizer = headers["authorizer"]
    if (!authorizer) {
      throw Error("Unauthorized!")
    }

    const currentUser = JSON.parse(authorizer)
    return currentUser
  },
)
