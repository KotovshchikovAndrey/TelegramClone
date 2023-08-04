import { InputType, Field, Int } from "@nestjs/graphql"
import { MaxLength, IsNotEmpty } from "class-validator"

@InputType()
export class CreateConversationDTO {
  @Field()
  name: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  avatar?: string
}

export class CreateMemberDTO {
  conservation: string
  user: string
}

export class CreateMessageDTO {
  @Field()
  @MaxLength(500)
  @IsNotEmpty()
  text: string

  media_url?: string
}
