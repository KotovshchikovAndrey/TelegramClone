import 'package:flutter/material.dart';
import 'package:ui/src/features/messages/views/widgets/chat_message.dart';

class ChatRoomPage extends StatelessWidget {
  const ChatRoomPage({super.key, required this.roomName});
  final String roomName;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        image: DecorationImage(
          image: NetworkImage(
            "https://krot.info/uploads/posts/2023-03/1680226665_krot-info-p-standartnii-fon-telegram-instagram-23.jpg",
          ),
          fit: BoxFit.cover,
        ),
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          iconTheme: const IconThemeData(color: Colors.white, size: 30),
          backgroundColor: const Color.fromARGB(255, 33, 47, 60),
          title: const Row(
            children: [
              Padding(
                padding: EdgeInsets.only(right: 15),
                child: CircleAvatar(
                  radius: 25,
                  backgroundImage: NetworkImage("https://i.yapx.cc/PWwHk.jpg"),
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Name",
                    style: TextStyle(fontSize: 20, color: Colors.white),
                  ),
                  Text(
                    "Был(а) в сети",
                    style: TextStyle(fontSize: 15, color: Colors.grey),
                  ),
                ],
              )
            ],
          ),
          actions: [
            const Padding(
              padding: EdgeInsets.only(right: 10),
              child: Icon(
                Icons.call,
                size: 27,
              ),
            ),
            PopupMenuButton(
              iconSize: 27,
              itemBuilder: (BuildContext context) => const [
                PopupMenuItem<String>(
                  value: 'option1',
                  child: Text(
                    "test",
                    style: TextStyle(color: Colors.black),
                  ),
                ),
              ],
            )
          ],
        ),
        bottomNavigationBar: TextFormField(
          decoration: const InputDecoration(
            hintText: "Cooбщение",
            hintStyle: TextStyle(color: Colors.grey, fontSize: 18),
            filled: true,
            fillColor: Color.fromARGB(255, 33, 47, 61),
            contentPadding: EdgeInsets.all(15),
            prefixIcon: Icon(
              Icons.tag_faces_sharp,
              size: 27,
              color: Colors.grey,
            ),
            suffixIcon: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.attach_file,
                  size: 27,
                  color: Colors.grey,
                ),
                Padding(
                  padding: EdgeInsets.only(right: 15, left: 15),
                  child: Icon(
                    Icons.mic_none_outlined,
                    size: 27,
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
          ),
        ),
        body: ListView(children: [
          ChatMessage(isMyMessage: false, text: "Message 0", date: "05:11"),
          ChatMessage(isMyMessage: true, text: "Message 1", date: "05:11"),
          ChatMessage(isMyMessage: true, text: "Message 2", date: "05:11"),
          ChatMessage(isMyMessage: false, text: "Message 3", date: "05:11"),
          ChatMessage(isMyMessage: false, text: "Message 4", date: "05:11"),
          ChatMessage(isMyMessage: false, text: "Message 5", date: "05:11"),
          ChatMessage(isMyMessage: true, text: "Message 6", date: "05:11"),
          ChatMessage(isMyMessage: true, text: "Message 7", date: "05:11"),
          ChatMessage(isMyMessage: false, text: "Message 4", date: "05:11"),
          ChatMessage(isMyMessage: false, text: "Message 5", date: "05:11"),
          ChatMessage(isMyMessage: true, text: "Message 6", date: "05:11"),
          ChatMessage(isMyMessage: true, text: "Message 7", date: "05:11"),
        ]),
      ),
    );
  }
}
