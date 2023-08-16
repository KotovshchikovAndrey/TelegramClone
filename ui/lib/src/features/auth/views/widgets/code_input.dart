import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';
import 'package:ui/src/features/auth/views/bloc/user_bloc.dart';

class CodeInput extends StatelessWidget {
  const CodeInput({super.key});

  @override
  Widget build(BuildContext context) {
    final authBloc = BlocProvider.of<UserBloc>(context);

    return TextFormField(
      onChanged: (code) {
        if (code.length == 5) {
          authBloc.add(
            ConfirmUserLogin(code: int.parse(code)),
          );
        }
      },
      keyboardType: TextInputType.number,
      style: const TextStyle(color: Colors.white),
      inputFormatters: <TextInputFormatter>[
        FilteringTextInputFormatter.digitsOnly,
        MaskTextInputFormatter(
          mask: '######',
          filter: {"#": RegExp(r'[0-9]')},
        ),
      ],
      decoration: const InputDecoration(
        hintText: "Код",
        hintStyle: TextStyle(color: Colors.white),
        icon: Icon(Icons.phone_iphone),
        focusedBorder: UnderlineInputBorder(
          borderSide: BorderSide(
            color: Colors.blue,
          ),
        ),
      ),
    );
  }
}
