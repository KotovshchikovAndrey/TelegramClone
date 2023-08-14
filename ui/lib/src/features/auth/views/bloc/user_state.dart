part of 'user_bloc.dart';

abstract class UserState {}

class InitialUserState extends UserState {}

class AuthenticatedUser extends UserState {
  CurrentUser currentUser;
  UserSessionPayload sessionPayload;

  AuthenticatedUser({required this.currentUser, required this.sessionPayload});
}

class UserError extends UserState {
  String message;

  UserError({required this.message});
}

class RegisterSuccess extends UserState {}

class LoginSuccess extends UserState {}
