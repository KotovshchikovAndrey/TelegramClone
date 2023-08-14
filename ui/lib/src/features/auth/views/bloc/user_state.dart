part of 'user_bloc.dart';

abstract class UserState {}

class InitialUserState extends UserState {}

class UserError extends UserState {
  String message;

  UserError({required this.message});
}

class UserRegisterSuccess extends UserState {}
