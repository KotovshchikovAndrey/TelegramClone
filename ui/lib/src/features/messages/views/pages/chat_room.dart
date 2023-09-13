import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ui/src/features/auth/views/bloc/user_bloc.dart';
import 'package:ui/src/features/messages/models/message.dart';
import 'package:ui/src/features/messages/views/bloc/chat_bloc.dart';
import 'package:ui/src/features/messages/views/widgets/chat_appbar.dart';
import 'package:ui/src/features/messages/views/widgets/chat_input.dart';
import 'package:ui/src/features/messages/views/widgets/message_list.dart';
import 'package:web_socket_channel/io.dart';

class ChatRoomPage extends StatefulWidget {
  const ChatRoomPage({super.key, required this.roomName});
  final String roomName;

  @override
  State<ChatRoomPage> createState() => _ChatRoomPageState();
}

class _ChatRoomPageState extends State<ChatRoomPage> {
  // IOWebSocketChannel get _websocket {
  //   final authState = BlocProvider.of<UserBloc>(context).state;
  //   return IOWebSocketChannel.connect(
  //     Uri.parse('ws://10.0.2.2/messages/ws/test_channel'),
  //     headers: {
  //       "User-Session":
  //           authState is AuthenticatedUser ? authState.sessionKey : ""
  //     },
  //   );
  // }

  @override
  void initState() {
    super.initState();

    final chatBloc = BlocProvider.of<ChatBloc>(context);
    chatBloc.add(FetchConversationMessages());

    // _websocket.stream.listen((event) {
    //   print(event);
    // });
  }

  @override
  void dispose() {
    // _websocket.sink.close();
    super.dispose();
  }

  _sendMessage(String text) {
    // _websocket.sink.add(text);
  }

  @override
  Widget build(BuildContext context) {
    final chatBloc = BlocProvider.of<ChatBloc>(context);

    return Container(
      decoration: const BoxDecoration(
        image: DecorationImage(
          image: AssetImage("assets/images/chat_room_background.jpg"),
          fit: BoxFit.cover,
        ),
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: chatAppBar(),
        body: Stack(
          children: [
            const MessageList(),
            ChatInput(
              onSendMessage: (text) {
                final message = Message(text: text, date: "15:20");
                chatBloc.add(AddMessageToChatList(message: message));
                _sendMessage(text);
              },
            ),
          ],
        ),
      ),
    );
  }
}
