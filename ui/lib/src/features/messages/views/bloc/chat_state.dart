part of 'chat_bloc.dart';

abstract class ChatState {}

class ConversationLoading extends ChatState {}

class ChatMessageList extends ChatState {
  List<Message> messages;

  ChatMessageList({required this.messages});
}
