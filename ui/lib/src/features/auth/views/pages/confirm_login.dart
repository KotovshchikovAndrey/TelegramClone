import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ui/src/features/auth/views/bloc/user_bloc.dart';
import 'package:ui/src/features/auth/views/widgets/code_input.dart';

class ConfirmLoginPage extends StatelessWidget {
  const ConfirmLoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    final authBloc = BlocProvider.of<UserBloc>(context);
    final isKeyboard = MediaQuery.of(context).viewInsets.bottom != 0;

    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 28, 40, 51),
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            children: [
              if (!isKeyboard) _buildGreeting(),
              BlocConsumer(
                bloc: authBloc,
                listener: (context, state) {
                  if (state is AuthenticatedUser) {
                    Navigator.pushNamed(context, "/");
                  }
                },
                builder: (context, state) {
                  if (state is UserError) {
                    return Column(
                      children: [
                        const Padding(
                          padding: EdgeInsets.all(30),
                          child: CodeInput(),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 30),
                          child: Text(
                            state.message,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              color: Colors.red,
                              fontSize: 15,
                            ),
                          ),
                        ),
                      ],
                    );
                  }

                  return const Padding(
                    padding: EdgeInsets.all(30),
                    child: CodeInput(),
                  );
                },
              )
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
