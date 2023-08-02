import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import * as graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(graphqlUploadExpress())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  await app.listen(3000, "127.0.0.1")
}

bootstrap()
