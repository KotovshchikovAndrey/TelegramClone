import 'package:flutter/material.dart';

class ChatMessage extends StatelessWidget {
  ChatMessage({
    super.key,
    required this.isMyMessage,
    required this.text,
    required this.date,
  });

  bool isMyMessage = false;
  String text;
  String date;

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: isMyMessage ? Alignment.topRight : Alignment.topLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 15, horizontal: 10),
        padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 30),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width / 1.5,
        ),
        decoration: isMyMessage
            ? const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topRight,
                  end: Alignment.bottomLeft,
                  colors: <Color>[
                    Color.fromARGB(255, 135, 68, 203),
                    Color.fromARGB(255, 161, 80, 193),
                  ],
                ),
                borderRadius: BorderRadius.only(
                  topRight: Radius.circular(35),
                  bottomRight: Radius.circular(5),
                  topLeft: Radius.circular(25),
                  bottomLeft: Radius.circular(25),
                ),
              )
            : const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topRight,
                  end: Alignment.bottomLeft,
                  colors: <Color>[
                    Color.fromARGB(255, 68, 203, 192),
                    Color.fromARGB(255, 48, 127, 201),
                  ],
                ),
                borderRadius: BorderRadius.only(
                  topRight: Radius.circular(25),
                  bottomRight: Radius.circular(25),
                  topLeft: Radius.circular(35),
                  bottomLeft: Radius.circular(5),
                ),
              ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              text,
              textAlign: TextAlign.left,
              style: const TextStyle(color: Colors.white, fontSize: 15),
            ),
            Text(
              date,
              style: const TextStyle(
                color: Color.fromARGB(255, 221, 207, 207),
              ),
            )
          ],
        ),
      ),
    );
  }
}
