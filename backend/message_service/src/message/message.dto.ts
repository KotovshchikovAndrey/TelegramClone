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
  send_from: string

  @Field()
  @IsNotEmpty()
  send_to: string
}

@InputType()
export class GetMessageListDTO {
  @Field()
  @IsNotEmpty()
  send_from: string

  @Field()
  @IsNotEmpty()
  send_to: string

  @Field(() => Int)
  @IsInt()
  limit: number

  @Field(() => Int)
  @IsInt()
  offset: number = 0
}

export class FilterMessageListDTO {
  send_to?: string
  send_from?: string
  created_at?: Date
  status?: "sent" | "received" | "readed"
}
