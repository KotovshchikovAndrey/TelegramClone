import 'package:flutter/material.dart';

class ChatListItem extends StatelessWidget {
  final String chatName;
  final String avatarUrl;
  final String lastMessage;
  final String lastMessageDate;

  const ChatListItem({
    super.key,
    required this.chatName,
    required this.lastMessage,
    required this.lastMessageDate,
    this.avatarUrl = "default",
  });

  @override
  Widget build(BuildContext context) {
    print(avatarUrl);

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Padding(
                padding: const EdgeInsets.only(right: 15, left: 7),
                child: CircleAvatar(
                  radius: 27,
                  backgroundImage: avatarUrl != "default"
                      ? NetworkImage(avatarUrl)
                      : const AssetImage(
                          "assets/images/default_chat_avatar.jpg",
                        ) as ImageProvider,
                ),
              ),
              Expanded(
                child: Container(
                  width: MediaQuery.of(context).size.width,
                  decoration: const BoxDecoration(
                    border: Border(
                      bottom: BorderSide(color: Colors.black, width: 0.5),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Text(
                            chatName,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                              color: Colors.white,
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.only(right: 7),
                            child: Text(
                              lastMessageDate,
                              style: const TextStyle(color: Colors.grey),
                            ),
                          )
                        ],
                      ),
                      Container(
                        margin: const EdgeInsets.symmetric(vertical: 10),
                        child: Text(
                          lastMessage,
                          style: const TextStyle(color: Colors.grey),
                        ),
                      ),
                    ],
                  ),
                ),
              )
            ],
          )
        ],
      ),
    );
  }
}
