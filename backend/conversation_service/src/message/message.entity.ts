import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"
import { ObjectType, Field } from "@nestjs/graphql"

export type MessageDocument = HydratedDocument<Message>

@Schema({ timestamps: { createdAt: "created_at" } })
@ObjectType()
export class Message {
  @Prop({ required: true, unique: true })
  @Field(() => String)
  uuid: string

  @Prop({ required: true })
  @Field()
  text: string

  @Prop({ required: false, default: null })
  @Field({ nullable: true })
  media_url?: string

  @Prop({ required: true })
  @Field()
  send_from: string

  @Prop({ required: true })
  @Field()
  send_to: string

  @Prop({ default: "sent" })
  @Field()
  status: "sent" | "received" | "readed"

  @Field(() => Date)
  created_at: Date
}

@ObjectType()
export class Interlocutor {
  @Field()
  user_uuid: string

  @Field()
  name: string

  @Field()
  surname: string

  @Field()
  phone: string

  @Field({ nullable: true })
  avatar?: string

  @Field({ nullable: true })
  about_me?: string
}

@ObjectType()
export class MediaHistory {
  @Field(() => [String], { nullable: "items" })
  media_urls: string[]
}

export const MessageSchema = SchemaFactory.createForClass(Message)
