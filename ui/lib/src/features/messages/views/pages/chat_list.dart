import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ui/src/core/routes/route_args.dart';
import 'package:ui/src/features/messages/models/chat.dart';
import 'package:ui/src/features/messages/views/bloc/chat_bloc.dart';
import 'package:ui/src/features/messages/views/widgets/chat_list_item.dart';

class ChatListPage extends StatefulWidget {
  const ChatListPage({super.key});

  @override
  State<ChatListPage> createState() => _ChatListPageState();
}

class _ChatListPageState extends State<ChatListPage> {
  List<Chat> chats = [];

  @override
  void initState() {
    super.initState();

    final chatBloc = BlocProvider.of<ChatBloc>(context);
    chatBloc.add(FetchChats());
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final chatBloc = BlocProvider.of<ChatBloc>(context);

    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 28, 40, 51),
      body: BlocBuilder(
        bloc: chatBloc,
        builder: (context, state) {
          if (state is ChatList) {
            chats = state.chats;
          }

          return ListView.builder(
            padding: const EdgeInsets.all(5),
            itemCount: chats.length,
            itemBuilder: (context, index) {
              final currentChat = chats[index];

              return InkWell(
                onTap: () => Navigator.pushNamed(
                  context,
                  "/chat",
                  arguments: ChatRoomArgs(roomName: "test"),
                ),
                child: SizedBox(
                  height: 85,
                  child: ChatListItem(
                    chatName: currentChat.name,
                    lastMessage: currentChat.lastMessage,
                    lastMessageDate: currentChat.lastMessageDate,
                    avatarUrl: currentChat.avatarUrl,
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
