import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ui/src/features/messages/models/message.dart';

part 'chat_state.dart';
part 'chat_event.dart';

class ChatBloc extends Bloc<ChatEvent, ChatState> {
  ChatBloc() : super(ConversationLoading()) {
    on<AddMessageToChatList>(_addMessageToChatList);
    on<FetchConversationMessages>(_fetchConversationMessages);
  }

  Future<void> _addMessageToChatList(
    AddMessageToChatList event,
    Emitter<ChatState> emit,
  ) async {
    final currentState = state;
    if (currentState is ChatMessageList) {
      final messages = currentState.messages;
      messages.add(event.message);
      emit(ChatMessageList(messages: messages));
    }
  }

  Future<void> _fetchConversationMessages(
    FetchConversationMessages event,
    Emitter<ChatState> emit,
  ) async {
    // fetch messages
    final messages = [
      Message(text: "init message", date: "18:00"),
      Message(text: "init message", date: "18:00"),
      Message(text: "init message", date: "18:00"),
      Message(text: "init message", date: "18:00"),
      Message(text: "init message", date: "18:00"),
      Message(text: "init message", date: "18:00"),
      Message(text: "init message", date: "18:00"),
      Message(text: "init message", date: "18:00"),
      Message(text: "init message", date: "18:00"),
      Message(text: "init message", date: "18:00"),
    ];
    emit(ChatMessageList(messages: messages));
  }
}
