import { Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common"
import { KafkaMessagingFactory } from "./kafka.factory"
import { IKafkaConsumer } from "./kafka.types"
import { randomUUID } from "crypto"
import { Kafka } from "kafkajs"
import { UserAccountModule } from "src/user-account/user-account.module"

const KAFKA_CLIENT_HOST = process.env["KAFKA_CLIENT_HOST"]

@Module({
  imports: [UserAccountModule],
  providers: [
    {
      provide: "KAFKA_CLIENT",
      useFactory: (): Kafka => {
        const kafkaClient = new Kafka({
          clientId: randomUUID(),
          brokers: [KAFKA_CLIENT_HOST],
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
