import { Injectable } from "@nestjs/common"
import { FileDTO } from "../message.dto"
import { join } from "path"
import { randomUUID } from "crypto"

const AdmZip = require("adm-zip")

@Injectable()
export class FileService {
  private readonly maxSize = 15728640
  private readonly allowedExt = new Set(["jpeg", "png", "svg"])
  private readonly uploadPath: string

  constructor() {
    this.uploadPath = join(__dirname, "..", "..", "assets")
  }

  async uploadFiles(files: FileDTO[]) {
    for (const file of files) {
      this.checkIsValidOrThrowError(file)
    }

    const zipName = `${randomUUID()}.zip`
    this.createZipFromFiles(zipName, files)
    return "/" + zipName
  }

  private checkIsValidOrThrowError(file: FileDTO) {
    if (!this.allowedExt.has(file.ext)) {
      throw Error(
        `file ext must be in { ${Array.from(this.allowedExt).join(", ")} }`,
      )
    }

    if (Buffer.byteLength(file.content) > this.maxSize) {
      throw Error(`max file size is ${this.maxSize}`)
    }
  }

  private createZipFromFiles(zipName: string, files: FileDTO[]) {
    const zip = new AdmZip()
    for (const file of files) {
      const filename = `${randomUUID()}.${file.ext}`
      zip.addFile(filename, file.content)
    }

    zip.writeZip(this.uploadPath + `/${zipName}`)
  }
}
