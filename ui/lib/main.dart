import 'package:flutter/material.dart';
import 'package:ui/src/core/ioc.dart';
import 'package:ui/src/core/routes/route_builder.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ui/src/features/auth/views/bloc/user_bloc.dart';

void main() {
  setupIocContainer();
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final _authBloc = UserBloc();

  @override
  void initState() {
    super.initState();
    _authBloc.add(AuthenticateUser());
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => _authBloc, // Global Authentication State
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Flutter Demo',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
          useMaterial3: true,
        ),
        onGenerateRoute: routeBuilder,
      ),
    );
  }
}
