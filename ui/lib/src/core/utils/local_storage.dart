import 'package:shared_preferences/shared_preferences.dart';

class LocalStorage {
  Future<void> saveValue({required String key, required String value}) async {
    final storage = await SharedPreferences.getInstance();
    storage.setString(key, value);
  }

  Future<String?> getValue({required key}) async {
    final storage = await SharedPreferences.getInstance();
    final value = storage.getString(key);

    return value;
  }
}
