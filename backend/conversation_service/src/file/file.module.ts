import { Module } from "@nestjs/common"
import { DefaultFileService, FileService } from "./file.service"

@Module({
  exports: [
    {
      provide: FileService,
      useClass: DefaultFileService,
    },
  ],
  providers: [
    {
      provide: FileService,
      useClass: DefaultFileService,
    },
  ],
})
export class FileModule {}
