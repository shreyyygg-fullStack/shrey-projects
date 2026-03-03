import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
name: 'myfilter2',
pure: false
})


export class FilterPipe2 implements PipeTransform {

transform(item: any, args: any): any {
  if (!args) {
    return item;
  }
  let newList = [];
  for(let row of item){
      for(let i in row){
          if(row[i]!=null){
            if(row[i].toString().toLowerCase().includes(args.toString().toLowerCase())){
            newList.push(row);
            break;
            }

        }
        
      }
  }
  return newList;
}

}
