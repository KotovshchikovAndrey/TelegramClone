import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"
import { Field, ObjectType } from "@nestjs/graphql"

export type ConversationDocument = HydratedDocument<Conversation>
export type ConversationMemberDocument = HydratedDocument<ConversationMember>
export type ConversationMessageDocument = HydratedDocument<ConversationMessage>

@Schema()
@ObjectType()
export class Conversation {
  @Prop({ required: true, unique: true })
  @Field(() => String)
  uuid: string

  @Prop({ required: true })
  @Field({ nullable: false })
  name: string

  @Prop({ required: false })
  @Field({ nullable: true })
  description?: string

  @Prop({ required: false })
  @Field({ nullable: true })
  avatar?: string

  @Prop({ type: [{ type: String, ref: "ConversationMember", default: [] }] })
  @Field(() => ConversationMember, { nullable: "items" })
  members: ConversationMember[]
}

@Schema()
@ObjectType()
export class ConversationMember {
  @Prop({ required: true, unique: true })
  @Field(() => String)
  uuid: string

  @Prop({ required: true })
  user: string

  @Prop({ default: true })
  @Field()
  is_active: boolean

  @Prop({ default: new Date(Date.now()) })
  @Field(() => Date)
  join_date: Date

  @Prop({ required: false })
  @Field(() => Date, { nullable: true })
  leave_date?: Date
}

@Schema()
@ObjectType()
export class ConversationMessage {
  @Prop({ required: true, unique: true })
  @Field(() => String)
  uuid: string

  @Prop({ type: String, ref: "ConversationMember", required: true })
  @Field(() => String, { nullable: false })
  sender: string

  @Prop({ required: true })
  @Field()
  text: string

  @Prop({ required: false })
  @Field({ nullable: true })
  media_url?: string

  @Prop({ default: new Date(Date.now()) })
  @Field(() => Date)
  created_at: Date

  @Prop({ default: "sent" })
  @Field()
  status: "sent" | "received" | "readed"

  @Prop({ default: [] })
  @Field(() => [String], { nullable: "items" })
  viewers: string[]
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation)
export const ConversationMemberSchema =
  SchemaFactory.createForClass(ConversationMember)
export const ConversationMessageSchema =
  SchemaFactory.createForClass(ConversationMessage)
