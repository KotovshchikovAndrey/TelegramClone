import 'package:dio/dio.dart';
import 'package:ui/src/core/constants.dart';
import 'package:ui/src/core/exceptions/api_exception_mixin.dart';
import 'package:ui/src/features/auth/api/interfaces/auth_repository.dart';
import 'package:ui/src/features/auth/models/user.dart';
import 'package:ui/src/features/auth/models/user_create.dart';
import 'package:ui/src/features/auth/models/user_session.dart';

class HttpAuthRepository with ApiExceptionMixin implements IAuthRepository {
  final Dio _dio = Dio(
    BaseOptions(
      baseUrl: authApiUrl,
      connectTimeout: const Duration(seconds: 5),
      receiveTimeout: const Duration(seconds: 3),
    ),
  );

  @override
  Future<UserSession> registerUser(UserCreate userCreate) async {
    try {
      Response response = await _dio.post(
        "/register",
        data: userCreate.toJson(),
      );

      final userSession = UserSession.fromJson(response.data);
      return userSession;
    } on Exception catch (exc) {
      throwApiException(exc);
    }
  }

  @override
  Future<UserSession> loginUser(String phone) async {
    try {
      Response response = await _dio.post(
        "/login",
        data: {"phone": phone},
      );

      final userSession = UserSession.fromJson(response.data);
      return userSession;
    } on Exception catch (exc) {
      throwApiException(exc);
    }
  }

  @override
  Future<(CurrentUser, UserSessionPayload)> confirmUserLogin({
    required int code,
    required String sessionKey,
  }) async {
    try {
      Response response = await _dio.post(
        "/confirm-login",
        data: {"code": code, "session_key": sessionKey},
      );

      final userJson = response.data["user"];
      final sessionJson = response.data["session_payload"];

      final currentUser = CurrentUser.fromJson(userJson);
      final userSessionPayload = UserSessionPayload.fromJson(sessionJson);

      return (currentUser, userSessionPayload);
    } on Exception catch (exc) {
      throwApiException(exc);
    }
  }
}
