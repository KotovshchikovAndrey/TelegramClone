import 'package:flutter/material.dart';

AppBar customAppBar() {
  return AppBar(
    iconTheme: const IconThemeData(color: Colors.white, size: 30),
    title: const Text(
      "Telegram",
      style: TextStyle(
        color: Colors.white,
        fontWeight: FontWeight.w400,
        fontSize: 25,
      ),
    ),
    actions: const <Widget>[
      Padding(
        padding: EdgeInsets.only(right: 10),
        child: Icon(
          Icons.search,
          color: Colors.white,
        ),
      ),
    ],
    backgroundColor: const Color.fromARGB(255, 50, 69, 80),
  );
}
