import { Inject, Injectable } from "@nestjs/common"
import { Consumer, KafkaClient } from "kafka-node"
import { IKafkaConsumer } from "./kafka.types"
import { KafkaConsumer } from "./kafka.consumer"

@Injectable()
export class KafkaMessagingFactory {
  constructor(
    @Inject("KAFKA_CLIENT")
    private readonly kafkaClient: KafkaClient,
  ) {}

  createConsumer(): IKafkaConsumer {
    const consumer = new Consumer(
      this.kafkaClient,
      [
        {
          topic: "messages",
          partition: 0,
        },
      ],
      { autoCommit: true },
    )

    const kafkaConsumer = new KafkaConsumer(consumer)
    return kafkaConsumer
  }

  createProducer() {}
}
