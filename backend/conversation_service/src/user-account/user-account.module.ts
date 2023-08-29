import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AccountSchema } from "./user-account.entity"
import { UserAccountService } from "./user-account.service"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Account", schema: AccountSchema }]),
  ],
  exports: [UserAccountService],
  providers: [UserAccountService],
})
export class UserAccountModule {}
