import { ObjectType, Field, Int } from "@nestjs/graphql"

@ObjectType()
export class Chat {
  @Field((type) => Int)
  id: number

  @Field()
  title: string

  @Field({ nullable: true })
  description?: string
}
