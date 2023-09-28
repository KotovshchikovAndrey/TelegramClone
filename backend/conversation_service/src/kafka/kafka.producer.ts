import { Producer } from "kafkajs"
import { IKafkaMessage, IKafkaProducer } from "./kafka.types"
import { randomUUID } from "crypto"

export class KafkaProducer implements IKafkaProducer {
  private readonly producer: Producer

  constructor(producer: Producer) {
    this.producer = producer
  }

  async connect() {
    await this.producer.connect()
  }

  async sendMessage(topicName: string, message: IKafkaMessage) {
    await this.producer.send({
      acks: 1,
      topic: topicName,
      messages: [
        {
          key: message.key ?? randomUUID(),
          value: message.value,
          partition: message.partition,
        },
      ],
    })
  }

  async disconnect() {
    await this.producer.disconnect()
  }
}
