import 'package:flutter/material.dart';

AppBar customAppBar({required void Function() onSearchButtonClick}) {
  return AppBar(
    iconTheme: const IconThemeData(color: Colors.white, size: 27),
    title: const Text(
      "Telegram",
      style: TextStyle(
        color: Colors.white,
        fontWeight: FontWeight.w500,
        fontSize: 21,
      ),
    ),
    actions: <Widget>[
      InkWell(
        onTap: onSearchButtonClick,
        child: const Padding(
          padding: EdgeInsets.only(right: 10),
          child: Icon(
            Icons.search,
            color: Colors.white,
          ),
        ),
      ),
    ],
    backgroundColor: const Color.fromARGB(255, 33, 47, 60),
  );
}
