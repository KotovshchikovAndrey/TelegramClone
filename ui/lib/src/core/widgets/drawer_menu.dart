import 'package:flutter/material.dart';

class DrawerMenu extends StatelessWidget {
  const DrawerMenu({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        toolbarHeight: MediaQuery.of(context).size.height / 5,
        backgroundColor: const Color.fromARGB(255, 33, 47, 60),
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
                        fontSize: 18,
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
      body: Container(
        color: const Color.fromARGB(255, 43, 46, 49),
        child: ListView(
          children: [
            IconButton(
              onPressed: () => Navigator.pushNamed(context, '/group-creation'),
              icon: const Row(
                children: [
                  Padding(
                    padding: EdgeInsets.all(10),
                    child: Icon(
                      Icons.people_alt,
                      size: 25,
                      color: Colors.grey,
                    ),
                  ),
                  Text(
                    "Создать группу",
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w500,
                      fontSize: 15,
                    ),
                  ),
                ],
              ),
            ),
            IconButton(
              onPressed: () => Navigator.pushNamed(context, "/phone-contacts"),
              icon: const Row(
                children: [
                  Padding(
                    padding: EdgeInsets.all(10),
                    child: Icon(
                      Icons.person,
                      size: 25,
                      color: Colors.grey,
                    ),
                  ),
                  Text(
                    "Контакты",
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w500,
                      fontSize: 15,
                    ),
                  ),
                ],
              ),
            ),
            IconButton(
              onPressed: () => null,
              icon: const Row(
                children: [
                  Padding(
                    padding: EdgeInsets.all(10),
                    child: Icon(
                      Icons.phone,
                      size: 25,
                      color: Colors.grey,
                    ),
                  ),
                  Text(
                    "Звонки",
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w500,
                      fontSize: 15,
                    ),
                  ),
                ],
              ),
            ),
            IconButton(
              onPressed: () => null,
              icon: const Row(
                children: [
                  Padding(
                    padding: EdgeInsets.all(10),
                    child: Icon(
                      Icons.person_pin,
                      size: 25,
                      color: Colors.grey,
                    ),
                  ),
                  Text(
                    "Люди рядом",
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w500,
                      fontSize: 15,
                    ),
                  ),
                ],
              ),
            ),
            IconButton(
              onPressed: () => null,
              icon: const Row(
                children: [
                  Padding(
                    padding: EdgeInsets.all(10),
                    child: Icon(
                      Icons.bookmark,
                      size: 25,
                      color: Colors.grey,
                    ),
                  ),
                  Text(
                    "Избранное",
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w500,
                      fontSize: 15,
                    ),
                  ),
                ],
              ),
            ),
            IconButton(
              onPressed: () => null,
              icon: const Row(
                children: [
                  Padding(
                    padding: EdgeInsets.all(10),
                    child: Icon(
                      Icons.settings,
                      size: 25,
                      color: Colors.grey,
                    ),
                  ),
                  Text(
                    "Настройки",
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w500,
                      fontSize: 15,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
