import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AccountSchema } from "./user-account.entity"
import { UserAccountService } from "./user-account.service"
import { UserAccountResolver } from "./user-account.resolver"
import { FileModule } from "src/file/file.module"

@Module({
  imports: [
    FileModule,
    MongooseModule.forFeature([{ name: "Account", schema: AccountSchema }]),
  ],
  exports: [UserAccountService],
  providers: [UserAccountService, UserAccountResolver],
})
export class UserAccountModule {}
