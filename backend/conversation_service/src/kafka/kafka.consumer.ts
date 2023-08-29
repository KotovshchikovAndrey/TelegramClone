import { Consumer, KafkaMessage } from "kafkajs"
import { UserAccountService } from "src/user-account/user-account.service"

export class KafkaConsumer implements KafkaConsumer {
  private readonly consumer: Consumer
  private readonly topicName: string
  private readonly userAccountService: UserAccountService

  constructor(
    consumer: Consumer,
    topicName: string,
    userAccountService: UserAccountService,
  ) {
    this.consumer = consumer
    this.topicName = topicName
    this.userAccountService = userAccountService
  }

  async connect() {
    await this.consumer.connect()
    await this.consumer.subscribe({
      topic: this.topicName,
      fromBeginning: false,
    })

    await this.consumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, partition, message }) => {
        try {
          await this.handleMessage(message)
          this.consumer.commitOffsets([
            { topic, partition, offset: message.offset },
          ])
        } catch (error) {
          console.log(error)
        }
      },
    })
  }

  async disconnect() {
    await this.consumer.disconnect()
  }

  private async handleMessage(message: KafkaMessage) {
    const messageData = JSON.parse(message.value.toString())
    this.userAccountService.createAccountForUser({
      uuid: messageData.user_uuid,
      phone: messageData.phone,
      name: messageData.name,
      surname: messageData.surname,
    })
  }
}
