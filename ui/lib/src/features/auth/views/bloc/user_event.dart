part of 'user_bloc.dart';

abstract class UserEvent {}

class RegisterUser extends UserEvent {
  String name;
  String surname;
  String email;
  String phone;

  RegisterUser({
    required this.name,
    required this.surname,
    required this.email,
    required this.phone,
  });
}

class LoginUser extends UserEvent {
  String phone;

  LoginUser({required this.phone});
}

class ConfirmUserLogin extends UserEvent {
  int code;
  String sessionKey;

  ConfirmUserLogin({required this.code, required this.sessionKey});
}
