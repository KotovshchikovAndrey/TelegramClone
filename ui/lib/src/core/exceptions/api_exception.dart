class ApiException implements Exception {
  int status;
  String message;

  ApiException({required this.status, required this.message});
}
