import { InputType, Field, Int } from "@nestjs/graphql"
import { MaxLength, IsNotEmpty } from "class-validator"

@InputType()
export class CreateConversationDTO {
  @Field()
  is_group: boolean

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  avatar?: string
}

export class ConversationMemberDTO {
  user: string
  conversation: string
  is_active: boolean
}
