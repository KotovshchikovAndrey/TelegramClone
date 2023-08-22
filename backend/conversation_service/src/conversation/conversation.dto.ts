import { Field, Int, InputType, ObjectType } from "@nestjs/graphql"
import {
  MaxLength,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsArray,
  IsString,
  IsIn,
} from "class-validator"

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

export class CreateGroupDTO {
  @IsNotEmpty()
  @MaxLength(20)
  name: string

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(70)
  description?: string

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

export class UpdateMessageDTO {
  @IsNotEmpty()
  @IsUUID()
  uuid: string

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
