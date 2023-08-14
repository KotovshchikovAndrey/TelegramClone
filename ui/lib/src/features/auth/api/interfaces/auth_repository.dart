import 'package:ui/src/features/auth/api/models/user_create.dart';
import 'package:ui/src/features/auth/api/models/user_session.dart';

abstract interface class IAuthRepository {
  Future<UserSession> registerUser(UserCreate userCreate);
}
