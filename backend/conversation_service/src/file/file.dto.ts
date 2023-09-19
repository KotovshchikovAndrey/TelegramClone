import { FileUpload } from "./file.types"

export class FileDTO {
  filename: string
  ext: string
  mimetype: string
  content: Buffer

  constructor(file: FileDTO) {
    this.filename = file.filename
    this.ext = file.ext
    this.mimetype = file.mimetype
    this.content = file.content
  }

  static async fromFileUpload(fileUpload: FileUpload): Promise<FileDTO> {
    return new Promise(async (resolve, reject) => {
      const chunks: Buffer[] = []
      const stream = fileUpload.createReadStream()

      stream.on("data", (chunk: Buffer) => {
        chunks.push(chunk)
      })

      stream.on("end", () => {
        const fileDTO = new FileDTO({
          filename: fileUpload.filename,
          ext: fileUpload.filename.split(".")[1],
          mimetype: fileUpload.mimetype,
          content: Buffer.concat(chunks),
        })

        resolve(fileDTO)
      })
    })
  }

  static async fromFileUploadArray(
    fileUploadArray: Promise<FileUpload>[],
  ): Promise<FileDTO[]> {
    return Promise.all(
      fileUploadArray.map(async (fileUploadPromise) => {
        const fileUpload = await fileUploadPromise
        return this.fromFileUpload(fileUpload)
      }),
    )
  }
}
