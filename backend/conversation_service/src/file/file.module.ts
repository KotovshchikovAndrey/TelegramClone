import { Module } from "@nestjs/common"
import { LocalFileService, FileService } from "./file.service"

@Module({
  exports: [
    {
      provide: FileService,
      useClass: LocalFileService,
    },
  ],
  providers: [
    {
      provide: FileService,
      useClass: LocalFileService,
    },
  ],
})
export class FileModule {}
