import 'package:flutter/material.dart';

AppBar chatAppBar() {
  return AppBar(
    iconTheme: const IconThemeData(color: Colors.white, size: 30),
    backgroundColor: const Color.fromARGB(255, 33, 47, 60),
    title: const Row(
      children: [
        Padding(
          padding: EdgeInsets.only(right: 15),
          child: CircleAvatar(
            radius: 25,
            backgroundImage: AssetImage("assets/images/pass_avatar.jpg"),
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
  );
}
