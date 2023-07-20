import 'package:flutter/material.dart';
import 'package:ui/src/features/messager/views/widgets/chat_list_item.dart';

class ChatRoom {
  final String chatRoomTitle;
  final String chatRoomDescription;
  final String chatRoomImageUrl;

  const ChatRoom({
    required this.chatRoomTitle,
    required this.chatRoomDescription,
    required this.chatRoomImageUrl,
  });
}

class ChatListPage extends StatelessWidget {
  const ChatListPage({super.key});

  final List<ChatRoom> chatList = const [
    ChatRoom(
        chatRoomTitle: "Екатерина Анисимова",
        chatRoomDescription: "Посмотрим)",
        chatRoomImageUrl: "https://i.yapx.cc/PWwHk.jpg"),
    ChatRoom(
        chatRoomTitle: "Chat 2",
        chatRoomDescription: "Test Desc",
        chatRoomImageUrl: "https://i.yapx.cc/PWwHk.jpg"),
    ChatRoom(
        chatRoomTitle: "Chat 3",
        chatRoomDescription: "Test Desc",
        chatRoomImageUrl: "https://i.yapx.cc/PWwHk.jpg"),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 43, 46, 49),
      body: ListView.builder(
        padding: const EdgeInsets.all(5),
        itemCount: chatList.length,
        itemBuilder: (context, index) {
          final currentChatRoom = chatList[index];

          return InkWell(
            onTap: () => print(111),
            child: SizedBox(
              height: 100,
              child: ChatListItem(
                chatRoomTitle: currentChatRoom.chatRoomTitle,
                chatRoomDescription: currentChatRoom.chatRoomDescription,
                chatRoomImageUrl: currentChatRoom.chatRoomImageUrl,
              ),
            ),
          );
        },
      ),
    );
  }
}
