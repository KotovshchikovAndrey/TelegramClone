import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AccountSchema } from "./user-account.entity"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Account", schema: AccountSchema }]),
  ],
})
export class UserAccountModule {}
