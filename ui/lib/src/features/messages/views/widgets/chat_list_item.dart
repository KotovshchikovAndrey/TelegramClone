import 'package:flutter/material.dart';

class ChatListItem extends StatelessWidget {
  final String chatRoomTitle;
  final String chatRoomDescription;
  final String chatRoomImageUrl;

  const ChatListItem({
    super.key,
    required this.chatRoomTitle,
    required this.chatRoomDescription,
    required this.chatRoomImageUrl,
  });

  @override
  Widget build(BuildContext context) {
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
                  backgroundImage: NetworkImage(chatRoomImageUrl),
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
                            chatRoomTitle,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                              color: Colors.white,
                            ),
                          ),
                          const Padding(
                            padding: EdgeInsets.only(right: 7),
                            child: Text(
                              "ср",
                              style: TextStyle(color: Colors.grey),
                            ),
                          )
                        ],
                      ),
                      Container(
                        margin: const EdgeInsets.symmetric(vertical: 10),
                        child: Text(
                          chatRoomDescription,
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
