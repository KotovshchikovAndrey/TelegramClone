import 'package:shared_preferences/shared_preferences.dart';

class LocalStorage {
  Future<void> saveData({required String key, required String value}) async {
    final storage = await SharedPreferences.getInstance();
    storage.setString(key, value);
  }
}
