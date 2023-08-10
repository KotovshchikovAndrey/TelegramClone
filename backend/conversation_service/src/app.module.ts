import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { GraphQLModule } from "@nestjs/graphql"
import { ApolloDriverConfig, ApolloDriver } from "@nestjs/apollo"
import { getMongoConnection } from "./db/mongo.connection"
import { MessageModule } from "./message/message.module"
import { ConversationModule } from "./conversation/conversation.module"
import { join } from "path"
import { FileModule } from "./file/file.module"
// import { KafkaModule } from "./kafka/kafka.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConnection,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
    }),
    MessageModule,
    ConversationModule,
    FileModule,
    // KafkaModule,
  ],
})
export class AppModule {}
