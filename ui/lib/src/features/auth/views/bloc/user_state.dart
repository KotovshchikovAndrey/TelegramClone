part of 'user_bloc.dart';

abstract class UserState {}

class InitialUserState extends UserState {}

class UserLoading extends UserState {}

class AuthenticatedUser extends UserState {
  String sessionKey;
  CurrentUser currentUser;

  AuthenticatedUser({required this.sessionKey, required this.currentUser});
}

class UserError extends UserState {
  String message;

  UserError({required this.message});
}

class RegisterSuccess extends UserState {}

class LoginSuccess extends UserState {}
