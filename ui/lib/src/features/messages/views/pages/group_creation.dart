import 'package:contacts_service/contacts_service.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';

class GroupCreationPage extends StatefulWidget {
  const GroupCreationPage({super.key});

  @override
  State<GroupCreationPage> createState() => _GroupCreationPageState();
}

class _GroupCreationPageState extends State<GroupCreationPage> {
  final _controller = TextEditingController();
  String phoneContactFilter = "";

  @override
  void initState() {
    _controller.addListener(() {
      setState(() {
        phoneContactFilter = _controller.text.toLowerCase();
      });
    });
    super.initState();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<List<Contact>> _getPhoneContacts() async {
    bool isGranted = await Permission.contacts.isGranted;
    if (!isGranted) {
      isGranted = await Permission.contacts.request().isGranted;
    }

    if (isGranted) {
      final contacts = await ContactsService.getContacts();
      if (phoneContactFilter.isEmpty) return contacts;

      final filteredContacts = contacts.where((contact) {
        var contactName = contact.displayName;
        contactName ??= contact.phones![0].value;
        return contactName!.toLowerCase().contains(phoneContactFilter);
      }).toList();

      return filteredContacts;
    }

    return [];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color.fromARGB(255, 33, 47, 60),
        iconTheme: const IconThemeData(
          color: Colors.white, //change your color here
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
            child: FutureBuilder(
              future: _getPhoneContacts(),
              builder: (context, snapshot) {
                final contacts = snapshot.data;
                if (contacts != null) {
                  return ListView.builder(
                    itemCount: contacts.length,
                    itemBuilder: (context, index) {
                      final contact = contacts[index];
                      final contactName = contact.displayName;
                      final contactPhoneNumber = contact.phones![0].value;

                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 5),
                        child: ListTile(
                          leading: const CircleAvatar(
                            radius: 25,
                            backgroundImage: AssetImage(
                                "assets/images/default_chat_avatar.jpg"),
                          ),
                          title: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                contactName ?? contactPhoneNumber ?? "Unknown",
                                style: const TextStyle(color: Colors.white),
                              ),
                              const Text(
                                "был(a) недавно",
                                style: TextStyle(color: Colors.grey),
                              )
                            ],
                          ),
                        ),
                      );
                    },
                  );
                }

                return const Center(
                  child: CircularProgressIndicator(
                    color: Colors.blue,
                    strokeWidth: 2,
                  ),
                );
              },
            ),
          )
        ],
      ),
    );
  }
}
