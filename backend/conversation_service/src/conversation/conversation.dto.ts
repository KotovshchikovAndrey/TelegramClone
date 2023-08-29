import { Field, Int, InputType, ObjectType } from "@nestjs/graphql"
import {
  MaxLength,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsArray,
  IsString,
  IsIn,
  IsInt,
} from "class-validator"

@InputType()
export class GetMessageHistoryDTO {
  @Field()
  @IsUUID()
  conversation: string

  @Field({ defaultValue: 10 })
  @IsInt()
  limit: number

  @Field({ defaultValue: 0 })
  @IsInt()
  offset: number
}

@InputType()
export class CreatePersonalMessageDTO {
  @Field()
  @IsUUID()
  reciever: string

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(500)
  text?: string
}

export class CreateConversationDTO {
  is_group: boolean
  name?: string
  description?: string
  avatar?: string
}

export class CreateMessageDTO {
  sender: string
  conversation: string
  text?: string
  media_url?: string
}

export class CreateMemberDTO {
  account: string
  conversation: string
  is_admin: boolean
}

@InputType()
export class CreateGroupDTO {
  @Field()
  @IsNotEmpty()
  @MaxLength(20)
  name: string

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(70)
  description?: string

  @Field(() => [String], { nullable: "items" })
  @IsArray()
  @IsUUID("4", { each: true })
  users: string[]
}

export class CreateGroupMessageDTO {
  @IsNotEmpty()
  @IsUUID()
  conversation: string

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(500)
  text?: string
}

@InputType()
export class UpdateMessageDTO {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  uuid: string

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(500)
  text?: string
}

@InputType()
export class SetUserMessageStatusDTO {
  @Field({ nullable: false })
  @IsNotEmpty()
  @IsUUID()
  message: string

  @Field({ nullable: false })
  @IsIn(["sent", "delivered", "readed"])
  status: "sent" | "delivered" | "readed"
}

export class UpdateConversationDTO {
  name?: string
  description?: string
  avatar?: string
}

export class SetMessageStatusDTO {
  uuid: string
  status: "sent" | "delivered" | "readed"
}

export class SetAccountMessageStatusDTO {
  account: string
  message: string
  status: "sent" | "delivered" | "readed"
}
