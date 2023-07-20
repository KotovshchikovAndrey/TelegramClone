import 'package:flutter/material.dart';
import 'package:ui/src/core/widgets/drawer_menu.dart';
import 'package:ui/src/features/messager/views/pages/chat_list.dart';

import 'custom_appbar.dart';

class TopTabBar extends StatefulWidget {
  const TopTabBar({super.key});

  @override
  State<StatefulWidget> createState() => _TopTabBarState();
}

class _TopTabBarState extends State<TopTabBar>
    with SingleTickerProviderStateMixin {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const Drawer(
        child: DrawerMenu(),
      ),
      appBar: customAppBar(),
      body: Theme(
        data: ThemeData(
          highlightColor: Colors.transparent,
          splashColor: Colors.transparent,
        ),
        child: Container(
          color: const Color.fromARGB(255, 50, 69, 80),
          child: DefaultTabController(
            length: 2,
            child: Column(
              children: <Widget>[
                Container(
                  constraints: const BoxConstraints.expand(height: 50),
                  child: const TabBar(
                    unselectedLabelColor: Colors.grey,
                    labelColor: Color.fromARGB(255, 101, 186, 255),
                    indicatorColor: Colors.blueAccent,
                    tabs: [
                      Tab(
                        child: Text(
                          "Все чаты",
                          style: TextStyle(fontSize: 15),
                        ),
                      ),
                      Tab(
                        child: Text(
                          "Личные",
                          style: TextStyle(fontSize: 15),
                        ),
                      ),
                    ],
                  ),
                ),
                const Expanded(
                  child: TabBarView(
                    children: [
                      ChatListPage(),
                      Text("Articles Body"),
                    ],
                  ),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
