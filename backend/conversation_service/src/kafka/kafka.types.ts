export interface IKafkaMessage {
  key?: string
  value: string
  partition?: number
}

export interface IKafkaConsumer {
  connect(): Promise<void>
  disconnect(): Promise<void>
}

export interface IKafkaProducer {
  connect(): Promise<void>
  sendMessage(topicName: string, message: IKafkaMessage): Promise<void>
  disconnect(): Promise<void>
}
