import { Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common"
import { KafkaMessagingFactory } from "./kafka.factory"
import { IKafkaConsumer } from "./kafka.types"
import { randomUUID } from "crypto"
import { Kafka } from "kafkajs"

@Module({
  imports: [],
  providers: [
    {
      provide: "KAFKA_CLIENT",
      useFactory: (): Kafka => {
        const kafkaClient = new Kafka({
          clientId: randomUUID(),
          brokers: ["localhost:9091"], // ЗАМЕНИТЬ НА .env!
        })

        return kafkaClient
      },
    },
    KafkaMessagingFactory,
  ],
})
export class KafkaModule implements OnModuleInit, OnModuleDestroy {
  private readonly consumer: IKafkaConsumer

  constructor(private readonly kafkaMessagingFactory: KafkaMessagingFactory) {
    this.consumer = this.kafkaMessagingFactory.createConsumer()
  }

  async onModuleInit() {
    await this.consumer.connect()
  }

  async onModuleDestroy() {
    await this.consumer.disconnect()
  }
}
