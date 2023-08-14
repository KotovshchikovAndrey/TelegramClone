import 'package:flutter/material.dart';
import 'package:ui/src/core/page/start.dart';
import 'package:ui/src/core/routes/route_args.dart';
import 'package:ui/src/core/widgets/routes_transitions.dart';
import 'package:ui/src/features/auth/views/pages/login.dart';
import 'package:ui/src/features/auth/views/pages/register.dart';
import 'package:ui/src/features/messages/views/pages/chat_room.dart';

Route<dynamic>? routeBuilder(RouteSettings settings) {
  final routeArgs = settings.arguments;
  switch (settings.name) {
    case '/':
      return SlideRightRoute(widget: const StartPage());
    case '/register':
      return SlideRightRoute(widget: const RegisterPage());
    case '/login':
      return SlideRightRoute(widget: const LoginPage());
    case '/chat':
      if (routeArgs is ChatRoomArgs) {
        return SlideRightRoute(
          widget: ChatRoomPage(roomName: routeArgs.roomName),
        );
      }
  }

  return null;
}
