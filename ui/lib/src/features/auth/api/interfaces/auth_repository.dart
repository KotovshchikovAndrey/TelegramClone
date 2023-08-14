import 'package:ui/src/features/auth/api/models/user.dart';
import 'package:ui/src/features/auth/api/models/user_create.dart';
import 'package:ui/src/features/auth/api/models/user_session.dart';

abstract interface class IAuthRepository {
  Future<UserSession> registerUser(UserCreate userCreate);
  Future<UserSession> loginUser(String phone);
  Future<(CurrentUser, UserSessionPayload)> confirmUserLogin({
    required int code,
    required String sessionKey,
  });
}
