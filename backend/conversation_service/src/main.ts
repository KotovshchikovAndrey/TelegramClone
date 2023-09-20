import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import * as graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js"

const SERVER_HOST = process.env["SERVER_HOST"]
const SERVER_PORT = process.env["SERVER_PORT"]

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(graphqlUploadExpress())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  await app.listen(SERVER_PORT, SERVER_HOST)
}

bootstrap()
