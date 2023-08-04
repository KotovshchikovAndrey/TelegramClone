import { FileUpload } from "./file.types"

export class FileDTO {
  ext: string
  mimetype: string
  content: Buffer

  constructor(file: FileDTO) {
    this.ext = file.ext
    this.mimetype = file.mimetype
    this.content = file.content
  }

  static async fromFileUploadArray(
    fileUploadArray: Promise<FileUpload>[],
  ): Promise<FileDTO[]> {
    // @ts-ignore
    return Promise.all(
      fileUploadArray.map((fileUpload) => {
        return new Promise(async (resolve, reject) => {
          const chunks: Buffer[] = []
          const file = await fileUpload
          const stream = file.createReadStream()

          stream.on("data", (chunk: Buffer) => {
            chunks.push(chunk)
          })

          stream.on("end", () => {
            const fileDTO = new FileDTO({
              ext: file.filename.split(".")[1],
              mimetype: file.mimetype,
              content: Buffer.concat(chunks),
            })

            resolve(fileDTO)
          })
        })
      }),
    )
  }
}
