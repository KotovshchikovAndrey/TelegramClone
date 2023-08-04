import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { GqlExecutionContext } from "@nestjs/graphql"
import axios from "axios"

export const CurrentUser = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context).getContext()
    const headers = gqlContext.req.headers

    const userSession = headers["user-session"]
    if (!userSession) {
      throw Error("Unauthorized!")
    }

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/authenticate",
        {
          headers: {
            "Content-Type": "application/json",
            "User-Session": userSession,
          },
        },
      )

      return response.data
    } catch (error) {
      throw Error("Unauthorized!")
    }
  },
)
