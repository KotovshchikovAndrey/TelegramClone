import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';
import 'package:ui/src/features/auth/utils/auth_validator.dart';
import 'package:ui/src/features/auth/views/bloc/user_bloc.dart';
import 'package:ui/src/features/auth/views/widgets/submit_button.dart';

class RegisterForm extends StatefulWidget {
  const RegisterForm({super.key});

  @override
  State<RegisterForm> createState() => _RegisterFormState();
}

class _RegisterFormState extends State<RegisterForm> {
  final userBloc = UserBloc();
  final _authValidator = AuthValidator();
  final _formKey = GlobalKey<FormState>();

  final _nameController = TextEditingController();
  final _surnameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();

  bool _isFormValid = false;

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _surnameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();

    super.dispose();
  }

  void _sumbitForm() {
    if (_isFormValid) {
      final event = RegisterUser(
        name: _nameController.text,
        surname: _surnameController.text,
        email: _emailController.text,
        phone: _phoneController.text,
      );

      userBloc.add(event);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          _buildNameInput(),
          _buildSurnameInput(),
          _buildEmailInput(),
          _buildPhoneInput(),
          BlocConsumer(
            bloc: userBloc,
            listener: (context, state) {
              if (state is RegisterSuccess) {
                Navigator.of(context).pushNamed("/login");
              }
            },
            builder: (context, state) {
              if (state is UserLoading) {
                return Column(
                  children: [
                    SubmitButton(
                      text: "Зарегистрироваться",
                      onSubmit: _sumbitForm,
                    ),
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
                    SubmitButton(
                      text: "Зарегистрироваться",
                      onSubmit: _sumbitForm,
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

              return SubmitButton(
                text: "Зарегистрироваться",
                onSubmit: _sumbitForm,
              );
            },
          ),
        ],
      ),
      onChanged: () {
        _isFormValid = _formKey.currentState!.validate();
      },
    );
  }

  Widget _buildNameInput() {
    return Padding(
      padding: const EdgeInsets.only(
        top: 30,
        bottom: 10,
        right: 30,
        left: 30,
      ),
      child: TextFormField(
        controller: _nameController,
        validator: _authValidator.validateName,
        keyboardType: TextInputType.name,
        autocorrect: false,
        cursorColor: Colors.blue,
        cursorWidth: 1,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          hintText: "Имя",
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

  Widget _buildSurnameInput() {
    return Padding(
      padding: const EdgeInsets.symmetric(
        vertical: 12,
        horizontal: 30,
      ),
      child: TextFormField(
        controller: _surnameController,
        validator: _authValidator.validateSurname,
        keyboardType: TextInputType.name,
        autocorrect: false,
        cursorColor: Colors.blue,
        cursorWidth: 1,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          hintText: "Фамилия",
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

  Widget _buildEmailInput() {
    return Padding(
      padding: const EdgeInsets.symmetric(
        vertical: 12,
        horizontal: 30,
      ),
      child: TextFormField(
        controller: _emailController,
        validator: _authValidator.validateEmail,
        keyboardType: TextInputType.emailAddress,
        cursorColor: Colors.blue,
        cursorWidth: 1,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          hintText: "Email",
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
}
