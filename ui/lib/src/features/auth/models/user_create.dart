class UserCreate {
  String name;
  String surname;
  String phone;
  String email;

  UserCreate({
    required this.name,
    required this.surname,
    required this.email,
    required this.phone,
  });

  Map<String, dynamic> toJson() {
    return {
      "name": name,
      "surname": surname,
      "email": email,
      "phone": phone,
    };
  }
}
