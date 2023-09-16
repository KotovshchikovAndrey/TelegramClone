import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ui/src/features/messages/models/chat.dart';
import 'package:ui/src/features/messages/models/message.dart';

part 'chat_state.dart';
part 'chat_event.dart';

class ChatBloc extends Bloc<ChatEvent, ChatState> {
  ChatBloc() : super(ConversationLoading()) {
    on<SendMessageToChat>(_sendMessageToChat);
    on<FetchChatMessages>(_fetchChatMessages);
    on<FetchChats>(_fetchChats);
    on<FilterChatsByName>(_filterChatsByName);
    on<ResetChatFilters>(_resetChatFilters);
  }

  final List<Chat> chats = const [
    Chat(
      name: "Роберт Адамов",
      lastMessage: "Дорова",
      lastMessageDate: "2023-08-10",
    ),
    Chat(
      name: "Михаил Ищенко",
      lastMessage: "Привет",
      lastMessageDate: "2023-08-10",
    ),
    Chat(
      name: "Алексей Штоль",
      lastMessage: "Батя в городе",
      lastMessageDate: "2023-08-10",
    ),
  ];

  Future<void> _sendMessageToChat(
    SendMessageToChat event,
    Emitter<ChatState> emit,
  ) async {
    final currentState = state;
    if (currentState is ChatMessageList) {
      final messages = currentState.messages;
      messages.add(event.message);
      emit(ChatMessageList(messages: messages));
    }
  }

  Future<void> _fetchChatMessages(
    FetchChatMessages event,
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

  Future<void> _fetchChats(
    FetchChats event,
    Emitter<ChatState> emit,
  ) async {
    // fetch chats
    emit(ChatList(chats: chats));
  }

  Future<void> _filterChatsByName(
    FilterChatsByName event,
    Emitter<ChatState> emit,
  ) async {
    final currentState = state;
    final searchChatName = event.name.toLowerCase();

    if (currentState is ChatList && searchChatName.isNotEmpty) {
      final filteredChats = currentState.chats
          .where(
            (chat) => chat.name.toLowerCase().contains(
                  searchChatName.toLowerCase(),
                ),
          )
          .toList();

      emit(ChatList(chats: filteredChats));
    }

    if (searchChatName.isEmpty) {
      emit(ChatList(chats: chats));
    }
  }

  Future<void> _resetChatFilters(
    ResetChatFilters event,
    Emitter<ChatState> emit,
  ) async {
    emit(ChatList(chats: chats));
  }
}
