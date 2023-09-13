class Chat {
  final String name;
  final String avatarUrl;
  final String lastMessage;
  final String lastMessageDate;

  const Chat({
    required this.name,
    required this.lastMessage,
    required this.lastMessageDate,
    this.avatarUrl = "default",
  });
}
