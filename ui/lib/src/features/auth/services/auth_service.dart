import 'package:ui/src/core/ioc.dart';
import 'package:ui/src/features/auth/api/interfaces/auth_repository.dart';

class AuthService {
  final IAuthRepository repository = container<IAuthRepository>();

  registerUser() async {}
}
