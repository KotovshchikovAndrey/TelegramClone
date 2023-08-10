export interface IKafkaConsumer {
  connect(): Promise<void>
  disconnect(): Promise<void>
}
