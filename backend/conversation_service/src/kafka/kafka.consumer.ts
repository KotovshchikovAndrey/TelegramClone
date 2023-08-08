import { Consumer, Message } from "kafka-node"

export class KafkaConsumer implements KafkaConsumer {
  private readonly consumer: Consumer

  constructor(consumer: Consumer) {
    this.consumer = consumer
  }

  async connect() {
    this.consumer.on("message", (message) => this.handleMessage(message))
    console.log("Kafka consumer connected")
  }

  async disconnect() {
    this.consumer.close(true, () => {
      console.log("Kafka consumer disconnected")
    })
  }

  private async handleMessage(message: Message) {
    console.log(message)
  }
}
