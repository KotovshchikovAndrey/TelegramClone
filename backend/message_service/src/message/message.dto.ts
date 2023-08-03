import { InputType, Field, Int } from "@nestjs/graphql"
import { IsInt, MaxLength, IsNotEmpty, IsIn } from "class-validator"
import { FileUpload } from "./messages.types"

@InputType()
export class CreateMessageDTO {
  @Field()
  @MaxLength(500)
  @IsNotEmpty()
  text: string

  @Field()
  @IsNotEmpty()
  send_to: string

  media_url?: string
}

@InputType()
export class UpdateMessageDTO {
  @Field()
  @IsNotEmpty()
  uuid: string

  @Field()
  @MaxLength(500)
  @IsNotEmpty()
  text: string

  media_url?: string
}

@InputType()
export class MessageHistoryDTO {
  @Field()
  @IsNotEmpty()
  send_from: string

  @Field(() => Int)
  @IsInt()
  limit: number

  @Field(() => Int)
  @IsInt()
  offset: number = 0
}

export class FindMessageDTO {
  send_from?: string
  created_at?: Date
  status?: "sent" | "received" | "readed"
}

export class CurrentUserDTO {
  user_uuid: string
  name: string
  surname: string
  phone: string
  email: string
}

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
