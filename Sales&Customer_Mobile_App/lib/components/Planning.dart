import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../Interceptor/interceptor.dart';
import '../model/RowData.dart';

class Planning extends StatefulWidget {
  const Planning({super.key});

  @override
  State<Planning> createState() => _PlanningState();
}

class _PlanningState extends State<Planning> {

  Dio dio = Dio();
  InterceptorInterceptor interceptor = InterceptorInterceptor();

  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  bool isAppBarVisible = false;
  List<Map<String, dynamic>> planAccountDetails = [];
  List<Map<String, dynamic>> filteredPlanAccounts = [];
  TextEditingController searchController = TextEditingController();
  bool northOption = true;
  bool southOption = true;
  bool eastOption = true;
  bool westOption = true;
  bool nepalOption = true;
  bool banglaOption = true;

  bool selectAllRegions = true;

  int numberOfPlans =0;
  String? noOfPlans;

  Map<int, RowData> rowDetails = {};

  @override
  void initState() {
    super.initState();

    dio.interceptors.add(InterceptorInterceptor());
    if(mounted) {
      planningAccounts();
    }


    SharedPreferences.getInstance().then((prefs) {
      String? updateplan = prefs.getString('Planning_data');
      String? noOfAcc = prefs.getString('Number_of_Plans');

      List<dynamic> plandata = json.decode(updateplan!);
      noOfPlans = noOfAcc;

      setState(() {
        planAccountDetails = List<Map<String, dynamic>>.from(plandata);
        filteredPlanAccounts = List<Map<String, dynamic>>.from(plandata);
      });

    });



  }

  @override
  void dispose() {
    // Dispose any resources or cancel any asynchronous operations here
    super.dispose();
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(


      key: _scaffoldKey,
      appBar: isAppBarVisible
          ? PreferredSize(
        preferredSize: Size.fromHeight(250.0),
        child: AnimatedContainer(
          duration: Duration(milliseconds: 200),
          height: isAppBarVisible ? 310.0 : 250.0,
          child: AppBar(
              backgroundColor: Colors.blue[900],
              title: Text('Alerts!',
                  style: TextStyle(
                      color: Colors.white, fontWeight: FontWeight.bold)),
              actions: [
                IconButton(
                  icon: Icon(Icons.close),
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
                    'Alert Data 1',
                    style: TextStyle(color: Colors.white, fontSize: 20),
                  ),
                  Text(
                    'Alert Data 2',
                    style: TextStyle(color: Colors.white, fontSize: 20),
                  ),
                ],
              )),
        ),
      )
          : null,


      body: Stack(
        children: [
          Column(
            // mainAxisAlignment: MainAxisAlignment.center,
            // crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  height: 105,
                  color: Colors.blue[900],
                  child: Padding(
                    padding: const EdgeInsets.only(
                      top: 45.0,
                    ),
                    child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(" Planning",
                              style: TextStyle(
                                  fontSize: 28,
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold)),
                          IconButton(
                            onPressed: () {
                              setState(() {
                                isAppBarVisible = !isAppBarVisible;
                              });
                            },
                            icon: isAppBarVisible
                                ? Icon(Icons.keyboard_arrow_up)
                                : Icon(Icons.keyboard_arrow_down),
                            color: Colors.white,
                          ),
                        ]),
                  ),
                ),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 40.0),
                    child: Container(
                        decoration: BoxDecoration(
                          border: Border.all(
                              color:
                              Colors.grey), // Set your desired border color
                        ),
                        child: IgnorePointer(
                          ignoring: isAppBarVisible,
                          child: Opacity(
                              opacity: isAppBarVisible ? 0.3 : 1.0,
                              child: ListView.separated(
                                padding: EdgeInsets.zero,
                                itemCount: filteredPlanAccounts.length,
                                itemBuilder: (BuildContext context, int index) {
                                  return GestureDetector(
                                    onTap: () {
                                      // handleRowTap(
                                      //     filteredPlanAccounts[index], index);
                                    },
                                    child: Container(
                                      color: Colors.transparent,
                                      child: Row(
                                        children: [
                                          Padding(
                                            padding:
                                            const EdgeInsets.only(left: 10.0),
                                            child: Column(
                                              crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                              children: [
                                                Text(limitCharacters(
                                                    '${filteredPlanAccounts[index]['account']}',
                                                    27)),
                                                Text(limitCharacters(
                                                    '${filteredPlanAccounts[index]['segment']}',
                                                    20)),
                                              ],
                                            ),
                                          ),
                                          Spacer(),
                                          Padding(
                                            padding: const EdgeInsets.only(
                                                right: 10.0),
                                            child: Column(
                                              crossAxisAlignment:
                                              CrossAxisAlignment.end,
                                              children: [
                                                SizedBox(
                                                  height: 10,
                                                ),
                                                Text(limitCharacters(
                                                    '${filteredPlanAccounts[index]['region']}',
                                                    10)),
                                                Text(limitCharacters(
                                                    '${filteredPlanAccounts[index]['p_type']}',
                                                    12)),
                                              ],
                                            ),
                                          )
                                        ],
                                      ),
                                    ),
                                  );
                                },
                                separatorBuilder:
                                    (BuildContext context, int index) {
                                  // <-- SEE HERE
                                  return Divider();
                                },
                              )),
                        )),
                  ),
                ),
              ]),
          Positioned(
            top: 90, // Adjust this value to control the overlap
            left: 0,
            right: 0,
            child: Container(
              height: 56,
              color: Colors.blue[900],
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 8.0),
                child: IgnorePointer(
                  ignoring: isAppBarVisible,
                  child: Opacity(
                    opacity: isAppBarVisible ? 0.3 : 1.0,
                    child: TextField(
                      controller: searchController,
                      onChanged: (query) {
                        filterAccounts(query);
                      },
                      style: TextStyle(color: Colors.black),
                      decoration: InputDecoration(
                        contentPadding: EdgeInsets.symmetric(vertical: 10.0),
                        border: InputBorder.none,
                        labelText: 'Search',
                        floatingLabelBehavior: FloatingLabelBehavior.never,
                        prefixIcon: Icon(Icons.search),
                        suffixIcon: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text('$noOfPlans'),
                            IconButton(
                              icon: Icon(Icons.filter_list),
                              onPressed: () {
                                showModalBottomSheet<void>(
                                  shape: RoundedRectangleBorder(
                                    borderRadius:
                                    BorderRadius.only(topLeft: Radius.zero, topRight: Radius.zero),
                                  ),
                                  context: context,
                                  isScrollControlled: true,
                                  builder: (BuildContext context) {
                                    return StatefulBuilder(builder:
                                        (BuildContext context,
                                        StateSetter setState) {
                                      return Container(
                                        decoration: BoxDecoration(
                                          color: Colors.white70,

                                        ),
                                        height: 400,
                                        width: 450,
                                        child: Padding(
                                          padding: const EdgeInsets.all(16.0),
                                          child: Column(
                                            crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                'Region Filter',
                                                style: TextStyle(
                                                  fontSize: 20.0,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              buildAllFilterOption(
                                                'Select All',
                                                selectAllRegions,
                                                    (value) {
                                                  setState(() {
                                                    selectAllRegions = value;
                                                    // Set the values for all region options
                                                    northOption = value;
                                                    southOption = value;
                                                    eastOption = value;
                                                    westOption = value;
                                                    nepalOption = value;
                                                    banglaOption = value;
                                                  });
                                                  filterAccounts(
                                                      searchController.text);
                                                },
                                              ),
                                              // SizedBox(height: 7.0),
                                              buildFilterOption(
                                                'NORTH',
                                                northOption,
                                                    (value) {
                                                  setState(() {
                                                    northOption = value;
                                                  });
                                                },
                                              ),
                                              buildFilterOption(
                                                'SOUTH',
                                                southOption,
                                                    (value) {
                                                  setState(() {
                                                    southOption = value;
                                                  });
                                                },
                                              ),
                                              buildFilterOption(
                                                'EAST',
                                                eastOption,
                                                    (value) {
                                                  setState(() {
                                                    eastOption = value;
                                                  });
                                                },
                                              ),
                                              buildFilterOption(
                                                'WEST',
                                                westOption,
                                                    (value) {
                                                  setState(() {
                                                    westOption = value;
                                                  });
                                                },
                                              ),
                                              buildFilterOption(
                                                'NEPAL',
                                                nepalOption,
                                                    (value) {
                                                  setState(() {
                                                    nepalOption = value;
                                                  });
                                                },
                                              ),
                                              buildFilterOption(
                                                'BANGLADESH',
                                                banglaOption,
                                                    (value) {
                                                  setState(() {
                                                    banglaOption = value;
                                                  });
                                                },
                                              ),
                                            ],
                                          ),
                                        ),
                                      );
                                    });
                                  },
                                );

                                setState(() {});
                              },
                            ),
                          ],
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.transparent),
                          borderRadius: BorderRadius.circular(
                              8.0), // Set the border radius here
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.transparent),
                          borderRadius: BorderRadius.circular(8.0),
                        ),
                        filled: true,
                        fillColor: Colors.grey[50],
                        hintStyle: TextStyle(color: Colors.grey),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),


    );
  }


  void handleRowTap(Map<String, dynamic> account, int index) {
    RowData rowData = rowDetails[index] ?? RowData();
    showModalBottomSheet<void>(
      shape: RoundedRectangleBorder(
        borderRadius:
        BorderRadius.only(topLeft: Radius.zero, topRight: Radius.zero),
      ),
      context: context,
      isScrollControlled: true,
      builder: (BuildContext context) {
        // Customize the bottom sheet content here
        return StatefulBuilder(
            builder: (BuildContext context, StateSetter setState) {
              return SingleChildScrollView(
                child: Container(
                  padding: EdgeInsets.only(
                    bottom: MediaQuery.of(context).viewInsets.bottom,
                  ),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white70,
                      borderRadius: BorderRadius.zero,
                    ),
                    height: 450,
                    // Adjust the height as needed

                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Column(
                        // mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Center(
                            child: Container(
                                height: 65,
                                width: 350,
                                decoration: BoxDecoration(
                                  // borderRadius: BorderRadius.circular(20.0),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.grey.withOpacity(0.3),
                                      spreadRadius: 5,
                                      blurRadius: 7,
                                      offset: Offset(0,
                                          3), // changes the position of the shadow
                                    ),
                                  ],
                                  color: Colors.white70,
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      crossAxisAlignment: CrossAxisAlignment.center,
                                      children: [
                                        Row(
                                            mainAxisAlignment:
                                            MainAxisAlignment.center,
                                            children: [
                                              ElevatedButton(
                                                  child: const Text(
                                                    'Plan!',
                                                  ),
                                                  style: ElevatedButton.styleFrom(
                                                    primary: Colors.blue[
                                                    900], // Set the background color
                                                    onPrimary: Colors
                                                        .white, // Set the text color
                                                    fixedSize: Size(120.0, 40.0),
                                                    shape: RoundedRectangleBorder(
                                                      borderRadius:
                                                      BorderRadius.circular(
                                                          10.0),
                                                    ),
                                                  ),
                                                  onPressed: () {
                                                    Navigator.pop(context);

                                                    ScaffoldMessenger.of(context)
                                                        .showSnackBar(
                                                      SnackBar(
                                                          content: Text(
                                                              'Planning has been done successfully.')),
                                                    );

                                                    print(
                                                        'Selected Activity: ${rowData.selectedValue}');
                                                    print(
                                                        'Remarks: ${rowData.remarksController.text}');
                                                    print(
                                                        'Selected Date: ${rowData.selectedDate}');
                                                  }),
                                              SizedBox(
                                                width: 40,
                                              ),
                                              ElevatedButton(
                                                child: const Text(
                                                  'Cancel',
                                                ),
                                                style: ElevatedButton.styleFrom(
                                                  primary: Colors
                                                      .red, // Set the background color
                                                  onPrimary: Colors
                                                      .white, // Set the text color
                                                  fixedSize: Size(120.0, 40.0),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                    BorderRadius.circular(10.0),
                                                  ),
                                                ),
                                                onPressed: () =>
                                                    Navigator.pop(context),
                                              ),
                                            ]),
                                      ]),
                                )),
                          ),
                          SizedBox(
                            height: 10,
                          ),
                          Container(
                            // color: Colors.lightBlue[50],
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  child: Row(
                                    children: [
                                      Text(
                                        'Plan Type:   ',
                                        style: TextStyle(
                                          fontSize: 18.0,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      Spacer(),
                                      DropdownButton<String>(
                                        value: rowData.selectedValue,
                                        icon: Icon(Icons.arrow_downward),
                                        iconSize: 24,
                                        elevation: 16,
                                        style: TextStyle(color: Colors.black),
                                        underline: Container(
                                          height: 2,
                                          color: Colors.black,
                                        ),
                                        onChanged: (String? newValue) {
                                          setState(() {
                                            rowData.selectedValue = newValue!;
                                          });
                                        },
                                        items: <String>['CALL', 'VISIT']
                                            .map<DropdownMenuItem<String>>(
                                                (String value) {
                                              return DropdownMenuItem<String>(
                                                value: value,
                                                child: Text(value),
                                              );
                                            }).toList(),
                                      ),
                                    ],
                                  ),
                                ),
                                Text(
                                  'Remarks:-  ',
                                  style: TextStyle(
                                    fontSize: 18.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                TextFormField(
                                  controller: rowData.remarksController,
                                  keyboardType: TextInputType.text,
                                  decoration: InputDecoration(
                                    hintText: 'Enter Remarks',
                                    filled: true,
                                    fillColor: Colors.lightBlue[50],
                                    // border: InputBorder.none,
                                    focusedBorder: OutlineInputBorder(
                                      borderSide:
                                      BorderSide(color: Colors.transparent),
                                    ),
                                  ),
                                ),
                                SizedBox(
                                  height: 10,
                                ),
                                Row(
                                  children: <Widget>[
                                    Text(
                                      'Planning Date:',
                                      style: TextStyle(
                                        fontSize: 18.0,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Spacer(),
                                    Text(
                                      '${rowData.selectedDate.toLocal()}'
                                          .split(' ')[0],
                                      style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold),
                                    ),
                                    IconButton(
                                      onPressed: () async {
                                        final DateTime? picked =
                                        await showDatePicker(
                                          context: context,
                                          initialDate: rowData.selectedDate,
                                          firstDate: DateTime(2000),
                                          lastDate: DateTime(2101),
                                        );

                                        if (picked != null &&
                                            picked != rowData.selectedDate) {
                                          setState(() {
                                            rowData.selectedDate = picked;
                                          });
                                        }
                                      },
                                      icon: Icon(Icons.date_range),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Account Details:-',
                                style: TextStyle(
                                  decoration: TextDecoration.combine([
                                    TextDecoration.underline,
                                  ]),
                                  fontSize: 19.0,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(
                                height: 8,
                              ),
                              Container(
                                width: 400,
                                child: Text(
                                  '${account['account']}',
                                  style: TextStyle(
                                    fontSize: 16.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              Text(
                                '[${account['region']}]',
                                style: TextStyle(
                                  fontSize: 16.0,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Row(
                                children: [
                                  Text(
                                    '${account['p_type']}',
                                    style: TextStyle(
                                      fontSize: 16.0,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            });
      },
    );
  }

  Future<void> planningAccounts() async {
    try {
      final response = await dio.get("http://10.0.0.186:3010/planning_accounts");

      if(mounted) {
        if (response.statusCode == 200) {
          final List<dynamic> data = response.data;

          String result = json.encode(data);

          numberOfPlans = data.length;

          String nofacc;
          nofacc = numberOfPlans.toString();

          final SharedPreferences prefs = await SharedPreferences.getInstance();
          prefs.setString('Planning_data', result);
          prefs.setString('Number_of_Plans', nofacc);

          // String? updateplan =  prefs.getString('Planning_data');
          //
          // List<dynamic> plandata = json.decode(updateplan!);
          //
          // setState(() {
          //   planAccountDetails = List<Map<String, dynamic>>.from(plandata);
          //   filteredPlanAccounts = List<Map<String, dynamic>>.from(plandata);
          // });

          // Handle the data as needed
          print('Received data: $planAccountDetails');
        } else {
          // Handle error cases
          print('Request failed with status: ${response.statusCode}');
        }
      }
    } on DioError catch (error) {
      // Handle network errors or other exceptions
      if(mounted) {
        Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);

        final SharedPreferences prefs = await SharedPreferences.getInstance();
        prefs.remove('jwtToken');
        prefs.remove('Status');
        print('Error: ${error.response!.statusCode}');
      }
    }
  }


  Widget buildFilterOption(String title, bool value, Function(bool) onChanged) {
    return Row(
      children: [
        Text(
          title,
          style: TextStyle(fontSize: 15.0),
        ),
        Spacer(),
        Container(
          height: 35,
          child: Switch(
            value: value,
            onChanged: (newValue) {
              setState(() {
                onChanged(newValue);
                filterAccounts(searchController.text);
              });
            },
          ),
        ),
      ],
    );
  }

  Widget buildAllFilterOption(String title, bool value, Function(bool) onChanged) {
    return Row(
      children: [
        Text(
          title,
          style: TextStyle(fontSize: 18.0),
        ),
        SizedBox(width: 10,),
        Switch(
          value: value,
          onChanged: (newValue) {
            setState(() {
              onChanged(newValue);
              filterAccounts(searchController.text);
            });
          },
        ),
      ],
    );
  }
  String limitCharacters(String text, int maxLength) {
    if (text.length <= maxLength) {
      return text;
    } else {
      return text.substring(0, maxLength) + '...';
    }
  }

  void filterAccounts(String query) {
    setState(() {
      filteredPlanAccounts = planAccountDetails.where((account) {
        bool matchesQuery = account['account']
            .toLowerCase()
            .contains(query.toLowerCase()) ||
            account['segment'].toLowerCase().contains(query.toLowerCase()) ||
            account['region'].toLowerCase().contains(query.toLowerCase()) ||
            account['state'].toLowerCase().contains(query.toLowerCase());

        bool matchesRegion = (northOption && account['region'] == 'NORTH') ||
            (southOption && account['region'] == 'SOUTH') ||
            (eastOption && account['region'] == 'EAST') ||
            (westOption && account['region'] == 'WEST') ||
            (nepalOption && account['region'] == 'NEPAL') ||
            (banglaOption && account['region'] == 'BANGLADESH');

        return matchesQuery && matchesRegion;
      }).toList();

      bool allRegionsSelected =
          northOption && southOption && eastOption && westOption && nepalOption && banglaOption;

      // Update selectAllRegions based on the above condition
      if (allRegionsSelected) {
        selectAllRegions = true;
      } else {
        selectAllRegions = false;
      }

      bool allFiltersDeselected =
          !northOption && !southOption && !eastOption && !westOption && !nepalOption && !banglaOption && !selectAllRegions;

      if (allFiltersDeselected) {
        filteredPlanAccounts = planAccountDetails.where((account) =>
        account['account']
            .toLowerCase()
            .contains(query.toLowerCase()) ||
            account['segment'].toLowerCase().contains(query.toLowerCase()) ||
            account['region'].toLowerCase().contains(query.toLowerCase()) ||
            account['state'].toLowerCase().contains(query.toLowerCase())).toList();
      }

    });
  }


}

