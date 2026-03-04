import 'package:flutter/material.dart';
import 'package:flutter_project/components/Home.dart';
import 'package:flutter_project/components/Planning.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../Services/ApiService.dart';
import '../components/UserManagement.dart';
import '../components/first_page.dart';
import '../components/setting.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});


  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      color: Colors.white,
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
      home: const MyHomePage(title: 'SEGMAP'),
      initialRoute: '/',
      routes: {
        // 'accounts': (context) => first_page(),
        'home': (context) => Home(),
        'settings' : (context) => Setting(),
        'user_management' : (context) => UserManagement(),
        'planning' : (context) => Planning(),
      },
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {

  bool _obscureText = true;


  @override
  initState() {
    super.initState();

    navigating();
  }

  navigating() {

    SharedPreferences.getInstance().then((prefs) {
      String? updateStatus = prefs.getString('Status');

      if (updateStatus == "Success") {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => Home()),
        );
      }
    });
  }


  TextEditingController userIdController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      appBar: AppBar(

        backgroundColor: Colors.blue[900],

        title: Text(widget.title, style: TextStyle( color: Colors.white),),
        centerTitle: true,

      ),
      body:
      Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [

          Image.asset('assets/images/web2.png',),

          // Text(
          //   "Login",
          //   style: TextStyle(
          //     fontSize: 25,
          //     color: Colors.indigo,
          //     fontWeight: FontWeight.bold
          //   ),
          // ),

          Padding(
            padding: const EdgeInsets.symmetric(vertical: 30),
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 15),
                    child: TextFormField(
                      controller: userIdController,
                      keyboardType: TextInputType.text,
                      decoration: InputDecoration(
                        labelText: 'User Id',
                        hintText: 'Enter User Id',
                        prefixIcon: Icon(Icons.account_box),
                        border: OutlineInputBorder(),
                      ),
                      validator: (value){
                        return value!.isEmpty ? 'Please Enter Email' : null;
                      }
                    ),
                  ),

                  SizedBox(height: 30),

                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 15),
                    child: TextFormField(

                        controller: passwordController,
                        obscureText: _obscureText,
                        decoration: InputDecoration(
                          labelText: 'Password',
                          hintText: 'Enter Password',
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscureText ? Icons.visibility : Icons.visibility_off,
                            ),
                            onPressed: () {
                              setState(() {
                                _obscureText = !_obscureText;
                              });
                            },
                          ),
                          prefixIcon: Icon(Icons.password),
                          border: OutlineInputBorder(),
                        ),
                        validator: (value){
                          return value!.isEmpty ? 'Please Enter Password' : null;
                        }
                    ),
                  ),

                  SizedBox(height: 30),

                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 35),
                    child: MaterialButton(
                      height: 40,
                        minWidth: double.infinity,
                        onPressed: (){
                          if (_formKey.currentState!.validate()) {
                            // Only print data if the form is valid
                            String userId = userIdController.text;
                            String password = passwordController.text;

                            // Print the data
                            print("User Id: $userId");
                            print("Password: $password");

                            _login();
                          }
                        },
                      child: Text('Login'),
                      color: Colors.blue[900],
                      textColor: Colors.white,
                    ),
                  ),

                ],
              ),

            ),
          )
        ],
      )


















      // Center(
      //    child: Container(
      //     width: 4000,
      //     height: 200,
      //     color: Colors.blue,
      //
      //     child: SingleChildScrollView(
      //       child: Row(
      //        children: <Widget>[
      //          Center(
      //            child: Container(
      //              width: 150,
      //                child: Image.asset('assets/images/web2.png',)),
      //          ),
      //          Text('a'),
      //          Text('a'),
      //          ElevatedButton(onPressed: (){ print("clicked"); }, child: Text('click')),
      //
      //          ElevatedButton(  //OutlinedButton,ElevatedButton,TextButton
      //           child: Text('Hello Devops' , style: TextStyle(fontSize: 15, color: Colors.black, fontWeight: FontWeight.bold),),
      //             onPressed: (){
      //             print('object');
      //             },
      //           onLongPress: (){
      //             print('object 2!!');
      //           },
      //
      //         ),
      //               ]
      //
      //
      //       ),
      //     )
      //   )
      // )



       // This trailing comma makes auto-formatting nicer for build methods.
    );
  }




  Future<void> _login() async {
    try {

      final String enteredUserId = userIdController.text;
      final String enteredPassword = passwordController.text;

      final ApiService apiService = ApiService();

      await apiService.authenticateUser(enteredUserId, enteredPassword, context);

    } catch (e) {
      print('Error Logging in $e');
    }
  }
}


