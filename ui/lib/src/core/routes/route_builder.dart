import 'package:flutter/material.dart';
import 'package:ui/src/core/page/start.dart';
import 'package:ui/src/core/routes/route_args.dart';
import 'package:ui/src/core/widgets/routes_transitions.dart';
import 'package:ui/src/features/auth/views/pages/confirm_login.dart';
import 'package:ui/src/features/auth/views/pages/login.dart';
import 'package:ui/src/features/auth/views/pages/register.dart';
import 'package:ui/src/features/messages/views/pages/chat_room.dart';
import 'package:ui/src/features/messages/views/pages/group_creation.dart';
import 'package:ui/src/features/messages/views/pages/phone_contacts.dart';

Route<dynamic>? routeBuilder(RouteSettings settings) {
  final routeArgs = settings.arguments;
  switch (settings.name) {
    case '/':
      return SlideRightRoute(widget: const StartPage());
    case '/register':
      return SlideRightRoute(widget: const RegisterPage());
    case '/login':
      return SlideRightRoute(widget: const LoginPage());
    case '/confirm-login':
      return SlideRightRoute(widget: const ConfirmLoginPage());
    case '/chat':
      if (routeArgs is ChatRoomArgs) {
        return SlideRightRoute(
          widget: ChatRoomPage(roomName: routeArgs.roomName),
        );
      }
    case '/group-creation':
      return SlideRightRoute(widget: const GroupCreationPage());
    case '/phone-contacts':
      return SlideRightRoute(widget: const PhoneContactsPage());
  }

  return null;
}
