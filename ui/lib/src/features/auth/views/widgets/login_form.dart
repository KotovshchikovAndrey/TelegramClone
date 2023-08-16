import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';
import 'package:ui/src/features/auth/utils/auth_validator.dart';
import 'package:ui/src/features/auth/views/bloc/user_bloc.dart';

class LoginForm extends StatefulWidget {
  const LoginForm({super.key});

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final userBloc = UserBloc();
  final _authValidator = AuthValidator();
  final _formKey = GlobalKey<FormState>();

  final _phoneController = TextEditingController();
  bool _isFormValid = false;

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  _sumbitForm() {
    if (_isFormValid) {
      final event = LoginUser(phone: _phoneController.text);
      userBloc.add(event);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          _buildPhoneInput(),
          BlocBuilder(
            bloc: userBloc,
            builder: (context, state) {
              if (state is LoginSuccess) {
                Navigator.of(context).pushNamed("/confirm-login");
              }

              if (state is UserLoading) {
                return Column(
                  children: [
                    _buildSubmitButton(),
                    const Center(
                      child: CircularProgressIndicator(
                        color: Colors.blue,
                        strokeWidth: 2,
                      ),
                    ),
                  ],
                );
              }

              if (state is UserError) {
                return Column(
                  children: [
                    _buildSubmitButton(),
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

              return _buildSubmitButton();
            },
          ),
        ],
      ),
      onChanged: () {
        _isFormValid = _formKey.currentState!.validate();
      },
    );
  }

  Widget _buildPhoneInput() {
    return Padding(
      padding: const EdgeInsets.symmetric(
        vertical: 12,
        horizontal: 30,
      ),
      child: TextFormField(
        controller: _phoneController,
        validator: _authValidator.validatePhone,
        keyboardType: TextInputType.phone,
        inputFormatters: [
          MaskTextInputFormatter(
            mask: '+7 (###) ###-####',
            filter: {"#": RegExp(r'[0-9]')},
          )
        ],
        cursorColor: Colors.blue,
        cursorWidth: 1,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          hintText: "Телефон",
          hintStyle: const TextStyle(color: Colors.white),
          contentPadding: const EdgeInsets.all(15),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(5),
            borderSide: const BorderSide(
              color: Colors.blue,
            ),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(5),
            borderSide: const BorderSide(
              color: Colors.grey,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSubmitButton() {
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
        onPressed: _sumbitForm,
        child: const Text(
          "Войти",
          style: TextStyle(
            color: Colors.white,
            fontSize: 15,
          ),
        ),
      ),
    );
  }
}
