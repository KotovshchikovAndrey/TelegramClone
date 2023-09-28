import { Inject, Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common"
import {
  AbstractKafkaConsumerFactory,
  KafkaConsumerFactory,
} from "./kafka.factory"
import { IKafkaConsumer, IKafkaProducer } from "./kafka.types"
import { randomUUID } from "crypto"
import { Kafka } from "kafkajs"
import { UserAccountModule } from "src/user-account/user-account.module"
import { KafkaProducer } from "./kafka.producer"

const kafkaProducerProvider = {
  provide: "KAFKA_PRODUCER",
  inject: [{ token: "KAFKA_CLIENT", optional: false }],
  useFactory(kafkaClient: Kafka): IKafkaProducer {
    const producer = kafkaClient.producer({
      allowAutoTopicCreation: true, // В проде убрать
    })

    const kafkaProducer = new KafkaProducer(producer)
    return kafkaProducer
  },
}

@Module({
  imports: [UserAccountModule],
  exports: [kafkaProducerProvider],
  providers: [
    kafkaProducerProvider,
    {
      provide: AbstractKafkaConsumerFactory,
      useClass: KafkaConsumerFactory,
    },
    {
      provide: "KAFKA_CLIENT",
      useFactory: (): Kafka => {
        const KAFKA_CLIENT_HOST = process.env["KAFKA_CLIENT_HOST"]
        const kafkaClient = new Kafka({
          clientId: randomUUID(),
          brokers: [KAFKA_CLIENT_HOST],
        })

        return kafkaClient
      },
    },
  ],
})
export class KafkaModule implements OnModuleInit, OnModuleDestroy {
  private readonly userAccountConsumer: IKafkaConsumer

  constructor(
    @Inject("KAFKA_PRODUCER")
    private readonly kafkaProducer: IKafkaProducer,
    private readonly kafkaConsumerFactory: AbstractKafkaConsumerFactory,
  ) {
    this.userAccountConsumer =
      this.kafkaConsumerFactory.createUserAccountConsumer()
  }

  async onModuleInit() {
    await this.kafkaProducer.connect()
    await this.userAccountConsumer.connect()
  }

  async onModuleDestroy() {
    await this.kafkaProducer.disconnect()
    await this.userAccountConsumer.disconnect()
  }
}
