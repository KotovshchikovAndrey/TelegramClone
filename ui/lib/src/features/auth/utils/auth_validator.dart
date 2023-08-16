import 'package:email_validator/email_validator.dart';

class AuthValidator {
  final _allowedEmailDomains = {"mail.ru", "gmail.com"};

  String? validateName(String? name) {
    if (name == null || name.isEmpty) {
      return "введите ваше имя";
    }

    if (name.length > 25) {
      return "максимальная длина поля - 25 символов";
    }

    return null;
  }

  String? validateSurname(String? surname) {
    if (surname == null || surname.isEmpty) {
      return "введите вашу фамилию";
    }

    if (surname.length > 25) {
      return "максимальная длина поля - 25 символов";
    }

    return null;
  }

  String? validateEmail(String? email) {
    if (email == null || email.isEmpty) {
      return "введите ваш email адрес";
    }

    if (!EmailValidator.validate(email)) {
      return "некорректный email адрес";
    }

    final emailDomain = email.split("@")[1];
    if (!_allowedEmailDomains.contains(emailDomain)) {
      return "разрешенные email адреса: ${_allowedEmailDomains.join(", ")}";
    }

    return null;
  }

  String? validatePhone(String? phone) {
    if (phone == null || phone.isEmpty) {
      return "введите ваш номер телефона";
    }

    if (phone.length != 17) {
      return "некорректный номер телефона";
    }

    return null;
  }
}
