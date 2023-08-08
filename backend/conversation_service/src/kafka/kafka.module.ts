import { Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common"
import { KafkaClient } from "kafka-node"
import { KafkaMessagingFactory } from "./kafka.factory"
import { IKafkaConsumer } from "./kafka.types"

@Module({
  imports: [],
  providers: [
    {
      provide: "KAFKA_CLIENT",
      useFactory: (): KafkaClient => {
        const kafkaClient = new KafkaClient({
          kafkaHost: "localhost:9091",
          clientId: "conversation-service",
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
