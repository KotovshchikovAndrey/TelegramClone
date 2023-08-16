import 'package:flutter/material.dart';
import 'package:ui/src/features/auth/views/widgets/code_input.dart';

class ConfirmLoginPage extends StatelessWidget {
  const ConfirmLoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    final isKeyboard = MediaQuery.of(context).viewInsets.bottom != 0;

    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 28, 40, 51),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          if (!isKeyboard) _buildGreeting(),
          Padding(
            padding: const EdgeInsets.all(30),
            child: CodeInput(hintText: "Код"),
          ),
        ],
      ),
    );
  }

  Widget _buildGreeting() {
    return const Column(
      children: [
        Text(
          "Проверьте почту",
          style: TextStyle(
            color: Colors.white,
            fontSize: 20,
          ),
        ),
        Padding(
          padding: EdgeInsets.all(10),
          child: Text(
            "Введите код, который пришел на электронную почту email@mail.ru",
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
