import 'package:flutter/material.dart';
import 'package:ui/src/features/messages/views/widgets/phone_contacts_list.dart';

class GroupCreationPage extends StatefulWidget {
  const GroupCreationPage({super.key});

  @override
  State<GroupCreationPage> createState() => _GroupCreationPageState();
}

class _GroupCreationPageState extends State<GroupCreationPage> {
  final _controller = TextEditingController();
  String phoneContactsFilter = "";

  @override
  void initState() {
    _controller.addListener(() {
      setState(() {
        phoneContactsFilter = _controller.text.toLowerCase();
      });
    });
    super.initState();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color.fromARGB(255, 33, 47, 60),
        iconTheme: const IconThemeData(
          color: Colors.white,
        ),
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Создать группу",
              style: TextStyle(
                fontWeight: FontWeight.w400,
                color: Colors.white,
                fontSize: 20,
              ),
            ),
            Padding(
              padding: EdgeInsets.symmetric(vertical: 5),
              child: Text(
                "до 2000 участников",
                style: TextStyle(
                  fontWeight: FontWeight.w400,
                  color: Colors.grey,
                  fontSize: 15,
                ),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.blue,
        shape: const CircleBorder(),
        child: const Icon(
          Icons.arrow_forward,
          color: Colors.white,
        ),
        onPressed: () {},
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 5),
            child: TextField(
              controller: _controller,
              cursorColor: Colors.blue,
              style: const TextStyle(
                fontSize: 18,
                color: Colors.white,
              ),
              decoration: const InputDecoration(
                contentPadding: EdgeInsets.only(left: 10),
                hintText: "Кого бы вы хотели пригласить?",
                hintStyle: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w400,
                  color: Colors.grey,
                ),
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(
                    width: 0.2,
                    color: Colors.grey,
                  ),
                ),
                focusedBorder: UnderlineInputBorder(
                  borderSide: BorderSide(
                    width: 0.2,
                    color: Colors.grey,
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: PhoneContactsList(phoneContactsFilter: phoneContactsFilter),
          )
        ],
      ),
    );
  }
}
