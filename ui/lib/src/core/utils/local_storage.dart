import 'package:shared_preferences/shared_preferences.dart';

class LocalStorage {
  final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();

  Future<void> saveData({required String key, required String value}) async {
    final storage = await _prefs;
    storage.setString(key, value);
  }
}
