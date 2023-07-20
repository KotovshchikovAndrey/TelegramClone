import 'package:flutter/material.dart';

class DrawerMenu extends StatelessWidget {
  const DrawerMenu({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        toolbarHeight: MediaQuery.of(context).size.height / 5,
        backgroundColor: const Color.fromARGB(255, 50, 69, 80),
        title: Column(
          children: [
            Container(
              margin: const EdgeInsets.only(bottom: 15),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CircleAvatar(
                    radius: 35,
                    backgroundImage:
                        NetworkImage("https://i.yapx.cc/PWwHk.jpg"),
                  ),
                  Flexible(
                    child: Icon(
                      Icons.wb_sunny,
                      color: Colors.white,
                      size: 30,
                    ),
                  )
                ],
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "E А",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w400,
                        fontSize: 20,
                      ),
                    ),
                    Text(
                      "+79242570707",
                      style: TextStyle(
                        color: Colors.grey,
                        fontWeight: FontWeight.w400,
                        fontSize: 15,
                      ),
                    )
                  ],
                ),
                Flexible(
                  child: IconButton(
                    onPressed: () => null,
                    icon: const Icon(
                      Icons.keyboard_arrow_down,
                      size: 30,
                      color: Colors.white,
                    ),
                  ),
                )
              ],
            )
          ],
        ),
      ),
    );
  }
}
