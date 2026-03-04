import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_project/components/Home.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../components/first_page.dart';

class ApiService {

  Dio dio = Dio();



  Future<void> authenticateUser(String username, String password, BuildContext context) async {

    try {
      final response = await http.post(
        Uri.parse("http://10.0.0.186:3010/authenticate"),
        body: jsonEncode({
          'userId': username,
          'userPwd': password,
        }),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      if (response.statusCode == 200) {
        print("Response details-- ${response.body}");

        final Map<String, dynamic> responseData = json.decode(response.body);
        final String? jwtToken = responseData['token'];
        final String Username = responseData['userName'];


        if (jwtToken != null && responseData['status'] == "Success") {
          // Save the JWT token and handle authentication success
          print('JWT Token: $jwtToken');

          //Saving jwt token in shared preference
          final SharedPreferences prefs = await SharedPreferences.getInstance();
          prefs.setString('jwtToken', jwtToken);
          prefs.setString('Status',"Success");
          prefs.setString('username', Username);


          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => Home()),
          );

        } else {
          // Handle authentication failure due to missing or null token
          print('Authentication failed: Token is null or missing');


          showDialog(
            context: context,
            builder: (BuildContext context) {
              return AlertDialog(
                title: Text('Invalid Credentials'),
                content: Text('Please check your User ID and Password.'),
                actions: [
                  TextButton(
                    onPressed: () {
                      Navigator.pop(context); // Close the dialog
                    },
                    child: Text('OK'),
                  ),
                ],
              );
            },
          );
        }
      } else {
        // Handle authentication failure due to non-200 status code
        print('Authentication failed: Status Code ${response.statusCode}');
      }
    } catch (e) {
      // Handle any exceptions that might occur during the authentication process
      print('Error during authentication: $e');
    }
  }

  //Getting jwt token in shared preference
  Future<String?> getTokenFromLocal() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwtToken');
  }

  //Saving jwt token in shared preference
  Future<void> saveTokenToLocal(String jwtToken) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString('jwtToken', jwtToken);
  }




}
