import { Field, ObjectType } from "@nestjs/graphql"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type AccountDocument = HydratedDocument<Account>

@Schema()
@ObjectType()
export class Account {
  @Prop({ required: true, unique: true })
  @Field(() => String)
  uuid: string

  @Prop({ required: true, unique: true, index: true })
  @Field({ nullable: false })
  phone: string

  @Prop({ required: true })
  @Field({ nullable: false })
  name: string

  @Prop({ required: true })
  @Field({ nullable: false })
  surname: string

  @Prop({ required: false, default: null })
  @Field({ nullable: true })
  about_me?: string

  @Prop({ required: false, default: null })
  @Field({ nullable: true })
  avatar?: string

  @Prop({ required: false })
  @Field(() => Date, { nullable: true })
  birthday?: Date

  @Prop({ required: false, default: false })
  @Field({ nullable: false })
  is_online: boolean
}

export class User {
  user_uuid: string
  phone: string
  email: string
}

export const AccountSchema = SchemaFactory.createForClass(Account)
