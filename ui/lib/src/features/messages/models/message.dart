class Message {
  late final String text;
  late final String date;

  Message({required this.text, required this.date});

  Message.fromJson({required Map<String, dynamic> jsonData}) {
    text = jsonData["text"];

    final createdAt = DateTime.parse(jsonData["created_at"]).toLocal();
    date = "${createdAt.hour}:${createdAt.minute}";
  }
}
