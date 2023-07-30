import { InputType, Field } from "@nestjs/graphql"

@InputType()
export class CreateConversationDTO {
  @Field()
  name: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  avatar?: string
}
