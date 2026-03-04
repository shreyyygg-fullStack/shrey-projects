import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';
import * as FileSaver from 'file-saver';
import { GetFileList } from './indentdb.type';
import { GlobalConstants } from '../common/global-constants';


@Injectable({
  providedIn: 'root'
})
export class UploadfileService {

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${GlobalConstants.apiURL}upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get<GetFileList[]>(`${GlobalConstants.apiURL}files`);
  }

  download(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${GlobalConstants.apiURL}download/[filename]`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  downloadFile(data, filename = 'data') {
    let csvData = this.ConvertToCSV(data, ['indent_sheet_num', 'indent_issue_date', 'crm_opt_num', 'sos_summary', 'sales1_id', 'sales1_name', 'sales2_id', 'sales2_name', 'order_type', 'customer_po_num', 'customer_po_date', 'contract_acnt_name', 'cntr_code', 'cntr_country', 'cntr_address', 'cntr_tel', 'cntr_gst_code', 'cntr_contact_person', 'cntr_email', 'user_acnt_name', 'ua_code', 'ua_country', 'ua_address', 'ua_tel', 'ua_gst_code', 'ua_contact_person', 'ua_email', 'key_account_flag', 'sp_cur', 'lp_total', 'sp_total', 'pck_and_fwd_amnt', 'domestic_freight_amnt', 'igst_pc', 'igst_amount', 'sgst_pc', 'sgst_amount', 'cgst_pc', 'cgst_amount', 'inst_com_amnt', 'tp_cur', 'tp1', 'tp2', 'iigm', 'pmt_trms', 'adv_type', 'adv_pc', 'adv_amount', 'adv_date', 'bsh_type', 'bsh_pc', 'bsh_amount', 'bsh_date', 'ash_type', 'ash_pc', 'ash_amount', 'ash_date', 'thirdp_com_cur', 'thirdp_com_amnt', 'thirdp_com_paid_by', 'com_acnt_name', 'com_code', 'com_country', 'com_address', 'com_tel', 'com_gst_code', 'com_contact_person', 'com_email', 'csutomer_application_code', 'customer_application_type', 'customer_app_desc', 'req_etd_by_customer', 'req_eta_by_customer', 'trd_trms_with_customer', 'dest_port_by_customer', 'mot', 'freight1', 'req_etd_to_ij', 'req_eta_to_ij', 'trd_trms_with_ij', 'dest_port_to_ij', 'mot_to_ij', 'freight2', 'coo', 'epa', 'ip', 'free_detention_period', 'consignee_acnt_name', 'cns_code', 'cns_country', 'cns_address', 'cns_tel', 'cns_gst_code', 'cns_contact_person', 'cns_email', 'cns_iec_code', 'bank_name_on_cad', 'address', 'tel', 'notify_acnt_name', 'ntf_code', 'ntf_country', 'ntf_address', 'ntf_tel', 'ntf_gst_code', 'ntf_contact_person', 'ntf_email', 'production_start', 'oth_customer_po_sheet', 'oth_sr_spec_sheet', 'oth_drawing', 'oth_test_report', 'oth_pi', 'oth_lc_draft', 'oth_doc1', 'oth_doc2', 'remarks1', 'pi_no', 'pi_date', 'iipo_no', 'iipo_date', 'ij_project_num', 'oc_date', 'sa_date', 'lc_chk_date_by_ij', 'lc_open_date', 'lc_last_revision_date', 'latest_shipment_date', 'lc_expiry_date', 'exf1', 'exf1_sts', 'exf_ij_accment1', 'exf2', 'exf2_sts', 'exf_ij_accment2', 'exf3', 'exf3_sts', 'exf_ij_accment3', 'fob_fowarder', 'invoice_no1', 'invoice_date1', 'mode1', 'from1', 'vessel1', 'awb_bl_no1', 'etd1', 'eta1', 'invoice_no2', 'invoice_date2', 'mode2', 'from2', 'vessel2', 'awb_bl_no2', 'etd2', 'eta2', 'invoice_no3', 'invoice_date3', 'mode3', 'from3', 'vessel3', 'awb_bl_no3', 'etd3', 'eta3', 'eway_bill_req', 'eway_bill_num', 'remarks2', 'com_month', 'checked_on', 'next_check', 'for_info', 'pmt_sts', 'del_sts']);
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.href = window.location.origin + "/" + filename;
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';

    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {

      let line = (i + 1) + '';
      for (let index in headerList) {
        let head = headerList[index];
        if (array[i][head] == null) {
          array[i][head] = "";
        }
        line += ',' + array[i][head];
      }
      str += line + '\r\n';
    }
    return str;
  }
}
