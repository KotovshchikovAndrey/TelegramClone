import { Injectable } from "@nestjs/common"
import { join } from "path"

import * as Upload from "graphql-upload/Upload.js"
const AdmZip = require("adm-zip")

@Injectable()
export class FileService {
  private readonly uploadPath: string

  constructor() {
    this.uploadPath = join(__dirname, "..", "..", "assets")
  }

  async uploadFiles(files: Upload[]) {
    const zip = await this.createZipFromFiles(files)
  }

  private async createZipFromFiles(files: any[]) {
    const zip = new AdmZip()
    for (const file of files) {
      zip.addFile("test.jpg", file.buffer)
    }

    zip.writeZip(this.uploadPath + "/files.zip")
  }
}
