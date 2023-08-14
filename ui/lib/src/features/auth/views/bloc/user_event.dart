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