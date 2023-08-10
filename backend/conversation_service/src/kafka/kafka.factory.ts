import { Inject, Injectable } from "@nestjs/common"
import { IKafkaConsumer } from "./kafka.types"
import { KafkaConsumer } from "./kafka.consumer"
import { Kafka } from "kafkajs"
import { randomUUID } from "crypto"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class KafkaMessagingFactory {
  constructor(
    @Inject("KAFKA_CLIENT")
    private readonly kafkaClient: Kafka,
    private readonly configService: ConfigService,
  ) {}

  createConsumer(): IKafkaConsumer {
    const consumer = this.kafkaClient.consumer({
      groupId: randomUUID(),
    })

    const topicName = this.configService.get("KAFKA_CONSUMER_TOPIC")
    const kafkaConsumer = new KafkaConsumer(consumer, topicName)
    return kafkaConsumer
  }

  createProducer() {}
}
