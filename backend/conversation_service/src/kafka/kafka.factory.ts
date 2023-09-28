import { Inject, Injectable } from "@nestjs/common"
import { IKafkaConsumer } from "./kafka.types"
import { KafkaUserAccountConsumer } from "./kafka.consumer"
import { Consumer, Kafka } from "kafkajs"
import { randomUUID } from "crypto"
import { UserAccountService } from "src/user-account/user-account.service"

export abstract class AbstractKafkaConsumerFactory {
  abstract createUserAccountConsumer(): IKafkaConsumer
}

@Injectable()
export class KafkaConsumerFactory extends AbstractKafkaConsumerFactory {
  constructor(
    @Inject("KAFKA_CLIENT")
    private readonly kafkaClient: Kafka,
    private readonly userAccountService: UserAccountService,
  ) {
    super()
  }

  createUserAccountConsumer(): IKafkaConsumer {
    const topicName = process.env["KAFKA_CONSUMER_TOPIC"]
    return new KafkaUserAccountConsumer({
      consumer: this.createConsumer(),
      topicName: topicName,
      userAccountService: this.userAccountService,
    })
  }

  private createConsumer(): Consumer {
    const consumer = this.kafkaClient.consumer({
      groupId: randomUUID(),
    })

    return consumer
  }
}
