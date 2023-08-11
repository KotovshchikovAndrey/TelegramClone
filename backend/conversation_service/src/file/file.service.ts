import { FileDTO } from "./file.dto"
import { resolve } from "path"
import { randomUUID, createHash } from "crypto"

const fs = require("fs")
const AdmZip = require("adm-zip")

export abstract class FileService {
  protected readonly maxSize = 15728640
  protected readonly allowedExt = new Set(["jpeg", "png", "svg"])

  async uploadFiles(files: FileDTO[]) {
    if (files.length === 0) {
      return null
    }

    for (const file of files) {
      this.checkIsValidOrThrowError(file)
    }

    const zipName = await this.createZipFromFiles(files)
    return zipName
  }

  async updateFiles(mediaUrl: string, files: FileDTO[]) {
    if (files.length === 0) {
      await this.removeZip(mediaUrl)
      return null
    }

    for (const file of files) {
      this.checkIsValidOrThrowError(file)
    }

    const zipName = await this.updateZip(mediaUrl, files)
    return zipName
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

  protected abstract createZipFromFiles(files: FileDTO[]): Promise<string>

  protected abstract updateZip(
    zipName: string,
    files: FileDTO[],
  ): Promise<string>

  protected abstract removeZip(zipName: string): Promise<void>
}

export class DefaultFileService extends FileService {
  private readonly uploadPath: string

  constructor() {
    super()
    this.uploadPath = resolve(process.cwd(), "src", "assets")
  }

  protected async createZipFromFiles(files: FileDTO[]) {
    const zip = new AdmZip()
    for (const file of files) {
      const filename = `${randomUUID()}.${file.ext}`
      zip.addFile(filename, file.content)
    }

    const filesHash = createHash("sha256")
      .update(files.map((file) => file.content).join(";"))
      .digest("hex")
      .toString()

    const zipName = `${randomUUID()}_${filesHash}.zip`
    zip.writeZip(this.uploadPath + `/${zipName}`)

    return zipName
  }

  protected async updateZip(zipName: string, files: FileDTO[]) {
    const newFilesHash = createHash("sha256")
      .update(files.map((file) => file.content).join(";"))
      .digest("hex")
      .toString()

    const uploadedFilesHash = zipName.split("_")[1].split(".")[0]
    if (newFilesHash === uploadedFilesHash) {
      return zipName
    }

    await this.removeZip(zipName) // remove old zip
    const newZipName = await this.createZipFromFiles(files)
    return newZipName
  }

  protected async removeZip(zipName: string) {
    const zipPath = resolve(this.uploadPath, zipName)
    await new Promise((resolve) => fs.unlink(zipPath, resolve))
  }
}
