import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { HydratedDocument } from "mongoose"
import { ObjectType, Field } from "@nestjs/graphql"
import { randomUUID } from "crypto"

export type ConversationDocument = HydratedDocument<Conversation>

@Schema()
@ObjectType()
export class Conversation {
  @Prop({ type: String, default: randomUUID().toString() })
  @Field()
  _id: string

  @Prop({ default: false })
  @Field()
  is_group: boolean

  @Prop()
  @Field()
  name: string

  @Prop({ required: false })
  @Field({ nullable: true })
  description?: string

  @Prop({ required: false })
  @Field({ nullable: true })
  avatar?: string
}

@ObjectType()
export class ConversationMember {
  @Prop({ type: String, default: randomUUID().toString() })
  @Field()
  _id: string

  @Prop({ type: mongoose.Schema.ObjectId, ref: Conversation })
  @Field(() => String)
  conversation: Conversation

  @Prop()
  @Field()
  user: string

  @Prop({ default: new Date(Date.now()) })
  @Field()
  join_date: Date

  @Prop()
  @Field()
  leave_date: Date
}

@ObjectType()
export class Message {
  @Prop({ type: String, default: randomUUID().toString() })
  @Field()
  _id: string

  @Prop({ type: mongoose.Schema.ObjectId, ref: ConversationMember })
  @Field(() => String)
  conversation_member: ConversationMember

  @Prop()
  @Field()
  text: string

  @Prop()
  @Field({ nullable: true })
  media_url?: string

  @Prop({ default: new Date(Date.now()) })
  @Field(() => Date, { nullable: true })
  created_at: Date
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation)

export const ConversationMemberSchema =
  SchemaFactory.createForClass(ConversationMember)

export const MessageSchema = SchemaFactory.createForClass(Message)
