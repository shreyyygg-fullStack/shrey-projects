import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { GlobalConstants } from '../common/global-constants';
import { IndentDetail, InvoiceDetail, PaymentDetail } from './indentdb.type';

@Injectable({
  providedIn: 'root'
})
export class FilemanagementService {

  constructor(private httpcon:HttpClient) { }

  getAllIndents(indentType: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const options = { headers };
    return this.httpcon.get<IndentDetail>(GlobalConstants.apiGetDataList+indentType)
    .pipe(map(Response => {
      let indentList:IndentDetail[]=[];
      for (const key in Response) {
        if (Response.hasOwnProperty(key)) {
          indentList.push({...Response[key] });
        }
      }
      return indentList;
    }));
    
  }

  getIndentsByDate(fromDate: string, toDate: string,indentType:string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    
    const param = new HttpParams()
    .set('startDate', fromDate)
    .set('endingDate',toDate);
    const options = { headers };
    return this.httpcon.post<IndentDetail>(GlobalConstants.apiListIndentByDate + indentType, param, options)
    .pipe(map(Response => {
      let indentList:IndentDetail[]=[];
      for (const key in Response) {
        if (Response.hasOwnProperty(key)) {
          indentList.push({...Response[key] });
        }
      }
      return indentList;
    }))
    
  }

  getIndentByConditionalFilter(option,indentType: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    
    const param = new HttpParams()
    .set('option', option);
    const options = { headers };
    return this.httpcon.post<IndentDetail>(GlobalConstants.apiListIndentByConditionalFilter+ indentType, param, options)
    .pipe(map(Response => {
      let indentList:IndentDetail[]=[];
      for (const key in Response) {
        if (Response.hasOwnProperty(key)) {
          indentList.push({...Response[key] });
        }
      }
      return indentList;
    }))
  }


  // invoice list 
  getAllInvoiceList(indentType: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const options = { headers };
    return this.httpcon.get<InvoiceDetail>(GlobalConstants.apiGetListOfInvoice+ indentType)
    .pipe(map(Response => {
      let invoiceList:InvoiceDetail[]=[];
      for (const key in Response) {
        if (Response.hasOwnProperty(key)) {
          invoiceList.push({...Response[key] });
        }
      }
      return invoiceList;
    }));
  }

  getInvoiceListByDate(fromDate: string, toDate: string, indentType: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    
    const param = new HttpParams()
    .set('startDate', fromDate)
    .set('endingDate',toDate);
    const options = { headers };
    return this.httpcon.post<InvoiceDetail>(GlobalConstants.apiGetListOfInvoiceByDate+ indentType, param, options)
    .pipe(map(Response => {
      let invoiceList:InvoiceDetail[]=[];
      for (const key in Response) {
        if (Response.hasOwnProperty(key)) {
          invoiceList.push({...Response[key] });
        }
      }
      return invoiceList;
    }))
  }

  getInvoiceListByConditionalFilter(option, indentType: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    
    const param = new HttpParams()
    .set('option', option);
    const options = { headers };
    return this.httpcon.post<InvoiceDetail>(GlobalConstants.apiGetListOfInvoiceByConditionalFilter+ indentType, param, options)
    .pipe(map(Response => {
      let invoiceList:InvoiceDetail[]=[];
      for (const key in Response) {
        if (Response.hasOwnProperty(key)) {
          invoiceList.push({...Response[key] });
        }
      }
      return invoiceList;
    }))
  }

  // payment List
  getAllPaymentList(indentType: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const options = { headers };
    return this.httpcon.get<PaymentDetail>(GlobalConstants.apiGetListOfPayment + indentType)
    .pipe(map(Response => {
      let paymentList:PaymentDetail[]=[];
      for (const key in Response) {
        if (Response.hasOwnProperty(key)) {
          paymentList.push({...Response[key] });
        }
      }
      return paymentList;
    }));
  }

  getPaymentListByDate(fromDate: string, toDate: string, indentType: string){

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    
    const param = new HttpParams()
    .set('startDate', fromDate)
    .set('endingDate',toDate);
    const options = { headers };
    return this.httpcon.post<PaymentDetail>(GlobalConstants.apiGetListOfPaymentByDate+ indentType, param, options)
    .pipe(map(Response => {
      let paymentList:PaymentDetail[]=[];
      for (const key in Response) {
        if (Response.hasOwnProperty(key)) {
          paymentList.push({...Response[key] });
        }
      }
      return paymentList;
    }))
  }

  getPaymentListByConditionalFilter(option, indentType: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    
    const param = new HttpParams()
    .set('option', option);
    const options = { headers };
    return this.httpcon.post<PaymentDetail>(GlobalConstants.apiGetListOfPaymentByConditionalFilter + indentType, param, options)
    .pipe(map(Response => {
      let paymentList:PaymentDetail[]=[];
      for (const key in Response) {
        if (Response.hasOwnProperty(key)) {
          paymentList.push({...Response[key] });
        }
      }
      return paymentList;
    }))
  }

}
