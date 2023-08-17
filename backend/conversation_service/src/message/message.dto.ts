import { InputType, Field, Int } from "@nestjs/graphql"
import { IsInt, MaxLength, IsNotEmpty, IsIn, IsUUID } from "class-validator"

@InputType()
export class CreateMessageDTO {
  @Field()
  @MaxLength(500)
  @IsNotEmpty()
  text: string

  @Field()
  @IsUUID()
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

@InputType()
export class UpdateMessageStatusDTO {
  @Field()
  uuid: string

  @Field()
  @IsIn(["sent", "received", "readed"])
  status: "sent" | "received" | "readed"
}

@InputType()
export class FindAllMediaDTO {
  @Field()
  send_to: string

  @Field(() => Int)
  limit: number

  @Field(() => Int, { defaultValue: 0 })
  offset: number = 0
}
