import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ui/src/core/exceptions/api_exception.dart';
import 'package:ui/src/core/ioc.dart';
import 'package:ui/src/core/utils/local_storage.dart';
import 'package:ui/src/features/auth/api/interfaces/auth_repository.dart';
import 'package:ui/src/features/auth/models/user.dart';
import 'package:ui/src/features/auth/models/user_create.dart';
import 'package:ui/src/features/auth/models/user_session.dart';

part 'user_state.dart';
part 'user_event.dart';

class UserBloc extends Bloc<UserEvent, UserState> {
  final IAuthRepository repository = container<IAuthRepository>();
  final LocalStorage localStorage = container<LocalStorage>();

  UserBloc() : super(InitialUserState()) {
    on<RegisterUser>(_registerUser);
    on<LoginUser>(_loginUser);
    on<ConfirmUserLogin>(_confirmUserLogin);
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
      final userSession = await repository.registerUser(userCreate);
      await localStorage.saveData(
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
      final userSession = await repository.loginUser(event.phone);
      await localStorage.saveData(
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
      final (currentUser, sessionPayload) = await repository.confirmUserLogin(
        code: event.code,
        sessionKey: event.sessionKey,
      );

      emit(
        AuthenticatedUser(
          currentUser: currentUser,
          sessionPayload: sessionPayload,
        ),
      );
    } on ApiException catch (exc) {
      emit(UserError(message: exc.message));
    }
  }
}
