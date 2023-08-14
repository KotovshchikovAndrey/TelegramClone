import 'package:dio/dio.dart';
import 'package:ui/src/core/exceptions/api_exception.dart';

mixin class ApiExceptionMixin {
  Never throwApiException(Exception exc) {
    if (exc is DioException) {
      final errorResponse = exc.response;
      if (errorResponse != null) {
        final errorData = errorResponse.data;
        throw ApiException(
          status: errorData["status"],
          message: errorData["message"],
        );
      }
    }

    throw ApiException(
      status: 500,
      message: "Произошла непредвиденная ошибка, попробуйте позже",
    );
  }
}
