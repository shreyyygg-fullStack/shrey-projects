import 'package:flutter/material.dart';
import 'package:flutter_project/components/Planning.dart';
import 'package:flutter_project/components/setting.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'UserManagement.dart';
import 'first_page.dart';

class Home extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MyHomePage();
  }
}

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final PageController _pageController = PageController(initialPage: 0);
  int currentPageIndex = 0;

  @override
  void initState() {
    super.initState();
    _pageController.addListener(() {
      setState(() {
        currentPageIndex = _pageController.page!.round();
      });
    });
  }

  void navigateToPlanning() {
    _pageController.jumpToPage(1); // Assuming Planning is at index 1
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        controller: _pageController,
        // onPageChanged: (index) {
        //   setState(() {
        //     currentPageIndex = index;
        //   });
        // },
        children: [
          first_page(pageController: _pageController),
          Planning(),
          Setting(),
          UserManagement(),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        onTap: (index) {
          if (index == 4) {
            showDialog(
              context: context,
              builder: (BuildContext context) {
                return AlertDialog(
                  title: Text('Logout?'),
                  content: Text('Do you want to Logout?'),
                  actions: [
                    TextButton(
                      onPressed: () {
                        Navigator.pop(context); // Close the dialog
                      },
                      child: Text('NO'),
                    ),
                    TextButton(
                      onPressed: () {
                        navigating(); // Logout
                      },
                      child: Text('YES'),
                    ),
                  ],
                );
              },
            );
          } else {
            _pageController.jumpToPage(index);
          }
        },
        currentIndex: currentPageIndex,
        backgroundColor: Colors.grey,
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            backgroundColor: Colors.grey,
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            backgroundColor: Colors.grey,
            icon: Icon(Icons.next_plan),
            label: 'Planning',
          ),
          BottomNavigationBarItem(
            backgroundColor: Colors.grey,
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.supervised_user_circle),
            backgroundColor: Colors.grey,
            label: 'User Management',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_off),
            backgroundColor: Colors.grey,
            label: 'Logout',
          ),
        ],
      ),
    );
  }

  navigating() async {
    Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);

    final SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.remove('jwtToken');
    prefs.remove('Status');
  }
}
