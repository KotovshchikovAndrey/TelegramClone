import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ui/src/core/exceptions/api_exception.dart';
import 'package:ui/src/core/ioc.dart';
import 'package:ui/src/core/utils/local_storage.dart';
import 'package:ui/src/features/auth/api/interfaces/auth_repository.dart';
import 'package:ui/src/features/auth/models/user.dart';
import 'package:ui/src/features/auth/models/user_create.dart';

part 'user_state.dart';
part 'user_event.dart';

class UserBloc extends Bloc<UserEvent, UserState> {
  final IAuthRepository _repository = container<IAuthRepository>();
  final LocalStorage _localStorage = container<LocalStorage>();

  UserBloc() : super(InitialUserState()) {
    on<RegisterUser>(_registerUser);
    on<LoginUser>(_loginUser);
    on<ConfirmUserLogin>(_confirmUserLogin);
    on<AuthenticateUser>(_authenticateUser);
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
      emit(UserLoading());
      final userSession = await _repository.registerUser(userCreate);
      await _localStorage.saveValue(
        key: "sessionKey",
        value: userSession.sessionKey,
      );

      emit(RegisterSuccess());
    } on ApiException catch (exc) {
      emit(UserError(message: exc.message));
    }
  }

  Future<void> _loginUser(
    LoginUser event,
    Emitter<UserState> emit,
  ) async {
    try {
      emit(UserLoading());
      final userSession = await _repository.loginUser(event.phone);
      await _localStorage.saveValue(
        key: "sessionKey",
        value: userSession.sessionKey,
      );

      emit(LoginSuccess());
    } on ApiException catch (exc) {
      emit(UserError(message: exc.message));
    }
  }

  Future<void> _confirmUserLogin(
    ConfirmUserLogin event,
    Emitter<UserState> emit,
  ) async {
    try {
      emit(UserLoading());
      final sessionKey = await _localStorage.getValue(key: "sessionKey");
      if (sessionKey == null) {
        const errorMessage =
            "Что то пошло не так. Попробуйте произвести вход еще раз";

        emit(UserError(message: errorMessage));
        return;
      }

      final (currentUser, _) = await _repository.confirmUserLogin(
        code: event.code,
        sessionKey: sessionKey,
      );

      emit(AuthenticatedUser(currentUser: currentUser));
    } on ApiException catch (exc) {
      emit(UserError(message: exc.message));
    }
  }

  Future<void> _authenticateUser(
    AuthenticateUser event,
    Emitter<UserState> emit,
  ) async {
    final sessionKey = await _localStorage.getValue(key: "sessionKey");
    if (sessionKey == null) {
      return;
    }

    try {
      final currentUser = await _repository.authenticateUser(sessionKey);
      emit(AuthenticatedUser(currentUser: currentUser));
    } on ApiException catch (_) {
      return;
    }
  }
}
