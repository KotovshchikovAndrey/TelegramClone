class UserSession {
  late final String sessionKey;

  UserSession({required this.sessionKey});

  UserSession.fromJson(Map<String, dynamic> jsonData) {
    sessionKey = jsonData["session_key"].toString();
  }
}