import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"
import { ObjectType, Field } from "@nestjs/graphql"

export type MessageDocument = HydratedDocument<Message>

@Schema()
@ObjectType()
export class Message {
  @Prop({ required: true, unique: true })
  @Field(() => String)
  uuid: string

  @Prop({ required: true })
  @Field()
  text: string

  @Prop({ required: false })
  @Field({ nullable: true })
  media_url?: string

  @Prop({ default: new Date(Date.now()) })
  @Field(() => Date)
  created_at: Date

  @Prop({ required: true })
  @Field()
  send_from: string

  @Prop({ required: true })
  @Field()
  send_to: string

  @Prop({ default: "sent" })
  @Field()
  status: "sent" | "received" | "readed"
}

export const MessageSchema = SchemaFactory.createForClass(Message)
