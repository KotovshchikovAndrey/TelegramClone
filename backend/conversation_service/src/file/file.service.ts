import { FileDTO } from "./file.dto"
import { resolve } from "path"
import { randomUUID, createHash } from "crypto"
import * as fs from "fs"
import * as AdmZip from "adm-zip"

export abstract class FileService {
  private readonly maxSize = 15728640 // 15 мб
  private readonly allowedExt = new Set(["jpeg", "jpg", "png", "svg"])

  async uploadMedia(file: FileDTO) {
    this.checkIsFileValidOrThrowError(file)

    const mediaPath = await this.saveMedia(file)
    return mediaPath
  }

  async uploadMultipleMedia(files: FileDTO[]) {
    if (files.length === 0) {
      return null
    }

    for (const file of files) {
      this.checkIsFileValidOrThrowError(file)
    }

    const mediaPath = await this.saveMultipleMedia(files)
    return mediaPath
  }

  async updateMultipleMedia(mediaPath: string, files: FileDTO[]) {
    if (files.length === 0) {
      await this.removeMedia(mediaPath)
      return null
    }

    for (const file of files) {
      this.checkIsFileValidOrThrowError(file)
    }

    mediaPath = await this.modifyMultipleMedia(mediaPath, files)
    return mediaPath
  }

  private checkIsFileValidOrThrowError(file: FileDTO) {
    if (!this.allowedExt.has(file.ext)) {
      throw Error(
        `file ext must be in { ${Array.from(this.allowedExt).join(", ")} }`,
      )
    }

    if (Buffer.byteLength(file.content) > this.maxSize) {
      throw Error(`max file size is ${this.maxSize}`)
    }
  }

  protected abstract saveMedia(file: FileDTO): Promise<string>

  protected abstract saveMultipleMedia(files: FileDTO[]): Promise<string>

  protected abstract removeMedia(mediaPath: string): Promise<void>

  protected abstract modifyMultipleMedia(
    mediaPath: string,
    files: FileDTO[],
  ): Promise<string>
}

export class LocalFileService extends FileService {
  private readonly uploadPath: string

  constructor() {
    super()
    this.uploadPath = resolve(process.cwd(), "src", "assets")
  }

  protected async saveMedia(file: FileDTO) {
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

  protected async saveMultipleMedia(files: FileDTO[]) {
    const zip = new AdmZip()
    for (const file of files) {
      const filename = `${file.filename}_${randomUUID()}.${file.ext}`
      zip.addFile(filename, file.content)
    }

    const filesHash = createHash("sha256")
      .update(files.map((file) => file.content).join(";"))
      .digest("hex")
      .toString()

    const mediaPath = `${filesHash}_${randomUUID()}.zip`
    zip.writeZip(this.uploadPath + `/${mediaPath}`)

    return mediaPath
  }

  protected async modifyMultipleMedia(mediaPath: string, files: FileDTO[]) {
    const newFilesHash = createHash("sha256")
      .update(files.map((file) => file.content).join(";"))
      .digest("hex")
      .toString()

    const uploadedFilesHash = mediaPath.split("_")[0]
    if (newFilesHash === uploadedFilesHash) {
      return mediaPath
    }

    await this.removeMedia(mediaPath) // remove old zip
    const newMediaPath = await this.saveMultipleMedia(files)

    return newMediaPath
  }

  protected async removeMedia(mediaPath: string) {
    const fullMediaPath = resolve(this.uploadPath, mediaPath)
    fs.promises.unlink(fullMediaPath)
  }
}
