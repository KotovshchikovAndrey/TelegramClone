import { HydratedDocument } from "mongoose"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Field, ObjectType } from "@nestjs/graphql"

export type AccountDocument = HydratedDocument<Account>
export type ConversationDocument = HydratedDocument<Conversation>
export type MemberDocument = HydratedDocument<Member>
export type MessageDocumenr = HydratedDocument<Message>
export type MessageObserverDocument = HydratedDocument<MessageObserver>

@Schema()
// @ObjectType()
export class Account {
  @Prop({ required: true, unique: true })
  // @Field(() => String)
  uuid: string

  @Prop({ required: true })
  // @Field({ nullable: false })
  phone: string

  @Prop({ required: false, default: null })
  // @Field({ nullable: true })
  name?: string

  @Prop({ required: false, default: null })
  // @Field({ nullable: true })
  surname?: string

  @Prop({ required: false, default: null })
  // @Field({ nullable: true })
  about_me?: string

  @Prop({ required: false, default: null })
  // @Field({ nullable: true })
  avatar?: string

  @Prop({ required: false })
  // @Field(() => Date, { nullable: true })
  birthday?: Date

  @Prop({ required: false, default: false })
  // @Field({ nullable: false })
  is_online: boolean
}

@Schema({
  timestamps: { createdAt: "created_at", updatedAt: false },
})
// @ObjectType()
export class Conversation {
  @Prop({ required: true, unique: true })
  // @Field(() => String)
  uuid: string

  @Prop({ required: false, default: null })
  // @Field({ nullable: true })
  name?: string

  @Prop({ required: false, default: null })
  // @Field({ nullable: true })
  description?: string

  @Prop({ required: false, default: null })
  // @Field({ nullable: true })
  avatar?: string

  @Prop({ required: false, default: false })
  // @Field({ nullable: false })
  is_group: boolean

  @Prop({ required: false, default: new Date(Date.now()) })
  // @Field(() => Date, { nullable: false })
  last_message_at: Date

  // @Field(() => Date, { nullable: false })
  created_at: Date
}

@Schema({
  timestamps: { createdAt: "join_date", updatedAt: false },
})
// @ObjectType()
export class Member {
  @Prop({ required: true, unique: true })
  // @Field(() => String)
  uuid: string

  @Prop({ type: String, ref: "Account", required: true })
  // @Field(() => String, { nullable: false })
  account: string

  @Prop({ type: String, ref: "Conversation", required: true })
  // @Field(() => String, { nullable: false })
  conversation: string

  @Prop({ required: false, default: false })
  // @Field({ nullable: false })
  is_admin: boolean

  @Prop({ required: false, default: true })
  // @Field({ nullable: false })
  is_active: boolean

  // @Field(() => Date, { nullable: false })
  join_date: Date

  @Prop({ required: false, default: null })
  // @Field(() => Date, { nullable: true })
  leave_date?: Date
}

@Schema({
  timestamps: { createdAt: "created_at", updatedAt: false },
})
// @ObjectType()
export class Message {
  @Prop({ required: true, unique: true })
  // @Field(() => String)
  uuid: string

  @Prop({ type: String, ref: "Account", required: true })
  // @Field(() => String, { nullable: false })
  sender: string

  @Prop({ type: String, ref: "Conversation", required: true })
  // @Field(() => String, { nullable: false })
  conversation: string

  @Prop({ required: false, default: null })
  // @Field({ nullable: true })
  text?: string

  @Prop({ required: false, default: null })
  // @Field({ nullable: true })
  media_url?: string

  @Prop({ default: "sent" })
  // @Field()
  status: "sent" | "delivered" | "readed"

  // @Field(() => Date, { nullable: false })
  created_at: Date
}

@Schema()
export class MessageObserver {
  @Prop({ type: String, ref: "Message", required: true })
  // @Field(() => String, { nullable: false })
  message: string

  @Prop({ type: String, ref: "Member", required: true })
  // @Field(() => String, { nullable: false })
  member: string

  @Prop({ default: "sent" })
  // @Field()
  status: "sent" | "delivered" | "readed"
}

export const AccountSchema = SchemaFactory.createForClass(Account)
export const ConversationSchema = SchemaFactory.createForClass(Conversation)
export const MemberSchema = SchemaFactory.createForClass(Member)
export const MessageSchema = SchemaFactory.createForClass(Message)
export const MessageObserverSchema =
  SchemaFactory.createForClass(MessageObserver)
