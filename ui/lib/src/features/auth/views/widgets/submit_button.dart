import 'package:flutter/material.dart';

class SubmitButton extends StatelessWidget {
  const SubmitButton({
    super.key,
    required this.text,
    required this.onSubmit,
  });

  final String text;
  final void Function() onSubmit;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(15),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(
            vertical: 10,
            horizontal: 30,
          ),
          backgroundColor: Colors.blue,
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.only(
              topRight: Radius.circular(5),
              bottomRight: Radius.circular(5),
              topLeft: Radius.circular(5),
              bottomLeft: Radius.circular(5),
            ),
          ),
        ),
        onPressed: onSubmit,
        child: Text(
          text,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 15,
          ),
        ),
      ),
    );
  }
}
