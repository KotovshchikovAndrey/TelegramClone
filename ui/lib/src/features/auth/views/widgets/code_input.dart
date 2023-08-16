import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';

class CodeInput extends StatelessWidget {
  CodeInput({super.key, required this.hintText});

  final _controller = TextEditingController();
  final String? hintText;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: _controller,
      keyboardType: TextInputType.number,
      style: const TextStyle(color: Colors.white),
      inputFormatters: <TextInputFormatter>[
        FilteringTextInputFormatter.digitsOnly,
        MaskTextInputFormatter(
          mask: '######',
          filter: {"#": RegExp(r'[0-9]')},
        ),
      ],
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: const TextStyle(color: Colors.white),
        icon: const Icon(Icons.phone_iphone),
        focusedBorder: const UnderlineInputBorder(
          borderSide: BorderSide(
            color: Colors.blue,
          ),
        ),
      ),
    );
  }
}
