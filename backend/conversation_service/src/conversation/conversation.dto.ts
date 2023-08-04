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
  conversation: string
  user: string
  is_admin: boolean
}

export class CreateMembersDTO {
  conversation: string
  members: Omit<CreateMemberDTO, "conservation">[] = []
}

export class CreateMessageDTO {
  @Field()
  @MaxLength(500)
  @IsNotEmpty()
  text: string

  @Field()
  @IsNotEmpty()
  conversation: string

  media_url?: string
}
