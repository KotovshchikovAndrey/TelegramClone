import { InputType, Field, Int } from "@nestjs/graphql"
import { IsInt, MaxLength, IsNotEmpty } from "class-validator"

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
