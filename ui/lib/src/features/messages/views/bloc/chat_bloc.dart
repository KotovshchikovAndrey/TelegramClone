import 'package:flutter_bloc/flutter_bloc.dart';

part 'chat_state.dart';
part 'chat_event.dart';

class ChatBloc extends Bloc<ChatEvent, ChatState> {
  ChatBloc() : super(ConversationLoading()) {
    on<LoadConversation>(_someMethod);
  }

  Future<void> _someMethod(
    LoadConversation event,
    Emitter<ChatState> eimit,
  ) async {
    return;
  }
}
