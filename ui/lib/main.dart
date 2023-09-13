import 'package:flutter/material.dart';
import 'package:ui/src/core/ioc.dart';
import 'package:ui/src/core/routes/route_builder.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ui/src/features/auth/views/bloc/user_bloc.dart';
import 'package:ui/src/features/messages/views/bloc/chat_bloc.dart';

void main() {
  setupIocContainer();
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

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
    return MultiBlocProvider(
      providers: [
        BlocProvider<UserBloc>(
          create: (context) => _authBloc,
        ),
        BlocProvider<ChatBloc>(
          create: (context) => ChatBloc(),
        )
      ],
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
