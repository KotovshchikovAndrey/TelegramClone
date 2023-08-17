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

  @Field(() => ConversationMember, { nullable: "items" })
  members: Omit<ConversationMember, "conservation">[]
}

@Schema({ timestamps: { createdAt: "join_date" } })
@ObjectType()
export class ConversationMember {
  @Prop({ required: true, unique: true })
  @Field(() => String)
  uuid: string

  @Prop({ required: true })
  user: string

  @Prop({ type: String, ref: "Conversation", required: true })
  @Field(() => String, { nullable: false })
  conversation: string

  @Prop({ default: false })
  @Field()
  is_admin: boolean

  @Prop({ default: true })
  @Field()
  is_active: boolean

  @Prop({ required: false })
  @Field(() => Date, { nullable: true })
  leave_date?: Date

  @Field(() => Date)
  join_date: Date
}

@Schema({ timestamps: { createdAt: "created_at" } })
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

  @Prop({ default: "sent" })
  @Field()
  status: "sent" | "received" | "readed"

  @Prop({ default: [] })
  @Field(() => [String], { nullable: "items" })
  viewers: string[]

  @Field(() => Date)
  created_at: Date
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation)
export const ConversationMemberSchema =
  SchemaFactory.createForClass(ConversationMember)
export const ConversationMessageSchema =
  SchemaFactory.createForClass(ConversationMessage)
