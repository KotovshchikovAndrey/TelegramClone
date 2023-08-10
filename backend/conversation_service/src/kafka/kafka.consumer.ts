import { Consumer, KafkaMessage } from "kafkajs"

export class KafkaConsumer implements KafkaConsumer {
  private readonly consumer: Consumer
  private readonly topicName: string

  constructor(consumer: Consumer, topicName: string) {
    this.consumer = consumer
    this.topicName = topicName
  }

  async connect() {
    await this.consumer.connect()
    await this.consumer.subscribe({
      topic: this.topicName,
      fromBeginning: true,
    })

    await this.consumer.run({
      autoCommit: true, // ПОТОМ УБРАТЬ!
      eachMessage: async ({ topic, partition, message }) =>
        this.handleMessage(message),
    })
  }

  async disconnect() {
    await this.consumer.disconnect()
  }

  private async handleMessage(message: KafkaMessage) {
    console.log(message.value.toString())
  }
}
