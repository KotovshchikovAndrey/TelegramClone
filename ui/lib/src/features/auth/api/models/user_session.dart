class UserSession {
  late final String sessionKey;

  UserSession({required this.sessionKey});

  UserSession.fromJson(Map<String, dynamic> jsonData) {
    sessionKey = jsonData["session_key"].toString();
  }
}

class UserSessionPayload {
  late final String userDevice;
  late final String userIp;
  late final String userLocation;

  UserSessionPayload({
    required this.userDevice,
    required this.userIp,
    required this.userLocation,
  });

  UserSessionPayload.fromJson(Map<String, dynamic> jsonData) {
    userDevice = jsonData["session_device"].toString();
    userIp = jsonData["user_ip"].toString();
    userLocation = jsonData["user_location"].toString();
  }
}
