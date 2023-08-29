import { Inject, Injectable } from "@nestjs/common"
import { IKafkaConsumer } from "./kafka.types"
import { KafkaConsumer } from "./kafka.consumer"
import { Kafka } from "kafkajs"
import { randomUUID } from "crypto"
import { ConfigService } from "@nestjs/config"
import { UserAccountService } from "src/user-account/user-account.service"

@Injectable()
export class KafkaMessagingFactory {
  constructor(
    @Inject("KAFKA_CLIENT")
    private readonly kafkaClient: Kafka,
    private readonly configService: ConfigService,
    private readonly userAccountService: UserAccountService,
  ) {}

  createConsumer(): IKafkaConsumer {
    const consumer = this.kafkaClient.consumer({
      groupId: randomUUID(),
    })

    const topicName = this.configService.get("KAFKA_CONSUMER_TOPIC")
    const kafkaConsumer = new KafkaConsumer(
      consumer,
      topicName,
      this.userAccountService,
    )

    return kafkaConsumer
  }

  createProducer() {}
}
