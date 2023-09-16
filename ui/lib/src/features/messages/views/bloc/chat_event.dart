part of 'chat_bloc.dart';

abstract class ChatEvent {}

class SendMessageToChat extends ChatEvent {
  Message message;

  SendMessageToChat({required this.message});
}

class FetchChatMessages extends ChatEvent {}

class FetchChats extends ChatEvent {
  num limit;
  num offset;

  FetchChats({this.limit = 10, this.offset = 0});
}

class FilterChatsByName extends ChatEvent {
  String name;

  FilterChatsByName({this.name = ""});
}

class ResetChatFilters extends ChatEvent {}
