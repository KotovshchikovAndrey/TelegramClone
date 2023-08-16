class CurrentUser {
  late final String userUUID;
  late final String name;
  late final String surname;
  late final String phone;
  late final String email;

  CurrentUser({
    required this.userUUID,
    required this.name,
    required this.surname,
    required this.phone,
    required this.email,
  });

  CurrentUser.fromJson(Map<String, dynamic> jsonData) {
    userUUID = jsonData["user_uuid"].toString();
    name = jsonData["name"].toString();
    surname = jsonData["surname"].toString();
    phone = jsonData["phone"].toString();
    email = jsonData["email"].toString();
  }
}
