import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from '../shared/services/common-service.service';
import { FilemanagementService } from '../shared/services/filemanagement.service';
import { IndentDetail, InvoiceDetail, PaymentDetail } from '../shared/services/indentdb.type';
import { saveAs } from 'file-saver';
import { UtilService } from '../shared/services/util.service';

import { convertArrayToCSV } from 'convert-array-to-csv';
import { Router } from '@angular/router';
import { GlobalConstants } from '../shared/common/global-constants';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-indentlist',
  templateUrl: './indentlist.component.html',
  styleUrls: ['./indentlist.component.css'],
  providers: [DatePipe, CommonServiceService, FilemanagementService]
})
export class IndentlistComponent implements OnInit {
  indField: boolean = true;
  piField: boolean = false;
  iipoField: boolean = false;
  iiocField: boolean = false;
  vdocField: boolean = false;
  lcField: boolean = false;
  vdShpField: boolean = false;
  vdExfField: boolean = false;
  iiExfField: boolean = false;
  bgField: boolean = false;
  invField: boolean = false;
  pmtField: boolean = false;
  comField: boolean = false;
  nxtActField: boolean = false;

  generalDetailColumn:number = 0;

  onePageRowList: any[] = [];
  selectPagesForm: FormGroup;
  InstanceList: IndentDetail[] = [];
  InstanceList2: IndentDetail[] = [];
  InvoiceList: InvoiceDetail[] = [];
  InvoiceList2: InvoiceDetail[] = [];
  PaymentList: PaymentDetail[] = [];
  PaymentList2: PaymentDetail[] = [];
  indentHeader = [];
  indentBody = [];

  indentType : "ALL"| "OPEN"| "CLOSED"| "CANCELLED" = "OPEN"; 
  indentTypeList = [
    { value: 'ALL', label: 'All Orders' },
    { value: 'OPEN', label: 'Open Orders' },
    { value: 'CLOSED', label: 'Closed Orders' },
    { value: 'CANCELLED', label: 'Cancelled Orders' }
  ];

  fromDate;
  toDate;
  modalReference: NgbModalRef;
  indentRange: 'ALL' | 'option2' | 'option3' | 'option4' = 'ALL';   // variable for filter by indent list to select range of data.
  selectedOutputFilter = false;
  searchText: string = "";
  newIndentBody = [];
  date2 = new Date;


  rfromDate = { day: this.date2.getUTCDate(), month: this.date2.getUTCMonth() + 1, year: this.date2.getUTCFullYear() };
  rtoDate = { day: this.date2.getUTCDate(), month: this.date2.getUTCMonth() + 1, year: this.date2.getUTCFullYear() };
  selectYear;

  allDateFlag = true;
  rangeDateFlag = false;
  selectYearFlag = false;
  conditionalFilterFlag = false;
  maxYear;  // for example if this is 2020 max select year = 2020-2021
  Year;
  optionId: number = 1;
  optionName = 'General Details'

  showAll = true;
  show = false;
  error;
  conditionalFilter = [
    { label: 'Order before Sales', value: 1 },
    { label: 'Outstanding', value: 2 },
    { label: 'No BSH after F-EXF', value: 3 },
    { label: 'No ADV', value: 4 },
    { label: 'No F-EXF fixed', value: 5 },
    { label: 'No SHP schedule fixed', value: 6 },
    { label: 'Cancelled Order', value: 99 },
  ];
  conditionalFilterValue = 1;

  // pageList variables.
  startIndex: number = 0;
  onePageRow: number = 20;
  endIndex: number = this.onePageRow - 1;
  pageList = [1, 2, 3, 4, 5]
  maxNumberOfPagesButton = 5;
  pages = 0;
  startPageButtonDisabled = false;
  endPageButtonDisabled = true;
  selectedPage = 1;
  emptyListMssg: string = "";

  // maxlength 
  searchMaxLength: number = 50;

  constructor(private datePipe: DatePipe,private ngxService: NgxUiLoaderService,private fb: FormBuilder, private router: Router, private commonService: CommonServiceService, private filemanagementService: FilemanagementService) { }

  ngOnInit(): void {
    if (this.date2.getMonth() > 2) {
      this.selectYear = String(this.date2.getUTCFullYear() + 1);
      this.maxYear = this.date2.getUTCFullYear() + 1
    }
    else {
      this.selectYear = String(this.date2.getUTCFullYear());
      this.maxYear = this.date2.getUTCFullYear();

    }

    this.Year = [
      { value: null, label: 'Select Year' },
      { value: this.maxYear, label: String(this.maxYear - 1).concat("-").concat(String(this.maxYear)) },
      { value: this.maxYear - 1, label: String(this.maxYear - 2).concat("-").concat(String(this.maxYear - 1)) },
      { value: this.maxYear - 2, label: String(this.maxYear - 3).concat("-").concat(String(this.maxYear - 2)) },
      { value: this.maxYear - 3, label: String(this.maxYear - 4).concat("-").concat(String(this.maxYear - 3)) },
      { value: this.maxYear - 4, label: String(this.maxYear - 5).concat("-").concat(String(this.maxYear - 4)) },
    ]

    this.setAllDate();
    // reset Select Year .
    if (this.date2.getMonth() > 2) {
      this.selectYear = String(this.date2.getUTCFullYear() + 1);
      this.maxYear = this.date2.getUTCFullYear() + 1
    }
    else {
      this.selectYear = String(this.date2.getUTCFullYear());
      this.maxYear = this.date2.getUTCFullYear();
    }
    // reset fromDate and To Date.
    this.rfromDate = { day: this.date2.getUTCDate(), month: this.date2.getUTCMonth() + 1, year: this.date2.getUTCFullYear() };
    this.rtoDate = { day: this.date2.getUTCDate(), month: this.date2.getUTCMonth() + 1, year: this.date2.getUTCFullYear() };
    this.selectPagesForm = this.fb.group({
      pages: new FormControl(20),
    });
  }


  homeRouterInit() {
    this.router.navigate(['ii/home']);
  }

  indentListInit() {
    location.reload();
  }

  async fetchData() {
    let indentType = this.indentType;
    this.emptyListMssg = "Loading Indent Data...";
    this.filemanagementService.getAllIndents(indentType)
      .subscribe(Response => {
        this.InstanceList = [];
        this.InstanceList2 = [];
        this.InstanceList2 = Response;
        this.InstanceList = Response;
        if (this.InstanceList.length == 0) {
          this.emptyListMssg = "There is no Indent.";
        }
        else {
          this.emptyListMssg = "";
        }
        this.createIndentArray();
        return this.InstanceList;
      }, error => {
        this.commonService.toast("error", "Server is not responding------------");
      });
  }




  setAllDate() {
    this.allDateFlag = true;
    this.rangeDateFlag = false;
    this.selectYearFlag = false;
    this.conditionalFilterFlag = false;
    this.indentRange = "ALL";
    this.resetOutputFilter();
    if (this.allDateFlag) {
      this.fetchData();
    }
    this.searchText = '';
    this.generatePageListButtons();
    this.resetConditionalFilterOption();
  }

  setRangeDate() {
    this.allDateFlag = false;
    this.rangeDateFlag = true;
    this.selectYearFlag = false;
    this.conditionalFilterFlag = false;
    this.indentRange = "option2";
    this.rfromDate = { day: this.date2.getUTCDate(), month: this.date2.getUTCMonth() + 1, year: this.date2.getUTCFullYear() };
    this.rtoDate = { day: this.date2.getUTCDate(), month: this.date2.getUTCMonth() + 1, year: this.date2.getUTCFullYear() };
    // this.resetOutputFilter();
    if (this.rangeDateFlag) {
      this.fetchIndentByDate();
    }
    this.searchText = '';
    this.resetConditionalFilterOption();
  }

  setSelectYear() {
    this.allDateFlag = false;
    this.rangeDateFlag = false;
    this.selectYearFlag = true;
    this.conditionalFilterFlag = false;
    this.indentRange = 'option3';
    if (this.date2.getMonth() > 2) {
      this.selectYear = String(this.date2.getUTCFullYear() + 1);
      this.maxYear = this.date2.getUTCFullYear() + 1
    }
    else {
      this.selectYear = String(this.date2.getUTCFullYear());
      this.maxYear = this.date2.getUTCFullYear();
    }
    // this.resetOutputFilter();
    if (this.selectYearFlag) {
      this.fetchIndentByYear();
    }
    this.searchText = "";
    this.resetConditionalFilterOption();
  }

  setConditionalFilter() {
    this.conditionalFilterFlag = true;
    this.conditionalFilterValue = 1;
    this.resetOutputFilter();
    this.onChangeFetchConditionalData();
  }

  onChangeFetchConditionalData() {
    let indentType = this.indentType;
    this.resetListParam();
    this.indField = true;
    this.searchText = '';
    this.allDateFlag = false;
    this.rangeDateFlag = false;
    this.selectYearFlag = false;
    this.indentRange = 'option4';
    this.conditionalFilterValue = +this.conditionalFilterValue;
    let option = this.conditionalFilterValue;
    this.emptyListMssg = "Loading Indent Data...";
    this.filemanagementService.getIndentByConditionalFilter(option,indentType)
      .subscribe(Response => {
        this.InstanceList = [];
        this.InstanceList2 = [];
        this.InstanceList = Response;
        this.InstanceList2 = Response;
        if (this.InstanceList.length == 0) {
          this.emptyListMssg = "There is no Indent.";
        }
        else {
          this.emptyListMssg = "";
        }
        this.createIndentArray();
        return this.InstanceList;
      });
  }



  dselectType = [
    { value: 1, viewValue: 'General Details' },
    { value: 2, viewValue: 'PO Details' },
    { value: 3, viewValue: 'Account Details' },
    { value: 4, viewValue: 'Payment Details' },
    { value: 5, viewValue: '3P Comm Details' },
    { value: 6, viewValue: 'Application Details' },
    { value: 7, viewValue: 'SHP Inst1 Details' },
    { value: 8, viewValue: 'SHP Inst2 Details' },
    { value: 9, viewValue: 'IND Remarks Details' },
    { value: 10, viewValue: 'PI Details' },
    { value: 11, viewValue: 'LC Details' },
    { value: 12, viewValue: 'EXF Details' },
    { value: 13, viewValue: 'SHP Adv Details' },
    { value: 14, viewValue: 'Sales Admin Details' },
  ];

  allSet = {
    set1: true,
    set2: true,
    set3: true,
    set4: true,
    set5: true,
    set6: true,
    set7: true,
    set8: true,
    set9: true,
    set10: true,
    set11: true,
    set12: true,
    set13: true,
    set14: true
  }




  listColumns(id, name) {
    this.optionId = id;
    this.optionName = name;
    this.showAll = !this.showAll;
    this.show = !this.show;

  }




  poDetails = {
    customer_po_no: { id: '1', name: 'CUSTOMER PO NO.', checked: true },
    customer_po_date: { id: '2', name: 'CUSTOMER PO DATE', checked: true },
    sp_currency: { id: '3', name: 'SP CUR', checked: true },
    tp_currency: { id: '4', name: ' TP CUR', checked: true },
    list_price_total: { id: '5', name: 'LP', checked: true },
    selling_price_total: { id: '6', name: 'SP', checked: true },
    transfer_price_1: { id: '7', name: 'TP 1', checked: true },
    transfer_price_2: { id: '8', name: 'TP 2', checked: true },
    iigm_inr: { id: '9', name: 'IIGM INR', checked: true },
    // payment_term: { id: '10', name: ' Payment Term', checked: true },
    pck_n_fwd: { id: '11', name: 'PCK & FWD', checked: true },
    dmst_frt: { id: '12', name: 'DMST FRT', checked: true },
    inst_com: { id: '13', name: 'INST/COM', checked: true },
    sgst_percentage: { id: '14', name: 'SGST %', checked: true },
    sgst_amount: { id: '15', name: 'SGST AMOUNT', checked: true },
    cgst_percentage: { id: '16', name: 'CGST %', checked: true },
    cgst_amount: { id: '17', name: 'CGST AMOUNT', checked: true },
    igst_percentage: { id: '18', name: 'IGST %', checked: true },
    igst_amount: { id: '19', name: 'IGST AMOUNT', checked: true },

  }


  accountDetails = {
    cntr_address: { id: '2', name: 'CNTR ADDRESS', checked: true },
    cntr_contact: { id: '3', name: 'CNTR CONTACT', checked: true },
    cntr_email: { id: '4', name: 'CNTR EMAIL', checked: true },
    cntr_code: { id: '5', name: 'CNTR CODE', checked: true },
    cntr_country: { id: '6', name: 'CNTR COUNTRY', checked: true },
    cntr_gst_in: { id: '7', name: 'CNTR GST IN', checked: true },
    cntr_tel: { id: '8', name: 'CNTR TEL', checked: true },
    user_account_name: { id: '9', name: 'USER ACCOUNT NAME', checked: true },
    ua_address: { id: '10', name: 'UA ADDRESS', checked: true },
    ua_contact: { id: '11', name: 'UA CONTACT', checked: true },
    ua_email: { id: '12', name: 'UA EMAIL', checked: true },
    ua_code: { id: '13', name: 'UA CODE', checked: true },
    ua_country: { id: '14', name: 'UA COUNTRY', checked: true },
    ua_gst_in: { id: '15', name: 'UA GST IN', checked: true },
    ua_tel: { id: '16', name: 'UA TEL', checked: true },
    key_account_flag: { id: '17', name: 'KEY ACCOUNT FLAG', checked: true }
  }


  paymentDetails = {
    payment_terms: { id: '1', name: 'PAYMENT TERM', checked: true },
    adv_type: { id: '2', name: 'ADV TYPE', checked: true },
    adv_percent: { id: '3', name: 'ADV %', checked: true },
    adv_amount: { id: '4', name: 'ADV AMOUNT', checked: true },
    adv_date: { id: '5', name: 'ADV DATE', checked: true },
    bsh_type: { id: '6', name: 'BSH TYPE', checked: true },
    bsh_percent: { id: '7', name: 'BSH %', checked: true },
    bsh_amount: { id: '8', name: 'BSH AMOUNT', checked: true },
    bsh_date: { id: '9', name: 'BSH DATE', checked: true },
    ash_type: { id: '10', name: 'ASH TYPE', checked: true },
    ash_percent: { id: '11', name: 'ASH %', checked: true },
    ash_amount: { id: '12', name: 'ASH AMOUNT', checked: true },
    ash_date: { id: '13', name: 'ASH DATE', checked: true }
  }


  comDetails = {
    tp_com_currency: { id: '1', name: '3P COM CURRENCY', checked: true },
    tp_com_amount: { id: '2', name: '3P COM AMOUNT', checked: true },
    tp_com_paid: { id: '3', name: '3P COM PAID BY', checked: true },
    tp_com_acnt_name: { id: '4', name: 'COM ACNT NAME', checked: true },
    com_acnt_address: { id: '5', name: 'COM ACNT ADDRESS', checked: true },
    com_contact: { id: '6', name: 'COM CONTACT', checked: true },
    com_email: { id: '7', name: 'COM EMAIL', checked: true },
    com_code: { id: '8', name: 'COM CODE', checked: true },
    com_country: { id: '9', name: 'COM COUNTRY', checked: true },
    com_gst_in: { id: '10', name: 'COM GST IN', checked: true },
    com_tel: { id: '11', name: 'COM TEL', checked: true },
  }


  applicationDetails = {
    customer_app_code: { id: '1', name: 'CUSTOMER APP CODE', checked: true },
    application_type: { id: '2', name: 'APPLICATION TYPE', checked: true },
    customer_app_desc: { id: '3', name: 'CUSTOMER APP DESC', checked: true },
  }


  shpInst1Details = {
    request_etd_user: { id: '1', name: 'REQUEST ETD USER', checked: true },
    request_eta_user: { id: '2', name: 'REQUEST ETA USER', checked: true },
    request_etd_factory: { id: '3', name: 'REQ ETD FACTORY', checked: true },
    request_eta_factory: { id: '4', name: 'REQ ETA FACTORY', checked: true },
    trade_terms: { id: '5', name: 'TRADE TERMS', checked: true },
    trade_terms_factory: { id: '6', name: 'TRADE TERMS FACTORY', checked: true },
    dest_port: { id: '7', name: 'DEST PORT', checked: true },
    dest_port_factory: { id: '8', name: 'DEST PORT FACTORY', checked: true },
    mot: { id: '9', name: 'MOT', checked: true },
    mot_to_factory: { id: '10', name: 'MOT TO FACTORY', checked: true },
    freight: { id: '11', name: 'FREIGHT', checked: true },
    freight_to_factory: { id: '12', name: 'FREIGHT TO FACTORY', checked: true },
    coo: { id: '13', name: 'COO', checked: true },
    epa: { id: '14', name: 'EPA', checked: true },
    ip: { id: '15', name: 'IP', checked: true },
    free_dtnt_prd: { id: '16', name: 'FREE DTNT PRD(DAYS)', checked: true },
  }


  shpInst2Details = {
    cns_account_name: { id: '1', name: 'CNS ACCOUNT NAME', checked: true },
    cns_address: { id: '2', name: 'CNS ADDRESS', checked: true },
    cns_contact: { id: '3', name: 'CNS CONTACT', checked: true },
    cns_email: { id: '4', name: 'CNS EMAIL', checked: true },
    cns_code: { id: '5', name: 'CNS CODE', checked: true },
    cns_country: { id: '6', name: 'CNS COUNTRY', checked: true },
    cns_gst_in: { id: '7', name: 'CNS GST IN', checked: true },
    cns_tel: { id: '8', name: 'CNS TEL', checked: true },
    cns_iec_code: { id: '9', name: 'CNS IEC CODE', checked: true },
    bank_name: { id: '10', name: 'BANK NAME ON CARD', checked: true },
    bank_tel: { id: '11', name: 'BANK TEL', checked: true },
    bank_address: { id: '12', name: 'BANK ADDRESS', checked: true },
    ntf_acc_name: { id: '13', name: 'NTF ACCOUNT NAME', checked: true },
    ntf_address: { id: '14', name: 'NTF ADDRESS', checked: true },
    ntf_contact: { id: '15', name: 'NTF CONTACT', checked: true },
    ntf_email: { id: '16', name: 'NTF EMAIL', checked: true },
    ntf_code: { id: '17', name: 'NTF CODE', checked: true },
    ntf_country: { id: '18', name: 'NTF COUNTRY', checked: true },
    ntf_gst_in: { id: '19', name: 'NTF GST IN', checked: true },
    ntf_tel: { id: '20', name: 'NTF TEL', checked: true },
    fob_fowarder: { id: '21', name: 'FOB FOWARDER', checked: true },
  }


  indRemarksDetails = {
    production_start: { id: '1', name: 'PRODUCTION START', checked: true },
    customer_po_sheet: { id: '2', name: 'ATCH PO', checked: true },
    customer_pi: { id: '3', name: 'ATCH PI', checked: true },
    customer_sr_sheet: { id: '4', name: 'ATCH SR', checked: true },
    drawing: { id: '5', name: 'ATCH DWG', checked: true },
    test_report: { id: '6', name: 'ATCH TEST REPORT', checked: true },
    lc_draft: { id: '7', name: 'ATCH LC DRFT', checked: true },
    oth_doc1: { id: '8', name: 'ATCH OTH1', checked: true },
    oth_doc2: { id: '9', name: 'ATCH OTH2', checked: true },
    remarks: { id: '10', name: 'REMARKS', checked: true },
  }


  piDetails = {
    pi_no: { id: '1', name: 'PI NO', checked: true },
    pi_date: { id: '2', name: 'PI DATE', checked: true },
    iipo_no: { id: '3', name: 'IIPO NO.', checked: true },
    iipo_date: { id: '4', name: 'IIPO DATE', checked: true },
    ij_project_no: { id: '5', name: 'IJ PROJECT NO.', checked: true },
    oc_date: { id: '6', name: 'OC DATE', checked: true },
    sa_date: { id: '7', name: 'SA DATE', checked: true }
  }


  lcDetails = {
    lc_check_date: { id: '1', name: 'LC CHECK DATE BY IJ', checked: true },
    lc_last_rev_date: { id: '2', name: 'LC LAST REV DATE', checked: true },
    lc_open_date: { id: '3', name: 'LC OPEN DATE', checked: true },
    lc_shp_date: { id: '4', name: 'LC SHP DATE', checked: true },
    lc_expiry_date: { id: '5', name: 'LC EXPIRY DATE', checked: true }
  }


  exfDetails = {
    exf1: { id: '1', name: 'EXF1', checked: true },
    exf1_status: { id: '2', name: 'EXF1 STATUS', checked: true },
    exf_ij_annt1: { id: '3', name: 'EXF IJ ANNT1', checked: true },
    exf2: { id: '4', name: 'EXF2', checked: true },
    exf2_status: { id: '5', name: 'EXF2 STATUS', checked: true },
    exf_ij_annt2: { id: '6', name: 'EXF IJ ANNT2', checked: true },
    exf3: { id: '7', name: 'EXF3', checked: true },
    exf3_status: { id: '8', name: 'EXF3 STATUS', checked: true },
    exf_ij_annt3: { id: '9', name: 'EXF IJ ANNT3', checked: true }
  }

  shpAdvDetails = {
    invoice_no_1: { id: '1', name: 'INVOICE NO.1', checked: true },
    invoice_date_1: { id: '2', name: 'INVOICE DATE1', checked: true },
    etd1: { id: '3', name: 'ETD1', checked: true },
    eta1: { id: '4', name: 'ETA1', checked: true },
    mode1: { id: '5', name: 'MODE1', checked: true },
    from1: { id: '6', name: 'FROM1', checked: true },
    vessel1: { id: '7', name: 'VESSEL1', checked: true },
    awb_bi_no_1: { id: '8', name: 'AWB/BL NO 1.', checked: true },
    invoice_no_2: { id: '9', name: 'INVOICE NO.2', checked: true },
    invoice_date_2: { id: '10', name: 'INVOICE DATE2', checked: true },
    etd2: { id: '11', name: 'ETD2', checked: true },
    eta2: { id: '12', name: 'ETA2', checked: true },
    mode2: { id: '13', name: 'MODE2', checked: true },
    from2: { id: '14', name: 'FROM2', checked: true },
    vessel2: { id: '15', name: 'VESSEL2', checked: true },
    awb_bi_no_2: { id: '16', name: 'AWB/BL NO 2.', checked: true },
    invoice_no_3: { id: '17', name: 'INVOICE NO.3', checked: true },
    invoice_date_3: { id: '18', name: 'INVOICE DATE3', checked: true },
    etd3: { id: '19', name: 'ETD3', checked: true },
    eta3: { id: '20', name: 'ETA3', checked: true },
    mode3: { id: '21', name: 'MODE3', checked: true },
    from3: { id: '22', name: 'FROM3', checked: true },
    vessel3: { id: '23', name: 'VESSEL3', checked: true },
    awb_bi_no_3: { id: '24', name: 'AWB/BL NO.3', checked: true },
    eway_bill_rqd: { id: '25', name: 'EWAY BILL RQD', checked: true },
    eway_bill_no: { id: '26', name: 'EWAY BILL NO.', checked: true }
  }

  salesAdminDetails = {
    remarks: { id: '1', name: 'REMARKS', checked: true },
    com_month: { id: '2', name: 'COM MONTH', checked: true },
    checked_on: { id: '3', name: 'CHECKED ON', checked: true },
    for: { id: '4', name: 'FOR', checked: true },
    next_check: { id: '5', name: 'NEXT CHECK', checked: true },
    payment_status: { id: '6', name: 'PAYMENT STATUS', checked: true },
    delivery_status: { id: '7', name: 'DELIVERY STATUS', checked: true }
  }

  // Added extra field from sub master data table. 
  sub_data = {
    job_no: { name: 'JOB NO', checked: true },
    prd_ord_date: { name: 'PRD ORDER DATE', checked: true },
    oc_no: { name: 'OC NO', checked: true },
    oc_date: { name: 'SUB OC DATE', checked: true },
    // del_sts: { name: 'SUB DEL STS', checked: true },
    exf1_date: { name: 'EXF1 DATE', checked: true },
    exf1_sts: { name: 'SUB EXF1 STS', checked: true },
    exf1_annc_date: { name: 'EXF1 ANNOUNCEMENT DATE BY VND/OPR', checked: true },
    exf2_date: { name: 'EXF2 DATE', checked: true },
    exf2_sts: { name: 'SUB EXF2 STS', checked: true },
    exf2_annc_date: { name: 'EXF2 ANNOUNCEMENT DATE BY VND/OPR', checked: true },
    exf3_date: { name: 'EXF3 DATE', checked: true },
    exf3_sts: { name: 'SUB EXF3 STS', checked: true },
    exf3_annc_date: { name: 'EXF3 ANNOUNCEMENT DATE BY VND/OPR', checked: true },
    abg_request_anct_date: { name: 'ABG REQUEST DATE TO ACNT', checked: true },
    abg_issuance_date: { name: 'ABG DRAFT ISSUANCE DATE', checked: true },
    abg_final_submission_draft_date: { name: 'ABG FINAL SUBMISSION DATE OF DRAFT', checked: true },
    abg_final_submission_bg_date: { name: 'ABG FINAL SUBMISSION DATE OF BG', checked: true },
    pbg_request_anct_date: { name: 'PBG REQUEST DATE TO ACNT', checked: true },
    pbg_issuance_date: { name: 'PBG DRAFT ISSUANCE DATE', checked: true },
    pbg_final_submission_draft_date: { name: 'PBG FINAL SUBMISSION DATE OF DRAFT', checked: true },
    pbg_final_submission_bg_date: { name: 'PBG FINAL SUBMISSION DATE OF BG', checked: true }
  }

  subPaymentDetails = {
    payment_id: {name: 'PAYMENT ID' ,checked: true},
    payment_type: { name: 'TYPE', checked: true },
    payment_date: { name: 'DATE', checked: true },
    payment_amount: { name: 'AMOUNT', checked: true }
  }

  subInvoiceDetails = {
    invoice_id: { name: 'INVOICE ID', checked: true },
    inv_request_anct_date: { name: 'INV REQUEST DATE TO ACNT', checked: true },
    inv_issuance_date: { name: 'INV ISSUANCE DATE', checked: true },
    inv_no: { name: 'INV NO', checked: true },
    ewb_no: { name: 'EWB NO', checked: true },
    ewb_issuance_date: { name: 'EWB ISSUANCE DATE', checked: true },
    transportation_method: { name: 'TRANSPORTATION METHOD', checked: true },
    dispatch_date: { name: 'DISPATCH DATE', checked: true },
    dispatch_from_indent: { name: 'ORIGIN AS PER INDENT', checked: true },
    dispatch_from_origin: { name: 'ORIGIN AS PER ACTUAL', checked: true },
    dispatch_to_indent: { name: 'DESTINATION AS PER INDENT', checked: true },
    dispatch_to_destination: { name: 'DESTINATION AS PER ACTUAL', checked: true },
    machine_sn: { name: 'MACHINE SN', checked: true },
  }


  generalDetails = {
    indent_sheet_no: { id: '1', name: 'INDENT SHEET NO', checked: true },
    indent_issue_date: { id: '2', name: 'INDENT ISSUE DATE', checked: true },
    sos_summary: { id: '3', name: 'SOS SUMMARY', checked: true },
    contract_account_name: { id: '4', name: 'CNTR ACCOUNT NAME', checked: true },
    crm_opt_no: { id: '5', name: 'CRM OPT NO.', checked: true },
    order_type: { id: '6', name: 'ORDER TYPE', checked: true },
    sales1_id: { id: '7', name: 'SALES1 ID', checked: true },
    sales1_name: { id: '8', name: 'SALES1', checked: true },
    sales2_id: { id: '9', name: 'SALES2 ID', checked: true },
    sales2_name: { id: '10', name: 'SALES2', checked: true }
  }


  // please do not delete this function this is empty function but still require.
  unsorted() {
    //   !!!! Please do not delete this function this function is empty but still it is doing work because i need an empty function for unsorting..
  }

  reset() {
    let i = 1;
    this.setAllDate();
    this.searchText = "";
    this.resetListParam();
    this.indField = true;
    this.allOptionOff(true, true);
    this.createIndentArray();
  }


  setAllCheck(choice) {
    let id = this.optionId;
    this.advanceFilter(choice, id)
  }

  advanceFilter(choice, id) {
    switch (id) {
      case 1:
        // this.generalDetails.indent_sheet_no.checked = choice;
        // this.generalDetails.indent_issue_date.checked = choice;
        this.generalDetails.sos_summary.checked = choice;
        this.generalDetails.contract_account_name.checked = choice;
        this.generalDetails.crm_opt_no.checked = choice;
        this.generalDetails.order_type.checked = choice;
        this.generalDetails.sales1_name.checked = choice;
        this.generalDetails.sales2_name.checked = choice;
        this.generalDetails.sales1_id.checked = choice;
        this.generalDetails.sales2_id.checked = choice;
        this.allSet.set1 = !this.allSet.set1;
        break;
      case 2:
        this.poDetails.customer_po_date.checked = choice;
        this.poDetails.customer_po_no.checked = choice;
        this.poDetails.sp_currency.checked = choice;
        this.poDetails.tp_currency.checked = choice;
        this.poDetails.list_price_total.checked = choice;
        this.poDetails.selling_price_total.checked = choice;
        this.poDetails.transfer_price_1.checked = choice;
        this.poDetails.transfer_price_2.checked = choice;
        this.poDetails.iigm_inr.checked = choice;
        // this.poDetails.payment_term.checked = choice;
        this.poDetails.pck_n_fwd.checked = choice;
        this.poDetails.dmst_frt.checked = choice;
        this.poDetails.inst_com.checked = choice;
        this.poDetails.sgst_amount.checked = choice;
        this.poDetails.sgst_percentage.checked = choice;
        this.poDetails.cgst_amount.checked = choice;
        this.poDetails.cgst_percentage.checked = choice;
        this.poDetails.igst_amount.checked = choice;
        this.poDetails.igst_percentage.checked = choice;
        this.allSet.set2 = !this.allSet.set2;
        break;
      case 3:
        this.accountDetails.cntr_address.checked = choice;
        this.accountDetails.cntr_contact.checked = choice;
        this.accountDetails.cntr_email.checked = choice;
        this.accountDetails.cntr_country.checked = choice;
        this.accountDetails.cntr_code.checked = choice;
        this.accountDetails.cntr_gst_in.checked = choice;
        this.accountDetails.cntr_tel.checked = choice;
        this.accountDetails.user_account_name.checked = choice;
        this.accountDetails.ua_address.checked = choice;
        this.accountDetails.ua_contact.checked = choice;
        this.accountDetails.ua_email.checked = choice;
        this.accountDetails.ua_code.checked = choice;
        this.accountDetails.ua_country.checked = choice;
        this.accountDetails.ua_gst_in.checked = choice;
        this.accountDetails.ua_tel.checked = choice;
        this.accountDetails.key_account_flag.checked = choice;
        this.allSet.set3 = !this.allSet.set3;
        break;
      case 4:
        this.paymentDetails.payment_terms.checked = choice;
        this.paymentDetails.adv_type.checked = choice;
        this.paymentDetails.adv_percent.checked = choice;
        this.paymentDetails.adv_amount.checked = choice;
        this.paymentDetails.bsh_type.checked = choice;
        this.paymentDetails.bsh_percent.checked = choice;
        this.paymentDetails.bsh_amount.checked = choice;
        this.paymentDetails.ash_type.checked = choice;
        this.paymentDetails.ash_percent.checked = choice;
        this.paymentDetails.ash_amount.checked = choice;
        this.paymentDetails.ash_date.checked = choice;
        this.paymentDetails.adv_date.checked = choice;
        this.paymentDetails.bsh_date.checked = choice;
        this.allSet.set4 = !this.allSet.set4;
        break;
      case 5:
        this.comDetails.tp_com_currency.checked = choice;
        this.comDetails.tp_com_amount.checked = choice;
        this.comDetails.tp_com_paid.checked = choice;
        this.comDetails.tp_com_acnt_name.checked = choice;
        this.comDetails.com_acnt_address.checked = choice;
        this.comDetails.com_contact.checked = choice;
        this.comDetails.com_email.checked = choice;
        this.comDetails.com_contact.checked = choice;
        this.comDetails.com_country.checked = choice;
        this.comDetails.com_gst_in.checked = choice;
        this.comDetails.com_tel.checked = choice;
        this.comDetails.com_code.checked = choice;
        this.allSet.set5 = !this.allSet.set5;
        break;
      case 6:
        this.applicationDetails.customer_app_code.checked = choice;
        this.applicationDetails.application_type.checked = choice;
        this.applicationDetails.customer_app_desc.checked = choice;
        this.allSet.set6 = !this.allSet.set6;
        break;
      case 7:
        this.shpInst1Details.request_etd_user.checked = choice;
        this.shpInst1Details.request_eta_user.checked = choice;
        this.shpInst1Details.request_etd_factory.checked = choice;
        this.shpInst1Details.request_eta_factory.checked = choice;
        this.shpInst1Details.trade_terms.checked = choice;
        this.shpInst1Details.trade_terms_factory.checked = choice;
        this.shpInst1Details.dest_port.checked = choice;
        this.shpInst1Details.dest_port_factory.checked = choice;
        this.shpInst1Details.mot.checked = choice;
        this.shpInst1Details.mot_to_factory.checked = choice;
        this.shpInst1Details.freight.checked = choice;
        this.shpInst1Details.freight_to_factory.checked = choice;
        this.shpInst1Details.coo.checked = choice;
        this.shpInst1Details.epa.checked = choice;
        this.shpInst1Details.ip.checked = choice;
        this.shpInst1Details.free_dtnt_prd.checked = choice;
        this.allSet.set7 = !this.allSet.set7;
        break;
      case 8:
        this.shpInst2Details.cns_account_name.checked = choice;
        this.shpInst2Details.cns_address.checked = choice;
        this.shpInst2Details.cns_contact.checked = choice;
        this.shpInst2Details.cns_email.checked = choice;
        this.shpInst2Details.cns_country.checked = choice;
        this.shpInst2Details.cns_gst_in.checked = choice;
        this.shpInst2Details.cns_tel.checked = choice;
        this.shpInst2Details.cns_iec_code.checked = choice;
        this.shpInst2Details.bank_name.checked = choice;
        this.shpInst2Details.bank_tel.checked = choice;
        this.shpInst2Details.bank_address.checked = choice;
        this.shpInst2Details.ntf_acc_name.checked = choice;
        this.shpInst2Details.ntf_address.checked = choice;
        this.shpInst2Details.ntf_contact.checked = choice;
        this.shpInst2Details.ntf_email.checked = choice;
        this.shpInst2Details.ntf_code.checked = choice;
        this.shpInst2Details.ntf_country.checked = choice;
        this.shpInst2Details.ntf_gst_in.checked = choice;
        this.shpInst2Details.ntf_tel.checked = choice;
        this.shpInst2Details.fob_fowarder.checked = choice;
        this.shpInst2Details.cns_code.checked = choice;
        this.allSet.set8 = !this.allSet.set8;
        break;
      case 9:
        this.indRemarksDetails.production_start.checked = choice;
        this.indRemarksDetails.customer_po_sheet.checked = choice;
        this.indRemarksDetails.customer_pi.checked = choice;
        this.indRemarksDetails.customer_sr_sheet.checked = choice;
        this.indRemarksDetails.drawing.checked = choice;
        this.indRemarksDetails.test_report.checked = choice;
        this.indRemarksDetails.lc_draft.checked = choice;
        this.indRemarksDetails.oth_doc1.checked = choice;
        this.indRemarksDetails.oth_doc2.checked = choice;
        this.indRemarksDetails.remarks.checked = choice;
        this.allSet.set9 = !this.allSet.set9;
        break;
      case 10:
        this.piDetails.pi_no.checked = choice;
        this.piDetails.pi_date.checked = choice;
        this.piDetails.iipo_no.checked = choice;
        this.piDetails.iipo_date.checked = choice;
        this.piDetails.ij_project_no.checked = choice;
        this.piDetails.oc_date.checked = choice;
        this.piDetails.sa_date.checked = choice;
        this.allSet.set10 = !this.allSet.set10;
        break;
      case 11:
        this.lcDetails.lc_check_date.checked = choice;
        this.lcDetails.lc_last_rev_date.checked = choice;
        this.lcDetails.lc_open_date.checked = choice;
        this.lcDetails.lc_shp_date.checked = choice;
        this.lcDetails.lc_expiry_date.checked = choice;
        this.allSet.set11 = !this.allSet.set11;
        break;
      case 12:
        this.exfDetails.exf1.checked = choice;
        this.exfDetails.exf1_status.checked = choice;
        this.exfDetails.exf_ij_annt1.checked = choice;
        this.exfDetails.exf2.checked = choice;
        this.exfDetails.exf2_status.checked = choice;
        this.exfDetails.exf_ij_annt2.checked = choice;
        this.exfDetails.exf3.checked = choice;
        this.exfDetails.exf3_status.checked = choice;
        this.exfDetails.exf_ij_annt3.checked = choice;
        this.allSet.set12 = !this.allSet.set12;
        break;
      case 13:
        this.shpAdvDetails.invoice_no_1.checked = choice;
        this.shpAdvDetails.invoice_date_1.checked = choice;
        this.shpAdvDetails.etd1.checked = choice;
        this.shpAdvDetails.eta1.checked = choice;
        this.shpAdvDetails.mode1.checked = choice;
        this.shpAdvDetails.from1.checked = choice;
        this.shpAdvDetails.vessel1.checked = choice;
        this.shpAdvDetails.awb_bi_no_1.checked = choice;
        this.shpAdvDetails.invoice_no_2.checked = choice;
        this.shpAdvDetails.invoice_date_2.checked = choice;
        this.shpAdvDetails.etd2.checked = choice;
        this.shpAdvDetails.eta2.checked = choice;
        this.shpAdvDetails.mode2.checked = choice;
        this.shpAdvDetails.from2.checked = choice;
        this.shpAdvDetails.vessel2.checked = choice;
        this.shpAdvDetails.awb_bi_no_2.checked = choice;
        this.shpAdvDetails.invoice_no_3.checked = choice;
        this.shpAdvDetails.invoice_date_3.checked = choice;
        this.shpAdvDetails.etd3.checked = choice;
        this.shpAdvDetails.eta3.checked = choice;
        this.shpAdvDetails.mode3.checked = choice;
        this.shpAdvDetails.from3.checked = choice;
        this.shpAdvDetails.vessel3.checked = choice;
        this.shpAdvDetails.awb_bi_no_3.checked = choice;
        this.shpAdvDetails.eway_bill_rqd.checked = choice;
        this.shpAdvDetails.eway_bill_no.checked = choice;
        this.allSet.set13 = !this.allSet.set13;
        break;
      case 14:
        this.salesAdminDetails.remarks.checked = choice;
        this.salesAdminDetails.com_month.checked = choice;
        this.salesAdminDetails.checked_on.checked = choice;
        this.salesAdminDetails.for.checked = choice;
        this.salesAdminDetails.next_check.checked = choice;
        this.salesAdminDetails.payment_status.checked = choice;
        this.salesAdminDetails.delivery_status.checked = choice;
        this.allSet.set14 = !this.allSet.set14;
        break;
      default:
        break;
    }
  }



  exportCSV() {
    const csv = convertArrayToCSV(this.indentBody, {
      seperator: ',',
      header: this.indentHeader
    });
    var blob = new Blob([csv], { type: "csv;charset=utf-8" });
    let currentDate = new Date();
    let dateString = this.datePipe.transform(currentDate, 'yyyy_MM_dd_hh_mm_ss');
    let range;
    if (this.conditionalFilterFlag == true) {
      let option = +this.conditionalFilterValue
      if (option == 1) {
        range = "_OF_ORDER_BEFORE_SALES_INDENTS_";
      }
      if (option == 2) {
        range = "_OF_OUTSTANDING_INDENTS_";
      }
      if (option == 3) {
        range = "_OF_NO_BSH_AFTER_F_EXF_INDENTS_";
      }
      if (option == 4) {
        range = "_OF_NO_ADV_INDENTS_";
      }
      if (option == 5) {
        range = "_OF_NO_F_EXF_FIXED_INDENTS_";
      }
      if (option == 6) {
        range = "_OF_NO_SHP_SCHEDULE_FIXED_INDENTS_";
      }
      if (option == 99) {
        range = "_OF_CANCELLED_ORDER_INDENTS_";
      }
    }
    else if (this.allDateFlag) {
      range = "_OF_All_YEARS_";
    }
    else {
      range = "_FROM_".concat(this.fromDate).concat("_to_").concat(this.toDate);
    }
    if (this.indentBody.length == 0) {
      this.commonService.toast("warning", "There is no indent to export for selected filter!!");
    }
    else {
      let fileName = 'iOTS_DATA_' + range + '_ON_' + dateString;
      saveAs(blob, fileName + '.csv');
    }
  }

  async fetchIndentByFilter() {
    let indentType = this.indentType;
    this.emptyListMssg = "Loading Indent Data...";
    const fromDate = this.fromDate;
    const toDate = this.toDate;
    this.filemanagementService.getIndentsByDate(fromDate, toDate,indentType)
      .subscribe(Response => {
        this.InstanceList = [];
        this.InstanceList2 = [];
        this.InstanceList = Response;
        this.InstanceList2 = Response;
        if (this.InstanceList.length == 0) {
          this.emptyListMssg = "There is no Indent.";
        }
        else {
          this.emptyListMssg = "";
        }
        this.createIndentArray();
        return this.InstanceList;
      });
  }




  fetchIndentByYear() {
    this.resetOutputFilter();
    let year;
    if (this.selectYear != 'null') {
      year = String(Number(this.selectYear) - 1);
      this.fromDate = this.datePipe.transform(year.concat('04-01'), 'yyyy-MM-dd');
      year = this.selectYear;
      this.toDate = this.datePipe.transform(year.concat('03-31'), 'yyyy-MM-dd');
      this.fetchIndentByFilter();
      this.searchText = "";
    }
  }


  fetchIndentByDate() {
    this.resetOutputFilter();
    this.fromDate = this.datePipe.transform(new Date(this.rfromDate.year, this.rfromDate.month - 1, this.rfromDate.day), 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(this.rtoDate.year, this.rtoDate.month - 1, this.rtoDate.day), 'yyyy-MM-dd');

    if (this.fromDate <= this.toDate) {
      this.fetchIndentByFilter();
      this.error = false;
    }
    else {
      this.error = true;
      this.commonService.toast("warning", "Selected From Date is greater than To Date!!")
    }
    this.searchText = "";
  }


  createIndentArray() {
    let header = [];
    let row = [];
    this.indentHeader = [];
    this.indentBody = [];
    let i =0; 
    header.push(this.generalDetails.indent_sheet_no.name); i++; 
    header.push(this.generalDetails.indent_issue_date.name); i++; 
    if (this.generalDetails.crm_opt_no.checked) { header.push(this.generalDetails.crm_opt_no.name); i++; }
    if(this.generalDetails.contract_account_name.checked){ header.push(this.generalDetails.contract_account_name.name); i++;}
    if (this.generalDetails.sos_summary.checked) { header.push(this.generalDetails.sos_summary.name); i++; }
    if (this.generalDetails.sales1_id.checked) { header.push(this.generalDetails.sales1_id.name); i++; }
    if (this.generalDetails.sales1_name.checked) { header.push(this.generalDetails.sales1_name.name); i++; }
    if (this.generalDetails.sales2_id.checked) { header.push(this.generalDetails.sales2_id.name); i++; }
    if (this.generalDetails.sales2_name.checked) { header.push(this.generalDetails.sales2_name.name); i++; }
    if (this.generalDetails.order_type.checked) { header.push(this.generalDetails.order_type.name); i++; }
    //po details
    if (this.poDetails.customer_po_no.checked) { header.push(this.poDetails.customer_po_no.name) }
    if (this.poDetails.customer_po_date.checked) { header.push(this.poDetails.customer_po_date.name) }
    //Account Details
    // if (this.accountDetails.cntr_account_name.checked) { header.push(this.accountDetails.cntr_account_name.name) }
    if (this.accountDetails.cntr_code.checked) { header.push(this.accountDetails.cntr_code.name) }
    if (this.accountDetails.cntr_country.checked) { header.push(this.accountDetails.cntr_country.name) }
    if (this.accountDetails.cntr_address.checked) { header.push(this.accountDetails.cntr_address.name) }
    if (this.accountDetails.cntr_tel.checked) { header.push(this.accountDetails.cntr_tel.name) }
    if (this.accountDetails.cntr_gst_in.checked) { header.push(this.accountDetails.cntr_gst_in.name) }
    if (this.accountDetails.cntr_contact.checked) { header.push(this.accountDetails.cntr_contact.name) }
    if (this.accountDetails.cntr_email.checked) { header.push(this.accountDetails.cntr_email.name) }
    if (this.accountDetails.user_account_name.checked) { header.push(this.accountDetails.user_account_name.name) }
    if (this.accountDetails.ua_code.checked) { header.push(this.accountDetails.ua_code.name) }
    if (this.accountDetails.ua_country.checked) { header.push(this.accountDetails.ua_country.name) }
    if (this.accountDetails.ua_address.checked) { header.push(this.accountDetails.ua_address.name) }
    if (this.accountDetails.ua_tel.checked) { header.push(this.accountDetails.ua_tel.name) }
    if (this.accountDetails.ua_gst_in.checked) { header.push(this.accountDetails.ua_gst_in.name) }
    if (this.accountDetails.ua_contact.checked) { header.push(this.accountDetails.ua_contact.name) }
    if (this.accountDetails.ua_email.checked) { header.push(this.accountDetails.ua_email.name) }
    if (this.accountDetails.key_account_flag.checked) { header.push(this.accountDetails.key_account_flag.name) }
    //PO Details
    if (this.poDetails.sp_currency.checked) { header.push(this.poDetails.sp_currency.name) }
    if (this.poDetails.list_price_total.checked) { header.push(this.poDetails.list_price_total.name) }
    if (this.poDetails.selling_price_total.checked) { header.push(this.poDetails.selling_price_total.name) }
    if (this.poDetails.pck_n_fwd.checked) { header.push(this.poDetails.pck_n_fwd.name) }
    if (this.poDetails.dmst_frt.checked) { header.push(this.poDetails.dmst_frt.name) }
    if (this.poDetails.sgst_percentage.checked) { header.push(this.poDetails.sgst_percentage.name) }
    if (this.poDetails.sgst_amount.checked) { header.push(this.poDetails.sgst_amount.name) }
    if (this.poDetails.cgst_percentage.checked) { header.push(this.poDetails.cgst_percentage.name) }
    if (this.poDetails.cgst_amount.checked) { header.push(this.poDetails.cgst_amount.name) }
    if (this.poDetails.igst_percentage.checked) { header.push(this.poDetails.igst_percentage.name) }
    if (this.poDetails.igst_amount.checked) { header.push(this.poDetails.igst_amount.name) }
    if (this.poDetails.inst_com.checked) { header.push(this.poDetails.inst_com.name) }
    if (this.poDetails.tp_currency.checked) { header.push(this.poDetails.tp_currency.name) }
    if (this.poDetails.transfer_price_1.checked) { header.push(this.poDetails.transfer_price_1.name) }
    if (this.poDetails.transfer_price_2.checked) { header.push(this.poDetails.transfer_price_2.name) }
    if (this.poDetails.iigm_inr.checked) { header.push(this.poDetails.iigm_inr.name) }
    if (this.paymentDetails.payment_terms.checked) { header.push(this.paymentDetails.payment_terms.name) }

    //Payment Details
    if (this.paymentDetails.adv_type.checked) { header.push(this.paymentDetails.adv_type.name) }
    if (this.paymentDetails.adv_percent.checked) { header.push(this.paymentDetails.adv_percent.name) }
    if (this.paymentDetails.adv_amount.checked) { header.push(this.paymentDetails.adv_amount.name) }
    if (this.paymentDetails.adv_date.checked) { header.push(this.paymentDetails.adv_date.name) }
    if (this.paymentDetails.bsh_type.checked) { header.push(this.paymentDetails.bsh_type.name) }
    if (this.paymentDetails.bsh_percent.checked) { header.push(this.paymentDetails.bsh_percent.name) }
    if (this.paymentDetails.bsh_amount.checked) { header.push(this.paymentDetails.bsh_amount.name) }
    if (this.paymentDetails.bsh_date.checked) { header.push(this.paymentDetails.bsh_date.name) }
    if (this.paymentDetails.ash_type.checked) { header.push(this.paymentDetails.ash_type.name) }
    if (this.paymentDetails.ash_percent.checked) { header.push(this.paymentDetails.ash_percent.name) }
    if (this.paymentDetails.ash_amount.checked) { header.push(this.paymentDetails.ash_amount.name) }
    if (this.paymentDetails.ash_date.checked) { header.push(this.paymentDetails.ash_date.name) }


    //Third Party Commision Details
    if (this.comDetails.tp_com_currency.checked) { header.push(this.comDetails.tp_com_currency.name) }
    if (this.comDetails.tp_com_amount.checked) { header.push(this.comDetails.tp_com_amount.name) }
    if (this.comDetails.tp_com_paid.checked) { header.push(this.comDetails.tp_com_paid.name) }
    if (this.comDetails.tp_com_acnt_name.checked) { header.push(this.comDetails.tp_com_acnt_name.name) }
    if (this.comDetails.com_code.checked) { header.push(this.comDetails.com_code.name) }
    if (this.comDetails.com_country.checked) { header.push(this.comDetails.com_country.name) }
    if (this.comDetails.com_acnt_address.checked) { header.push(this.comDetails.com_acnt_address.name) }
    if (this.comDetails.com_tel.checked) { header.push(this.comDetails.com_tel.name) }
    if (this.comDetails.com_gst_in.checked) { header.push(this.comDetails.com_gst_in.name) }
    if (this.comDetails.com_contact.checked) { header.push(this.comDetails.com_contact.name) }
    if (this.comDetails.com_email.checked) { header.push(this.comDetails.com_email.name) }

    //Application Details
    if (this.applicationDetails.customer_app_code.checked) { header.push(this.applicationDetails.customer_app_code.name) }
    if (this.applicationDetails.application_type.checked) { header.push(this.applicationDetails.application_type.name) }
    if (this.applicationDetails.customer_app_desc.checked) { header.push(this.applicationDetails.customer_app_desc.name) }

    //Ship Instance 1 Details
    if (this.shpInst1Details.request_etd_user.checked) { header.push(this.shpInst1Details.request_etd_user.name) }
    if (this.shpInst1Details.request_eta_user.checked) { header.push(this.shpInst1Details.request_eta_user.name) }
    if (this.shpInst1Details.trade_terms.checked) { header.push(this.shpInst1Details.trade_terms.name) }
    if (this.shpInst1Details.dest_port.checked) { header.push(this.shpInst1Details.dest_port.name) }
    if (this.shpInst1Details.mot.checked) { header.push(this.shpInst1Details.mot.name) }
    if (this.shpInst1Details.freight.checked) { header.push(this.shpInst1Details.freight.name) }
    if (this.shpInst1Details.request_etd_factory.checked) { header.push(this.shpInst1Details.request_etd_factory.name) }
    if (this.shpInst1Details.request_eta_factory.checked) { header.push(this.shpInst1Details.request_eta_factory.name) }
    if (this.shpInst1Details.trade_terms_factory.checked) { header.push(this.shpInst1Details.trade_terms_factory.name) }
    // trd trade missing filled
    if (this.shpInst1Details.dest_port_factory.checked) { header.push(this.shpInst1Details.dest_port_factory.name) }
    if (this.shpInst1Details.mot_to_factory.checked) { header.push(this.shpInst1Details.mot_to_factory.name) }
    if (this.shpInst1Details.freight_to_factory.checked) { header.push(this.shpInst1Details.freight_to_factory.name) }
    if (this.shpInst1Details.coo.checked) { header.push(this.shpInst1Details.coo.name) }
    if (this.shpInst1Details.epa.checked) { header.push(this.shpInst1Details.epa.name) }
    if (this.shpInst1Details.ip.checked) { header.push(this.shpInst1Details.ip.name) }
    if (this.shpInst1Details.free_dtnt_prd.checked) { header.push(this.shpInst1Details.free_dtnt_prd.name) }

    //Ship Instance 2 Details
    if (this.shpInst2Details.cns_account_name.checked) { header.push(this.shpInst2Details.cns_account_name.name) }
    if (this.shpInst2Details.cns_code.checked) { header.push(this.shpInst2Details.cns_code.name) }
    if (this.shpInst2Details.cns_country.checked) { header.push(this.shpInst2Details.cns_country.name) }
    if (this.shpInst2Details.cns_address.checked) { header.push(this.shpInst2Details.cns_address.name) }
    if (this.shpInst2Details.cns_tel.checked) { header.push(this.shpInst2Details.cns_tel.name) }
    if (this.shpInst2Details.cns_gst_in.checked) { header.push(this.shpInst2Details.cns_gst_in.name) }
    if (this.shpInst2Details.cns_contact.checked) { header.push(this.shpInst2Details.cns_contact.name) }
    if (this.shpInst2Details.cns_email.checked) { header.push(this.shpInst2Details.cns_email.name) }
    if (this.shpInst2Details.cns_iec_code.checked) { header.push(this.shpInst2Details.cns_iec_code.name) }
    if (this.shpInst2Details.bank_name.checked) { header.push(this.shpInst2Details.bank_name.name) }
    if (this.shpInst2Details.bank_address.checked) { header.push(this.shpInst2Details.bank_address.name) }
    if (this.shpInst2Details.bank_tel.checked) { header.push(this.shpInst2Details.bank_tel.name) }
    if (this.shpInst2Details.ntf_acc_name.checked) { header.push(this.shpInst2Details.ntf_acc_name.name) }
    if (this.shpInst2Details.ntf_code.checked) { header.push(this.shpInst2Details.ntf_code.name) }
    if (this.shpInst2Details.ntf_country.checked) { header.push(this.shpInst2Details.ntf_country.name) }
    if (this.shpInst2Details.ntf_address.checked) { header.push(this.shpInst2Details.ntf_address.name) }
    if (this.shpInst2Details.ntf_tel.checked) { header.push(this.shpInst2Details.ntf_tel.name) }
    if (this.shpInst2Details.ntf_gst_in.checked) { header.push(this.shpInst2Details.ntf_gst_in.name) }
    if (this.shpInst2Details.ntf_contact.checked) { header.push(this.shpInst2Details.ntf_contact.name) }
    if (this.shpInst2Details.ntf_email.checked) { header.push(this.shpInst2Details.ntf_email.name) }

    //
    if (this.indRemarksDetails.production_start.checked) { header.push(this.indRemarksDetails.production_start.name) }
    if (this.indRemarksDetails.customer_po_sheet.checked) { header.push(this.indRemarksDetails.customer_po_sheet.name) }
    if (this.indRemarksDetails.customer_sr_sheet.checked) { header.push(this.indRemarksDetails.customer_sr_sheet.name) }
    if (this.indRemarksDetails.drawing.checked) { header.push(this.indRemarksDetails.drawing.name) }
    if (this.indRemarksDetails.test_report.checked) { header.push(this.indRemarksDetails.test_report.name) }
    if (this.indRemarksDetails.customer_pi.checked) { header.push(this.indRemarksDetails.customer_pi.name) }
    if (this.indRemarksDetails.lc_draft.checked) { header.push(this.indRemarksDetails.lc_draft.name) }
    if (this.indRemarksDetails.oth_doc1.checked) { header.push(this.indRemarksDetails.oth_doc1.name) }
    if (this.indRemarksDetails.oth_doc2.checked) { header.push(this.indRemarksDetails.oth_doc2.name) }
    if (this.indRemarksDetails.remarks.checked) { header.push(this.indRemarksDetails.remarks.name) }

    //Proforma Invoice Details
    if (this.piDetails.pi_no.checked) { header.push(this.piDetails.pi_no.name) }
    if (this.piDetails.pi_date.checked) { header.push(this.piDetails.pi_date.name) }
    if (this.piDetails.iipo_no.checked) { header.push(this.piDetails.iipo_no.name) }
    if (this.piDetails.iipo_date.checked) { header.push(this.piDetails.iipo_date.name) }
    if (this.piDetails.ij_project_no.checked) { header.push(this.piDetails.ij_project_no.name) }
    if (this.piDetails.oc_date.checked) { header.push(this.piDetails.oc_date.name) }
    if (this.piDetails.sa_date.checked) { header.push(this.piDetails.sa_date.name) }

    //LC Details
    if (this.lcDetails.lc_check_date.checked) { header.push(this.lcDetails.lc_check_date.name) }
    if (this.lcDetails.lc_open_date.checked) { header.push(this.lcDetails.lc_open_date.name) }
    if (this.lcDetails.lc_last_rev_date.checked) { header.push(this.lcDetails.lc_last_rev_date.name) }
    if (this.lcDetails.lc_shp_date.checked) { header.push(this.lcDetails.lc_shp_date.name) }
    if (this.lcDetails.lc_expiry_date.checked) { header.push(this.lcDetails.lc_expiry_date.name) }

    //EXF Details
    if (this.exfDetails.exf1.checked) { header.push(this.exfDetails.exf1.name) }
    if (this.exfDetails.exf1_status.checked) { header.push(this.exfDetails.exf1_status.name) }
    if (this.exfDetails.exf_ij_annt1.checked) { header.push(this.exfDetails.exf_ij_annt1.name) }
    if (this.exfDetails.exf2.checked) { header.push(this.exfDetails.exf2.name) }
    if (this.exfDetails.exf2_status.checked) { header.push(this.exfDetails.exf2_status.name) }
    if (this.exfDetails.exf_ij_annt2.checked) { header.push(this.exfDetails.exf_ij_annt2.name) }
    if (this.exfDetails.exf3.checked) { header.push(this.exfDetails.exf3.name) }
    if (this.exfDetails.exf3_status.checked) { header.push(this.exfDetails.exf3_status.name) }
    if (this.exfDetails.exf_ij_annt3.checked) { header.push(this.exfDetails.exf_ij_annt3.name) }

    //Ship Instance 2 FOB Fowarder detail
    if (this.shpInst2Details.fob_fowarder.checked) { header.push(this.shpInst2Details.fob_fowarder.name) }

    //ShpAdv Details
    if (this.shpAdvDetails.invoice_no_1.checked) { header.push(this.shpAdvDetails.invoice_no_1.name) }
    if (this.shpAdvDetails.invoice_date_1.checked) { header.push(this.shpAdvDetails.invoice_date_1.name) }
    if (this.shpAdvDetails.mode1.checked) { header.push(this.shpAdvDetails.mode1.name) }
    if (this.shpAdvDetails.from1.checked) { header.push(this.shpAdvDetails.from1.name) }
    if (this.shpAdvDetails.vessel1.checked) { header.push(this.shpAdvDetails.vessel1.name) }
    if (this.shpAdvDetails.awb_bi_no_1.checked) { header.push(this.shpAdvDetails.awb_bi_no_1.name) }
    if (this.shpAdvDetails.etd1.checked) { header.push(this.shpAdvDetails.etd1.name) }
    if (this.shpAdvDetails.eta1.checked) { header.push(this.shpAdvDetails.eta1.name) }
    if (this.shpAdvDetails.invoice_no_2.checked) { header.push(this.shpAdvDetails.invoice_no_2.name) }
    if (this.shpAdvDetails.invoice_date_2.checked) { header.push(this.shpAdvDetails.invoice_date_2.name) }
    if (this.shpAdvDetails.mode2.checked) { header.push(this.shpAdvDetails.mode2.name) }
    if (this.shpAdvDetails.from2.checked) { header.push(this.shpAdvDetails.from2.name) }
    if (this.shpAdvDetails.vessel2.checked) { header.push(this.shpAdvDetails.vessel2.name) }
    if (this.shpAdvDetails.awb_bi_no_2.checked) { header.push(this.shpAdvDetails.awb_bi_no_2.name) }
    if (this.shpAdvDetails.etd2.checked) { header.push(this.shpAdvDetails.etd2.name) }
    if (this.shpAdvDetails.eta2.checked) { header.push(this.shpAdvDetails.eta2.name) }
    if (this.shpAdvDetails.invoice_no_3.checked) { header.push(this.shpAdvDetails.invoice_no_3.name) }
    if (this.shpAdvDetails.invoice_date_3.checked) { header.push(this.shpAdvDetails.invoice_date_3.name) }
    if (this.shpAdvDetails.mode3.checked) { header.push(this.shpAdvDetails.mode3.name) }
    if (this.shpAdvDetails.from3.checked) { header.push(this.shpAdvDetails.from3.name) }
    if (this.shpAdvDetails.vessel3.checked) { header.push(this.shpAdvDetails.vessel3.name) }
    if (this.shpAdvDetails.awb_bi_no_3.checked) { header.push(this.shpAdvDetails.awb_bi_no_3.name) }
    if (this.shpAdvDetails.etd3.checked) { header.push(this.shpAdvDetails.etd3.name) }
    if (this.shpAdvDetails.eta3.checked) { header.push(this.shpAdvDetails.eta3.name) }
    if (this.shpAdvDetails.eway_bill_rqd.checked) { header.push(this.shpAdvDetails.eway_bill_rqd.name) }
    if (this.shpAdvDetails.eway_bill_no.checked) { header.push(this.shpAdvDetails.eway_bill_no.name) }

    //Sales Admin Details
    if (this.salesAdminDetails.remarks.checked) { header.push(this.salesAdminDetails.remarks.name) }
    if (this.salesAdminDetails.com_month.checked) { header.push(this.salesAdminDetails.com_month.name) }
    if (this.salesAdminDetails.checked_on.checked) { header.push(this.salesAdminDetails.checked_on.name) }
    if (this.salesAdminDetails.next_check.checked) { header.push(this.salesAdminDetails.next_check.name) }
    if (this.salesAdminDetails.for.checked) { header.push(this.salesAdminDetails.for.name) }
    if (this.salesAdminDetails.payment_status.checked) { header.push(this.salesAdminDetails.payment_status.name) }
    if (this.salesAdminDetails.delivery_status.checked) { header.push(this.salesAdminDetails.delivery_status.name) }

    if (this.sub_data.job_no.checked) { header.push(this.sub_data.job_no.name) }
    if (this.sub_data.prd_ord_date.checked) { header.push(this.sub_data.prd_ord_date.name) }
    if (this.sub_data.oc_no.checked) { header.push(this.sub_data.oc_no.name) }
    if (this.sub_data.oc_date.checked) { header.push(this.sub_data.oc_date.name) }
    // if (this.sub_data.del_sts.checked) { header.push(this.sub_data.del_sts.name) }
    if (this.sub_data.exf1_date.checked) { header.push(this.sub_data.exf1_date.name) }
    if (this.sub_data.exf1_sts.checked) { header.push(this.sub_data.exf1_sts.name) }
    if (this.sub_data.exf1_annc_date.checked) { header.push(this.sub_data.exf1_annc_date.name) }
    if (this.sub_data.exf2_date.checked) { header.push(this.sub_data.exf2_date.name) }
    if (this.sub_data.exf2_sts.checked) { header.push(this.sub_data.exf2_sts.name) }
    if (this.sub_data.exf2_annc_date.checked) { header.push(this.sub_data.exf2_annc_date.name) }
    if (this.sub_data.exf3_date.checked) { header.push(this.sub_data.exf3_date.name) }
    if (this.sub_data.exf3_sts.checked) { header.push(this.sub_data.exf3_sts.name) }
    if (this.sub_data.exf3_annc_date.checked) { header.push(this.sub_data.exf3_annc_date.name) }
    if (this.sub_data.abg_request_anct_date.checked) { header.push(this.sub_data.abg_request_anct_date.name) }
    if (this.sub_data.abg_issuance_date.checked) { header.push(this.sub_data.abg_issuance_date.name) }
    if (this.sub_data.abg_final_submission_draft_date.checked) { header.push(this.sub_data.abg_final_submission_draft_date.name) }
    if (this.sub_data.abg_final_submission_bg_date.checked) { header.push(this.sub_data.abg_final_submission_bg_date.name) }
    if (this.sub_data.pbg_request_anct_date.checked) { header.push(this.sub_data.pbg_request_anct_date.name) }
    if (this.sub_data.pbg_issuance_date.checked) { header.push(this.sub_data.pbg_issuance_date.name) }
    if (this.sub_data.pbg_final_submission_draft_date.checked) { header.push(this.sub_data.pbg_final_submission_draft_date.name) }
    if (this.sub_data.pbg_final_submission_bg_date.checked) { header.push(this.sub_data.pbg_final_submission_bg_date.name) }
    this.indentHeader = header;  // passing the whole selected headers to indent Header array
    this.generalDetailColumn = i;
    for (let r of this.InstanceList) {
      row = [];
      row.push(r.indent_sheet_num) 
      row.push(r.indent_issue_date) 
      if (this.generalDetails.crm_opt_no.checked) { row.push(r.crm_opt_num) }
      if (this.generalDetails.contract_account_name.checked){ row.push(r.contract_acnt_name)}
      if (this.generalDetails.sos_summary.checked) { row.push(r.sos_summary) }
      if (this.generalDetails.sales1_id.checked) { row.push(r.sales1_id) }
      if (this.generalDetails.sales1_name.checked) { row.push(r.sales1_name) }
      if (this.generalDetails.sales2_id.checked) { row.push(r.sales2_id) }
      if (this.generalDetails.sales2_name.checked) { row.push(r.sales2_name) }
      if (this.generalDetails.order_type.checked) { row.push(r.order_type) }
      //po details
      if (this.poDetails.customer_po_no.checked) { row.push(r.customer_po_num) }
      if (this.poDetails.customer_po_date.checked) { row.push(r.customer_po_date) }
      //Account Details
      // if (this.accountDetails.cntr_account_name.checked) { row.push(r.contract_acnt_name) }
      if (this.accountDetails.cntr_code.checked) { row.push(r.cntr_code) }
      if (this.accountDetails.cntr_country.checked) { row.push(r.cntr_country) }
      if (this.accountDetails.cntr_address.checked) { row.push(r.cntr_address) }
      if (this.accountDetails.cntr_tel.checked) { row.push(r.cntr_tel) }
      if (this.accountDetails.cntr_gst_in.checked) { row.push(r.cntr_gst_code) }
      if (this.accountDetails.cntr_contact.checked) { row.push(r.cntr_contact_person) }
      if (this.accountDetails.cntr_email.checked) { row.push(r.cntr_email) }
      if (this.accountDetails.user_account_name.checked) { row.push(r.user_acnt_name) }
      if (this.accountDetails.ua_code.checked) { row.push(r.ua_code) }
      if (this.accountDetails.ua_country.checked) { row.push(r.ua_country) }
      if (this.accountDetails.ua_address.checked) { row.push(r.ua_address) }
      if (this.accountDetails.ua_tel.checked) { row.push(r.ua_tel) }
      if (this.accountDetails.ua_gst_in.checked) { row.push(r.ua_gst_code) }
      if (this.accountDetails.ua_contact.checked) { row.push(r.ua_contact_person) }
      if (this.accountDetails.ua_email.checked) { row.push(r.ua_email) }
      if (this.accountDetails.key_account_flag.checked) { row.push(r.key_account_flag) }
      //PO Details
      if (this.poDetails.sp_currency.checked) { row.push(r.sp_cur) }
      if (this.poDetails.list_price_total.checked) { row.push(r.lp_total) }
      if (this.poDetails.selling_price_total.checked) { row.push(r.sp_total) }
      if (this.poDetails.pck_n_fwd.checked) { row.push(r.pck_and_fwd_amnt) }
      if (this.poDetails.dmst_frt.checked) { row.push(r.domestic_freight_amnt) }
      // convert to percentage if exist.
      if (this.poDetails.sgst_percentage.checked) {
        if (r.sgst_pc) {
          if (r.sgst_pc.toString() == "NA") {   // if it has NaN 
            row.push("")
          }
          else {
            row.push((+r.sgst_pc * 100).toString().concat("%"))
          }
        }
        else {
          row.push(r.sgst_pc)
        }
      }
      if (this.poDetails.sgst_amount.checked) { row.push(r.sgst_amount) }
      //converting into percentage.
      if (this.poDetails.cgst_percentage.checked) {   // if it has NaN
        if (r.cgst_pc) {
          if (r.cgst_pc.toString() == "NA") {
            row.push("")
          }
          else {
            row.push((+r.cgst_pc * 100).toString().concat("%"))
          }
        }
        else {
          row.push(r.cgst_pc)
        }
      }
      if (this.poDetails.cgst_amount.checked) { row.push(r.cgst_amount) }
      // converting into percentage.
      if (this.poDetails.igst_percentage.checked) {
        if (r.igst_pc) {
          if (r.igst_pc.toString() == "NA") {
            row.push("")
          }
          else {
            row.push((+r.igst_pc * 100).toString().concat("%"))
          }
        }
        else {
          row.push(r.igst_pc)
        }
      }
      if (this.poDetails.igst_amount.checked) { row.push(r.igst_amount) }
      if (this.poDetails.inst_com.checked) { row.push(r.inst_com_amnt) }
      if (this.poDetails.tp_currency.checked) { row.push(r.tp_cur) }
      if (this.poDetails.transfer_price_1.checked) { row.push(r.tp1) }
      if (this.poDetails.transfer_price_2.checked) { row.push(r.tp2) }
      if (this.poDetails.iigm_inr.checked) { row.push(r.iigm) }
      if (this.paymentDetails.payment_terms.checked) { row.push(r.pmt_trms) }

      //Payment Details
      if (this.paymentDetails.adv_type.checked) { row.push(r.adv_type) }
      // converting into percentage.
      if (this.paymentDetails.adv_percent.checked) {
        if (r.adv_pc) {
          if (r.adv_pc.toString() == "NA") {
            row.push("")
          }
          else {
            row.push((+r.adv_pc * 100).toString().concat("%"))
          }
        }
        else {
          row.push(r.adv_pc)
        }
      }
      if (this.paymentDetails.adv_amount.checked) { row.push(r.adv_amount) }
      if (this.paymentDetails.adv_date.checked) { row.push(r.adv_date) }
      if (this.paymentDetails.bsh_type.checked) { row.push(r.bsh_type) }
      // converting into percentage.
      if (this.paymentDetails.bsh_percent.checked) {
        if (r.bsh_pc) {
          if (r.bsh_pc.toString() == "NA") {
            row.push("")
          }
          else {
            row.push((+r.bsh_pc * 100).toString().concat("%"))
          }
        }
        else {
          row.push(r.bsh_pc)
        }
      }
      if (this.paymentDetails.bsh_amount.checked) { row.push(r.bsh_amount) }
      if (this.paymentDetails.bsh_date.checked) { row.push(r.bsh_date) }
      if (this.paymentDetails.ash_type.checked) { row.push(r.ash_type) }
      // converting into percentage.
      if (this.paymentDetails.ash_percent.checked) {
        if (r.ash_pc) {
          if (r.ash_pc.toString() == "NA") {
            row.push("")
          }
          else {
            row.push((+r.ash_pc * 100).toString().concat("%"))
          }
        }
        else {
          row.push(r.ash_pc)
        }
      }
      if (this.paymentDetails.ash_amount.checked) { row.push(r.ash_amount) }
      if (this.paymentDetails.ash_date.checked) { row.push(r.ash_date) }


      //Third Party Commision Details
      if (this.comDetails.tp_com_currency.checked) { row.push(r.thirdp_com_cur) }
      if (this.comDetails.tp_com_amount.checked) { row.push(r.thirdp_com_amnt) }
      if (this.comDetails.tp_com_paid.checked) { row.push(r.thirdp_com_paid_by) }
      if (this.comDetails.tp_com_acnt_name.checked) { row.push(r.com_acnt_name) }
      if (this.comDetails.com_code.checked) { row.push(r.com_code) }
      if (this.comDetails.com_country.checked) { row.push(r.com_country) }
      if (this.comDetails.com_acnt_address.checked) { row.push(r.com_address) }
      if (this.comDetails.com_tel.checked) { row.push(r.com_tel) }
      if (this.comDetails.com_gst_in.checked) { row.push(r.com_gst_code) }
      if (this.comDetails.com_contact.checked) { row.push(r.com_contact_person) }
      if (this.comDetails.com_email.checked) { row.push(r.com_email) }

      //Application Details
      if (this.applicationDetails.customer_app_code.checked) { row.push(r.csutomer_application_code) }
      if (this.applicationDetails.application_type.checked) { row.push(r.customer_application_type) }
      if (this.applicationDetails.customer_app_desc.checked) { row.push(r.customer_app_desc) }

      //Ship Instance 1 Details
      if (this.shpInst1Details.request_etd_user.checked) { row.push(r.req_etd_by_customer) }
      if (this.shpInst1Details.request_eta_user.checked) { row.push(r.req_eta_by_customer) }
      if (this.shpInst1Details.trade_terms.checked) { row.push(r.trd_trms_with_customer) }
      if (this.shpInst1Details.dest_port.checked) { row.push(r.dest_port_by_customer) }
      if (this.shpInst1Details.mot.checked) { row.push(r.mot) }
      if (this.shpInst1Details.freight.checked) { row.push(r.freight1) }
      if (this.shpInst1Details.request_etd_factory.checked) { row.push(r.req_etd_to_ij) }
      if (this.shpInst1Details.request_eta_factory.checked) { row.push(r.req_eta_to_ij) }
      if (this.shpInst1Details.trade_terms_factory.checked) { row.push(r.trd_trms_with_ij) }
      if (this.shpInst1Details.dest_port_factory.checked) { row.push(r.dest_port_to_ij) }
      if (this.shpInst1Details.mot_to_factory.checked) { row.push(r.mot_to_ij) }
      if (this.shpInst1Details.freight_to_factory.checked) { row.push(r.freight2) }
      if (this.shpInst1Details.coo.checked) { row.push(r.coo) }
      if (this.shpInst1Details.epa.checked) { row.push(r.epa) }
      if (this.shpInst1Details.ip.checked) { row.push(r.ip) }
      if (this.shpInst1Details.free_dtnt_prd.checked) { row.push(r.free_detention_period) }

      //Ship Instance 2 Details
      if (this.shpInst2Details.cns_account_name.checked) { row.push(r.consignee_acnt_name) }
      if (this.shpInst2Details.cns_code.checked) { row.push(r.cns_code) }
      if (this.shpInst2Details.cns_country.checked) { row.push(r.cns_country) }
      if (this.shpInst2Details.cns_address.checked) { row.push(r.cns_address) }
      if (this.shpInst2Details.cns_tel.checked) { row.push(r.cns_tel) }
      if (this.shpInst2Details.cns_gst_in.checked) { row.push(r.cns_gst_code) }
      if (this.shpInst2Details.cns_contact.checked) { row.push(r.cns_contact_person) }
      if (this.shpInst2Details.cns_email.checked) { row.push(r.cns_email) }
      if (this.shpInst2Details.cns_iec_code.checked) { row.push(r.cns_iec_code) }
      if (this.shpInst2Details.bank_name.checked) { row.push(r.bank_name_on_cad) }
      if (this.shpInst2Details.bank_address.checked) { row.push(r.address) }
      if (this.shpInst2Details.bank_tel.checked) { row.push(r.tel) }
      if (this.shpInst2Details.ntf_acc_name.checked) { row.push(r.notify_acnt_name) }
      if (this.shpInst2Details.ntf_code.checked) { row.push(r.ntf_code) }
      if (this.shpInst2Details.ntf_country.checked) { row.push(r.ntf_country) }
      if (this.shpInst2Details.ntf_address.checked) { row.push(r.ntf_address) }
      if (this.shpInst2Details.ntf_tel.checked) { row.push(r.ntf_tel) }
      if (this.shpInst2Details.ntf_gst_in.checked) { row.push(r.ntf_gst_code) }
      if (this.shpInst2Details.ntf_contact.checked) { row.push(r.ntf_contact_person) }
      if (this.shpInst2Details.ntf_email.checked) { row.push(r.ntf_email) }

      //Indent Remakrs Details
      if (this.indRemarksDetails.production_start.checked) { row.push(r.production_start) }
      if (this.indRemarksDetails.customer_po_sheet.checked) { row.push(r.oth_customer_po_sheet) }
      if (this.indRemarksDetails.customer_sr_sheet.checked) { row.push(r.oth_sr_spec_sheet) }
      if (this.indRemarksDetails.drawing.checked) { row.push(r.oth_drawing) }
      if (this.indRemarksDetails.test_report.checked) { row.push(r.oth_test_report) }
      if (this.indRemarksDetails.customer_pi.checked) { row.push(r.oth_pi) }
      if (this.indRemarksDetails.lc_draft.checked) { row.push(r.oth_lc_draft) }
      if (this.indRemarksDetails.oth_doc1.checked) { row.push(r.oth_doc1) }
      if (this.indRemarksDetails.oth_doc2.checked) { row.push(r.oth_doc2) }
      if (this.indRemarksDetails.remarks.checked) { row.push(r.remarks1) }

      //Proforma Invoice Details
      if (this.piDetails.pi_no.checked) { row.push(r.pi_no) }
      if (this.piDetails.pi_date.checked) { row.push(r.pi_date) }
      if (this.piDetails.iipo_no.checked) { row.push(r.iipo_no) }
      if (this.piDetails.iipo_date.checked) { row.push(r.iipo_date) }
      if (this.piDetails.ij_project_no.checked) { row.push(r.ij_project_num) }
      if (this.piDetails.oc_date.checked) { row.push(r.oc_date) }
      if (this.piDetails.sa_date.checked) { row.push(r.sa_date) }

      //LC Details 
      if (this.lcDetails.lc_check_date.checked) { row.push(r.lc_chk_date_by_ij) }
      if (this.lcDetails.lc_open_date.checked) { row.push(r.lc_open_date) }
      if (this.lcDetails.lc_last_rev_date.checked) { row.push(r.lc_last_revision_date) }
      if (this.lcDetails.lc_shp_date.checked) { row.push(r.latest_shipment_date) }
      if (this.lcDetails.lc_expiry_date.checked) { row.push(r.lc_expiry_date) }

      //EXF Details
      if (this.exfDetails.exf1.checked) { row.push(r.exf1) }
      if (this.exfDetails.exf1_status.checked) { row.push(r.exf1_sts) }
      if (this.exfDetails.exf_ij_annt1.checked) { row.push(r.exf_ij_accment1) }
      if (this.exfDetails.exf2.checked) { row.push(r.exf2) }
      if (this.exfDetails.exf2_status.checked) { row.push(r.exf2_sts) }
      if (this.exfDetails.exf_ij_annt2.checked) { row.push(r.exf_ij_accment2) }
      if (this.exfDetails.exf3.checked) { row.push(r.exf3) }
      if (this.exfDetails.exf3_status.checked) { row.push(r.exf3_sts) }
      if (this.exfDetails.exf_ij_annt3.checked) { row.push(r.exf_ij_accment3) }

      //Ship Instance 2 FOB Fowarder detail
      if (this.shpInst2Details.fob_fowarder.checked) { row.push(r.fob_fowarder) }

      //ShpAdv Details
      if (this.shpAdvDetails.invoice_no_1.checked) { row.push(r.invoice_no1) }
      if (this.shpAdvDetails.invoice_date_1.checked) { row.push(r.invoice_date1) }
      if (this.shpAdvDetails.mode1.checked) { row.push(r.mode1) }
      if (this.shpAdvDetails.from1.checked) { row.push(r.from1) }
      if (this.shpAdvDetails.vessel1.checked) { row.push(r.vessel1) }
      if (this.shpAdvDetails.awb_bi_no_1.checked) { row.push(r.awb_bl_no1) }
      if (this.shpAdvDetails.etd1.checked) { row.push(r.etd1) }
      if (this.shpAdvDetails.eta1.checked) { row.push(r.eta1) }
      if (this.shpAdvDetails.invoice_no_2.checked) { row.push(r.invoice_no2) }
      if (this.shpAdvDetails.invoice_date_2.checked) { row.push(r.invoice_date2) }
      if (this.shpAdvDetails.mode2.checked) { row.push(r.mode2) }
      if (this.shpAdvDetails.from2.checked) { row.push(r.from2) }
      if (this.shpAdvDetails.vessel2.checked) { row.push(r.vessel2) }
      if (this.shpAdvDetails.awb_bi_no_2.checked) { row.push(r.awb_bl_no2) }
      if (this.shpAdvDetails.etd2.checked) { row.push(r.etd2) }
      if (this.shpAdvDetails.eta2.checked) { row.push(r.eta2) }
      if (this.shpAdvDetails.invoice_no_3.checked) { row.push(r.invoice_no3) }
      if (this.shpAdvDetails.invoice_date_3.checked) { row.push(r.invoice_date3) }
      if (this.shpAdvDetails.mode3.checked) { row.push(r.mode3) }
      if (this.shpAdvDetails.from3.checked) { row.push(r.from3) }
      if (this.shpAdvDetails.vessel3.checked) { row.push(r.vessel3) }
      if (this.shpAdvDetails.awb_bi_no_3.checked) { row.push(r.awb_bl_no3) }
      if (this.shpAdvDetails.etd3.checked) { row.push(r.etd3) }
      if (this.shpAdvDetails.eta3.checked) { row.push(r.eta3) }
      if (this.shpAdvDetails.eway_bill_rqd.checked) { row.push(r.eway_bill_req) }
      if (this.shpAdvDetails.eway_bill_no.checked) { row.push(r.eway_bill_num) }

      //Sales Admin Details
      if (this.salesAdminDetails.remarks.checked) { row.push(r.remarks2) }
      if (this.salesAdminDetails.com_month.checked) { row.push(r.com_month) }
      if (this.salesAdminDetails.checked_on.checked) { row.push(r.checked_on) }
      if (this.salesAdminDetails.next_check.checked) { row.push(r.next_check) }
      if (this.salesAdminDetails.for.checked) { row.push(r.for_info) }
      if (this.salesAdminDetails.payment_status.checked) { row.push(r.pmt_sts) }
      if (this.salesAdminDetails.delivery_status.checked) { row.push(r.del_sts) }

      if (this.sub_data.job_no.checked) { row.push(r.job_no) }
      if (this.sub_data.prd_ord_date.checked) { row.push(r.prd_ord_date) }
      if (this.sub_data.oc_no.checked) { row.push(r.oc_no) }
      if (this.sub_data.oc_date.checked) { row.push(r.s_oc_date) }
      // if (this.sub_data.del_sts.checked) { row.push(r.s_del_sts) }
      if (this.sub_data.exf1_date.checked) { row.push(r.exf1_date) }
      if (this.sub_data.exf1_sts.checked) { row.push(r.s_exf1_sts) }
      if (this.sub_data.exf1_annc_date.checked) { row.push(r.exf1_annc_date) }
      if (this.sub_data.exf2_date.checked) { row.push(r.exf2_date) }
      if (this.sub_data.exf2_sts.checked) { row.push(r.s_exf2_sts) }
      if (this.sub_data.exf2_annc_date.checked) { row.push(r.exf2_annc_date) }
      if (this.sub_data.exf3_date.checked) { row.push(r.exf3_date) }
      if (this.sub_data.exf3_sts.checked) { row.push(r.s_exf3_sts) }
      if (this.sub_data.exf3_annc_date.checked) { row.push(r.exf3_annc_date) }
      if (this.sub_data.abg_request_anct_date.checked) { row.push(r.abg_request_anct_date) }
      if (this.sub_data.abg_issuance_date.checked) { row.push(r.abg_issuance_date) }
      if (this.sub_data.abg_final_submission_draft_date.checked) { row.push(r.abg_final_submission_draft_date) }
      if (this.sub_data.abg_final_submission_bg_date.checked) { row.push(r.abg_final_submission_bg_date) }
      if (this.sub_data.pbg_request_anct_date.checked) { row.push(r.pbg_request_anct_date) }
      if (this.sub_data.pbg_issuance_date.checked) { row.push(r.pbg_issuance_date) }
      if (this.sub_data.pbg_final_submission_draft_date.checked) { row.push(r.pbg_final_submission_draft_date) }
      if (this.sub_data.pbg_final_submission_bg_date.checked) { row.push(r.pbg_final_submission_bg_date) }
      this.indentBody.push(row);

      this.setOnePageRowList();
    }
    this.newIndentBody = this.indentBody

    if (this.selectedOutputFilter === true) {
      this.globalSearchKeyUp();
      this.selectedOutputFilter = false;
    }


    this.resetPageListButtonsParameters();
  }



  globalSearchKeyUp() {
    let newItems = [];
    if (this.searchText.length == 0) {
      this.indentBody = this.newIndentBody
      this.resetPageListButtonsParameters();
      return this.indentBody;
    }
    this.indentBody = [];
    for (let item of this.newIndentBody) {
      for (let i of item) {
        if (i != null && this.searchText != null) {
          if (i.toString().toLowerCase().includes(this.searchText.toString().trim().toLowerCase())) {
            newItems.push(item);
            break;
          }
        }
      }
    }

    this.indentBody = newItems;
    this.resetPageListButtonsParameters();
    return;
  }


  outputFilterApply() {
    this.selectedOutputFilter = true;
    if(this.pmtField){
      this.createPaymentArray();
    }
    else if(this.invField){
      this.createInvoiceArray();
    }
    else{
      this.createIndentArray();
    }
  }

  outputFilterCancel() {
    this.generalDetails = this.oldGeneralDetails;
    this.poDetails = this.oldPoDetails;
    this.accountDetails = this.oldAccountDetails;
    this.paymentDetails = this.oldPaymentDetails;
    this.comDetails = this.oldCommDetails;
    this.applicationDetails = this.oldApplicationDetails;
    this.shpInst1Details = this.oldShpInst1Details;
    this.shpInst2Details = this.oldShpInst2Details;
    this.indRemarksDetails = this.oldIndRemarksDetails;
    this.piDetails = this.oldPiDetails;
    this.lcDetails = this.oldLcDetails;
    this.exfDetails = this.oldExfDetails;
    this.shpAdvDetails = this.oldShpAdvDetails;
    this.salesAdminDetails = this.oldSalesAdminDetails;
    this.allSet.set1 = this.oldAllset1;
    this.allSet.set2 = this.oldAllset2;
    this.allSet.set3 = this.oldAllset3;
    this.allSet.set4 = this.oldAllset4;
    this.allSet.set5 = this.oldAllset5;
    this.allSet.set6 = this.oldAllset6;
    this.allSet.set7 = this.oldAllset7;
    this.allSet.set8 = this.oldAllset8;
    this.allSet.set9 = this.oldAllset9;
    this.allSet.set10 = this.oldAllset10;
    this.allSet.set11 = this.oldAllset11;
    this.allSet.set12 = this.oldAllset12;
    this.allSet.set13 = this.oldAllset13;
    this.allSet.set14 = this.oldAllset14;
  }

  oldGeneralDetails;
  oldPoDetails;
  oldAccountDetails;
  oldPaymentDetails;
  oldCommDetails;
  oldApplicationDetails;
  oldShpInst1Details;
  oldShpInst2Details;
  oldIndRemarksDetails;
  oldPiDetails;
  oldLcDetails;
  oldExfDetails;
  oldShpAdvDetails;
  oldSalesAdminDetails;
  oldAllset1;
  oldAllset2;
  oldAllset3;
  oldAllset4;
  oldAllset5;
  oldAllset6;
  oldAllset7;
  oldAllset8;
  oldAllset9;
  oldAllset10;
  oldAllset11;
  oldAllset12;
  oldAllset13;
  oldAllset14;
  openModel() {
    this.show = false;
    this.showAll = true;
    this.optionId = 0;
    this.oldGeneralDetails = JSON.parse(JSON.stringify(this.generalDetails));
    this.oldPoDetails = JSON.parse(JSON.stringify(this.poDetails));
    this.oldAccountDetails = JSON.parse(JSON.stringify(this.accountDetails));
    this.oldPaymentDetails = JSON.parse(JSON.stringify(this.paymentDetails));
    this.oldCommDetails = JSON.parse(JSON.stringify(this.comDetails));
    this.oldApplicationDetails = JSON.parse(JSON.stringify(this.applicationDetails));
    this.oldShpInst1Details = JSON.parse(JSON.stringify(this.shpInst1Details));
    this.oldShpInst2Details = JSON.parse(JSON.stringify(this.shpInst2Details));
    this.oldIndRemarksDetails = JSON.parse(JSON.stringify(this.indRemarksDetails));
    this.oldPiDetails = JSON.parse(JSON.stringify(this.piDetails));
    this.oldLcDetails = JSON.parse(JSON.stringify(this.lcDetails));
    this.oldExfDetails = JSON.parse(JSON.stringify(this.exfDetails));
    this.oldShpAdvDetails = JSON.parse(JSON.stringify(this.shpAdvDetails));
    this.oldSalesAdminDetails = JSON.parse(JSON.stringify(this.salesAdminDetails));
    this.oldAllset1 = JSON.parse(JSON.stringify(this.allSet.set1));
    this.oldAllset2 = JSON.parse(JSON.stringify(this.allSet.set2));
    this.oldAllset3 = JSON.parse(JSON.stringify(this.allSet.set3));
    this.oldAllset4 = JSON.parse(JSON.stringify(this.allSet.set4));
    this.oldAllset5 = JSON.parse(JSON.stringify(this.allSet.set5));
    this.oldAllset6 = JSON.parse(JSON.stringify(this.allSet.set6));
    this.oldAllset7 = JSON.parse(JSON.stringify(this.allSet.set7));
    this.oldAllset8 = JSON.parse(JSON.stringify(this.allSet.set8));
    this.oldAllset9 = JSON.parse(JSON.stringify(this.allSet.set9));
    this.oldAllset10 = JSON.parse(JSON.stringify(this.allSet.set10));
    this.oldAllset11 = JSON.parse(JSON.stringify(this.allSet.set11));
    this.oldAllset12 = JSON.parse(JSON.stringify(this.allSet.set12));
    this.oldAllset13 = JSON.parse(JSON.stringify(this.allSet.set13));
    this.oldAllset14 = JSON.parse(JSON.stringify(this.allSet.set14));
  }

  resetOutputFilter() {
    this.resetListParam();
    this.indField = true;
    this.allOptionOff(true, true);
  }


  // when user want to move to next page. 
  nextPage() {
    if (this.nextButtonDisabled()) {
      return;
    }
    this.startIndex = this.startIndex + this.onePageRow;
    if (this.endIndex + this.onePageRow < this.indentBody.length) {
      this.endIndex += this.onePageRow;
    }
    else {
      this.endIndex = this.endIndex + (this.indentBody.length - this.startIndex);
      this.endPageButtonDisabled = false;
    }
    this.selectedPage++;
    this.generatePageListButtons();
  }

  // check if next button should be disabled or not.
  nextButtonDisabled() {
    if (this.endIndex >= this.indentBody.length - 1) {
      return true;
    }
  }

  // when user want to move to previous page.
  prevPage() {
    if (this.prevButtonDisabled()) {
      return;
    }
    if (this.endIndex >= this.indentBody.length - 1) {
      this.endIndex = this.endIndex - (this.indentBody.length - this.startIndex);
    }
    else {
      this.endIndex -= this.onePageRow;
    }
    this.startIndex -= this.onePageRow;
    this.selectedPage--;
    this.generatePageListButtons();
  }

  // check if previous button should be disabled or not. 
  prevButtonDisabled() {
    if (this.startIndex <= 0) {
      return true;
    }
  }

  // this will generate pageList for pagination
  generatePageListButtons() {
    let totalIndents = this.indentBody.length;
    this.pages = Math.ceil(totalIndents / this.onePageRow);
    // if there are pages less than or equal to number of buttons
    if (this.pages <= this.maxNumberOfPagesButton) {
      this.pageList = [];
      for (let i = 1; i <= this.pages; i++) {
        this.pageList.push(i);
      }
      this.endPageButtonDisabled = false;
      this.startPageButtonDisabled = false;
    }
    // if there are more.
    else {
      if (this.selectedPage <= 3) {
        this.pageList = [];
        // starting pagelist.  1,2,3,4,..
        this.startPageButtonDisabled = false;
        this.endPageButtonDisabled = true;
        this.pageList.push(1);
        this.pageList.push(2);
        this.pageList.push(3);
        this.pageList.push(4);
      }
      else {
        // greater than 3 but not at the last. 
        //     .. , selected-1, selected, selected+1, ..
        if (this.selectedPage > 3 && (this.selectedPage + 2 < this.pages)) {
          this.pageList = [];
          this.startPageButtonDisabled = true;
          this.endPageButtonDisabled = true;
          this.pageList.push(this.selectedPage - 1);
          this.pageList.push(this.selectedPage);
          this.pageList.push(this.selectedPage + 1);
        }
        // greater than 3 but at the last. 
        //   .., last-3,last-2,last-1,last 
        if (this.selectedPage > 3 && this.selectedPage + 2 >= this.pages) {
          this.pageList = [];
          this.startPageButtonDisabled = true;
          this.endPageButtonDisabled = false;
          this.pageList.push(this.pages - 3);
          this.pageList.push(this.pages - 2);
          this.pageList.push(this.pages - 1);
          this.pageList.push(this.pages);
        }
      }
    }

  }

  // when select any pagination button other than previous and next button
  pageSelectButton(pageNum) {
    this.selectedPage = pageNum;
    if (pageNum == 1) {
      this.startIndex = 0;
      this.endIndex = this.onePageRow - 1;
    }
    else {
      this.startIndex = (pageNum - 1) * this.onePageRow;
      this.endIndex = (pageNum - 1) * this.onePageRow - 1;
      if (this.endIndex + this.onePageRow < this.indentBody.length) {
        this.endIndex += this.onePageRow;
      }
      else {
        this.endIndex = this.endIndex + (this.indentBody.length - this.startIndex);
        this.endPageButtonDisabled = false;
      }
    }
    this.generatePageListButtons()
  }

  // resetting pageList attributes or parameters.
  resetPageListButtonsParameters() {
    this.startIndex = 0;
    if (this.selectPagesForm.value.pages == 'ALL') {
      this.onePageRow = this.indentBody.length;
    }
    else {
      this.onePageRow = +this.selectPagesForm.value.pages;
    }
    if (this.onePageRow >= this.indentBody.length - 1) {
      this.endIndex = this.indentBody.length - 1;
    }
    else {
      this.endIndex = this.onePageRow - 1;
    }
    // this.endIndex= this.onePageRow-1;
    this.startPageButtonDisabled = false;
    this.endPageButtonDisabled = true;
    this.selectedPage = 1;
    this.pageList = [];
    this.generatePageListButtons();
  }


  setAllSetCheckbox(state) {
    let id = this.optionId;
    switch (id) {
      case 1:
        if (state == false) {
          this.allSet.set1 = false;
        }
        else {
          if (this.generalDetails.indent_sheet_no.checked &&
            this.generalDetails.indent_issue_date.checked &&
            this.generalDetails.sos_summary.checked &&
            this.generalDetails.contract_account_name.checked &&
            this.generalDetails.crm_opt_no.checked &&
            this.generalDetails.order_type.checked &&
            this.generalDetails.sales1_name.checked &&
            this.generalDetails.sales2_name.checked &&
            this.generalDetails.sales1_id.checked &&
            this.generalDetails.sales2_id.checked) {
            this.allSet.set1 = true;
          }
        }
        break;
      case 2:
        if (state == false) {
          this.allSet.set2 = false;
        }
        else {
          if (this.poDetails.customer_po_date.checked &&
            this.poDetails.customer_po_no.checked &&
            this.poDetails.sp_currency.checked &&
            this.poDetails.tp_currency.checked &&
            this.poDetails.list_price_total.checked &&
            this.poDetails.selling_price_total.checked &&
            this.poDetails.transfer_price_1.checked &&
            this.poDetails.transfer_price_2.checked &&
            this.poDetails.iigm_inr.checked &&
            // this.poDetails.payment_term.checked &&
            this.poDetails.pck_n_fwd.checked &&
            this.poDetails.dmst_frt.checked &&
            this.poDetails.inst_com.checked &&
            this.poDetails.sgst_amount.checked &&
            this.poDetails.sgst_percentage.checked &&
            this.poDetails.cgst_amount.checked &&
            this.poDetails.cgst_percentage.checked &&
            this.poDetails.igst_amount.checked &&
            this.poDetails.igst_percentage.checked) {
            this.allSet.set2 = true;
          }
        }
        break;
      case 3:
        if (state == false) {
          this.allSet.set3 = false;
        }
        else {
          if (
            this.accountDetails.cntr_address.checked &&
            this.accountDetails.cntr_contact.checked &&
            this.accountDetails.cntr_email.checked &&
            this.accountDetails.cntr_country.checked &&
            this.accountDetails.cntr_code.checked &&
            this.accountDetails.cntr_gst_in.checked &&
            this.accountDetails.cntr_tel.checked &&
            this.accountDetails.user_account_name.checked &&
            this.accountDetails.ua_address.checked &&
            this.accountDetails.ua_contact.checked &&
            this.accountDetails.ua_email.checked &&
            this.accountDetails.ua_code.checked &&
            this.accountDetails.ua_country.checked &&
            this.accountDetails.ua_gst_in.checked &&
            this.accountDetails.ua_tel.checked &&
            this.accountDetails.key_account_flag.checked) {
            this.allSet.set3 = true;
          }
        }
        break;
      case 4:
        if (state == false) {
          this.allSet.set4 = false;
        }
        else {
          if (this.paymentDetails.payment_terms.checked &&
            this.paymentDetails.adv_type.checked &&
            this.paymentDetails.adv_percent.checked &&
            this.paymentDetails.adv_amount.checked &&
            this.paymentDetails.bsh_type.checked &&
            this.paymentDetails.bsh_percent.checked &&
            this.paymentDetails.bsh_amount.checked &&
            this.paymentDetails.ash_type.checked &&
            this.paymentDetails.ash_percent.checked &&
            this.paymentDetails.ash_amount.checked &&
            this.paymentDetails.ash_date.checked &&
            this.paymentDetails.adv_date.checked &&
            this.paymentDetails.bsh_date.checked) {
            this.allSet.set4 = true;
          }
        }
        break;
      case 5:
        if (state == false) {
          this.allSet.set5 = false;
        }
        else {
          if (this.comDetails.tp_com_currency.checked &&
            this.comDetails.tp_com_amount.checked &&
            this.comDetails.tp_com_paid.checked &&
            this.comDetails.tp_com_acnt_name.checked &&
            this.comDetails.com_acnt_address.checked &&
            this.comDetails.com_contact.checked &&
            this.comDetails.com_email.checked &&
            this.comDetails.com_contact.checked &&
            this.comDetails.com_country.checked &&
            this.comDetails.com_gst_in.checked &&
            this.comDetails.com_tel.checked &&
            this.comDetails.com_code.checked) {
            this.allSet.set5 = true;
          }
        }
        break;
      case 6:
        if (state == false) {
          this.allSet.set6 = false;
        }
        else {
          if (this.applicationDetails.customer_app_code.checked &&
            this.applicationDetails.application_type.checked &&
            this.applicationDetails.customer_app_desc.checked) {
            this.allSet.set6 = true;
          }
        }
        break;
      case 7:
        if (state == false) {
          this.allSet.set7 = false;
        }
        else {
          if (this.shpInst1Details.request_etd_user.checked &&
            this.shpInst1Details.request_eta_user.checked &&
            this.shpInst1Details.request_etd_factory.checked &&
            this.shpInst1Details.request_eta_factory.checked &&
            this.shpInst1Details.trade_terms.checked &&
            this.shpInst1Details.trade_terms_factory.checked &&
            this.shpInst1Details.dest_port.checked &&
            this.shpInst1Details.dest_port_factory.checked &&
            this.shpInst1Details.mot.checked &&
            this.shpInst1Details.mot_to_factory.checked &&
            this.shpInst1Details.freight.checked &&
            this.shpInst1Details.freight_to_factory.checked &&
            this.shpInst1Details.coo.checked &&
            this.shpInst1Details.epa.checked &&
            this.shpInst1Details.ip.checked &&
            this.shpInst1Details.free_dtnt_prd.checked) {
            this.allSet.set7 = true;
          }
        }
        break;
      case 8:
        if (state == false) {
          this.allSet.set8 = false;
        }
        else {
          if (this.shpInst2Details.cns_account_name.checked &&
            this.shpInst2Details.cns_address.checked &&
            this.shpInst2Details.cns_contact.checked &&
            this.shpInst2Details.cns_email.checked &&
            this.shpInst2Details.cns_country.checked &&
            this.shpInst2Details.cns_gst_in.checked &&
            this.shpInst2Details.cns_tel.checked &&
            this.shpInst2Details.cns_iec_code.checked &&
            this.shpInst2Details.bank_name.checked &&
            this.shpInst2Details.bank_tel.checked &&
            this.shpInst2Details.bank_address.checked &&
            this.shpInst2Details.ntf_acc_name.checked &&
            this.shpInst2Details.ntf_address.checked &&
            this.shpInst2Details.ntf_contact.checked &&
            this.shpInst2Details.ntf_email.checked &&
            this.shpInst2Details.ntf_code.checked &&
            this.shpInst2Details.ntf_country.checked &&
            this.shpInst2Details.ntf_gst_in.checked &&
            this.shpInst2Details.ntf_tel.checked &&
            this.shpInst2Details.fob_fowarder.checked &&
            this.shpInst2Details.cns_code.checked) {
            this.allSet.set8 = true;
          }
        }
        break;
      case 9:
        if (state == false) {
          this.allSet.set9 = false;
        }
        else {
          if (this.indRemarksDetails.production_start.checked &&
            this.indRemarksDetails.customer_po_sheet.checked &&
            this.indRemarksDetails.customer_pi.checked &&
            this.indRemarksDetails.customer_sr_sheet.checked &&
            this.indRemarksDetails.drawing.checked &&
            this.indRemarksDetails.test_report.checked &&
            this.indRemarksDetails.lc_draft.checked &&
            this.indRemarksDetails.oth_doc1.checked &&
            this.indRemarksDetails.oth_doc2.checked &&
            this.indRemarksDetails.remarks.checked) {
            this.allSet.set9 = true;
          }
        }
        break;
      case 10:
        if (state == false) {
          this.allSet.set10 = false;
        }
        else {
          if (this.piDetails.pi_no.checked &&
            this.piDetails.pi_date.checked &&
            this.piDetails.iipo_no.checked &&
            this.piDetails.iipo_date.checked &&
            this.piDetails.ij_project_no.checked &&
            this.piDetails.oc_date.checked &&
            this.piDetails.sa_date.checked) {
            this.allSet.set10 = true;
          }
        }
        break;
      case 11:
        if (state == false) {
          this.allSet.set11 = false;
        }
        else {
          if (this.lcDetails.lc_check_date.checked &&
            this.lcDetails.lc_last_rev_date.checked &&
            this.lcDetails.lc_open_date.checked &&
            this.lcDetails.lc_shp_date.checked &&
            this.lcDetails.lc_expiry_date.checked) {
            this.allSet.set11 = true;
          }
        }
        break;
      case 12:
        if (state == false) {
          this.allSet.set12 = false;
        }
        else {
          if (this.exfDetails.exf1.checked &&
            this.exfDetails.exf1_status.checked &&
            this.exfDetails.exf_ij_annt1.checked &&
            this.exfDetails.exf2.checked &&
            this.exfDetails.exf2_status.checked &&
            this.exfDetails.exf_ij_annt2.checked &&
            this.exfDetails.exf3.checked &&
            this.exfDetails.exf3_status.checked &&
            this.exfDetails.exf_ij_annt3.checked) {
            this.allSet.set12 = true;
          }
        }
        break;
      case 13:
        if (state == false) {
          this.allSet.set13 = false;
        }
        else {
          if (this.shpAdvDetails.invoice_no_1.checked &&
            this.shpAdvDetails.invoice_date_1.checked &&
            this.shpAdvDetails.etd1.checked &&
            this.shpAdvDetails.eta1.checked &&
            this.shpAdvDetails.mode1.checked &&
            this.shpAdvDetails.from1.checked &&
            this.shpAdvDetails.vessel1.checked &&
            this.shpAdvDetails.awb_bi_no_1.checked &&
            this.shpAdvDetails.invoice_no_2.checked &&
            this.shpAdvDetails.invoice_date_2.checked &&
            this.shpAdvDetails.etd2.checked &&
            this.shpAdvDetails.eta2.checked &&
            this.shpAdvDetails.mode2.checked &&
            this.shpAdvDetails.from2.checked &&
            this.shpAdvDetails.vessel2.checked &&
            this.shpAdvDetails.awb_bi_no_2.checked &&
            this.shpAdvDetails.invoice_no_3.checked &&
            this.shpAdvDetails.invoice_date_3.checked &&
            this.shpAdvDetails.etd3.checked &&
            this.shpAdvDetails.eta3.checked &&
            this.shpAdvDetails.mode3.checked &&
            this.shpAdvDetails.from3.checked &&
            this.shpAdvDetails.vessel3.checked &&
            this.shpAdvDetails.awb_bi_no_3.checked &&
            this.shpAdvDetails.eway_bill_rqd.checked &&
            this.shpAdvDetails.eway_bill_no.checked) {
            this.allSet.set13 = true;
          }
        }
        break;
      case 14:
        if (state == false) {
          this.allSet.set14 = false;
        }
        else {
          if (this.salesAdminDetails.remarks.checked &&
            this.salesAdminDetails.com_month.checked &&
            this.salesAdminDetails.checked_on.checked &&
            this.salesAdminDetails.for.checked &&
            this.salesAdminDetails.next_check.checked &&
            this.salesAdminDetails.payment_status.checked &&
            this.salesAdminDetails.delivery_status.checked) {
            this.allSet.set14 = true;
          }
        }
        break;
      default:
        break;
    }
  }

  onDoubleClickIndent(indentNo) {
    GlobalConstants.globalIndentDetailIndNo = indentNo
    this.router.navigate(['ii/indentmgmt']);

  }

  changeOnePageRow() {
    this.resetPageListButtonsParameters();
  }

  setOnePageRowList() {
    let totalIndents = this.indentBody.length;
    this.onePageRowList = [];
    if (totalIndents > 20) {
      this.onePageRowList.push(20);
    }
    if (totalIndents > 20 && totalIndents > 50) {
      this.onePageRowList.push(50);
    }
    if (totalIndents > 50 && totalIndents > 100) {
      this.onePageRowList.push(100);
    }
    if (totalIndents > 100 && totalIndents > 500) {
      this.onePageRowList.push(500);
    }
    this.onePageRowList.push('ALL');
  }

  //  the following functions work on tab click and shows their corresponding column only. 
  onClickShowIndList() {
    this.resetListParam();
    this.indField = true;
    this.allOptionOff(true, true);
    this.createIndentArray();
    this.searchText = '';
  }
  onClickShowPiList() {
    this.resetListParam();
    this.piField = true;
    this.allOptionOff(true, false);
    this.generalDetails.sales1_id.checked = false;
    this.generalDetails.sales2_id.checked = false;
    this.piDetails.pi_no.checked = true;
    this.piDetails.pi_date.checked = true;
    this.createIndentArray();
    this.searchText = '';
  }

  onClickShowIipoList() {
    this.resetListParam();
    this.iipoField = true;
    this.allOptionOff(true, false);
    this.generalDetails.sales1_id.checked = false;
    this.generalDetails.sales2_id.checked = false;
    this.piDetails.iipo_no.checked = true;
    this.piDetails.iipo_date.checked = true;
    this.createIndentArray();
    this.searchText = '';
  }

  onClickShowIiocList() {
    this.resetListParam();
    this.iiocField = true;
    this.allOptionOff(true, false);
    this.generalDetails.sales1_id.checked = false;
    this.generalDetails.sales2_id.checked = false;
    this.sub_data.job_no.checked = true;
    this.sub_data.prd_ord_date.checked = true;
    this.sub_data.oc_no.checked = true;
    this.sub_data.oc_date.checked = true;
    this.createIndentArray();
    this.searchText = '';
  }

  onClickShowVdocList() {
    this.resetListParam();
    this.vdocField = true;
    this.allOptionOff(true, false);
    this.generalDetails.sales1_id.checked = false;
    this.generalDetails.sales2_id.checked = false;
    this.piDetails.ij_project_no.checked = true;
    this.piDetails.oc_date.checked = true;
    this.createIndentArray();
    this.searchText = '';
  }

  onClickShowLcList() {
    this.resetListParam();
    this.lcField = true;
    this.allOptionOff(true, false);
    this.generalDetails.sales1_id.checked = false;
    this.generalDetails.sales2_id.checked = false;
    this.lcDetails.lc_check_date.checked = true;
    this.lcDetails.lc_last_rev_date.checked = true;
    this.lcDetails.lc_open_date.checked = true;
    this.lcDetails.lc_shp_date.checked = true;
    this.lcDetails.lc_expiry_date.checked = true;
    this.createIndentArray();
    this.searchText = '';
  }

  onClickShowVdShpList() {
    this.resetListParam();
    this.vdShpField = true;
    this.allOptionOff(true, false);
    this.generalDetails.sales1_id.checked = false;
    this.generalDetails.sales2_id.checked = false;
    this.salesAdminDetails.delivery_status.checked = true;
    this.shpAdvDetails.invoice_no_1.checked = true;
    this.shpAdvDetails.invoice_date_1.checked = true;
    this.shpAdvDetails.etd1.checked = true;
    this.shpAdvDetails.eta1.checked = true;
    this.shpAdvDetails.mode1.checked = true;
    this.shpAdvDetails.from1.checked = true;
    this.shpAdvDetails.vessel1.checked = true;
    this.shpAdvDetails.awb_bi_no_1.checked = true;
    this.shpAdvDetails.invoice_no_2.checked = true;
    this.shpAdvDetails.invoice_date_2.checked = true;
    this.shpAdvDetails.etd2.checked = true;
    this.shpAdvDetails.eta2.checked = true;
    this.shpAdvDetails.mode2.checked = true;
    this.shpAdvDetails.from2.checked = true;
    this.shpAdvDetails.vessel2.checked = true;
    this.shpAdvDetails.awb_bi_no_2.checked = true;
    this.shpAdvDetails.invoice_no_3.checked = true;
    this.shpAdvDetails.invoice_date_3.checked = true;
    this.shpAdvDetails.etd3.checked = true;
    this.shpAdvDetails.eta3.checked = true;
    this.shpAdvDetails.mode3.checked = true;
    this.shpAdvDetails.from3.checked = true;
    this.shpAdvDetails.vessel3.checked = true;
    this.shpAdvDetails.awb_bi_no_3.checked = true;
    this.shpAdvDetails.eway_bill_rqd.checked = true;
    this.shpAdvDetails.eway_bill_no.checked = true;
    this.createIndentArray();
    this.searchText = '';
  }

  onClickShowVdExfList() {
    this.resetListParam();
    this.vdExfField = true;
    this.allOptionOff(true, false);
    this.generalDetails.sales1_id.checked = false;
    this.generalDetails.sales2_id.checked = false;
    this.salesAdminDetails.delivery_status.checked = true;
    this.exfDetails.exf1.checked = true;
    this.exfDetails.exf1_status.checked = true;
    this.exfDetails.exf_ij_annt1.checked = true;
    this.exfDetails.exf2.checked = true;
    this.exfDetails.exf2_status.checked = true;
    this.exfDetails.exf_ij_annt2.checked = true;
    this.exfDetails.exf3.checked = true;
    this.exfDetails.exf3_status.checked = true;
    this.exfDetails.exf_ij_annt3.checked = true;
    this.createIndentArray();
    this.searchText = '';
  }

  onClickShowIiExfList() {
    this.resetListParam();
    this.iiExfField = true;
    this.allOptionOff(true, false);
    this.generalDetails.sales1_id.checked = false;
    this.generalDetails.sales2_id.checked = false;
    this.salesAdminDetails.delivery_status.checked = true;
    // this.sub_data.del_sts.checked = true;
    this.sub_data.exf1_date.checked = true;
    this.sub_data.exf1_sts.checked = true;
    this.sub_data.exf1_annc_date.checked = true;
    this.sub_data.exf2_date.checked = true;
    this.sub_data.exf2_sts.checked = true;
    this.sub_data.exf2_annc_date.checked = true;
    this.sub_data.exf3_date.checked = true;
    this.sub_data.exf3_sts.checked = true;
    this.sub_data.exf3_annc_date.checked = true;
    this.createIndentArray();
    this.searchText = '';
  }

  onClickShowBgList() {
    this.resetListParam();
    this.bgField = true;
    this.allOptionOff(true, false);
    this.generalDetails.sales1_id.checked = false;
    this.generalDetails.sales2_id.checked = false;
    this.sub_data.abg_request_anct_date.checked = true;
    this.sub_data.abg_issuance_date.checked = true;
    this.sub_data.abg_final_submission_draft_date.checked = true;
    this.sub_data.abg_final_submission_bg_date.checked = true;
    this.sub_data.pbg_request_anct_date.checked = true;
    this.sub_data.pbg_issuance_date.checked = true;
    this.sub_data.pbg_final_submission_draft_date.checked = true;
    this.sub_data.pbg_final_submission_bg_date.checked = true;
    this.createIndentArray();
    this.searchText = '';
  }

  onClickShowInvEwbList() {
    this.resetListParam();
    this.invField = true;
    this.allOptionOff(true, false);
    this.generalDetails.sales1_id.checked = false;
    this.generalDetails.sales2_id.checked = false;
    this.getInvData();
    this.searchText = '';
  }

  onClickShowPmtList() {
    this.resetListParam();
    this.pmtField = true;
    this.allOptionOff(true, false);
    this.generalDetails.sales1_id.checked = false;
    this.generalDetails.sales2_id.checked = false;
    this.salesAdminDetails.payment_status.checked = true;
    this.getPmtData();
    this.searchText = '';
  }

  onClickShowComList() {
    this.resetListParam();
    this.comField = true;
    this.allOptionOff(true, false);
    this.generalDetails.sales1_id.checked = false;
    this.generalDetails.sales2_id.checked = false;
    this.salesAdminDetails.com_month.checked = true;
    this.createIndentArray();
    this.searchText = '';
  }

  onClickShowNxtActList() {
    this.resetListParam();
    this.nxtActField = true;
    this.allOptionOff(true, false);
    this.generalDetails.sales1_id.checked = false;
    this.generalDetails.sales2_id.checked = false;
    this.salesAdminDetails.checked_on.checked = true;
    this.salesAdminDetails.for.checked = true;
    this.salesAdminDetails.next_check.checked = true;
    this.createIndentArray();
    this.searchText = '';
  }

  resetListParam() {   // this function is use to reset all tab to false. so that only one selected tab can be set to true.
    this.indField = false;
    this.piField = false;
    this.iipoField = false;
    this.iiocField = false;
    this.vdocField = false;
    this.lcField = false;
    this.vdShpField = false;
    this.vdExfField = false;
    this.iiExfField = false;
    this.bgField = false;
    this.invField = false;
    this.pmtField = false;
    this.comField = false;
    this.nxtActField = false;
  }

  allOptionOff(generalValue: boolean, otherValue: boolean) {
    this.generalDetails.indent_sheet_no.checked = true;
    this.generalDetails.indent_issue_date.checked = true;
    this.generalDetails.sos_summary.checked = generalValue;
    this.generalDetails.contract_account_name.checked = generalValue;
    this.generalDetails.crm_opt_no.checked = generalValue;
    this.generalDetails.order_type.checked = generalValue;
    this.generalDetails.sales1_name.checked = generalValue;
    this.generalDetails.sales2_name.checked = generalValue;
    this.generalDetails.sales1_id.checked = generalValue;
    this.generalDetails.sales2_id.checked = generalValue;
    this.poDetails.customer_po_date.checked = otherValue;
    this.poDetails.customer_po_no.checked = otherValue;
    this.poDetails.sp_currency.checked = otherValue;
    this.poDetails.tp_currency.checked = otherValue;
    this.poDetails.list_price_total.checked = otherValue;
    this.poDetails.selling_price_total.checked = otherValue;
    this.poDetails.transfer_price_1.checked = otherValue;
    this.poDetails.transfer_price_2.checked = otherValue;
    this.poDetails.iigm_inr.checked = otherValue;
    // this.poDetails.payment_term.checked = otherValue;
    this.poDetails.pck_n_fwd.checked = otherValue;
    this.poDetails.dmst_frt.checked = otherValue;
    this.poDetails.inst_com.checked = otherValue;
    this.poDetails.sgst_amount.checked = otherValue;
    this.poDetails.sgst_percentage.checked = otherValue;
    this.poDetails.cgst_amount.checked = otherValue;
    this.poDetails.cgst_percentage.checked = otherValue;
    this.poDetails.igst_amount.checked = otherValue;
    this.poDetails.igst_percentage.checked = otherValue;
    this.accountDetails.cntr_address.checked = otherValue;
    this.accountDetails.cntr_contact.checked = otherValue;
    this.accountDetails.cntr_email.checked = otherValue;
    this.accountDetails.cntr_country.checked = otherValue;
    this.accountDetails.cntr_code.checked = otherValue;
    this.accountDetails.cntr_gst_in.checked = otherValue;
    this.accountDetails.cntr_tel.checked = otherValue;
    this.accountDetails.user_account_name.checked = otherValue;
    this.accountDetails.ua_address.checked = otherValue;
    this.accountDetails.ua_contact.checked = otherValue;
    this.accountDetails.ua_email.checked = otherValue;
    this.accountDetails.ua_code.checked = otherValue;
    this.accountDetails.ua_country.checked = otherValue;
    this.accountDetails.ua_gst_in.checked = otherValue;
    this.accountDetails.ua_tel.checked = otherValue;
    this.accountDetails.key_account_flag.checked = otherValue;
    this.paymentDetails.payment_terms.checked = otherValue;
    this.paymentDetails.adv_type.checked = otherValue;
    this.paymentDetails.adv_percent.checked = otherValue;
    this.paymentDetails.adv_amount.checked = otherValue;
    this.paymentDetails.bsh_type.checked = otherValue;
    this.paymentDetails.bsh_percent.checked = otherValue;
    this.paymentDetails.bsh_amount.checked = otherValue;
    this.paymentDetails.ash_type.checked = otherValue;
    this.paymentDetails.ash_percent.checked = otherValue;
    this.paymentDetails.ash_amount.checked = otherValue;
    this.paymentDetails.ash_date.checked = otherValue;
    this.paymentDetails.adv_date.checked = otherValue;
    this.paymentDetails.bsh_date.checked = otherValue;
    this.comDetails.tp_com_currency.checked = otherValue;
    this.comDetails.tp_com_amount.checked = otherValue;
    this.comDetails.tp_com_paid.checked = otherValue;
    this.comDetails.tp_com_acnt_name.checked = otherValue;
    this.comDetails.com_acnt_address.checked = otherValue;
    this.comDetails.com_contact.checked = otherValue;
    this.comDetails.com_email.checked = otherValue;
    this.comDetails.com_contact.checked = otherValue;
    this.comDetails.com_country.checked = otherValue;
    this.comDetails.com_gst_in.checked = otherValue;
    this.comDetails.com_tel.checked = otherValue;
    this.comDetails.com_code.checked = otherValue;
    this.applicationDetails.customer_app_code.checked = otherValue;
    this.applicationDetails.application_type.checked = otherValue;
    this.applicationDetails.customer_app_desc.checked = otherValue;
    this.shpInst1Details.request_etd_user.checked = otherValue;
    this.shpInst1Details.request_eta_user.checked = otherValue;
    this.shpInst1Details.request_etd_factory.checked = otherValue;
    this.shpInst1Details.request_eta_factory.checked = otherValue;
    this.shpInst1Details.trade_terms.checked = otherValue;
    this.shpInst1Details.trade_terms_factory.checked = otherValue;
    this.shpInst1Details.dest_port.checked = otherValue;
    this.shpInst1Details.dest_port_factory.checked = otherValue;
    this.shpInst1Details.mot.checked = otherValue;
    this.shpInst1Details.mot_to_factory.checked = otherValue;
    this.shpInst1Details.freight.checked = otherValue;
    this.shpInst1Details.freight_to_factory.checked = otherValue;
    this.shpInst1Details.coo.checked = otherValue;
    this.shpInst1Details.epa.checked = otherValue;
    this.shpInst1Details.ip.checked = otherValue;
    this.shpInst1Details.free_dtnt_prd.checked = otherValue;
    this.shpInst2Details.cns_account_name.checked = otherValue;
    this.shpInst2Details.cns_address.checked = otherValue;
    this.shpInst2Details.cns_contact.checked = otherValue;
    this.shpInst2Details.cns_email.checked = otherValue;
    this.shpInst2Details.cns_country.checked = otherValue;
    this.shpInst2Details.cns_gst_in.checked = otherValue;
    this.shpInst2Details.cns_tel.checked = otherValue;
    this.shpInst2Details.cns_iec_code.checked = otherValue;
    this.shpInst2Details.bank_name.checked = otherValue;
    this.shpInst2Details.bank_tel.checked = otherValue;
    this.shpInst2Details.bank_address.checked = otherValue;
    this.shpInst2Details.ntf_acc_name.checked = otherValue;
    this.shpInst2Details.ntf_address.checked = otherValue;
    this.shpInst2Details.ntf_contact.checked = otherValue;
    this.shpInst2Details.ntf_email.checked = otherValue;
    this.shpInst2Details.ntf_code.checked = otherValue;
    this.shpInst2Details.ntf_country.checked = otherValue;
    this.shpInst2Details.ntf_gst_in.checked = otherValue;
    this.shpInst2Details.ntf_tel.checked = otherValue;
    this.shpInst2Details.fob_fowarder.checked = otherValue;
    this.shpInst2Details.cns_code.checked = otherValue;
    this.indRemarksDetails.production_start.checked = otherValue;
    this.indRemarksDetails.customer_po_sheet.checked = otherValue;
    this.indRemarksDetails.customer_pi.checked = otherValue;
    this.indRemarksDetails.customer_sr_sheet.checked = otherValue;
    this.indRemarksDetails.drawing.checked = otherValue;
    this.indRemarksDetails.test_report.checked = otherValue;
    this.indRemarksDetails.lc_draft.checked = otherValue;
    this.indRemarksDetails.oth_doc1.checked = otherValue;
    this.indRemarksDetails.oth_doc2.checked = otherValue;
    this.indRemarksDetails.remarks.checked = otherValue;
    this.piDetails.pi_no.checked = otherValue;
    this.piDetails.pi_date.checked = otherValue;
    this.piDetails.iipo_no.checked = otherValue;
    this.piDetails.iipo_date.checked = otherValue;
    this.piDetails.ij_project_no.checked = otherValue;
    this.piDetails.oc_date.checked = otherValue;
    this.piDetails.sa_date.checked = otherValue;
    this.lcDetails.lc_check_date.checked = otherValue;
    this.lcDetails.lc_last_rev_date.checked = otherValue;
    this.lcDetails.lc_open_date.checked = otherValue;
    this.lcDetails.lc_shp_date.checked = otherValue;
    this.lcDetails.lc_expiry_date.checked = otherValue;
    this.exfDetails.exf1.checked = otherValue;
    this.exfDetails.exf1_status.checked = otherValue;
    this.exfDetails.exf_ij_annt1.checked = otherValue;
    this.exfDetails.exf2.checked = otherValue;
    this.exfDetails.exf2_status.checked = otherValue;
    this.exfDetails.exf_ij_annt2.checked = otherValue;
    this.exfDetails.exf3.checked = otherValue;
    this.exfDetails.exf3_status.checked = otherValue;
    this.exfDetails.exf_ij_annt3.checked = otherValue;
    this.shpAdvDetails.invoice_no_1.checked = otherValue;
    this.shpAdvDetails.invoice_date_1.checked = otherValue;
    this.shpAdvDetails.etd1.checked = otherValue;
    this.shpAdvDetails.eta1.checked = otherValue;
    this.shpAdvDetails.mode1.checked = otherValue;
    this.shpAdvDetails.from1.checked = otherValue;
    this.shpAdvDetails.vessel1.checked = otherValue;
    this.shpAdvDetails.awb_bi_no_1.checked = otherValue;
    this.shpAdvDetails.invoice_no_2.checked = otherValue;
    this.shpAdvDetails.invoice_date_2.checked = otherValue;
    this.shpAdvDetails.etd2.checked = otherValue;
    this.shpAdvDetails.eta2.checked = otherValue;
    this.shpAdvDetails.mode2.checked = otherValue;
    this.shpAdvDetails.from2.checked = otherValue;
    this.shpAdvDetails.vessel2.checked = otherValue;
    this.shpAdvDetails.awb_bi_no_2.checked = otherValue;
    this.shpAdvDetails.invoice_no_3.checked = otherValue;
    this.shpAdvDetails.invoice_date_3.checked = otherValue;
    this.shpAdvDetails.etd3.checked = otherValue;
    this.shpAdvDetails.eta3.checked = otherValue;
    this.shpAdvDetails.mode3.checked = otherValue;
    this.shpAdvDetails.from3.checked = otherValue;
    this.shpAdvDetails.vessel3.checked = otherValue;
    this.shpAdvDetails.awb_bi_no_3.checked = otherValue;
    this.shpAdvDetails.eway_bill_rqd.checked = otherValue;
    this.shpAdvDetails.eway_bill_no.checked = otherValue;
    this.salesAdminDetails.remarks.checked = otherValue;
    this.salesAdminDetails.com_month.checked = otherValue;
    this.salesAdminDetails.checked_on.checked = otherValue;
    this.salesAdminDetails.for.checked = otherValue;
    this.salesAdminDetails.next_check.checked = otherValue;
    this.salesAdminDetails.payment_status.checked = otherValue;
    this.salesAdminDetails.delivery_status.checked = otherValue;

    this.sub_data.job_no.checked = otherValue;
    this.sub_data.prd_ord_date.checked = otherValue;
    this.sub_data.oc_no.checked = otherValue;
    this.sub_data.oc_date.checked = otherValue;
    // this.sub_data.del_sts.checked = otherValue;
    this.sub_data.exf1_date.checked = otherValue;
    this.sub_data.exf1_sts.checked = otherValue;
    this.sub_data.exf1_annc_date.checked = otherValue;
    this.sub_data.exf2_date.checked = otherValue;
    this.sub_data.exf2_sts.checked = otherValue;
    this.sub_data.exf2_annc_date.checked = otherValue;
    this.sub_data.exf3_date.checked = otherValue;
    this.sub_data.exf3_sts.checked = otherValue;
    this.sub_data.exf3_annc_date.checked = otherValue;
    this.sub_data.abg_request_anct_date.checked = otherValue;
    this.sub_data.abg_issuance_date.checked = otherValue;
    this.sub_data.abg_final_submission_draft_date.checked = otherValue;
    this.sub_data.abg_final_submission_bg_date.checked = otherValue;
    this.sub_data.pbg_request_anct_date.checked = otherValue;
    this.sub_data.pbg_issuance_date.checked = otherValue;
    this.sub_data.pbg_final_submission_draft_date.checked = otherValue;
    this.sub_data.pbg_final_submission_bg_date.checked = otherValue;
    this.allSet.set1 = otherValue;
    this.allSet.set2 = otherValue;
    this.allSet.set3 = otherValue;
    this.allSet.set4 = otherValue;
    this.allSet.set5 = otherValue;
    this.allSet.set6 = otherValue;
    this.allSet.set7 = otherValue;
    this.allSet.set8 = otherValue;
    this.allSet.set9 = otherValue;
    this.allSet.set10 = otherValue;
    this.allSet.set11 = otherValue;
    this.allSet.set12 = otherValue;
    this.allSet.set13 = otherValue;
    this.allSet.set14 = otherValue;
  }


  resetConditionalFilterOption() {
    this.conditionalFilterValue = 1;
  }


  getPmtData() {
    let indentType = this.indentType;
    // this.allDateFlag = true;
    // this.rangeDateFlag = false;
    // this.selectYearFlag = false;
    // this.conditionalFilterFlag = false;
    // this.indentRange = "ALL";
    // this.resetOutputFilter();
    if (this.allDateFlag) {
      this.emptyListMssg = "Loading Indent Data...";
      this.filemanagementService.getAllPaymentList(indentType)
        .subscribe(Response => {
          this.PaymentList = [];
          this.PaymentList2 = [];
          this.PaymentList = Response;
          this.PaymentList2 = Response;
          if (this.PaymentList.length == 0) {
            this.emptyListMssg = "There is no Indent.";
          }
          else {
            this.emptyListMssg = "";
          }
          this.createPaymentArray();
          return this.PaymentList;
        }, error => {
          this.commonService.toast("error", "Server is not responding------------");
        });
    }
    else if (this.rangeDateFlag || this.selectYearFlag) {
      // this.fetchIndentByDate();
      this.emptyListMssg = "Loading Indent Data...";
      const fromDate = this.fromDate;
      const toDate = this.toDate;
      this.filemanagementService.getPaymentListByDate(fromDate, toDate,indentType)
        .subscribe(Response => {
          this.PaymentList = [];
          this.PaymentList2 = [];
          this.PaymentList = Response;
          this.PaymentList2 = Response;
          if (this.PaymentList.length == 0) {
            this.emptyListMssg = "There is no Indent.";
          }
          else {
            this.emptyListMssg = "";
          }
          this.createPaymentArray();
          return this.PaymentList;
        });
    }
    // else if (this.selectYearFlag) {
    //   this.fetchIndentByYear();
    // }
    else if (this.conditionalFilterFlag) {
      let option = this.conditionalFilterValue;
      this.emptyListMssg = "Loading Indent Data...";
      this.filemanagementService.getPaymentListByConditionalFilter(option,indentType)
        .subscribe(Response => {
          this.PaymentList = [];
          this.PaymentList2 = [];
          this.PaymentList = Response;
          this.PaymentList2 = Response;
          if (this.PaymentList.length == 0) {
            this.emptyListMssg = "There is no Indent.";
          }
          else {
            this.emptyListMssg = "";
          }
          this.createPaymentArray();
          return this.PaymentList;
        });
    }
    this.searchText = '';
    this.generatePageListButtons();
  }

  getInvData() {
    let indentType = this.indentType;
    if (this.allDateFlag) {
      // this.fetchData();
      this.emptyListMssg = "Loading Indent Data...";
      this.filemanagementService.getAllInvoiceList(indentType)
        .subscribe(Response => {
          this.InvoiceList = [];
          this.InvoiceList2 = [];
          this.InvoiceList2 = Response;
          this.InvoiceList = Response;
          if (this.InvoiceList.length == 0) {
            this.emptyListMssg = "There is no Indent.";
          }
          else {
            this.emptyListMssg = "";
          }
          this.createInvoiceArray();
          return this.InvoiceList;
        }, error => {
          this.commonService.toast("error", "Server is not responding------------");
        });
    }
    else if (this.rangeDateFlag || this.selectYearFlag) {
      // this.fetchIndentByDate();
      this.emptyListMssg = "Loading Indent Data...";
      const fromDate = this.fromDate;
      const toDate = this.toDate;
      this.filemanagementService.getInvoiceListByDate(fromDate, toDate,indentType)
        .subscribe(Response => {
          this.InvoiceList = [];
          this.InvoiceList2 = [];
          this.InvoiceList = Response;
          this.InvoiceList2 = Response;
          if (this.InvoiceList.length == 0) {
            this.emptyListMssg = "There is no Indent.";
          }
          else {
            this.emptyListMssg = "";
          }
          this.createInvoiceArray();
          return this.InvoiceList;
        });
    }
    // else if (this.selectYearFlag) {
    //   this.fetchIndentByYear();
    // }
    else if (this.conditionalFilterFlag) {
      let option = this.conditionalFilterValue;
      this.emptyListMssg = "Loading Indent Data...";
      this.filemanagementService.getInvoiceListByConditionalFilter(option,indentType)
        .subscribe(Response => {
          this.InvoiceList = [];
          this.InvoiceList2 = [];
          this.InvoiceList = Response;
          this.InvoiceList2 = Response;
          if (this.InvoiceList.length == 0) {
            this.emptyListMssg = "There is no Indent.";
          }
          else {
            this.emptyListMssg = "";
          }
          this.createInvoiceArray();
          return this.InvoiceList;
        });
    }
    this.searchText = '';
    this.generatePageListButtons();
  }

  createPaymentArray() {
    let header = [];
    let row = [];
    this.indentHeader = [];
    this.indentBody = [];
    let i=0;
    header.push(this.generalDetails.indent_sheet_no.name); i++;
    header.push(this.generalDetails.indent_issue_date.name); i++;
    if (this.generalDetails.crm_opt_no.checked) { header.push(this.generalDetails.crm_opt_no.name); i++; }
    if(this.generalDetails.contract_account_name.checked){ header.push(this.generalDetails.contract_account_name.name); i++;}
    if (this.generalDetails.sos_summary.checked) { header.push(this.generalDetails.sos_summary.name); i++; }
    if (this.generalDetails.sales1_id.checked) { header.push(this.generalDetails.sales1_id.name); i++; }
    if (this.generalDetails.sales1_name.checked) { header.push(this.generalDetails.sales1_name.name); i++; }
    if (this.generalDetails.sales2_id.checked) { header.push(this.generalDetails.sales2_id.name); i++; }
    if (this.generalDetails.sales2_name.checked) { header.push(this.generalDetails.sales2_name.name); i++; }
    if (this.generalDetails.order_type.checked) { header.push(this.generalDetails.order_type.name); i++; }
    //po details
    if (this.poDetails.customer_po_no.checked) { header.push(this.poDetails.customer_po_no.name) }
    if (this.poDetails.customer_po_date.checked) { header.push(this.poDetails.customer_po_date.name) }
    //Account Details
    // if (this.accountDetails.cntr_account_name.checked) { header.push(this.accountDetails.cntr_account_name.name) }
    if (this.accountDetails.cntr_code.checked) { header.push(this.accountDetails.cntr_code.name) }
    if (this.accountDetails.cntr_country.checked) { header.push(this.accountDetails.cntr_country.name) }
    if (this.accountDetails.cntr_address.checked) { header.push(this.accountDetails.cntr_address.name) }
    if (this.accountDetails.cntr_tel.checked) { header.push(this.accountDetails.cntr_tel.name) }
    if (this.accountDetails.cntr_gst_in.checked) { header.push(this.accountDetails.cntr_gst_in.name) }
    if (this.accountDetails.cntr_contact.checked) { header.push(this.accountDetails.cntr_contact.name) }
    if (this.accountDetails.cntr_email.checked) { header.push(this.accountDetails.cntr_email.name) }
    if (this.accountDetails.user_account_name.checked) { header.push(this.accountDetails.user_account_name.name) }
    if (this.accountDetails.ua_code.checked) { header.push(this.accountDetails.ua_code.name) }
    if (this.accountDetails.ua_country.checked) { header.push(this.accountDetails.ua_country.name) }
    if (this.accountDetails.ua_address.checked) { header.push(this.accountDetails.ua_address.name) }
    if (this.accountDetails.ua_tel.checked) { header.push(this.accountDetails.ua_tel.name) }
    if (this.accountDetails.ua_gst_in.checked) { header.push(this.accountDetails.ua_gst_in.name) }
    if (this.accountDetails.ua_contact.checked) { header.push(this.accountDetails.ua_contact.name) }
    if (this.accountDetails.ua_email.checked) { header.push(this.accountDetails.ua_email.name) }
    if (this.accountDetails.key_account_flag.checked) { header.push(this.accountDetails.key_account_flag.name) }
    //PO Details
    if (this.poDetails.sp_currency.checked) { header.push(this.poDetails.sp_currency.name) }
    if (this.poDetails.list_price_total.checked) { header.push(this.poDetails.list_price_total.name) }
    if (this.poDetails.selling_price_total.checked) { header.push(this.poDetails.selling_price_total.name) }
    if (this.poDetails.pck_n_fwd.checked) { header.push(this.poDetails.pck_n_fwd.name) }
    if (this.poDetails.dmst_frt.checked) { header.push(this.poDetails.dmst_frt.name) }
    if (this.poDetails.sgst_percentage.checked) { header.push(this.poDetails.sgst_percentage.name) }
    if (this.poDetails.sgst_amount.checked) { header.push(this.poDetails.sgst_amount.name) }
    if (this.poDetails.cgst_percentage.checked) { header.push(this.poDetails.cgst_percentage.name) }
    if (this.poDetails.cgst_amount.checked) { header.push(this.poDetails.cgst_amount.name) }
    if (this.poDetails.igst_percentage.checked) { header.push(this.poDetails.igst_percentage.name) }
    if (this.poDetails.igst_amount.checked) { header.push(this.poDetails.igst_amount.name) }
    if (this.poDetails.inst_com.checked) { header.push(this.poDetails.inst_com.name) }
    if (this.poDetails.tp_currency.checked) { header.push(this.poDetails.tp_currency.name) }
    if (this.poDetails.transfer_price_1.checked) { header.push(this.poDetails.transfer_price_1.name) }
    if (this.poDetails.transfer_price_2.checked) { header.push(this.poDetails.transfer_price_2.name) }
    if (this.poDetails.iigm_inr.checked) { header.push(this.poDetails.iigm_inr.name) }
    if (this.paymentDetails.payment_terms.checked) { header.push(this.paymentDetails.payment_terms.name) }

    //Payment Details
    if (this.paymentDetails.adv_type.checked) { header.push(this.paymentDetails.adv_type.name) }
    if (this.paymentDetails.adv_percent.checked) { header.push(this.paymentDetails.adv_percent.name) }
    if (this.paymentDetails.adv_amount.checked) { header.push(this.paymentDetails.adv_amount.name) }
    if (this.paymentDetails.adv_date.checked) { header.push(this.paymentDetails.adv_date.name) }
    if (this.paymentDetails.bsh_type.checked) { header.push(this.paymentDetails.bsh_type.name) }
    if (this.paymentDetails.bsh_percent.checked) { header.push(this.paymentDetails.bsh_percent.name) }
    if (this.paymentDetails.bsh_amount.checked) { header.push(this.paymentDetails.bsh_amount.name) }
    if (this.paymentDetails.bsh_date.checked) { header.push(this.paymentDetails.bsh_date.name) }
    if (this.paymentDetails.ash_type.checked) { header.push(this.paymentDetails.ash_type.name) }
    if (this.paymentDetails.ash_percent.checked) { header.push(this.paymentDetails.ash_percent.name) }
    if (this.paymentDetails.ash_amount.checked) { header.push(this.paymentDetails.ash_amount.name) }
    if (this.paymentDetails.ash_date.checked) { header.push(this.paymentDetails.ash_date.name) }


    //Third Party Commision Details
    if (this.comDetails.tp_com_currency.checked) { header.push(this.comDetails.tp_com_currency.name) }
    if (this.comDetails.tp_com_amount.checked) { header.push(this.comDetails.tp_com_amount.name) }
    if (this.comDetails.tp_com_paid.checked) { header.push(this.comDetails.tp_com_paid.name) }
    if (this.comDetails.tp_com_acnt_name.checked) { header.push(this.comDetails.tp_com_acnt_name.name) }
    if (this.comDetails.com_code.checked) { header.push(this.comDetails.com_code.name) }
    if (this.comDetails.com_country.checked) { header.push(this.comDetails.com_country.name) }
    if (this.comDetails.com_acnt_address.checked) { header.push(this.comDetails.com_acnt_address.name) }
    if (this.comDetails.com_tel.checked) { header.push(this.comDetails.com_tel.name) }
    if (this.comDetails.com_gst_in.checked) { header.push(this.comDetails.com_gst_in.name) }
    if (this.comDetails.com_contact.checked) { header.push(this.comDetails.com_contact.name) }
    if (this.comDetails.com_email.checked) { header.push(this.comDetails.com_email.name) }

    //Application Details
    if (this.applicationDetails.customer_app_code.checked) { header.push(this.applicationDetails.customer_app_code.name) }
    if (this.applicationDetails.application_type.checked) { header.push(this.applicationDetails.application_type.name) }
    if (this.applicationDetails.customer_app_desc.checked) { header.push(this.applicationDetails.customer_app_desc.name) }

    //Ship Instance 1 Details
    if (this.shpInst1Details.request_etd_user.checked) { header.push(this.shpInst1Details.request_etd_user.name) }
    if (this.shpInst1Details.request_eta_user.checked) { header.push(this.shpInst1Details.request_eta_user.name) }
    if (this.shpInst1Details.trade_terms.checked) { header.push(this.shpInst1Details.trade_terms.name) }
    if (this.shpInst1Details.dest_port.checked) { header.push(this.shpInst1Details.dest_port.name) }
    if (this.shpInst1Details.mot.checked) { header.push(this.shpInst1Details.mot.name) }
    if (this.shpInst1Details.freight.checked) { header.push(this.shpInst1Details.freight.name) }
    if (this.shpInst1Details.request_etd_factory.checked) { header.push(this.shpInst1Details.request_etd_factory.name) }
    if (this.shpInst1Details.request_eta_factory.checked) { header.push(this.shpInst1Details.request_eta_factory.name) }
    if (this.shpInst1Details.trade_terms_factory.checked) { header.push(this.shpInst1Details.trade_terms_factory.name) }
    // trd trade missing filled
    if (this.shpInst1Details.dest_port_factory.checked) { header.push(this.shpInst1Details.dest_port_factory.name) }
    if (this.shpInst1Details.mot_to_factory.checked) { header.push(this.shpInst1Details.mot_to_factory.name) }
    if (this.shpInst1Details.freight_to_factory.checked) { header.push(this.shpInst1Details.freight_to_factory.name) }
    if (this.shpInst1Details.coo.checked) { header.push(this.shpInst1Details.coo.name) }
    if (this.shpInst1Details.epa.checked) { header.push(this.shpInst1Details.epa.name) }
    if (this.shpInst1Details.ip.checked) { header.push(this.shpInst1Details.ip.name) }
    if (this.shpInst1Details.free_dtnt_prd.checked) { header.push(this.shpInst1Details.free_dtnt_prd.name) }

    //Ship Instance 2 Details
    if (this.shpInst2Details.cns_account_name.checked) { header.push(this.shpInst2Details.cns_account_name.name) }
    if (this.shpInst2Details.cns_code.checked) { header.push(this.shpInst2Details.cns_code.name) }
    if (this.shpInst2Details.cns_country.checked) { header.push(this.shpInst2Details.cns_country.name) }
    if (this.shpInst2Details.cns_address.checked) { header.push(this.shpInst2Details.cns_address.name) }
    if (this.shpInst2Details.cns_tel.checked) { header.push(this.shpInst2Details.cns_tel.name) }
    if (this.shpInst2Details.cns_gst_in.checked) { header.push(this.shpInst2Details.cns_gst_in.name) }
    if (this.shpInst2Details.cns_contact.checked) { header.push(this.shpInst2Details.cns_contact.name) }
    if (this.shpInst2Details.cns_email.checked) { header.push(this.shpInst2Details.cns_email.name) }
    if (this.shpInst2Details.cns_iec_code.checked) { header.push(this.shpInst2Details.cns_iec_code.name) }
    if (this.shpInst2Details.bank_name.checked) { header.push(this.shpInst2Details.bank_name.name) }
    if (this.shpInst2Details.bank_address.checked) { header.push(this.shpInst2Details.bank_address.name) }
    if (this.shpInst2Details.bank_tel.checked) { header.push(this.shpInst2Details.bank_tel.name) }
    if (this.shpInst2Details.ntf_acc_name.checked) { header.push(this.shpInst2Details.ntf_acc_name.name) }
    if (this.shpInst2Details.ntf_code.checked) { header.push(this.shpInst2Details.ntf_code.name) }
    if (this.shpInst2Details.ntf_country.checked) { header.push(this.shpInst2Details.ntf_country.name) }
    if (this.shpInst2Details.ntf_address.checked) { header.push(this.shpInst2Details.ntf_address.name) }
    if (this.shpInst2Details.ntf_tel.checked) { header.push(this.shpInst2Details.ntf_tel.name) }
    if (this.shpInst2Details.ntf_gst_in.checked) { header.push(this.shpInst2Details.ntf_gst_in.name) }
    if (this.shpInst2Details.ntf_contact.checked) { header.push(this.shpInst2Details.ntf_contact.name) }
    if (this.shpInst2Details.ntf_email.checked) { header.push(this.shpInst2Details.ntf_email.name) }

    //
    if (this.indRemarksDetails.production_start.checked) { header.push(this.indRemarksDetails.production_start.name) }
    if (this.indRemarksDetails.customer_po_sheet.checked) { header.push(this.indRemarksDetails.customer_po_sheet.name) }
    if (this.indRemarksDetails.customer_sr_sheet.checked) { header.push(this.indRemarksDetails.customer_sr_sheet.name) }
    if (this.indRemarksDetails.drawing.checked) { header.push(this.indRemarksDetails.drawing.name) }
    if (this.indRemarksDetails.test_report.checked) { header.push(this.indRemarksDetails.test_report.name) }
    if (this.indRemarksDetails.customer_pi.checked) { header.push(this.indRemarksDetails.customer_pi.name) }
    if (this.indRemarksDetails.lc_draft.checked) { header.push(this.indRemarksDetails.lc_draft.name) }
    if (this.indRemarksDetails.oth_doc1.checked) { header.push(this.indRemarksDetails.oth_doc1.name) }
    if (this.indRemarksDetails.oth_doc2.checked) { header.push(this.indRemarksDetails.oth_doc2.name) }
    if (this.indRemarksDetails.remarks.checked) { header.push(this.indRemarksDetails.remarks.name) }

    //Proforma Invoice Details
    if (this.piDetails.pi_no.checked) { header.push(this.piDetails.pi_no.name) }
    if (this.piDetails.pi_date.checked) { header.push(this.piDetails.pi_date.name) }
    if (this.piDetails.iipo_no.checked) { header.push(this.piDetails.iipo_no.name) }
    if (this.piDetails.iipo_date.checked) { header.push(this.piDetails.iipo_date.name) }
    if (this.piDetails.ij_project_no.checked) { header.push(this.piDetails.ij_project_no.name) }
    if (this.piDetails.oc_date.checked) { header.push(this.piDetails.oc_date.name) }
    if (this.piDetails.sa_date.checked) { header.push(this.piDetails.sa_date.name) }

    //LC Details
    if (this.lcDetails.lc_check_date.checked) { header.push(this.lcDetails.lc_check_date.name) }
    if (this.lcDetails.lc_open_date.checked) { header.push(this.lcDetails.lc_open_date.name) }
    if (this.lcDetails.lc_last_rev_date.checked) { header.push(this.lcDetails.lc_last_rev_date.name) }
    if (this.lcDetails.lc_shp_date.checked) { header.push(this.lcDetails.lc_shp_date.name) }
    if (this.lcDetails.lc_expiry_date.checked) { header.push(this.lcDetails.lc_expiry_date.name) }

    //EXF Details
    if (this.exfDetails.exf1.checked) { header.push(this.exfDetails.exf1.name) }
    if (this.exfDetails.exf1_status.checked) { header.push(this.exfDetails.exf1_status.name) }
    if (this.exfDetails.exf_ij_annt1.checked) { header.push(this.exfDetails.exf_ij_annt1.name) }
    if (this.exfDetails.exf2.checked) { header.push(this.exfDetails.exf2.name) }
    if (this.exfDetails.exf2_status.checked) { header.push(this.exfDetails.exf2_status.name) }
    if (this.exfDetails.exf_ij_annt2.checked) { header.push(this.exfDetails.exf_ij_annt2.name) }
    if (this.exfDetails.exf3.checked) { header.push(this.exfDetails.exf3.name) }
    if (this.exfDetails.exf3_status.checked) { header.push(this.exfDetails.exf3_status.name) }
    if (this.exfDetails.exf_ij_annt3.checked) { header.push(this.exfDetails.exf_ij_annt3.name) }

    //Ship Instance 2 FOB Fowarder detail
    if (this.shpInst2Details.fob_fowarder.checked) { header.push(this.shpInst2Details.fob_fowarder.name) }

    //ShpAdv Details
    if (this.shpAdvDetails.invoice_no_1.checked) { header.push(this.shpAdvDetails.invoice_no_1.name) }
    if (this.shpAdvDetails.invoice_date_1.checked) { header.push(this.shpAdvDetails.invoice_date_1.name) }
    if (this.shpAdvDetails.mode1.checked) { header.push(this.shpAdvDetails.mode1.name) }
    if (this.shpAdvDetails.from1.checked) { header.push(this.shpAdvDetails.from1.name) }
    if (this.shpAdvDetails.vessel1.checked) { header.push(this.shpAdvDetails.vessel1.name) }
    if (this.shpAdvDetails.awb_bi_no_1.checked) { header.push(this.shpAdvDetails.awb_bi_no_1.name) }
    if (this.shpAdvDetails.etd1.checked) { header.push(this.shpAdvDetails.etd1.name) }
    if (this.shpAdvDetails.eta1.checked) { header.push(this.shpAdvDetails.eta1.name) }
    if (this.shpAdvDetails.invoice_no_2.checked) { header.push(this.shpAdvDetails.invoice_no_2.name) }
    if (this.shpAdvDetails.invoice_date_2.checked) { header.push(this.shpAdvDetails.invoice_date_2.name) }
    if (this.shpAdvDetails.mode2.checked) { header.push(this.shpAdvDetails.mode2.name) }
    if (this.shpAdvDetails.from2.checked) { header.push(this.shpAdvDetails.from2.name) }
    if (this.shpAdvDetails.vessel2.checked) { header.push(this.shpAdvDetails.vessel2.name) }
    if (this.shpAdvDetails.awb_bi_no_2.checked) { header.push(this.shpAdvDetails.awb_bi_no_2.name) }
    if (this.shpAdvDetails.etd2.checked) { header.push(this.shpAdvDetails.etd2.name) }
    if (this.shpAdvDetails.eta2.checked) { header.push(this.shpAdvDetails.eta2.name) }
    if (this.shpAdvDetails.invoice_no_3.checked) { header.push(this.shpAdvDetails.invoice_no_3.name) }
    if (this.shpAdvDetails.invoice_date_3.checked) { header.push(this.shpAdvDetails.invoice_date_3.name) }
    if (this.shpAdvDetails.mode3.checked) { header.push(this.shpAdvDetails.mode3.name) }
    if (this.shpAdvDetails.from3.checked) { header.push(this.shpAdvDetails.from3.name) }
    if (this.shpAdvDetails.vessel3.checked) { header.push(this.shpAdvDetails.vessel3.name) }
    if (this.shpAdvDetails.awb_bi_no_3.checked) { header.push(this.shpAdvDetails.awb_bi_no_3.name) }
    if (this.shpAdvDetails.etd3.checked) { header.push(this.shpAdvDetails.etd3.name) }
    if (this.shpAdvDetails.eta3.checked) { header.push(this.shpAdvDetails.eta3.name) }
    if (this.shpAdvDetails.eway_bill_rqd.checked) { header.push(this.shpAdvDetails.eway_bill_rqd.name) }
    if (this.shpAdvDetails.eway_bill_no.checked) { header.push(this.shpAdvDetails.eway_bill_no.name) }

    //Sales Admin Details
    if (this.salesAdminDetails.remarks.checked) { header.push(this.salesAdminDetails.remarks.name) }
    if (this.salesAdminDetails.com_month.checked) { header.push(this.salesAdminDetails.com_month.name) }
    if (this.salesAdminDetails.checked_on.checked) { header.push(this.salesAdminDetails.checked_on.name) }
    if (this.salesAdminDetails.next_check.checked) { header.push(this.salesAdminDetails.next_check.name) }
    if (this.salesAdminDetails.for.checked) { header.push(this.salesAdminDetails.for.name) }
    if (this.salesAdminDetails.delivery_status.checked) { header.push(this.salesAdminDetails.delivery_status.name) }


    // header.push(this.subPaymentDetails.payment_id.name)
    header.push(this.subPaymentDetails.payment_type.name)
    header.push(this.subPaymentDetails.payment_date.name)
    header.push(this.subPaymentDetails.payment_amount.name)
    if (this.salesAdminDetails.payment_status.checked) { header.push(this.salesAdminDetails.payment_status.name) }
    this.indentHeader = header;  // passing the whole selected headers to indent Header array
    this.generalDetailColumn = i;
    for (let r of this.PaymentList) {
      row = [];
      row.push(r.indent_sheet_num)
      row.push(r.indent_issue_date) 
      if (this.generalDetails.crm_opt_no.checked) { row.push(r.crm_opt_num) }
      if (this.generalDetails.contract_account_name.checked){ row.push(r.contract_acnt_name)}
      if (this.generalDetails.sos_summary.checked) { row.push(r.sos_summary) }
      if (this.generalDetails.sales1_id.checked) { row.push(r.sales1_id) }
      if (this.generalDetails.sales1_name.checked) { row.push(r.sales1_name) }
      if (this.generalDetails.sales2_id.checked) { row.push(r.sales2_id) }
      if (this.generalDetails.sales2_name.checked) { row.push(r.sales2_name) }
      if (this.generalDetails.order_type.checked) { row.push(r.order_type) }
      //po details
      if (this.poDetails.customer_po_no.checked) { row.push(r.customer_po_num) }
      if (this.poDetails.customer_po_date.checked) { row.push(r.customer_po_date) }
      //Account Details
      // if (this.accountDetails.cntr_account_name.checked) { row.push(r.contract_acnt_name) }
      if (this.accountDetails.cntr_code.checked) { row.push(r.cntr_code) }
      if (this.accountDetails.cntr_country.checked) { row.push(r.cntr_country) }
      if (this.accountDetails.cntr_address.checked) { row.push(r.cntr_address) }
      if (this.accountDetails.cntr_tel.checked) { row.push(r.cntr_tel) }
      if (this.accountDetails.cntr_gst_in.checked) { row.push(r.cntr_gst_code) }
      if (this.accountDetails.cntr_contact.checked) { row.push(r.cntr_contact_person) }
      if (this.accountDetails.cntr_email.checked) { row.push(r.cntr_email) }
      if (this.accountDetails.user_account_name.checked) { row.push(r.user_acnt_name) }
      if (this.accountDetails.ua_code.checked) { row.push(r.ua_code) }
      if (this.accountDetails.ua_country.checked) { row.push(r.ua_country) }
      if (this.accountDetails.ua_address.checked) { row.push(r.ua_address) }
      if (this.accountDetails.ua_tel.checked) { row.push(r.ua_tel) }
      if (this.accountDetails.ua_gst_in.checked) { row.push(r.ua_gst_code) }
      if (this.accountDetails.ua_contact.checked) { row.push(r.ua_contact_person) }
      if (this.accountDetails.ua_email.checked) { row.push(r.ua_email) }
      if (this.accountDetails.key_account_flag.checked) { row.push(r.key_account_flag) }
      //PO Details
      if (this.poDetails.sp_currency.checked) { row.push(r.sp_cur) }
      if (this.poDetails.list_price_total.checked) { row.push(r.lp_total) }
      if (this.poDetails.selling_price_total.checked) { row.push(r.sp_total) }
      if (this.poDetails.pck_n_fwd.checked) { row.push(r.pck_and_fwd_amnt) }
      if (this.poDetails.dmst_frt.checked) { row.push(r.domestic_freight_amnt) }
      // convert to percentage if exist.
      if (this.poDetails.sgst_percentage.checked) {
        if (r.sgst_pc) {
          if (r.sgst_pc.toString() == "NA") {   // if it has NaN 
            row.push("")
          }
          else {
            row.push((+r.sgst_pc * 100).toString().concat("%"))
          }
        }
        else {
          row.push(r.sgst_pc)
        }
      }
      if (this.poDetails.sgst_amount.checked) { row.push(r.sgst_amount) }
      //converting into percentage.
      if (this.poDetails.cgst_percentage.checked) {   // if it has NaN
        if (r.cgst_pc) {
          if (r.cgst_pc.toString() == "NA") {
            row.push("")
          }
          else {
            row.push((+r.cgst_pc * 100).toString().concat("%"))
          }
        }
        else {
          row.push(r.cgst_pc)
        }
      }
      if (this.poDetails.cgst_amount.checked) { row.push(r.cgst_amount) }
      // converting into percentage.
      if (this.poDetails.igst_percentage.checked) {
        if (r.igst_pc) {
          if (r.igst_pc.toString() == "NA") {
            row.push("")
          }
          else {
            row.push((+r.igst_pc * 100).toString().concat("%"))
          }
        }
        else {
          row.push(r.igst_pc)
        }
      }
      if (this.poDetails.igst_amount.checked) { row.push(r.igst_amount) }
      if (this.poDetails.inst_com.checked) { row.push(r.inst_com_amnt) }
      if (this.poDetails.tp_currency.checked) { row.push(r.tp_cur) }
      if (this.poDetails.transfer_price_1.checked) { row.push(r.tp1) }
      if (this.poDetails.transfer_price_2.checked) { row.push(r.tp2) }
      if (this.poDetails.iigm_inr.checked) { row.push(r.iigm) }
      if (this.paymentDetails.payment_terms.checked) { row.push(r.pmt_trms) }

      //Payment Details
      if (this.paymentDetails.adv_type.checked) { row.push(r.adv_type) }
      // converting into percentage.
      if (this.paymentDetails.adv_percent.checked) {
        if (r.adv_pc) {
          if (r.adv_pc.toString() == "NA") {
            row.push("")
          }
          else {
            row.push((+r.adv_pc * 100).toString().concat("%"))
          }
        }
        else {
          row.push(r.adv_pc)
        }
      }
      if (this.paymentDetails.adv_amount.checked) { row.push(r.adv_amount) }
      if (this.paymentDetails.adv_date.checked) { row.push(r.adv_date) }
      if (this.paymentDetails.bsh_type.checked) { row.push(r.bsh_type) }
      // converting into percentage.
      if (this.paymentDetails.bsh_percent.checked) {
        if (r.bsh_pc) {
          if (r.bsh_pc.toString() == "NA") {
            row.push("")
          }
          else {
            row.push((+r.bsh_pc * 100).toString().concat("%"))
          }
        }
        else {
          row.push(r.bsh_pc)
        }
      }
      if (this.paymentDetails.bsh_amount.checked) { row.push(r.bsh_amount) }
      if (this.paymentDetails.bsh_date.checked) { row.push(r.bsh_date) }
      if (this.paymentDetails.ash_type.checked) { row.push(r.ash_type) }
      // converting into percentage.
      if (this.paymentDetails.ash_percent.checked) {
        if (r.ash_pc) {
          if (r.ash_pc.toString() == "NA") {
            row.push("")
          }
          else {
            row.push((+r.ash_pc * 100).toString().concat("%"))
          }
        }
        else {
          row.push(r.ash_pc)
        }
      }
      if (this.paymentDetails.ash_amount.checked) { row.push(r.ash_amount) }
      if (this.paymentDetails.ash_date.checked) { row.push(r.ash_date) }


      //Third Party Commision Details
      if (this.comDetails.tp_com_currency.checked) { row.push(r.thirdp_com_cur) }
      if (this.comDetails.tp_com_amount.checked) { row.push(r.thirdp_com_amnt) }
      if (this.comDetails.tp_com_paid.checked) { row.push(r.thirdp_com_paid_by) }
      if (this.comDetails.tp_com_acnt_name.checked) { row.push(r.com_acnt_name) }
      if (this.comDetails.com_code.checked) { row.push(r.com_code) }
      if (this.comDetails.com_country.checked) { row.push(r.com_country) }
      if (this.comDetails.com_acnt_address.checked) { row.push(r.com_address) }
      if (this.comDetails.com_tel.checked) { row.push(r.com_tel) }
      if (this.comDetails.com_gst_in.checked) { row.push(r.com_gst_code) }
      if (this.comDetails.com_contact.checked) { row.push(r.com_contact_person) }
      if (this.comDetails.com_email.checked) { row.push(r.com_email) }

      //Application Details
      if (this.applicationDetails.customer_app_code.checked) { row.push(r.csutomer_application_code) }
      if (this.applicationDetails.application_type.checked) { row.push(r.customer_application_type) }
      if (this.applicationDetails.customer_app_desc.checked) { row.push(r.customer_app_desc) }

      //Ship Instance 1 Details
      if (this.shpInst1Details.request_etd_user.checked) { row.push(r.req_etd_by_customer) }
      if (this.shpInst1Details.request_eta_user.checked) { row.push(r.req_eta_by_customer) }
      if (this.shpInst1Details.trade_terms.checked) { row.push(r.trd_trms_with_customer) }
      if (this.shpInst1Details.dest_port.checked) { row.push(r.dest_port_by_customer) }
      if (this.shpInst1Details.mot.checked) { row.push(r.mot) }
      if (this.shpInst1Details.freight.checked) { row.push(r.freight1) }
      if (this.shpInst1Details.request_etd_factory.checked) { row.push(r.req_etd_to_ij) }
      if (this.shpInst1Details.request_eta_factory.checked) { row.push(r.req_eta_to_ij) }
      if (this.shpInst1Details.trade_terms_factory.checked) { row.push(r.trd_trms_with_ij) }
      if (this.shpInst1Details.dest_port_factory.checked) { row.push(r.dest_port_to_ij) }
      if (this.shpInst1Details.mot_to_factory.checked) { row.push(r.mot_to_ij) }
      if (this.shpInst1Details.freight_to_factory.checked) { row.push(r.freight2) }
      if (this.shpInst1Details.coo.checked) { row.push(r.coo) }
      if (this.shpInst1Details.epa.checked) { row.push(r.epa) }
      if (this.shpInst1Details.ip.checked) { row.push(r.ip) }
      if (this.shpInst1Details.free_dtnt_prd.checked) { row.push(r.free_detention_period) }

      //Ship Instance 2 Details
      if (this.shpInst2Details.cns_account_name.checked) { row.push(r.consignee_acnt_name) }
      if (this.shpInst2Details.cns_code.checked) { row.push(r.cns_code) }
      if (this.shpInst2Details.cns_country.checked) { row.push(r.cns_country) }
      if (this.shpInst2Details.cns_address.checked) { row.push(r.cns_address) }
      if (this.shpInst2Details.cns_tel.checked) { row.push(r.cns_tel) }
      if (this.shpInst2Details.cns_gst_in.checked) { row.push(r.cns_gst_code) }
      if (this.shpInst2Details.cns_contact.checked) { row.push(r.cns_contact_person) }
      if (this.shpInst2Details.cns_email.checked) { row.push(r.cns_email) }
      if (this.shpInst2Details.cns_iec_code.checked) { row.push(r.cns_iec_code) }
      if (this.shpInst2Details.bank_name.checked) { row.push(r.bank_name_on_cad) }
      if (this.shpInst2Details.bank_address.checked) { row.push(r.address) }
      if (this.shpInst2Details.bank_tel.checked) { row.push(r.tel) }
      if (this.shpInst2Details.ntf_acc_name.checked) { row.push(r.notify_acnt_name) }
      if (this.shpInst2Details.ntf_code.checked) { row.push(r.ntf_code) }
      if (this.shpInst2Details.ntf_country.checked) { row.push(r.ntf_country) }
      if (this.shpInst2Details.ntf_address.checked) { row.push(r.ntf_address) }
      if (this.shpInst2Details.ntf_tel.checked) { row.push(r.ntf_tel) }
      if (this.shpInst2Details.ntf_gst_in.checked) { row.push(r.ntf_gst_code) }
      if (this.shpInst2Details.ntf_contact.checked) { row.push(r.ntf_contact_person) }
      if (this.shpInst2Details.ntf_email.checked) { row.push(r.ntf_email) }

      //Indent Remakrs Details
      if (this.indRemarksDetails.production_start.checked) { row.push(r.production_start) }
      if (this.indRemarksDetails.customer_po_sheet.checked) { row.push(r.oth_customer_po_sheet) }
      if (this.indRemarksDetails.customer_sr_sheet.checked) { row.push(r.oth_sr_spec_sheet) }
      if (this.indRemarksDetails.drawing.checked) { row.push(r.oth_drawing) }
      if (this.indRemarksDetails.test_report.checked) { row.push(r.oth_test_report) }
      if (this.indRemarksDetails.customer_pi.checked) { row.push(r.oth_pi) }
      if (this.indRemarksDetails.lc_draft.checked) { row.push(r.oth_lc_draft) }
      if (this.indRemarksDetails.oth_doc1.checked) { row.push(r.oth_doc1) }
      if (this.indRemarksDetails.oth_doc2.checked) { row.push(r.oth_doc2) }
      if (this.indRemarksDetails.remarks.checked) { row.push(r.remarks1) }

      //Proforma Invoice Details
      if (this.piDetails.pi_no.checked) { row.push(r.pi_no) }
      if (this.piDetails.pi_date.checked) { row.push(r.pi_date) }
      if (this.piDetails.iipo_no.checked) { row.push(r.iipo_no) }
      if (this.piDetails.iipo_date.checked) { row.push(r.iipo_date) }
      if (this.piDetails.ij_project_no.checked) { row.push(r.ij_project_num) }
      if (this.piDetails.oc_date.checked) { row.push(r.oc_date) }
      if (this.piDetails.sa_date.checked) { row.push(r.sa_date) }

      //LC Details 
      if (this.lcDetails.lc_check_date.checked) { row.push(r.lc_chk_date_by_ij) }
      if (this.lcDetails.lc_open_date.checked) { row.push(r.lc_open_date) }
      if (this.lcDetails.lc_last_rev_date.checked) { row.push(r.lc_last_revision_date) }
      if (this.lcDetails.lc_shp_date.checked) { row.push(r.latest_shipment_date) }
      if (this.lcDetails.lc_expiry_date.checked) { row.push(r.lc_expiry_date) }

      //EXF Details
      if (this.exfDetails.exf1.checked) { row.push(r.exf1) }
      if (this.exfDetails.exf1_status.checked) { row.push(r.exf1_sts) }
      if (this.exfDetails.exf_ij_annt1.checked) { row.push(r.exf_ij_accment1) }
      if (this.exfDetails.exf2.checked) { row.push(r.exf2) }
      if (this.exfDetails.exf2_status.checked) { row.push(r.exf2_sts) }
      if (this.exfDetails.exf_ij_annt2.checked) { row.push(r.exf_ij_accment2) }
      if (this.exfDetails.exf3.checked) { row.push(r.exf3) }
      if (this.exfDetails.exf3_status.checked) { row.push(r.exf3_sts) }
      if (this.exfDetails.exf_ij_annt3.checked) { row.push(r.exf_ij_accment3) }

      //Ship Instance 2 FOB Fowarder detail
      if (this.shpInst2Details.fob_fowarder.checked) { row.push(r.fob_fowarder) }

      //ShpAdv Details
      if (this.shpAdvDetails.invoice_no_1.checked) { row.push(r.invoice_no1) }
      if (this.shpAdvDetails.invoice_date_1.checked) { row.push(r.invoice_date1) }
      if (this.shpAdvDetails.mode1.checked) { row.push(r.mode1) }
      if (this.shpAdvDetails.from1.checked) { row.push(r.from1) }
      if (this.shpAdvDetails.vessel1.checked) { row.push(r.vessel1) }
      if (this.shpAdvDetails.awb_bi_no_1.checked) { row.push(r.awb_bl_no1) }
      if (this.shpAdvDetails.etd1.checked) { row.push(r.etd1) }
      if (this.shpAdvDetails.eta1.checked) { row.push(r.eta1) }
      if (this.shpAdvDetails.invoice_no_2.checked) { row.push(r.invoice_no2) }
      if (this.shpAdvDetails.invoice_date_2.checked) { row.push(r.invoice_date2) }
      if (this.shpAdvDetails.mode2.checked) { row.push(r.mode2) }
      if (this.shpAdvDetails.from2.checked) { row.push(r.from2) }
      if (this.shpAdvDetails.vessel2.checked) { row.push(r.vessel2) }
      if (this.shpAdvDetails.awb_bi_no_2.checked) { row.push(r.awb_bl_no2) }
      if (this.shpAdvDetails.etd2.checked) { row.push(r.etd2) }
      if (this.shpAdvDetails.eta2.checked) { row.push(r.eta2) }
      if (this.shpAdvDetails.invoice_no_3.checked) { row.push(r.invoice_no3) }
      if (this.shpAdvDetails.invoice_date_3.checked) { row.push(r.invoice_date3) }
      if (this.shpAdvDetails.mode3.checked) { row.push(r.mode3) }
      if (this.shpAdvDetails.from3.checked) { row.push(r.from3) }
      if (this.shpAdvDetails.vessel3.checked) { row.push(r.vessel3) }
      if (this.shpAdvDetails.awb_bi_no_3.checked) { row.push(r.awb_bl_no3) }
      if (this.shpAdvDetails.etd3.checked) { row.push(r.etd3) }
      if (this.shpAdvDetails.eta3.checked) { row.push(r.eta3) }
      if (this.shpAdvDetails.eway_bill_rqd.checked) { row.push(r.eway_bill_req) }
      if (this.shpAdvDetails.eway_bill_no.checked) { row.push(r.eway_bill_num) }

      //Sales Admin Details
      if (this.salesAdminDetails.remarks.checked) { row.push(r.remarks2) }
      if (this.salesAdminDetails.com_month.checked) { row.push(r.com_month) }
      if (this.salesAdminDetails.checked_on.checked) { row.push(r.checked_on) }
      if (this.salesAdminDetails.next_check.checked) { row.push(r.next_check) }
      if (this.salesAdminDetails.for.checked) { row.push(r.for_info) }
      if (this.salesAdminDetails.delivery_status.checked) { row.push(r.del_sts) }

      
      // row.push(r.payment_id)
      row.push(r.payment_type)
      row.push(r.payment_date)
      row.push(r.payment_amount)
      if (this.salesAdminDetails.payment_status.checked) { row.push(r.pmt_sts) }

      this.indentBody.push(row);

      this.setOnePageRowList();
    }
    this.newIndentBody = this.indentBody
    if (this.selectedOutputFilter === true) {
      this.globalSearchKeyUp();
      this.selectedOutputFilter = false;
    }
    this.resetPageListButtonsParameters();
  }


  createInvoiceArray() {
    let header = [];
    let row = [];
    this.indentHeader = [];
    this.indentBody = [];
    let i=0;
    
    header.push(this.generalDetails.indent_sheet_no.name); i++;
    header.push(this.generalDetails.indent_issue_date.name); i++; 
    if (this.generalDetails.crm_opt_no.checked) { header.push(this.generalDetails.crm_opt_no.name); i++; }
    if(this.generalDetails.contract_account_name.checked){ header.push(this.generalDetails.contract_account_name.name); i++;}
    if (this.generalDetails.sos_summary.checked) { header.push(this.generalDetails.sos_summary.name); i++; }
    if (this.generalDetails.sales1_id.checked) { header.push(this.generalDetails.sales1_id.name); i++; }
    if (this.generalDetails.sales1_name.checked) { header.push(this.generalDetails.sales1_name.name); i++; }
    if (this.generalDetails.sales2_id.checked) { header.push(this.generalDetails.sales2_id.name); i++; }
    if (this.generalDetails.sales2_name.checked) { header.push(this.generalDetails.sales2_name.name); i++; }
    if (this.generalDetails.order_type.checked) { header.push(this.generalDetails.order_type.name); i++; }
    //po details
    if (this.poDetails.customer_po_no.checked) { header.push(this.poDetails.customer_po_no.name) }
    if (this.poDetails.customer_po_date.checked) { header.push(this.poDetails.customer_po_date.name) }
    //Account Details
    // if (this.accountDetails.cntr_account_name.checked) { header.push(this.accountDetails.cntr_account_name.name) }
    if (this.accountDetails.cntr_code.checked) { header.push(this.accountDetails.cntr_code.name) }
    if (this.accountDetails.cntr_country.checked) { header.push(this.accountDetails.cntr_country.name) }
    if (this.accountDetails.cntr_address.checked) { header.push(this.accountDetails.cntr_address.name) }
    if (this.accountDetails.cntr_tel.checked) { header.push(this.accountDetails.cntr_tel.name) }
    if (this.accountDetails.cntr_gst_in.checked) { header.push(this.accountDetails.cntr_gst_in.name) }
    if (this.accountDetails.cntr_contact.checked) { header.push(this.accountDetails.cntr_contact.name) }
    if (this.accountDetails.cntr_email.checked) { header.push(this.accountDetails.cntr_email.name) }
    if (this.accountDetails.user_account_name.checked) { header.push(this.accountDetails.user_account_name.name) }
    if (this.accountDetails.ua_code.checked) { header.push(this.accountDetails.ua_code.name) }
    if (this.accountDetails.ua_country.checked) { header.push(this.accountDetails.ua_country.name) }
    if (this.accountDetails.ua_address.checked) { header.push(this.accountDetails.ua_address.name) }
    if (this.accountDetails.ua_tel.checked) { header.push(this.accountDetails.ua_tel.name) }
    if (this.accountDetails.ua_gst_in.checked) { header.push(this.accountDetails.ua_gst_in.name) }
    if (this.accountDetails.ua_contact.checked) { header.push(this.accountDetails.ua_contact.name) }
    if (this.accountDetails.ua_email.checked) { header.push(this.accountDetails.ua_email.name) }
    if (this.accountDetails.key_account_flag.checked) { header.push(this.accountDetails.key_account_flag.name) }
    //PO Details
    if (this.poDetails.sp_currency.checked) { header.push(this.poDetails.sp_currency.name) }
    if (this.poDetails.list_price_total.checked) { header.push(this.poDetails.list_price_total.name) }
    if (this.poDetails.selling_price_total.checked) { header.push(this.poDetails.selling_price_total.name) }
    if (this.poDetails.pck_n_fwd.checked) { header.push(this.poDetails.pck_n_fwd.name) }
    if (this.poDetails.dmst_frt.checked) { header.push(this.poDetails.dmst_frt.name) }
    if (this.poDetails.sgst_percentage.checked) { header.push(this.poDetails.sgst_percentage.name) }
    if (this.poDetails.sgst_amount.checked) { header.push(this.poDetails.sgst_amount.name) }
    if (this.poDetails.cgst_percentage.checked) { header.push(this.poDetails.cgst_percentage.name) }
    if (this.poDetails.cgst_amount.checked) { header.push(this.poDetails.cgst_amount.name) }
    if (this.poDetails.igst_percentage.checked) { header.push(this.poDetails.igst_percentage.name) }
    if (this.poDetails.igst_amount.checked) { header.push(this.poDetails.igst_amount.name) }
    if (this.poDetails.inst_com.checked) { header.push(this.poDetails.inst_com.name) }
    if (this.poDetails.tp_currency.checked) { header.push(this.poDetails.tp_currency.name) }
    if (this.poDetails.transfer_price_1.checked) { header.push(this.poDetails.transfer_price_1.name) }
    if (this.poDetails.transfer_price_2.checked) { header.push(this.poDetails.transfer_price_2.name) }
    if (this.poDetails.iigm_inr.checked) { header.push(this.poDetails.iigm_inr.name) }
    if (this.paymentDetails.payment_terms.checked) { header.push(this.paymentDetails.payment_terms.name) }

    //Payment Details
    if (this.paymentDetails.adv_type.checked) { header.push(this.paymentDetails.adv_type.name) }
    if (this.paymentDetails.adv_percent.checked) { header.push(this.paymentDetails.adv_percent.name) }
    if (this.paymentDetails.adv_amount.checked) { header.push(this.paymentDetails.adv_amount.name) }
    if (this.paymentDetails.adv_date.checked) { header.push(this.paymentDetails.adv_date.name) }
    if (this.paymentDetails.bsh_type.checked) { header.push(this.paymentDetails.bsh_type.name) }
    if (this.paymentDetails.bsh_percent.checked) { header.push(this.paymentDetails.bsh_percent.name) }
    if (this.paymentDetails.bsh_amount.checked) { header.push(this.paymentDetails.bsh_amount.name) }
    if (this.paymentDetails.bsh_date.checked) { header.push(this.paymentDetails.bsh_date.name) }
    if (this.paymentDetails.ash_type.checked) { header.push(this.paymentDetails.ash_type.name) }
    if (this.paymentDetails.ash_percent.checked) { header.push(this.paymentDetails.ash_percent.name) }
    if (this.paymentDetails.ash_amount.checked) { header.push(this.paymentDetails.ash_amount.name) }
    if (this.paymentDetails.ash_date.checked) { header.push(this.paymentDetails.ash_date.name) }


    //Third Party Commision Details
    if (this.comDetails.tp_com_currency.checked) { header.push(this.comDetails.tp_com_currency.name) }
    if (this.comDetails.tp_com_amount.checked) { header.push(this.comDetails.tp_com_amount.name) }
    if (this.comDetails.tp_com_paid.checked) { header.push(this.comDetails.tp_com_paid.name) }
    if (this.comDetails.tp_com_acnt_name.checked) { header.push(this.comDetails.tp_com_acnt_name.name) }
    if (this.comDetails.com_code.checked) { header.push(this.comDetails.com_code.name) }
    if (this.comDetails.com_country.checked) { header.push(this.comDetails.com_country.name) }
    if (this.comDetails.com_acnt_address.checked) { header.push(this.comDetails.com_acnt_address.name) }
    if (this.comDetails.com_tel.checked) { header.push(this.comDetails.com_tel.name) }
    if (this.comDetails.com_gst_in.checked) { header.push(this.comDetails.com_gst_in.name) }
    if (this.comDetails.com_contact.checked) { header.push(this.comDetails.com_contact.name) }
    if (this.comDetails.com_email.checked) { header.push(this.comDetails.com_email.name) }

    //Application Details
    if (this.applicationDetails.customer_app_code.checked) { header.push(this.applicationDetails.customer_app_code.name) }
    if (this.applicationDetails.application_type.checked) { header.push(this.applicationDetails.application_type.name) }
    if (this.applicationDetails.customer_app_desc.checked) { header.push(this.applicationDetails.customer_app_desc.name) }

    //Ship Instance 1 Details
    if (this.shpInst1Details.request_etd_user.checked) { header.push(this.shpInst1Details.request_etd_user.name) }
    if (this.shpInst1Details.request_eta_user.checked) { header.push(this.shpInst1Details.request_eta_user.name) }
    if (this.shpInst1Details.trade_terms.checked) { header.push(this.shpInst1Details.trade_terms.name) }
    if (this.shpInst1Details.dest_port.checked) { header.push(this.shpInst1Details.dest_port.name) }
    if (this.shpInst1Details.mot.checked) { header.push(this.shpInst1Details.mot.name) }
    if (this.shpInst1Details.freight.checked) { header.push(this.shpInst1Details.freight.name) }
    if (this.shpInst1Details.request_etd_factory.checked) { header.push(this.shpInst1Details.request_etd_factory.name) }
    if (this.shpInst1Details.request_eta_factory.checked) { header.push(this.shpInst1Details.request_eta_factory.name) }
    if (this.shpInst1Details.trade_terms_factory.checked) { header.push(this.shpInst1Details.trade_terms_factory.name) }
    // trd trade missing filled
    if (this.shpInst1Details.dest_port_factory.checked) { header.push(this.shpInst1Details.dest_port_factory.name) }
    if (this.shpInst1Details.mot_to_factory.checked) { header.push(this.shpInst1Details.mot_to_factory.name) }
    if (this.shpInst1Details.freight_to_factory.checked) { header.push(this.shpInst1Details.freight_to_factory.name) }
    if (this.shpInst1Details.coo.checked) { header.push(this.shpInst1Details.coo.name) }
    if (this.shpInst1Details.epa.checked) { header.push(this.shpInst1Details.epa.name) }
    if (this.shpInst1Details.ip.checked) { header.push(this.shpInst1Details.ip.name) }
    if (this.shpInst1Details.free_dtnt_prd.checked) { header.push(this.shpInst1Details.free_dtnt_prd.name) }

    //Ship Instance 2 Details
    if (this.shpInst2Details.cns_account_name.checked) { header.push(this.shpInst2Details.cns_account_name.name) }
    if (this.shpInst2Details.cns_code.checked) { header.push(this.shpInst2Details.cns_code.name) }
    if (this.shpInst2Details.cns_country.checked) { header.push(this.shpInst2Details.cns_country.name) }
    if (this.shpInst2Details.cns_address.checked) { header.push(this.shpInst2Details.cns_address.name) }
    if (this.shpInst2Details.cns_tel.checked) { header.push(this.shpInst2Details.cns_tel.name) }
    if (this.shpInst2Details.cns_gst_in.checked) { header.push(this.shpInst2Details.cns_gst_in.name) }
    if (this.shpInst2Details.cns_contact.checked) { header.push(this.shpInst2Details.cns_contact.name) }
    if (this.shpInst2Details.cns_email.checked) { header.push(this.shpInst2Details.cns_email.name) }
    if (this.shpInst2Details.cns_iec_code.checked) { header.push(this.shpInst2Details.cns_iec_code.name) }
    if (this.shpInst2Details.bank_name.checked) { header.push(this.shpInst2Details.bank_name.name) }
    if (this.shpInst2Details.bank_address.checked) { header.push(this.shpInst2Details.bank_address.name) }
    if (this.shpInst2Details.bank_tel.checked) { header.push(this.shpInst2Details.bank_tel.name) }
    if (this.shpInst2Details.ntf_acc_name.checked) { header.push(this.shpInst2Details.ntf_acc_name.name) }
    if (this.shpInst2Details.ntf_code.checked) { header.push(this.shpInst2Details.ntf_code.name) }
    if (this.shpInst2Details.ntf_country.checked) { header.push(this.shpInst2Details.ntf_country.name) }
    if (this.shpInst2Details.ntf_address.checked) { header.push(this.shpInst2Details.ntf_address.name) }
    if (this.shpInst2Details.ntf_tel.checked) { header.push(this.shpInst2Details.ntf_tel.name) }
    if (this.shpInst2Details.ntf_gst_in.checked) { header.push(this.shpInst2Details.ntf_gst_in.name) }
    if (this.shpInst2Details.ntf_contact.checked) { header.push(this.shpInst2Details.ntf_contact.name) }
    if (this.shpInst2Details.ntf_email.checked) { header.push(this.shpInst2Details.ntf_email.name) }

    //
    if (this.indRemarksDetails.production_start.checked) { header.push(this.indRemarksDetails.production_start.name) }
    if (this.indRemarksDetails.customer_po_sheet.checked) { header.push(this.indRemarksDetails.customer_po_sheet.name) }
    if (this.indRemarksDetails.customer_sr_sheet.checked) { header.push(this.indRemarksDetails.customer_sr_sheet.name) }
    if (this.indRemarksDetails.drawing.checked) { header.push(this.indRemarksDetails.drawing.name) }
    if (this.indRemarksDetails.test_report.checked) { header.push(this.indRemarksDetails.test_report.name) }
    if (this.indRemarksDetails.customer_pi.checked) { header.push(this.indRemarksDetails.customer_pi.name) }
    if (this.indRemarksDetails.lc_draft.checked) { header.push(this.indRemarksDetails.lc_draft.name) }
    if (this.indRemarksDetails.oth_doc1.checked) { header.push(this.indRemarksDetails.oth_doc1.name) }
    if (this.indRemarksDetails.oth_doc2.checked) { header.push(this.indRemarksDetails.oth_doc2.name) }
    if (this.indRemarksDetails.remarks.checked) { header.push(this.indRemarksDetails.remarks.name) }

    //Proforma Invoice Details
    if (this.piDetails.pi_no.checked) { header.push(this.piDetails.pi_no.name) }
    if (this.piDetails.pi_date.checked) { header.push(this.piDetails.pi_date.name) }
    if (this.piDetails.iipo_no.checked) { header.push(this.piDetails.iipo_no.name) }
    if (this.piDetails.iipo_date.checked) { header.push(this.piDetails.iipo_date.name) }
    if (this.piDetails.ij_project_no.checked) { header.push(this.piDetails.ij_project_no.name) }
    if (this.piDetails.oc_date.checked) { header.push(this.piDetails.oc_date.name) }
    if (this.piDetails.sa_date.checked) { header.push(this.piDetails.sa_date.name) }

    //LC Details
    if (this.lcDetails.lc_check_date.checked) { header.push(this.lcDetails.lc_check_date.name) }
    if (this.lcDetails.lc_open_date.checked) { header.push(this.lcDetails.lc_open_date.name) }
    if (this.lcDetails.lc_last_rev_date.checked) { header.push(this.lcDetails.lc_last_rev_date.name) }
    if (this.lcDetails.lc_shp_date.checked) { header.push(this.lcDetails.lc_shp_date.name) }
    if (this.lcDetails.lc_expiry_date.checked) { header.push(this.lcDetails.lc_expiry_date.name) }

    //EXF Details
    if (this.exfDetails.exf1.checked) { header.push(this.exfDetails.exf1.name) }
    if (this.exfDetails.exf1_status.checked) { header.push(this.exfDetails.exf1_status.name) }
    if (this.exfDetails.exf_ij_annt1.checked) { header.push(this.exfDetails.exf_ij_annt1.name) }
    if (this.exfDetails.exf2.checked) { header.push(this.exfDetails.exf2.name) }
    if (this.exfDetails.exf2_status.checked) { header.push(this.exfDetails.exf2_status.name) }
    if (this.exfDetails.exf_ij_annt2.checked) { header.push(this.exfDetails.exf_ij_annt2.name) }
    if (this.exfDetails.exf3.checked) { header.push(this.exfDetails.exf3.name) }
    if (this.exfDetails.exf3_status.checked) { header.push(this.exfDetails.exf3_status.name) }
    if (this.exfDetails.exf_ij_annt3.checked) { header.push(this.exfDetails.exf_ij_annt3.name) }

    //Ship Instance 2 FOB Fowarder detail
    if (this.shpInst2Details.fob_fowarder.checked) { header.push(this.shpInst2Details.fob_fowarder.name) }

    //ShpAdv Details
    if (this.shpAdvDetails.invoice_no_1.checked) { header.push(this.shpAdvDetails.invoice_no_1.name) }
    if (this.shpAdvDetails.invoice_date_1.checked) { header.push(this.shpAdvDetails.invoice_date_1.name) }
    if (this.shpAdvDetails.mode1.checked) { header.push(this.shpAdvDetails.mode1.name) }
    if (this.shpAdvDetails.from1.checked) { header.push(this.shpAdvDetails.from1.name) }
    if (this.shpAdvDetails.vessel1.checked) { header.push(this.shpAdvDetails.vessel1.name) }
    if (this.shpAdvDetails.awb_bi_no_1.checked) { header.push(this.shpAdvDetails.awb_bi_no_1.name) }
    if (this.shpAdvDetails.etd1.checked) { header.push(this.shpAdvDetails.etd1.name) }
    if (this.shpAdvDetails.eta1.checked) { header.push(this.shpAdvDetails.eta1.name) }
    if (this.shpAdvDetails.invoice_no_2.checked) { header.push(this.shpAdvDetails.invoice_no_2.name) }
    if (this.shpAdvDetails.invoice_date_2.checked) { header.push(this.shpAdvDetails.invoice_date_2.name) }
    if (this.shpAdvDetails.mode2.checked) { header.push(this.shpAdvDetails.mode2.name) }
    if (this.shpAdvDetails.from2.checked) { header.push(this.shpAdvDetails.from2.name) }
    if (this.shpAdvDetails.vessel2.checked) { header.push(this.shpAdvDetails.vessel2.name) }
    if (this.shpAdvDetails.awb_bi_no_2.checked) { header.push(this.shpAdvDetails.awb_bi_no_2.name) }
    if (this.shpAdvDetails.etd2.checked) { header.push(this.shpAdvDetails.etd2.name) }
    if (this.shpAdvDetails.eta2.checked) { header.push(this.shpAdvDetails.eta2.name) }
    if (this.shpAdvDetails.invoice_no_3.checked) { header.push(this.shpAdvDetails.invoice_no_3.name) }
    if (this.shpAdvDetails.invoice_date_3.checked) { header.push(this.shpAdvDetails.invoice_date_3.name) }
    if (this.shpAdvDetails.mode3.checked) { header.push(this.shpAdvDetails.mode3.name) }
    if (this.shpAdvDetails.from3.checked) { header.push(this.shpAdvDetails.from3.name) }
    if (this.shpAdvDetails.vessel3.checked) { header.push(this.shpAdvDetails.vessel3.name) }
    if (this.shpAdvDetails.awb_bi_no_3.checked) { header.push(this.shpAdvDetails.awb_bi_no_3.name) }
    if (this.shpAdvDetails.etd3.checked) { header.push(this.shpAdvDetails.etd3.name) }
    if (this.shpAdvDetails.eta3.checked) { header.push(this.shpAdvDetails.eta3.name) }
    if (this.shpAdvDetails.eway_bill_rqd.checked) { header.push(this.shpAdvDetails.eway_bill_rqd.name) }
    if (this.shpAdvDetails.eway_bill_no.checked) { header.push(this.shpAdvDetails.eway_bill_no.name) }

    //Sales Admin Details
    if (this.salesAdminDetails.remarks.checked) { header.push(this.salesAdminDetails.remarks.name) }
    if (this.salesAdminDetails.com_month.checked) { header.push(this.salesAdminDetails.com_month.name) }
    if (this.salesAdminDetails.checked_on.checked) { header.push(this.salesAdminDetails.checked_on.name) }
    if (this.salesAdminDetails.next_check.checked) { header.push(this.salesAdminDetails.next_check.name) }
    if (this.salesAdminDetails.for.checked) { header.push(this.salesAdminDetails.for.name) }
    if (this.salesAdminDetails.payment_status.checked) { header.push(this.salesAdminDetails.payment_status.name) }
    if (this.salesAdminDetails.delivery_status.checked) { header.push(this.salesAdminDetails.delivery_status.name) }
    
    // header.push(this.subInvoiceDetails.invoice_id.name)
    header.push(this.subInvoiceDetails.inv_request_anct_date.name)
    header.push(this.subInvoiceDetails.inv_issuance_date.name)
    header.push(this.subInvoiceDetails.inv_no.name)
    header.push(this.subInvoiceDetails.ewb_no.name)
    header.push(this.subInvoiceDetails.ewb_issuance_date.name)
    header.push(this.subInvoiceDetails.transportation_method.name)
    header.push(this.subInvoiceDetails.dispatch_date.name)
    header.push(this.subInvoiceDetails.dispatch_from_indent.name)
    header.push(this.subInvoiceDetails.dispatch_from_origin.name)
    header.push(this.subInvoiceDetails.dispatch_to_indent.name)
    header.push(this.subInvoiceDetails.dispatch_to_destination.name)
    header.push(this.subInvoiceDetails.machine_sn.name)
    this.indentHeader = header;  // passing the whole selected headers to indent Header array
    this.generalDetailColumn= i ;
    for (let r of this.InvoiceList) {
      row = [];
      
      row.push(r.indent_sheet_num)
      row.push(r.indent_issue_date) 
      if (this.generalDetails.crm_opt_no.checked) { row.push(r.crm_opt_num) }
      if (this.generalDetails.contract_account_name.checked){ row.push(r.contract_acnt_name)}
      if (this.generalDetails.sos_summary.checked) { row.push(r.sos_summary) }
      if (this.generalDetails.sales1_id.checked) { row.push(r.sales1_id) }
      if (this.generalDetails.sales1_name.checked) { row.push(r.sales1_name) }
      if (this.generalDetails.sales2_id.checked) { row.push(r.sales2_id) }
      if (this.generalDetails.sales2_name.checked) { row.push(r.sales2_name) }
      if (this.generalDetails.order_type.checked) { row.push(r.order_type) }
      //po details
      if (this.poDetails.customer_po_no.checked) { row.push(r.customer_po_num) }
      if (this.poDetails.customer_po_date.checked) { row.push(r.customer_po_date) }
      //Account Details
      // if (this.accountDetails.cntr_account_name.checked) { row.push(r.contract_acnt_name) }
      if (this.accountDetails.cntr_code.checked) { row.push(r.cntr_code) }
      if (this.accountDetails.cntr_country.checked) { row.push(r.cntr_country) }
      if (this.accountDetails.cntr_address.checked) { row.push(r.cntr_address) }
      if (this.accountDetails.cntr_tel.checked) { row.push(r.cntr_tel) }
      if (this.accountDetails.cntr_gst_in.checked) { row.push(r.cntr_gst_code) }
      if (this.accountDetails.cntr_contact.checked) { row.push(r.cntr_contact_person) }
      if (this.accountDetails.cntr_email.checked) { row.push(r.cntr_email) }
      if (this.accountDetails.user_account_name.checked) { row.push(r.user_acnt_name) }
      if (this.accountDetails.ua_code.checked) { row.push(r.ua_code) }
      if (this.accountDetails.ua_country.checked) { row.push(r.ua_country) }
      if (this.accountDetails.ua_address.checked) { row.push(r.ua_address) }
      if (this.accountDetails.ua_tel.checked) { row.push(r.ua_tel) }
      if (this.accountDetails.ua_gst_in.checked) { row.push(r.ua_gst_code) }
      if (this.accountDetails.ua_contact.checked) { row.push(r.ua_contact_person) }
      if (this.accountDetails.ua_email.checked) { row.push(r.ua_email) }
      if (this.accountDetails.key_account_flag.checked) { row.push(r.key_account_flag) }
      //PO Details
      if (this.poDetails.sp_currency.checked) { row.push(r.sp_cur) }
      if (this.poDetails.list_price_total.checked) { row.push(r.lp_total) }
      if (this.poDetails.selling_price_total.checked) { row.push(r.sp_total) }
      if (this.poDetails.pck_n_fwd.checked) { row.push(r.pck_and_fwd_amnt) }
      if (this.poDetails.dmst_frt.checked) { row.push(r.domestic_freight_amnt) }
      // convert to percentage if exist.
      if (this.poDetails.sgst_percentage.checked) {
        if (r.sgst_pc) {
          if (r.sgst_pc.toString() == "NA") {   // if it has NaN 
            row.push("")
          }
          else {
            row.push((+r.sgst_pc * 100).toString().concat("%"))
          }
        }
        else {
          row.push(r.sgst_pc)
        }
      }
      if (this.poDetails.sgst_amount.checked) { row.push(r.sgst_amount) }
      //converting into percentage.
      if (this.poDetails.cgst_percentage.checked) {   // if it has NaN
        if (r.cgst_pc) {
          if (r.cgst_pc.toString() == "NA") {
            row.push("")
          }
          else {
            row.push((+r.cgst_pc * 100).toString().concat("%"))
          }
        }
        else {
          row.push(r.cgst_pc)
        }
      }
      if (this.poDetails.cgst_amount.checked) { row.push(r.cgst_amount) }
      // converting into percentage.
      if (this.poDetails.igst_percentage.checked) {
        if (r.igst_pc) {
          if (r.igst_pc.toString() == "NA") {
            row.push("")
          }
          else {
            row.push((+r.igst_pc * 100).toString().concat("%"))
          }
        }
        else {
          row.push(r.igst_pc)
        }
      }
      if (this.poDetails.igst_amount.checked) { row.push(r.igst_amount) }
      if (this.poDetails.inst_com.checked) { row.push(r.inst_com_amnt) }
      if (this.poDetails.tp_currency.checked) { row.push(r.tp_cur) }
      if (this.poDetails.transfer_price_1.checked) { row.push(r.tp1) }
      if (this.poDetails.transfer_price_2.checked) { row.push(r.tp2) }
      if (this.poDetails.iigm_inr.checked) { row.push(r.iigm) }
      if (this.paymentDetails.payment_terms.checked) { row.push(r.pmt_trms) }

      //Payment Details
      if (this.paymentDetails.adv_type.checked) { row.push(r.adv_type) }
      // converting into percentage.
      if (this.paymentDetails.adv_percent.checked) {
        if (r.adv_pc) {
          if (r.adv_pc.toString() == "NA") {
            row.push("")
          }
          else {
            row.push((+r.adv_pc * 100).toString().concat("%"))
          }
        }
        else {
          row.push(r.adv_pc)
        }
      }
      if (this.paymentDetails.adv_amount.checked) { row.push(r.adv_amount) }
      if (this.paymentDetails.adv_date.checked) { row.push(r.adv_date) }
      if (this.paymentDetails.bsh_type.checked) { row.push(r.bsh_type) }
      // converting into percentage.
      if (this.paymentDetails.bsh_percent.checked) {
        if (r.bsh_pc) {
          if (r.bsh_pc.toString() == "NA") {
            row.push("")
          }
          else {
            row.push((+r.bsh_pc * 100).toString().concat("%"))
          }
        }
        else {
          row.push(r.bsh_pc)
        }
      }
      if (this.paymentDetails.bsh_amount.checked) { row.push(r.bsh_amount) }
      if (this.paymentDetails.bsh_date.checked) { row.push(r.bsh_date) }
      if (this.paymentDetails.ash_type.checked) { row.push(r.ash_type) }
      // converting into percentage.
      if (this.paymentDetails.ash_percent.checked) {
        if (r.ash_pc) {
          if (r.ash_pc.toString() == "NA") {
            row.push("")
          }
          else {
            row.push((+r.ash_pc * 100).toString().concat("%"))
          }
        }
        else {
          row.push(r.ash_pc)
        }
      }
      if (this.paymentDetails.ash_amount.checked) { row.push(r.ash_amount) }
      if (this.paymentDetails.ash_date.checked) { row.push(r.ash_date) }


      //Third Party Commision Details
      if (this.comDetails.tp_com_currency.checked) { row.push(r.thirdp_com_cur) }
      if (this.comDetails.tp_com_amount.checked) { row.push(r.thirdp_com_amnt) }
      if (this.comDetails.tp_com_paid.checked) { row.push(r.thirdp_com_paid_by) }
      if (this.comDetails.tp_com_acnt_name.checked) { row.push(r.com_acnt_name) }
      if (this.comDetails.com_code.checked) { row.push(r.com_code) }
      if (this.comDetails.com_country.checked) { row.push(r.com_country) }
      if (this.comDetails.com_acnt_address.checked) { row.push(r.com_address) }
      if (this.comDetails.com_tel.checked) { row.push(r.com_tel) }
      if (this.comDetails.com_gst_in.checked) { row.push(r.com_gst_code) }
      if (this.comDetails.com_contact.checked) { row.push(r.com_contact_person) }
      if (this.comDetails.com_email.checked) { row.push(r.com_email) }

      //Application Details
      if (this.applicationDetails.customer_app_code.checked) { row.push(r.csutomer_application_code) }
      if (this.applicationDetails.application_type.checked) { row.push(r.customer_application_type) }
      if (this.applicationDetails.customer_app_desc.checked) { row.push(r.customer_app_desc) }

      //Ship Instance 1 Details
      if (this.shpInst1Details.request_etd_user.checked) { row.push(r.req_etd_by_customer) }
      if (this.shpInst1Details.request_eta_user.checked) { row.push(r.req_eta_by_customer) }
      if (this.shpInst1Details.trade_terms.checked) { row.push(r.trd_trms_with_customer) }
      if (this.shpInst1Details.dest_port.checked) { row.push(r.dest_port_by_customer) }
      if (this.shpInst1Details.mot.checked) { row.push(r.mot) }
      if (this.shpInst1Details.freight.checked) { row.push(r.freight1) }
      if (this.shpInst1Details.request_etd_factory.checked) { row.push(r.req_etd_to_ij) }
      if (this.shpInst1Details.request_eta_factory.checked) { row.push(r.req_eta_to_ij) }
      if (this.shpInst1Details.trade_terms_factory.checked) { row.push(r.trd_trms_with_ij) }
      if (this.shpInst1Details.dest_port_factory.checked) { row.push(r.dest_port_to_ij) }
      if (this.shpInst1Details.mot_to_factory.checked) { row.push(r.mot_to_ij) }
      if (this.shpInst1Details.freight_to_factory.checked) { row.push(r.freight2) }
      if (this.shpInst1Details.coo.checked) { row.push(r.coo) }
      if (this.shpInst1Details.epa.checked) { row.push(r.epa) }
      if (this.shpInst1Details.ip.checked) { row.push(r.ip) }
      if (this.shpInst1Details.free_dtnt_prd.checked) { row.push(r.free_detention_period) }

      //Ship Instance 2 Details
      if (this.shpInst2Details.cns_account_name.checked) { row.push(r.consignee_acnt_name) }
      if (this.shpInst2Details.cns_code.checked) { row.push(r.cns_code) }
      if (this.shpInst2Details.cns_country.checked) { row.push(r.cns_country) }
      if (this.shpInst2Details.cns_address.checked) { row.push(r.cns_address) }
      if (this.shpInst2Details.cns_tel.checked) { row.push(r.cns_tel) }
      if (this.shpInst2Details.cns_gst_in.checked) { row.push(r.cns_gst_code) }
      if (this.shpInst2Details.cns_contact.checked) { row.push(r.cns_contact_person) }
      if (this.shpInst2Details.cns_email.checked) { row.push(r.cns_email) }
      if (this.shpInst2Details.cns_iec_code.checked) { row.push(r.cns_iec_code) }
      if (this.shpInst2Details.bank_name.checked) { row.push(r.bank_name_on_cad) }
      if (this.shpInst2Details.bank_address.checked) { row.push(r.address) }
      if (this.shpInst2Details.bank_tel.checked) { row.push(r.tel) }
      if (this.shpInst2Details.ntf_acc_name.checked) { row.push(r.notify_acnt_name) }
      if (this.shpInst2Details.ntf_code.checked) { row.push(r.ntf_code) }
      if (this.shpInst2Details.ntf_country.checked) { row.push(r.ntf_country) }
      if (this.shpInst2Details.ntf_address.checked) { row.push(r.ntf_address) }
      if (this.shpInst2Details.ntf_tel.checked) { row.push(r.ntf_tel) }
      if (this.shpInst2Details.ntf_gst_in.checked) { row.push(r.ntf_gst_code) }
      if (this.shpInst2Details.ntf_contact.checked) { row.push(r.ntf_contact_person) }
      if (this.shpInst2Details.ntf_email.checked) { row.push(r.ntf_email) }

      //Indent Remakrs Details
      if (this.indRemarksDetails.production_start.checked) { row.push(r.production_start) }
      if (this.indRemarksDetails.customer_po_sheet.checked) { row.push(r.oth_customer_po_sheet) }
      if (this.indRemarksDetails.customer_sr_sheet.checked) { row.push(r.oth_sr_spec_sheet) }
      if (this.indRemarksDetails.drawing.checked) { row.push(r.oth_drawing) }
      if (this.indRemarksDetails.test_report.checked) { row.push(r.oth_test_report) }
      if (this.indRemarksDetails.customer_pi.checked) { row.push(r.oth_pi) }
      if (this.indRemarksDetails.lc_draft.checked) { row.push(r.oth_lc_draft) }
      if (this.indRemarksDetails.oth_doc1.checked) { row.push(r.oth_doc1) }
      if (this.indRemarksDetails.oth_doc2.checked) { row.push(r.oth_doc2) }
      if (this.indRemarksDetails.remarks.checked) { row.push(r.remarks1) }

      //Proforma Invoice Details
      if (this.piDetails.pi_no.checked) { row.push(r.pi_no) }
      if (this.piDetails.pi_date.checked) { row.push(r.pi_date) }
      if (this.piDetails.iipo_no.checked) { row.push(r.iipo_no) }
      if (this.piDetails.iipo_date.checked) { row.push(r.iipo_date) }
      if (this.piDetails.ij_project_no.checked) { row.push(r.ij_project_num) }
      if (this.piDetails.oc_date.checked) { row.push(r.oc_date) }
      if (this.piDetails.sa_date.checked) { row.push(r.sa_date) }

      //LC Details 
      if (this.lcDetails.lc_check_date.checked) { row.push(r.lc_chk_date_by_ij) }
      if (this.lcDetails.lc_open_date.checked) { row.push(r.lc_open_date) }
      if (this.lcDetails.lc_last_rev_date.checked) { row.push(r.lc_last_revision_date) }
      if (this.lcDetails.lc_shp_date.checked) { row.push(r.latest_shipment_date) }
      if (this.lcDetails.lc_expiry_date.checked) { row.push(r.lc_expiry_date) }

      //EXF Details
      if (this.exfDetails.exf1.checked) { row.push(r.exf1) }
      if (this.exfDetails.exf1_status.checked) { row.push(r.exf1_sts) }
      if (this.exfDetails.exf_ij_annt1.checked) { row.push(r.exf_ij_accment1) }
      if (this.exfDetails.exf2.checked) { row.push(r.exf2) }
      if (this.exfDetails.exf2_status.checked) { row.push(r.exf2_sts) }
      if (this.exfDetails.exf_ij_annt2.checked) { row.push(r.exf_ij_accment2) }
      if (this.exfDetails.exf3.checked) { row.push(r.exf3) }
      if (this.exfDetails.exf3_status.checked) { row.push(r.exf3_sts) }
      if (this.exfDetails.exf_ij_annt3.checked) { row.push(r.exf_ij_accment3) }

      //Ship Instance 2 FOB Fowarder detail
      if (this.shpInst2Details.fob_fowarder.checked) { row.push(r.fob_fowarder) }

      //ShpAdv Details
      if (this.shpAdvDetails.invoice_no_1.checked) { row.push(r.invoice_no1) }
      if (this.shpAdvDetails.invoice_date_1.checked) { row.push(r.invoice_date1) }
      if (this.shpAdvDetails.mode1.checked) { row.push(r.mode1) }
      if (this.shpAdvDetails.from1.checked) { row.push(r.from1) }
      if (this.shpAdvDetails.vessel1.checked) { row.push(r.vessel1) }
      if (this.shpAdvDetails.awb_bi_no_1.checked) { row.push(r.awb_bl_no1) }
      if (this.shpAdvDetails.etd1.checked) { row.push(r.etd1) }
      if (this.shpAdvDetails.eta1.checked) { row.push(r.eta1) }
      if (this.shpAdvDetails.invoice_no_2.checked) { row.push(r.invoice_no2) }
      if (this.shpAdvDetails.invoice_date_2.checked) { row.push(r.invoice_date2) }
      if (this.shpAdvDetails.mode2.checked) { row.push(r.mode2) }
      if (this.shpAdvDetails.from2.checked) { row.push(r.from2) }
      if (this.shpAdvDetails.vessel2.checked) { row.push(r.vessel2) }
      if (this.shpAdvDetails.awb_bi_no_2.checked) { row.push(r.awb_bl_no2) }
      if (this.shpAdvDetails.etd2.checked) { row.push(r.etd2) }
      if (this.shpAdvDetails.eta2.checked) { row.push(r.eta2) }
      if (this.shpAdvDetails.invoice_no_3.checked) { row.push(r.invoice_no3) }
      if (this.shpAdvDetails.invoice_date_3.checked) { row.push(r.invoice_date3) }
      if (this.shpAdvDetails.mode3.checked) { row.push(r.mode3) }
      if (this.shpAdvDetails.from3.checked) { row.push(r.from3) }
      if (this.shpAdvDetails.vessel3.checked) { row.push(r.vessel3) }
      if (this.shpAdvDetails.awb_bi_no_3.checked) { row.push(r.awb_bl_no3) }
      if (this.shpAdvDetails.etd3.checked) { row.push(r.etd3) }
      if (this.shpAdvDetails.eta3.checked) { row.push(r.eta3) }
      if (this.shpAdvDetails.eway_bill_rqd.checked) { row.push(r.eway_bill_req) }
      if (this.shpAdvDetails.eway_bill_no.checked) { row.push(r.eway_bill_num) }

      //Sales Admin Details
      if (this.salesAdminDetails.remarks.checked) { row.push(r.remarks2) }
      if (this.salesAdminDetails.com_month.checked) { row.push(r.com_month) }
      if (this.salesAdminDetails.checked_on.checked) { row.push(r.checked_on) }
      if (this.salesAdminDetails.next_check.checked) { row.push(r.next_check) }
      if (this.salesAdminDetails.for.checked) { row.push(r.for_info) }
      if (this.salesAdminDetails.payment_status.checked) { row.push(r.pmt_sts) }
      if (this.salesAdminDetails.delivery_status.checked) { row.push(r.del_sts) }


      // row.push(r.invoice_id)
      row.push(r.inv_request_anct_date)
      row.push(r.inv_issuance_date)
      row.push(r.inv_no)
      row.push(r.ewb_no)
      row.push(r.ewb_issuance_date)
      row.push(r.transportation_method)
      row.push(r.dispatch_date)
      row.push(r.dispatch_from_indent)
      row.push(r.dispatch_from_origin)
      row.push(r.dispatch_to_indent)
      row.push(r.dispatch_to_destination)
      row.push(r.machine_sn)

      this.indentBody.push(row);
      this.setOnePageRowList();
    }
    this.newIndentBody = this.indentBody
    if (this.selectedOutputFilter === true) {
      this.globalSearchKeyUp();
      this.selectedOutputFilter = false;
    }
    this.resetPageListButtonsParameters();
  }


  onChangeIndentTypeGetData(){

    //added ngx ui loader Service to start
    this.ngxService.start();

    this.allDateFlag = true;
    this.rangeDateFlag = false;
    this.selectYearFlag = false;
    this.conditionalFilterFlag = false;
    this.indentRange = "ALL";
    this.resetOutputFilter();
    if (this.allDateFlag) {
      this.fetchData();
    }
    this.searchText = '';
    this.generatePageListButtons();
    this.resetConditionalFilterOption();

    this.ngxService.stop();
    //added ngx ui loader Service to stop
  }
}

