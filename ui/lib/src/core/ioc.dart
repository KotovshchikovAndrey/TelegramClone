import 'package:get_it/get_it.dart';
import 'package:ui/src/core/utils/local_storage.dart';
import 'package:ui/src/features/auth/api/interfaces/auth_repository.dart';
import 'package:ui/src/features/auth/api/repositories/auth_repository.dart';

final container = GetIt.I;
void setupIocContainer() {
  container.registerSingleton<IAuthRepository>(HttpAuthRepository());
  container.registerSingleton<LocalStorage>(LocalStorage());
}
