import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import axios from "axios"
import { GqlExecutionContext } from "@nestjs/graphql"

@Injectable()
export class GetMessageListGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return true
    // const gqlContext = GqlExecutionContext.create(context)
    // const headers = gqlContext.getContext().req.headers

    // const userSession = headers["user-session"]
    // if (!userSession) {
    //   throw Error("Unauthorized")
    // }

    // const authServiceHost = this.configService.get("AUTH_SERVICE_HOST")

    // try {
    //   const response = await axios.get(authServiceHost)
    //   return true
    // } catch (err) {
    //   throw Error("NOOOOOOOOOOOOOOOOOOOOOO!")
    // }
  }
}
