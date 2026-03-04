
import 'dart:io';

void main(){

  print("Welcome to dart");

  stdout.write("Enter name:- ");

  var name = stdin.readLineSync();

  print("Name- $name") ;

  var map_name = {
    'key1': 'value1',
    'key2': 211,
    'key3': 32.0,
    'key4': true
  };

  print(map_name['key2']);

  for(int i = 0; i<5; i++ ){
    print('hello ${i + 1}');
  }

  var p = Human();
  p.print();
}

class Human{

void print(){
  stdout.write("Function called");

}
}