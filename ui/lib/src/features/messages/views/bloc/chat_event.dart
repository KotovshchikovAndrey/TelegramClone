part of 'chat_bloc.dart';

abstract class ChatEvent {}

class LoadConversation extends ChatEvent {}

class AddMessageToChatList extends ChatEvent {
  Message message;

  AddMessageToChatList({required this.message});
}

class FetchConversationMessages extends ChatEvent {}
