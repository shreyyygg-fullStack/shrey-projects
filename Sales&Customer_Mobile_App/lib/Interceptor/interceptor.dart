
import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:shared_preferences/shared_preferences.dart';


class InterceptorInterceptor extends Interceptor {

  @override
  Future<void> onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
  print("onRequest called");

  final SharedPreferences prefs = await SharedPreferences.getInstance();
  String ? authToken = prefs.getString('jwtToken');
    // String ? authToken = await _getAuthToken(); // Implement your logic to get the auth token

  if(authToken !=null) {
    options.headers["Authorization"] = "Bearer $authToken";
    print("authhtoken $authToken");
  }
    super.onRequest(options, handler);
  }


}
