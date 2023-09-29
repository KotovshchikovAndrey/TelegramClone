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
  late final IOWebSocketChannel _websocket;

  @override
  void initState() {
    super.initState();
    _fetchChatMessages();
    _connectToWebsocket();
  }

  @override
  void dispose() {
    _websocket.sink.close();
    super.dispose();
  }

  void _fetchChatMessages() {
    final chatBloc = BlocProvider.of<ChatBloc>(context);
    chatBloc.add(FetchChatMessages());
  }

  void _connectToWebsocket() {
    final authState = BlocProvider.of<UserBloc>(context).state;
    _websocket = IOWebSocketChannel.connect(
      Uri.parse('ws://10.0.2.2/conversations/ws/test_channel'),
      headers: {
        "User-Session":
            authState is AuthenticatedUser ? authState.sessionKey : ""
      },
    );

    _websocket.stream.listen((event) {
      print(event);
    });
  }

  void _sendMessage(String text) {
    _websocket.sink.add(text);
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
                chatBloc.add(SendMessageToChat(message: message));
                _sendMessage(text);
              },
            ),
          ],
        ),
      ),
    );
  }
}
