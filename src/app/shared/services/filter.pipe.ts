import { Pipe, PipeTransform } from '@angular/core';
import { IndentData } from '../services/indentdb.type';

@Pipe({
name: 'myfilter',
pure: false
})
export class FilterPipe implements PipeTransform {


transform(value: any, args: any, filterType:any): any {
  if (!args) {
    return value;
  }
  let rVal;
  return value.filter((val) => {
    switch(filterType){
      case 'indentNumber':
        if(val.indent_sheet_num != null ) {
          rVal =  val.indent_sheet_num.toLocaleUpperCase().toString().includes(args) ||
                  val.indent_sheet_num.toLocaleLowerCase().toString().includes(args);
          if(rVal){ return rVal;}
        }
        break;
      case 'sosSummary':
        if(val.sos_summary != null ) {
          rVal =  val.sos_summary.toLocaleUpperCase().toString().includes(args) ||
                  val.sos_summary.toLocaleLowerCase().toString().includes(args);
          if(rVal){ return rVal;}
        }
        break;
      case 'orderType':
        if(val.order_type != null ) {
          rVal =  val.order_type.toLocaleUpperCase().toString().includes(args) ||
                  val.order_type.toLocaleLowerCase().toString().includes(args);
          if(rVal){ return rVal;}
        }
        break;
      case 'projectNumber':
        if(val.ij_project_num != null ) {
          rVal =  val.ij_project_num.toLocaleUpperCase().toString().includes(args) ||
                  val.ij_project_num.toLocaleLowerCase().toString().includes(args);
          if(rVal){ return rVal;}
        }
        break;
      case 'contractAcntName':
        if(val.contract_acnt_name != null ) {
          rVal =  val.contract_acnt_name.toLocaleUpperCase().toString().includes(args) ||
                  val.contract_acnt_name.toLocaleLowerCase().toString().includes(args);
          if(rVal){ return rVal;}
        }
        break;
      case 'userAcntName':
        if(val.user_acnt_name != null ) {
          rVal =  val.user_acnt_name.toLocaleUpperCase().toString().includes(args) ||
                  val.user_acnt_name.toLocaleLowerCase().toString().includes(args);
          if(rVal){ return rVal;}
        }
        break;
      case 'customer_po_num':
          if(val.customer_po_num != null ) {
            rVal =  val.customer_po_num.toLocaleUpperCase().toString().includes(args) ||
                    val.customer_po_num.toLocaleLowerCase().toString().includes(args);
            if(rVal){ return rVal;}
          }
          break;
    }
     return false;
    // if(val.indent_sheet_num != null || val.sos_summary != null || val.orderType != null || val.projectNumber != null
    // || val.contractAcntName != null  || val.userAcntName != null  ) {
    //         rVal =  val.indent_sheet_num.toLocaleUpperCase().toString().includes(args) ||
    //                 val.indent_sheet_num.toLocaleLowerCase().toString().includes(args) ||
    //                 val.sos_summary.toLocaleUpperCase().toString().includes(args) ||
    //               val.sos_summary.toLocaleLowerCase().toString().includes(args) ||
    //               val.orderType.toLocaleUpperCase().toString().includes(args) ||
    //             val.orderType.toLocaleLowerCase().toString().includes(args) ||
    //             val.projectNumber.toLocaleUpperCase().toString().includes(args) ||
    //           val.projectNumber.toLocaleLowerCase().toString().includes(args) ||
    //                 val.contract_acnt_name.toLocaleUpperCase().toString().includes(args) ||
    //               val.contract_acnt_name.toLocaleLowerCase().toString().includes(args) ||
    //                 val.user_acnt_name.toLocaleUpperCase().toString().includes(args) ||
    //                 val.user_acnt_name.toLocaleLowerCase().toString().includes(args);
    //         if(rVal){ return rVal;}
    // }
    // if(this.isNotValid(val.indent_sheet_num)){
    //   if(val.indent_sheet_num.toLocaleUpperCase().toString().includes(args) ||
    //                   val.indent_sheet_num.toLocaleLowerCase().toString().includes(args)){
    //                     return val;
    //   }
    // }
    // if(this.isNotValid(val.sos_summary)){
    //   if(val.sos_summary.toLocaleUpperCase().toString().includes(args) ||
    //                   val.sos_summary.toLocaleLowerCase().toString().includes(args)){
    //                     return val;
    //   }
    // }
    // if(this.isNotValid(val.order_type)){
    //   if(val.order_type.toLocaleUpperCase().toString().includes(args) ||
    //                   val.order_type.toLocaleLowerCase().toString().includes(args)){
    //                     return val;
    //   }
    // }
    // if(this.isNotValid(val.ij_project_num)){
    //   if(val.ij_project_num.toLocaleUpperCase().toString().includes(args) ||
    //                   val.ij_project_num.toLocaleLowerCase().toString().includes(args)){
    //                     return val;
    //   }
    // }
    // if(this.isNotValid(val.contract_acnt_name)){
    //   if(val.contract_acnt_name.toLocaleUpperCase().toString().includes(args) ||
    //                   val.contract_acnt_name.toLocaleLowerCase().toString().includes(args)){
    //                     return val;
    //   }
    // }
    // if(this.isNotValid(val.user_acnt_name)){
    //   if(val.user_acnt_name.toLocaleUpperCase().toString().includes(args) ||
    //                   val.user_acnt_name.toLocaleLowerCase().toString().includes(args)){
    //                     return val;
    //   }
    // }
    // return false;
  });


}


isNotValid(value){
  if (['undefined--', 'null', null, undefined].indexOf(value) === -1){
    return true;
  }
  return false;
}
}
