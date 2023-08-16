part of 'user_bloc.dart';

abstract class UserState {}

class InitialUserState extends UserState {}

class UserLoading extends UserState {}

class AuthenticatedUser extends UserState {
  CurrentUser currentUser;

  AuthenticatedUser({required this.currentUser});
}

class UserError extends UserState {
  String message;

  UserError({required this.message});
}

class RegisterSuccess extends UserState {}

class LoginSuccess extends UserState {}
