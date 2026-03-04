import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserManagement extends StatefulWidget {
  const UserManagement({super.key});

  @override
  State<UserManagement> createState() => _UserManagementState();
}

class _UserManagementState extends State<UserManagement> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  bool isAppBarVisible = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(

      key: _scaffoldKey,
      appBar: isAppBarVisible
          ? PreferredSize(
        preferredSize: Size.fromHeight(250.0),
        child: AnimatedContainer(
          duration: Duration(milliseconds: 10000),
          height: isAppBarVisible ? 280.0 : 250.0,
          child: AppBar(
              backgroundColor: Colors.blue[900],
              title:
              Text('Alerts!', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              actions: [
                // ElevatedButton.icon(
                //   icon: Icon(Icons.keyboard_arrow_down),
                //   label: const Text(''),
                //   onPressed: () {
                //     showModalBottomSheet<void>(
                //       context: context,
                //       isScrollControlled: true,
                //       builder: (BuildContext context) {
                //         return Align(
                //           alignment: Alignment.topCenter,
                //           child: FractionallySizedBox(
                //             heightFactor: 0.3,
                //             child: Container(
                //               color: Colors.amber,
                //               child: Center(
                //                 child: Column(
                //                   mainAxisAlignment: MainAxisAlignment.center,
                //                   mainAxisSize: MainAxisSize.min,
                //                   children: <Widget>[
                //                     const Text('Modal BottomSheet'),
                //                     ElevatedButton(
                //                       child: const Text('Close BottomSheet'),
                //                       onPressed: () => Navigator.pop(context),
                //                     ),
                //                   ],
                //                 ),
                //               ),
                //             ),
                //           ),
                //         );
                //       },
                //     );
                //   },
                // ),
                IconButton(
                  icon: Icon(Icons.keyboard_arrow_up),
                  color: Colors.white,
                  onPressed: () {
                    setState(() {
                      isAppBarVisible = !isAppBarVisible;
                    });
                  },
                ),
              ],
              flexibleSpace: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(height: 20),
                  Text(
                    ' Data 1',
                    style: TextStyle(color: Colors.white, fontSize: 20),
                  ),
                  Text(
                    ' Data 2',
                    style: TextStyle(color: Colors.white, fontSize: 20),
                  ),
                ],
              )),
        ),

      )
          : null,


      body:
      Container(
        height: 100,
        color: Colors.blue[900],
        child: Padding(
          padding: const EdgeInsets.only(
            top: 45.0,
          ),
          child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(" User Management",
                    style: TextStyle(
                      fontSize: 26,
                      color: Colors.white, fontWeight: FontWeight.bold
                    )),
                IconButton(
                  onPressed: () {
                    setState(() {
                      isAppBarVisible = !isAppBarVisible;
                    });
                    // ScaffoldMessenger.of(context).showSnackBar(
                    //   SnackBar(
                    //       content: Text(
                    //           'App Bar ${isAppBarVisible ? 'activated' : 'deactivated'}')),
                    // );
                  },
                  icon: Icon(Icons.keyboard_arrow_down),
                  color: Colors.white,
                ),
              ]),
        ),
      ),


    );
  }

}
