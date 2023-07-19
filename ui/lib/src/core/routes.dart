import 'package:flutter/material.dart';
import 'package:ui/src/core/widgets/routes_transitions.dart';
import 'package:ui/src/core/widgets/top_tabbar.dart';

Route<dynamic>? routeBuilder(RouteSettings settings) {
  switch (settings.name) {
    case '/':
      return SlideRightRoute(widget: const TopTabBar());
  }

  return null;
}
