import { Consumer, KafkaClient } from "kafka-node"

export interface IKafkaConsumer {
  connect(): Promise<void>
  disconnect(): Promise<void>
}
