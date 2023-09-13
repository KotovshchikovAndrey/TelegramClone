import 'package:flutter/material.dart';
import 'package:ui/src/features/auth/views/widgets/login_form.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    final isKeyboard = MediaQuery.of(context).viewInsets.bottom != 0;

    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 28, 40, 51),
      body: Center(
        child: SingleChildScrollView(
          reverse: true,
          child: Column(
            children: [
              if (!isKeyboard) _buildGreeting(),
              const LoginForm(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGreeting() {
    return const Column(
      children: [
        Text(
          "Вход",
          style: TextStyle(
            color: Colors.white,
            fontSize: 20,
          ),
        ),
        Padding(
          padding: EdgeInsets.all(10),
          child: Text(
            "Введите номер телефона, который вы указывали при регистрации аккаунта",
            style: TextStyle(
              color: Colors.grey,
            ),
            textAlign: TextAlign.center,
          ),
        ),
      ],
    );
  }
}
