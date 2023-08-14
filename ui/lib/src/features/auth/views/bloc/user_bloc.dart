import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ui/src/core/exceptions/api_exception.dart';
import 'package:ui/src/core/ioc.dart';
import 'package:ui/src/core/utils/local_storage.dart';
import 'package:ui/src/features/auth/api/interfaces/auth_repository.dart';
import 'package:ui/src/features/auth/api/models/user_create.dart';

part 'user_state.dart';
part 'user_event.dart';

class UserBloc extends Bloc<UserEvent, UserState> {
  final IAuthRepository repository = container<IAuthRepository>();
  final LocalStorage localStorage = container<LocalStorage>();

  UserBloc() : super(InitialUserState()) {
    on<RegisterUser>(_registerUser);
  }

  Future<void> _registerUser(
    RegisterUser event,
    Emitter<UserState> emit,
  ) async {
    UserCreate userCreate = UserCreate(
      name: event.name,
      surname: event.surname,
      email: event.email,
      phone: event.phone,
    );

    try {
      final userSession = await repository.registerUser(userCreate);
      await localStorage.saveData(
        key: "sessionKey",
        value: userSession.sessionKey,
      );

      emit(UserRegisterSuccess());
    } on ApiException catch (exc) {
      emit(UserError(message: exc.message));
    }
  }
}
