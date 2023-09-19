import { FileDTO } from "./file.dto"
import { resolve } from "path"
import { randomUUID, createHash } from "crypto"
import * as fs from "fs"
import * as AdmZip from "adm-zip"

export abstract class FileService {
  private readonly maxSize = 15728640
  private readonly allowedExt = new Set(["jpeg", "jpg", "png", "svg"])

  async uploadSingleFile(file: FileDTO) {
    this.checkIsValidOrThrowError(file)

    const filename = await this.createFile(file)
    return filename
  }

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
      await this.removeFile(mediaUrl)
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

  protected abstract createFile(file: FileDTO): Promise<string>

  protected abstract removeFile(zipName: string): Promise<void>

  protected abstract createZipFromFiles(files: FileDTO[]): Promise<string>

  protected abstract updateZip(
    zipName: string,
    files: FileDTO[],
  ): Promise<string>
}

export class DefaultFileService extends FileService {
  private readonly uploadPath: string

  constructor() {
    super()
    this.uploadPath = resolve(process.cwd(), "src", "assets")
  }

  protected async createFile(file: FileDTO) {
    const fileHash = createHash("sha256")
      .update(file.content)
      .digest("hex")
      .toString()

    const filename = `${fileHash}.${file.ext}`
    const filePath = resolve(this.uploadPath, filename)
    if (fs.existsSync(filePath)) {
      return filename
    }

    await fs.promises.writeFile(filePath, file.content)
    return filename
  }

  protected async createZipFromFiles(files: FileDTO[]) {
    const zip = new AdmZip()
    for (const file of files) {
      const filename = `${randomUUID()}_${file.filename}.${file.ext}`
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

    await this.removeFile(zipName) // remove old zip
    const newZipName = await this.createZipFromFiles(files)

    return newZipName
  }

  protected async removeFile(filename: string) {
    const filePath = resolve(this.uploadPath, filename)
    fs.promises.unlink(filePath)
  }
}
