import { ConfigService } from "@nestjs/config"
import { MongooseModuleOptions } from "@nestjs/mongoose"

const getMongoUri = (configService: ConfigService) =>
  "mongodb://" +
  configService.get("MONGO_USER") +
  ":" +
  configService.get("MONGO_PASSWORD") +
  "@" +
  configService.get("MONGO_HOST") +
  ":" +
  configService.get("MONGO_PORT")

export const getMongoConnection = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  return {
    uri: getMongoUri(configService),
    dbName: configService.get("MONGO_DB_NAME"),
  }
}
