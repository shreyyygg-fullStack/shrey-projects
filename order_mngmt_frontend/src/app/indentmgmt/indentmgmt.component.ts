import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgbDateParserFormatter, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { IndentData, DetailDialogDataSet, indentFormUpdate, IndentUpdateStatus, updateIndentData, IndentUpdateNewTabs, IndentUpdateINVEWB, IndentUpdatePMT, IndentFromInvoice, InvoiceFilterDataType, Indent, SegmapEmails, SegmapEmailData } from '../shared/services/indentdb.type';
import Swal from 'sweetalert2';
import { GlobalConstants } from '../shared/common/global-constants';
import { Subject, Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import * as JSZip from 'jszip';
import { EmailService } from '../shared/services/email.service';

// Point to the local JS worker you copied
pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdfjs/pdf.worker.js';

export interface FilterYearList {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-indentmgmt',
  templateUrl: './indentmgmt.component.html',
  styleUrls: ['./indentmgmt.component.css'],
  providers: [DatePipe]
})

export class IndentmgmtComponent implements OnInit {

  @ViewChild('invFileInput') invFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('ewbFileInput') ewbFileInput!: ElementRef<HTMLInputElement>;

  @ViewChild('invformFileInput') invformFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('ewbformFileInput') ewbformFileInput!: ElementRef<HTMLInputElement>;

  @ViewChild('imgFileInput') imgFileInput!: ElementRef<HTMLInputElement>;

  searchEmailText: string = '';
  invNewbFiles: any[] = [];
  invFiles: any[] = [];
  ewbFiles: any[] = [];
  filteredInvFiles: any[] = [];
  filteredEwbFiles: any[] = [];
  invNewbFiles1: any[] = [];
  invFiles1: any[] = [];
  ewbFiles1: any[] = [];
  docFiles1: any[] = [];
  imageFiles1: any[] = [];
  selectAll: boolean = false;
  indeterminate = false;
  selectedFiles: any[] = [];
  filesSelection: boolean = false;
  invId: string = "";

  regionEmailData: any[] = [];
  regions: any[] = [];
  selectedRegions: string[] = []; // stores selected region names
  selectedEmails: string[] = [];  // stores final email list

  registeredEmails: SegmapEmails[] = [];
  filterregisteredEmails: SegmapEmails[] = [];

  checkedEmails: string[] = [];
  emailFormData: SegmapEmailData[] = [];
  subjectData: string;
  bodyData: string;
  bodyNote: string = "";
  bodyMsg: string = "";
  eFlag: boolean;

  sendEmailFlag: boolean;
  sendEmailMsg: string = "";
  otherDoc: boolean = false;

  invoiceID: number;
  invAttachedFormFiles: File[] = [];
  ewbAttachedFormFiles: File[] = [];
  verifiedAttachments: boolean = false;
  otherDocForm: FormGroup;
  selectedFileNames: string[] = [];
  otherSelectedFiles: File[] = [];
  indentFileImages: File[] = [];
  addFileData: File[] = [];
  MAX_FILE_SIZE = 16 * 1024 * 1024; // 16 MB in bytes
  selectedFileFlag: boolean = false;
  openPreviewFlag: boolean = false;
  otherDocFlag: boolean = false;
  otherDocTab: boolean;
  indentImageTab: boolean;

  category;
  filteredFiles: any[] = [];
  filteredImgFiles: any[] = [];
  docFiles: any[] = [];
  imageFiles: any[] = [];
  otherFiles: any[] = [];

  categoryList: string[] = [];

  filedoc;
  pdfSrc: string;
  imageSrc;
  imgDwnld;
  excelDwnld;

  previewFlag: boolean = false;
  fileType: string = "";
  addButton: boolean;
  invEwbToggle: boolean = true;

  invFileNamesTooltip: string[] = [];
  ewbFileNamesTooltip: string[] = [];

  invoiceModal: boolean = false;

  selectedFile: any = null;
  zoomLevel: number = 1; // For images (scaling factor)
  pdfZoomLevel: number = 1; // For PDFs (percentage zoom)
  selectedFileUrl: string | null = null;
  otherPdfBlobUrls: string[] = [];
  pdfBlobUrls: string[] = [];
  ewbPdfBlobUrls: string[] = [];
  currentFileIndex: number = 0;

  fileThumbnail: string[] = [];
  otherFileThumbnail: string[] = [];
  ewbFileThumbnail: string[] = [];
  pdffiles: Blob[] = [];
  otherPdffiles: Blob[] = [];
  ewbPdffiles: Blob[] = [];


  @ViewChild('openIndentDetailModal') openIndentDetailModal;
  indentListFromInvoice: IndentFromInvoice[] = [];
  invoiceFilterData: InvoiceFilterDataType[];
  filteredIndent: IndentData[] = [];
  formValue;

  oldDelStatus: string;
  oldPmtStatus: string;
  onePageRowList: any[] = [15, 20, 25, 30, 35, 40, 45, 50];
  selectPagesForm: FormGroup;

  // pageList variables.
  rowNumber = -1;
  showRow = false;

  pmt_type_detail;
  pmt_percent_detal;
  pmt_amount_detail;
  paymentStatus;
  selectedPaymentTypeForUpdate;
  misMatchedDataShown = false;
  startIndex: number = 0;
  onePageRow: number = 20;
  endIndex: number = this.onePageRow - 1;
  pageList = [1, 2, 3, 4, 5]
  maxNumberOfPagesButton = 5;
  pages = 0;
  startPageButtonDisabled = false;
  endPageButtonDisabled = true;
  selectedPage = 1;

  paymentId: string;
  indentId: string;

  current = [0];

  // hexcode
  nullHexCode = '6e756c6c'
  delStatusString = "DEL Status"

  abg_request_anct_datenew: string;
  pbg_request_anct_datenew: string;
  abg_request_anct_dateold: string;
  pbg_request_anct_dateold: string;

  abg_issuance_datenew: string;
  pbg_issuance_datenew: string;
  abg_issuance_dateold: string;
  pbg_issuance_dateold: string;

  abg_final_submission_draft_datenew: string;
  pbg_final_submission_draft_datenew: string;
  abg_final_submission_draft_dateold: string;
  pbg_final_submission_draft_dateold: string;

  abg_final_submission_bg_datenew: string;
  pbg_final_submission_bg_datenew: string;
  abg_final_submission_bg_dateold: string;
  pbg_final_submission_bg_dateold: string;
  abg_request_anct_dateChngd: boolean;
  abg_issuance_dateChngd: boolean;
  abg_final_submission_draft_dateChngd: boolean;
  abg_final_submission_bg_dateChngd: boolean;
  pbg_request_anct_dateChngd: boolean;
  pbg_issuance_dateChngd: boolean;
  pbg_final_submission_draft_dateChngd: boolean;
  pbg_final_submission_bg_dateChngd: boolean;
  globalInvoiceNo: any;
  globalPaymentNo: any;

  invoiceList: IndentUpdateINVEWB[] = [];
  invoice: IndentUpdateINVEWB = {
    id: '',
    invoice_id: '',
    indent_sheet_num: '',
    inv_request_anct_date: '',
    inv_issuance_date: '',
    inv_no: '',
    ewb_no: '',
    ewb_issuance_date: '',
    transportation_method: '',
    dispatch_date: '',
    dispatch_from_indent: '',
    dispatch_from_origin: '',
    dispatch_to_indent: '',
    dispatch_to_destination: '',
    machine_sn: '',
    invoice_doc: '',
    ewb_doc: '',
    inv_doc_name: '',
    ewb_doc_name: '',
    email_sent: ''
  };
  paymentList: IndentUpdatePMT[] = [];
  isAddOrUpdate: 'SAVE' | 'UPDATE';

  warningMessage;
  alertSuccess;
  alertWarning;
  alertDanger;
  iniYear;
  iniMonth;
  iniDay;
  btnPIColor;
  btnIIPOColor;
  btnOCColor;
  btnEXFColor;
  btnPMTColor;
  btnLCColor;
  btnCOMColor;
  btnSHPINVColor;
  btnNXTAXNColor;
  // new button
  btnINDColor = false;
  btnIIOCColor = false;
  btnIIEXFColor = false;
  btnBGColor = false;
  btnINVeWBColor = false;


  date = new Date();
  searchText = '';
  // following two variables generated by parveen == selectedFilter, and filterType ===============
  selectedFilter: 'indentNumber' | 'sosSummary' | 'orderType' | 'projectNumber' | 'contractAcntName' | 'userAcntName' | 'invoiceNumber' = 'indentNumber';
  filterType = [
    { value: 'indentNumber', label: 'Indent Number' },
    { value: 'sosSummary', label: 'SOS Summary' },
    { value: 'orderType', label: 'Order Type' },
    { value: 'projectNumber', label: 'Project Number' },
    { value: 'contractAcntName', label: 'Contract Acnt Name' },
    { value: 'userAcntName', label: 'User Acnt Name' },
    { value: 'customer_po_num', label: 'PO Number' },
    { value: 'invoiceNumber', label: 'Invoice Number' },
  ];

  indentType: "ALL" | "OPEN" | "CLOSED" | "CANCELLED" | "GROUPED" = "OPEN";
  indentTypeList = [
    { value: 'ALL', label: 'All Orders' },
    { value: 'OPEN', label: 'Open Orders' },
    { value: 'CLOSED', label: 'Closed Orders' },
    { value: 'CANCELLED', label: 'Cancelled Orders' }
  ];
  userSelIndNo = '';
  indents: IndentData[] = [];
  pmtListUsingPoNum: { indent_sheet_num: string, amount: number }[] = [];
  masterPmtListUsingPoNum: {
    indent_sheet_num: string, sp_total: number, sgst_amount: number, cgst_amount: number,
    igst_amount: number, pck_and_fwd_amnt: number, domestic_freight_amnt: number, inst_com_amnt: number
  }[] = [];
  groupTotalDefault = 0;
  groupTotalReceived = 0;
  groupTotalBalance = 0;
  selectedIndent: string;
  detaildatasource: DetailDialogDataSet[] = [];
  updateNewTabs: IndentUpdateNewTabs[] = [];
  formUpdateStatus: IndentUpdateStatus[] = [];
  dynamicFormValue: updateIndentData[] = [];

  piLoadForm = false;
  iipoLoadForm = false;
  ocLoadForm = false;
  exfLoadForm = false;
  pmtLoadForm = false;
  lcLoadForm = false;
  comLoadForm = false;
  shpinvLoadForm = false;
  nactionLoadForm = false;
  isLoadModal = false;
  // new forms
  indLoadForm = false;
  iiocLoadForm = false;
  iiexfLoadForm = false;
  bgLoadForm = false;
  invewbLoadForm = false;

  piNoChngd = false;
  piDateChngd = false;
  iipoNoChngd = false;
  iipoDateChngd = false;
  ijPrjNoChngd = false;
  ocDateChngd = false;
  delStsChngd = false;
  exf1Chngd = false;
  exf1stsChngd = false;
  exfijannc1Chngd = false;
  exf2Chngd = false;
  exf2stsChngd = false;
  exfijannc2Chngd = false;
  exf3Chngd = false;
  exf3stsChngd = false;
  exfijannc3Chngd = false;
  advDateChngd = false;
  bshDateChngd = false;
  ashDateChngd = false;
  pmtstsChngd = false;
  lcdrftchkChngd = false;
  lcOpenChngd = false;
  lclastrevChngd = false;
  lcLatestshpChngd = false;
  lcExpiryChngd = false;
  commonthChngd = false;
  invNo1Chngd = false;
  invNo2Chngd = false;
  invNo3Chngd = false;
  invDate1Chngd = false;
  invDate2Chngd = false;
  invDate3Chngd = false;
  mode1Chngd = false;
  mode2Chngd = false;
  mode3Chngd = false;
  from1Chngd = false;
  from2Chngd = false;
  from3Chngd = false;
  vessel1Chngd = false;
  vessel2Chngd = false;
  vessel3Chngd = false;
  awbbill1Chngd = false;
  awbbill2Chngd = false;
  awbbill3Chngd = false;
  etd1Chngd = false;
  etd2Chngd = false;
  etd3Chngd = false;
  eta1Chngd = false;
  eta2Chngd = false;
  eta3Chngd = false;
  checkedOnChngd = false;
  nextCheckChngd = false;
  forinfoChngd = false;

  // Form Group
  indFormGroup: FormGroup;
  piFormGroup: FormGroup;
  iipoFormGroup: FormGroup;
  ocFormGroup: FormGroup;
  exfFormGroup: FormGroup;
  pmtFormGroup: FormGroup;

  lcFormGroup: FormGroup;
  comFormGroup: FormGroup;
  shpinvFormGroup: FormGroup;
  nactionFormGroup: FormGroup;

  iiocFormGroup: FormGroup;
  iiexfFormGroup: FormGroup;
  bgFormGroup: FormGroup;
  invewbFormGroup: FormGroup;

  // Data refrence
  indentsheetnum;
  sossummary;
  contractacntname;
  indentissuedate;
  ordertype;
  sales1;
  crmoptnum;
  sales2;
  reqetdbycustomer;
  etd1;
  etd2;
  etd3;
  pmttrms;
  advtype;
  advpc;
  advamount;
  advdate;
  bshtype;
  bshpc;
  bshamount;
  bshdate;
  ashtype;
  ashpc;
  ashamount;
  ashdate;
  pmtsts;
  delsts;
  reqetdtoij;
  iiJobNo: string;
  iiPrdOrderDate: string;
  iiOcNo: string;
  iiOcDate: string;
  searchKeyMaxLength: number = 50;

  customerPoNO: string;
  customerPoDate: string;
  cntrCode: string;
  cntrCountry: string;
  cntrAddress: string;

  model1;
  outsideDays = 'hidden';
  placement = 'top';
  // End

  // Title and Data Flag
  mainTitleFlag = true;
  mainDataFlag = false;
  // End

  // exf type flag
  iiexfTyp1Flag = false;
  iiexfTyp2Flag = false;
  iiexfTyp3Flag = false;
  // end

  // exf type flag
  exfTyp1Flag = false;
  exfTyp2Flag = false;
  exfTyp3Flag = false;
  // end

  // bg type flag
  bgTyp1Flag = false;
  bgTyp2Flag = false;
  // end


  // LC type flag
  lcTyp1Flag = false;
  lcTyp2Flag = false;
  // end

  // com type flag
  comTyp1Flag = false;
  comTyp2Flag = false;
  // end

  // shp type flag
  shpTyp1Flag = false;
  shpTyp2Flag = false;
  shpTyp3Flag = false;
  // end

  // preview flag
  piRDFlag = false;

  // preview display
  pinoold;
  pinonew;
  pidateold;
  pidatenew;
  iiponoold;
  iipononew;
  iipodateold;
  iipodatenew;
  ijprojectnumold;
  ijprojectnumnew;
  ocdateold;
  ocdatenew;
  delstsold;
  delstsnew;
  exf1old;
  exf1new;
  exf1stsold;
  exf1stsnew;
  exfijannt1old;
  exfijannt1new;
  exf2old;
  exf2new;
  exf2stsold;
  exf2stsnew;
  exfijannt2old;
  exfijannt2new;
  exf3old;
  exf3new;
  exf3stsold;
  exf3stsnew;
  exfijannt3old;
  exfijannt3new;
  pmtstsold;
  pmtstsnew;
  advtypold;
  advtypnew;
  advpcold;
  advpcnew;
  advamtold;
  advamtnew;
  advdateold;
  advdatenew;
  bshtypold;
  bshtypnew;
  bshpcold;
  bshpcnew;
  bshamtold;
  bshamtnew;
  bshdateold;
  bshdatenew;
  ashtypold;
  ashtypnew;
  ashpcold;
  ashpcnew;
  ashamtold;
  ashamtnew;
  ashdateold;
  ashdatenew;
  lcdrftchkold;
  lcdrftchknew;
  lcopenold;
  lcopennew;
  lclastrevold;
  lclastrevnew;
  lclatshpold;
  lclatshpnew;
  lcexpiryold;
  lcexpirynew;
  commonthold;
  commonthnew;
  invno1old;
  invno1new;
  invdate1old;
  invdate1new;
  mode1old;
  mode1new;
  from1old;
  from1new;
  vess1old;
  vess1new;
  awbbl1old;
  awbbl1new;
  etd1old;
  etd1new;
  eta1old;
  eta1new;
  invno2old;
  invno2new;
  invdate2old;
  invdate2new;
  mode2old;
  mode2new;
  from2old;
  from2new;
  vess2old;
  vess2new;
  awbbl2old;
  awbbl2new;
  etd2old;
  etd2new;
  eta2old;
  eta2new;
  invno3old;
  invno3new;
  invdate3old;
  invdate3new;
  mode3old;
  mode3new;
  from3old;
  from3new;
  vess3old;
  vess3new;
  awbbl3old;
  awbbl3new;
  etd3old;
  etd3new;
  eta3old;
  eta3new;
  chkonold;
  chkonnew;
  nxtchkold;
  nxtchknew;
  forold;
  fornew;
  //Filter list Flag
  listsosflag = true;
  listordertypeflag = false;
  listprojectnoflag = false;
  listcntractnameflag = false;
  // end

  // object for IND module
  indentDetails = {

    indent_sheet_num: { name: "INDENT SHEET NO", value: "" },
    indent_issue_date: { name: "INDENT ISSUE DATE", value: "" },
    crm_opt_num: { name: "CRM OPT NO.", value: "" },
    sos_summary: { name: "SOS SUMMARY", value: "" },
    sales1_id: { name: "SALES1 ID", value: "" },
    sales1_name: { name: "SALES1", value: "" },
    sales2_id: { name: "SALES2 ID", value: "" },
    sales2_name: { name: "SALES2", value: "" },
    order_type: { name: "ORDER TYPE", value: "" },
    customer_po_num: { name: "CUSTOMER PO NO.", value: "" },
    customer_po_date: { name: "CUSTOMER PO DATE", value: "" },
    contract_acnt_name: { name: "CNTR ACCOUNT NAME", value: "" },
    cntr_code: { name: "CNTR CODE", value: "" },
    cntr_country: { name: "CNTR COUNTRY", value: "" },
    cntr_address: { name: "CNTR ADDRESS", value: "" },
    cntr_tel: { name: "CNTR TEL", value: "" },
    cntr_gst_code: { name: "CNTR GST IN", value: "" },
    cntr_contact_person: { name: "CNTR CONTACT", value: "" },
    cntr_email: { name: "CNTR EMAIL", value: "" },
    user_acnt_name: { name: "USER ACCOUNT NAME", value: "" },
    ua_code: { name: "UA CODE", value: "" },
    ua_country: { name: "UA COUNTRY", value: "" },
    ua_address: { name: "UA ADDRESS", value: "" },
    ua_tel: { name: "UA TEL", value: "" },
    ua_gst_code: { name: "UA GST IN", value: "" },
    ua_contact_person: { name: "UA CONTACT", value: "" },
    ua_email: { name: "UA EMAIL", value: "" },
    key_account_flag: { name: "KEY ACCOUNT FLAG", value: "" },
    sp_cur: { name: "SP CUR", value: "" },
    lp_total: { name: "LP", value: "" },
    sp_total: { name: "SP", value: "" },
    pck_and_fwd_amnt: { name: "PCK & FWD", value: "" },
    domestic_freight_amnt: { name: "DMST FRT", value: "" },
    sgst_pc: { name: "SGST%", value: "" },
    sgst_amount: { name: "SGST AMOUNT", value: "" },
    cgst_pc: { name: "CGST%", value: "" },
    cgst_amount: { name: "CGST AMOUNT", value: "" },
    igst_pc: { name: "IGST%", value: "" },
    igst_amount: { name: "IGST AMOUNT", value: "" },
    inst_com_amnt: { name: "INST/COM", value: "" },
    tp_cur: { name: "TP CUR", value: "" },
    tp1: { name: "TP1", value: "" },
    tp2: { name: "TP2", value: "" },
    iigm: { name: "IIGM INR", value: "" },
    pmt_trms: { name: "PAYMENT TERM", value: "" },
    adv_type: { name: "ADV TYPE", value: "" },
    adv_pc: { name: "ADV %", value: "" },
    adv_amount: { name: "ADV AMOUNT", value: "" },
    adv_date: { name: "ADV DATE", value: "" },
    bsh_type: { name: "BSH TYPE", value: "" },
    bsh_pc: { name: "BSH %", value: "" },
    bsh_amount: { name: "BSH AMOUNT", value: "" },
    bsh_date: { name: "BSH DATE", value: "" },
    ash_type: { name: "ASH TYPE", value: "" },
    ash_pc: { name: "ASH %", value: "" },
    ash_amount: { name: "ASH AMOUNT", value: "" },
    ash_date: { name: "ASH DATE", value: "" },
    thirdp_com_cur: { name: "3P COM CURRENCY", value: "" },
    thirdp_com_amnt: { name: "3P COM AMOUNT", value: "" },
    thirdp_com_paid_by: { name: "3P COM PAID BY", value: "" },
    com_acnt_name: { name: "COM ACNT NAME", value: "" },
    com_code: { name: "COM CODE", value: "" },
    com_country: { name: "COM COUNTRY", value: "" },
    com_address: { name: "COM ADDRESS", value: "" },
    com_tel: { name: "COM TEL", value: "" },
    com_gst_code: { name: "COM GST IN", value: "" },
    com_contact_person: { name: "COM CONTACT", value: "" },
    com_email: { name: "COM EMAIL", value: "" },
    csutomer_application_code: { name: "CUSTOMER APP CODE", value: "" },
    customer_application_type: { name: "APPLICATION TYPE", value: "" },
    customer_app_desc: { name: "CUSTOMER APP DESC", value: "" },
    req_etd_by_customer: { name: "REQUEST ETD USER", value: "" },
    req_eta_by_customer: { name: "REQUEST ETA USER", value: "" },
    trd_trms_with_customer: { name: "TRADE TERMS", value: "" },
    dest_port_by_customer: { name: "DEST PORT", value: "" },
    mot: { name: "MOT", value: "" },
    freight1: { name: "FREIGHT", value: "" },
    req_etd_to_ij: { name: "REQ ETD FACTORY", value: "" },
    req_eta_to_ij: { name: "REQ ETA FACTORY", value: "" },
    trd_trms_with_ij: { name: "TRADE TERMS FACTORY", value: "" },
    dest_port_to_ij: { name: "DEST PORT FACTORY", value: "" },
    mot_to_ij: { name: "MOT TO FACTORY", value: "" },
    freight2: { name: "FREIGHT TO FACTORY", value: "" },
    coo: { name: "COO", value: "" },
    epa: { name: "EPA", value: "" },
    ip: { name: "IP", value: "" },
    free_detention_period: { name: "FREE DTNT PRD(DAYS)", value: "" },
    consignee_acnt_name: { name: "CNS AMOUNT NAME", value: "" },
    cns_code: { name: "CNS CODE", value: "" },
    cns_country: { name: "CNS COUNTRY", value: "" },
    cns_address: { name: "CNS ADDRESS", value: "" },
    cns_tel: { name: "CNS TEL", value: "" },
    cns_gst_code: { name: "CNS GST IN", value: "" },
    cns_contact_person: { name: "CNS CONTACT", value: "" },
    cns_email: { name: "CNS EMAIL", value: "" },
    cns_iec_code: { name: "CNS IEC CODE", value: "" },
    bank_name_on_cad: { name: "BANK NAME ON CARD", value: "" },
    address: { name: "BANK ADDRESS", value: "" },
    tel: { name: "BANK TEL", value: "" },
    notify_acnt_name: { name: "NTF ACCOUNT NAME", value: "" },
    ntf_code: { name: "NTF CODE", value: "" },
    ntf_country: { name: "NTF COUNTRY", value: "" },
    ntf_address: { name: "NTF ADDRESS", value: "" },
    ntf_tel: { name: "NTF TEL", value: "" },
    ntf_gst_code: { name: "NTF GST IN", value: "" },
    ntf_contact_person: { name: "NTF CONTACT", value: "" },
    ntf_email: { name: "NTF EMAIL", value: "" },
    production_start: { name: "PRODUCTION START", value: "" },
    oth_customer_po_sheet: { name: "ATCH PO", value: "" },
    oth_sr_spec_sheet: { name: "ATCH SR", value: "" },
    oth_drawing: { name: "ATCH DWG", value: "" },
    oth_test_report: { name: "ATCH TEST REPORT", value: "" },
    oth_pi: { name: "ATCH PI", value: "" },
    oth_lc_draft: { name: "ATCH LC DRFT", value: "" },
    oth_doc1: { name: "ATCH OTH1", value: "" },
    oth_doc2: { name: "ATCH OTH2", value: "" },
    remarks1: { name: "REMARKS 1", value: "" },
    pi_no: { name: "PI NO", value: "" },
    pi_date: { name: "PI DATE", value: "" },
    iipo_no: { name: "IIPO NO.", value: "" },
    iipo_date: { name: "IIPO DATE", value: "" },
    ij_project_num: { name: "IJ PROJECT NO.", value: "" },
    oc_date: { name: "OC DATE", value: "" },
    sa_date: { name: "SA DATE", value: "" },
    lc_chk_date_by_ij: { name: "LC CHECK DATE BY IJ", value: "" },
    lc_open_date: { name: "LC OPEN DATE", value: "" },
    lc_last_revision_date: { name: "LC LAST REV DATE", value: "" },
    latest_shipment_date: { name: "LC SHP DATE", value: "" },
    lc_expiry_date: { name: "LC EXPIRY DATE", value: "" },
    exf1: { name: "EXF1", value: "" },
    exf1_sts: { name: "EXF1 STATUS", value: "" },
    exf_ij_accment1: { name: "EXF1 IJ ANNT1", value: "" },
    exf2: { name: "EXF2", value: "" },
    exf2_sts: { name: "EXF2 STATUS", value: "" },
    exf_ij_accment2: { name: "EXF IJ ANNT2", value: "" },
    exf3: { name: "EXF3", value: "" },
    exf3_sts: { name: "EXF3 STATUS", value: "" },
    exf_ij_accment3: { name: "EXF IJ ANNT3", value: "" },
    fob_fowarder: { name: "FOB FOWARDER", value: "" },
    invoice_no1: { name: "INVOICE NO.1", value: "" },
    invoice_date1: { name: "INVOICE DATE1", value: "" },
    mode1: { name: "MODE1", value: "" },
    from1: { name: "FROM1", value: "" },
    vessel1: { name: "VESSEL1", value: "" },
    awb_bl_no1: { name: "AWB/BL NO1.", value: "" },
    etd_1: { name: "ETD1", value: "" },
    eta1: { name: "ETA1", value: "" },
    invoice_no2: { name: "INVOICE NO.2", value: "" },
    invoice_date2: { name: "INVOICE DATE2", value: "" },
    mode2: { name: "MODE2", value: "" },
    from2: { name: "FROM2", value: "" },
    vessel2: { name: "VESSEL2", value: "" },
    awb_bl_no2: { name: "AWB/BL NO2.", value: "" },
    etd_2: { name: "ETD2", value: "" },
    eta2: { name: "ETA2", value: "" },
    invoice_no3: { name: "INVOICE NO.3", value: "" },
    invoice_date3: { name: "INVOICE DATE3", value: "" },
    mode3: { name: "MODE3", value: "" },
    from3: { name: "FROM3", value: "" },
    vessel3: { name: "VESSEL3", value: "" },
    awb_bl_no3: { name: "AWB/BL NO3.", value: "" },
    etd_3: { name: "ETD3", value: "" },
    eta3: { name: "ETA3", value: "" },
    eway_bill_req: { name: "EWAY BILL RQD", value: "" },
    eway_bill_num: { name: "EWAY BILL NO.", value: "" },
    remarks2: { name: "REMARKS 2", value: "" },
    com_month: { name: "COM MONTH", value: "" },
    checked_on: { name: "CHECKED ON", value: "" },
    next_check: { name: "NEXT CHECK", value: "" },
    for_info: { name: "FOR", value: "" },
    pmt_sts: { name: "PAYMENT STATUS", value: "" },
    del_sts: { name: "DELIVERY STATUS", value: "" },
  }

  jobnonew: any;
  jobnoold: string;
  prdorddatenew: any;
  prdorddateeold: string;
  jobNoChngd: boolean;
  iiocnonew: any;
  iiocnoold: string;
  iiocdatenew: any;
  iiocdateeold: string;
  iiocNoChngd: boolean;
  iiocDateChngd: boolean;

  dateViewFormat: string = "YYYY-MM-DD";
  decimalPattern = "^[0-9]+(\.[0-9]{1,5})?$" //'^(\d*\.)?\d+$';
  totalPaymentList: any[];
  globalEnableButtons: boolean = false;
  globalRequiredMsg: string;
  globalInvalidDateMsg: string;
  globalDecimalValMsg: string;
  pmtstsDisabled: boolean = true;
  globalUserRole: string = "";
  globalReadOnly: boolean = false;
  globalDisable: boolean = false;

  minDate: any;
  maxDate: any;
  dateSearchText: any;
  lastkeydown1: number = 0;
  isDateInvalid: boolean = false;
  isMinDateFlag: boolean = false;
  isMaxDateFlag: boolean = false;
  minDateInvalid: boolean = false;
  maxDateInvalid: boolean = false;
  minDateMsg: string = "";
  maxDateMsg: string = "";
  formControlName: any;
  isModified: boolean = false;
  _originalValue: any;
  switchTab: boolean = false;
  switchTabName: string = "";
  selectedTab: string = "";
  fromTab: string = "";
  firstTab: boolean = false;
  radioButtonClicked: boolean = false;
  radioTypeDisabled: boolean = false;
  isTabSwitched: boolean = false;
  isDiscardCalled: boolean = false;
  modalReference: NgbModalRef;
  reactiveForm: FormGroup;
  subscr: Subscription;
  subscriptions: Subscription[] = [];
  unsubscribe$: Subject<void> = new Subject<void>();
  orderOfIndent: 'ASC' | 'DESC' = 'DESC';

  // max length variables..
  maxLength15: number = 15;
  maxLength50: number = 50;
  maxLength100: number = 100;
  maxLength150: number = 150;
  maxLength200: number = 200;

  constructor(private sanitizer: DomSanitizer, private httpcon: HttpClient, private Emailservice: EmailService, private fb: FormBuilder, private router: Router, private datePipe: DatePipe, private parserFormatter: NgbDateParserFormatter, private modalService: NgbModal, private ngxService: NgxUiLoaderService) {
    this.initFormGroup();

    this.otherDocForm = this.fb.group({
      rows: this.fb.array([this.createRow()]),
    });
    this.selectedFileNames.push('');
    this.otherSelectedFiles.push(new File([], ""));
    this.otherFileThumbnail.push('');
    this.otherPdfBlobUrls.push('');
    this.otherPdffiles.push(new File([], ""));
    this.loadSelectedPdf('Other');
  }

  get rows(): FormArray {
    return this.otherDocForm.get('rows') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({
      category: [''],
      file: [null],
    });
  }

  initFormGroup() {
    this.indFormGroup = this.fb.group({
      indent_no: new FormControl(''),
    });

    this.piFormGroup = this.fb.group({
      pi_no: new FormControl(''),
      pi_date: new FormControl('')
    });


    this.iipoFormGroup = this.fb.group({
      iipo_no: new FormControl(''),
      iipo_date: new FormControl('')
    });

    this.iiocFormGroup = this.fb.group({
      job_no: new FormControl(''),
      prd_ord_date: new FormControl(''),
      oc_no: new FormControl(''),
      oc_date: new FormControl(''),
    });

    this.ocFormGroup = this.fb.group({
      ij_project_num: new FormControl(''),
      oc_date: new FormControl(''),
    });

    this.iiexfFormGroup = this.fb.group({
      del_sts: new FormControl(),
      exf1_date: new FormControl(),
      exf1_sts: new FormControl(),
      exf1_annc_date: new FormControl(),
      exf2_date: new FormControl(),
      exf2_sts: new FormControl(),
      exf2_annc_date: new FormControl(),
      exf3_date: new FormControl(),
      exf3_sts: new FormControl(),
      exf3_annc_date: new FormControl(),
    });

    this.exfFormGroup = this.fb.group({
      exf1: new FormControl(),
      exf1_sts: new FormControl(),
      exf_ij_accment1: new FormControl(),
      exf2: new FormControl(),
      exf2_sts: new FormControl(),
      exf_ij_accment2: new FormControl(),
      exf3: new FormControl(),
      exf3_sts: new FormControl(),
      exf_ij_accment3: new FormControl(),
      del_sts: new FormControl(),
    });

    this.bgFormGroup = this.fb.group({
      abg_request_anct_date: new FormControl(),
      abg_issuance_date: new FormControl(),
      abg_final_submission_draft_date: new FormControl(),
      abg_final_submission_bg_date: new FormControl(),
      pbg_request_anct_date: new FormControl(),
      pbg_issuance_date: new FormControl(),
      pbg_final_submission_draft_date: new FormControl(),
      pbg_final_submission_bg_date: new FormControl(),
    });

    this.invewbFormGroup = this.fb.group({
      inv_request_anct_date: new FormControl(''),
      inv_issuance_date: new FormControl('', [Validators.required]),
      inv_no: new FormControl('', [Validators.required]),
      ewb_no: new FormControl(''),
      ewb_issuance_date: new FormControl(''),
      transportation_method: new FormControl(''),
      dispatch_date: new FormControl(''),
      dispatch_from_indent: new FormControl(''),
      dispatch_from_origin: new FormControl(''),
      dispatch_to_indent: new FormControl(''),
      dispatch_to_destination: new FormControl(''),
      machine_sn: new FormControl('')
    });

    this.pmtFormGroup = new FormGroup({
      payment_type: new FormControl('ADV'),
      payment_date: new FormControl(''),
      payment_amount: new FormControl('', [Validators.pattern(this.decimalPattern)]),
      pmt_sts: new FormControl({ value: '' }),
    });

    this.lcFormGroup = this.fb.group({
      lc_chk_date_by_ij: new FormControl(),
      lc_open_date: new FormControl(),
      lc_last_revision_date: new FormControl(),
      latest_shipment_date: new FormControl(),
      lc_expiry_date: new FormControl(),
    });

    this.comFormGroup = this.fb.group({
      com_month: new FormControl(),
    });

    this.shpinvFormGroup = this.fb.group({
      invoice_no1: new FormControl(),
      invoice_no2: new FormControl(),
      invoice_no3: new FormControl(),
      invoice_date1: new FormControl(),
      invoice_date2: new FormControl(),
      invoice_date3: new FormControl(),
      mode1: new FormControl(),
      mode2: new FormControl(),
      mode3: new FormControl(),
      from1: new FormControl(),
      from2: new FormControl(),
      from3: new FormControl(),
      vessel1: new FormControl(),
      vessel2: new FormControl(),
      vessel3: new FormControl(),
      awb_bl_no1: new FormControl(),
      awb_bl_no2: new FormControl(),
      awb_bl_no3: new FormControl(),
      etd1: new FormControl(),
      etd2: new FormControl(),
      etd3: new FormControl(),
      eta1: new FormControl(),
      eta2: new FormControl(),
      eta3: new FormControl(),
      del_sts: new FormControl(),
    });

    this.nactionFormGroup = this.fb.group({
      checked_on: new FormControl(),
      next_check: new FormControl(),
      for_info: new FormControl(),
    });
  }

  ngOnInit() {
    this.minDate = { year: 1901, month: 1, day: 1 };
    this.maxDate = { year: new Date().getFullYear() + 5, month: 1, day: 1 };
    this.ngxService.start();
    this.initIndentListFromDb();
    this.ngxService.stop();
    this.globalUserRole = GlobalConstants.globalUserRole;
    this.globalRequiredMsg = GlobalConstants.globalRequiredMsg;
    this.globalInvalidDateMsg = GlobalConstants.globalInvalidDateMsg;
    this.globalDecimalValMsg = GlobalConstants.globalDecimalValMsg;
    if (this.globalUserRole == 'Administrator' || this.globalUserRole == 'Ishida' || this.globalUserRole == 'Superuser') {
      this.globalEnableButtons = true;
    }
    if (this.globalUserRole == 'User') {
      this.globalReadOnly = true;
      GlobalConstants.globalReadOnly = this.globalReadOnly;
      this.globalDisable = true;
      GlobalConstants.globaldisable = this.globalDisable;
    }

    if (this.globalDisable == true) {
      this.setFormControlsToDisable();
    }

    this.selectPagesForm = this.fb.group({
      pages: new FormControl(20),
    });
    this.generatePageListButtons();

    this.getCategoryList();
  }

  homeRouterInit() {
    this.router.navigate(['ii/home']);
  }

  indentmgmtRouterInit() {
    location.reload();
  }


  initIndentListFromDb() {
    this.groupedButtonEnabled = false;
    let url = GlobalConstants.apiIndent;
    if (this.indentType == "ALL") {
      url = GlobalConstants.apiIndent;
    }
    if (this.indentType == "OPEN") {
      url = GlobalConstants.apiOpenIndent;
    }
    if (this.indentType == "CLOSED") {
      url = GlobalConstants.apiClosedIndent;
    }
    if (this.indentType == "CANCELLED") {
      url = GlobalConstants.apiCancelledIndent;
    }

    return this.httpcon.get<IndentData[]>(url)
      .subscribe(res => {
        this.indents = res;
        this.filteredIndent = res;
        if (GlobalConstants.globalNxtActIndNo != "") {
          this.nextActionCallForUpdate();
        }
        if (GlobalConstants.globalIndentDetailIndNo != "" || GlobalConstants.globalIndentDetailIndNo != undefined) {
          this.indentDetailByIndentNo();
        }
        this.setSelectPageList();
        this.generatePageListButtons();
      });
  }

  getIndentListUsingPoNumber(customerPoNum: string) {
    const urllink = GlobalConstants.apiGetIndentListUsingPoNumber;
    const params = new HttpParams().set('customerPoNum', customerPoNum);
    this.httpcon.get<any[]>(urllink, { params: params })
      .pipe(map(Response => {
        this.indents = Response;
        this.filteredIndent = Response;
        this.setSelectPageList();
        this.generatePageListButtons();
        this.getPaymentListOfSamePoNumber(customerPoNum);
      })).subscribe();
  }

  async getPaymentListOfSamePoNumber(customerPoNum: string) {
    this.groupTotalBalance = 0;
    this.groupTotalReceived = 0;
    const urllink = GlobalConstants.apiGetListOfPmtUsingPoNumber;
    const params = new HttpParams().set('customerPoNum', customerPoNum);
    await this.httpcon.get<any[]>(urllink, { params: params })
      .pipe(map(Response => {
        this.pmtListUsingPoNum = Response;

        for (let data of this.pmtListUsingPoNum) {
          this.groupTotalReceived = this.groupTotalReceived + data.amount;
        }
        this.getPaymentListFromPmtusingPoNumber(customerPoNum);
      })).subscribe();

  }

  async getPaymentListFromPmtusingPoNumber(customerPoNum: string) {
    this.groupTotalDefault = 0;
    const params = new HttpParams().set('customerPoNum', customerPoNum);
    const urllink2 = GlobalConstants.apiGetListOfMasterPmtUsingPoNumber;
    await this.httpcon.get<any[]>(urllink2, { params: params })
      .pipe(map(Response => {
        this.masterPmtListUsingPoNum = Response;
        for (let data of this.masterPmtListUsingPoNum) {
          let default_amount = 0;
          default_amount = default_amount + this.getNumValueOfField(data.sgst_amount)
            + this.getNumValueOfField(data.cgst_amount)
            + this.getNumValueOfField(data.igst_amount)
            + this.getNumValueOfField(data.sp_total)
            + this.getNumValueOfField(data.pck_and_fwd_amnt)
            + this.getNumValueOfField(data.domestic_freight_amnt)
            + this.getNumValueOfField(data.inst_com_amnt)
          this.groupTotalDefault = this.groupTotalDefault + default_amount;
        }
        this.groupTotalBalance = this.groupTotalDefault - this.groupTotalReceived;
      })).subscribe();
  }

  indentDetailByIndentNo() {
    if (GlobalConstants.globalIndentDetailIndNo != "") {
      this.selectedIndent = GlobalConstants.globalIndentDetailIndNo;
      this.searchText = GlobalConstants.globalIndentDetailIndNo;
      this.getIndDetailFromServer(GlobalConstants.globalIndentDetailIndNo);
      this.mainDataFlag = true;
      this.mainTitleFlag = false;
      this.resetAllBtnSelect();
      this.btnINDColor = true;
      this.resetAllLoadFormDetail();
      this.indLoadForm = true;
      GlobalConstants.globalIndentDetailIndNo = "";
    }
    GlobalConstants.globalIndentDetailIndNo = "";
  }

  onClickSortIndentList() {
    if (this.groupedButtonEnabled) {
      return false;
    }
    let order = this.orderOfIndent;
    if (order == "DESC") {
      this.initIndentListFromDbASC();
      this.orderOfIndent = "ASC";
    } else {
      this.initIndentListFromDb();
      this.orderOfIndent = "DESC";
    }
    this.mainDataFlag = false;
    this.mainTitleFlag = true;
    this.resetAllBtnSelect();
    this.resetAllLoadFormDetail();
    this.selectedIndent = "";
    this.searchText = "";
  }

  initIndentListFromDbASC() {
    let indentType = this.indentType;
    return this.httpcon.get<IndentData[]>(GlobalConstants.apiIndentASC + indentType)
      .subscribe(res => {
        this.indents = res;
        this.filteredIndent = res;
        if (GlobalConstants.globalNxtActIndNo != "") {
          this.nextActionCallForUpdate();
        }
      });
  }

  onSelectEdit(indentlist: string, customerPoNum: string) {
    this.customerPoNO = customerPoNum;
    if (indentlist == null) {
      return false;
    }
    this.selectedIndent = indentlist;
    if (this.selectedIndent != null) {
      this.getIndDetailFromServer(this.selectedIndent.toString());
      // if (this.samePoNumberExist(customerPoNum)) {
      //   this.groupedButtonEnabled = true;
      // }
      this.mainDataFlag = true;
      this.mainTitleFlag = false;
      this.resetAllBtnSelect();
      this.btnINDColor = true;
      this.resetAllLoadFormDetail();
      this.indLoadForm = true;
    }
    if (this.groupedButtonEnabled && this.indentType == "GROUPED") {
      this.misMatchedDataShown = true;
      this.btnSelectPMT();
    }
  }


  nextActionCallForUpdate() {
    if (GlobalConstants.globalNxtActIndNo != "") {
      this.selectedIndent = GlobalConstants.globalNxtActIndNo;
      this.searchText = GlobalConstants.globalNxtActIndNo;
      this.getIndDetailFromServer(GlobalConstants.globalNxtActIndNo);
      this.mainDataFlag = true;
      this.mainTitleFlag = false;
      this.resetAllBtnSelect();
      this.btnNXTAXNColor = true;
      this.resetAllLoadFormDetail();
      this.nactionLoadForm = true;
      GlobalConstants.globalNxtActIndNo = "";
    }
    GlobalConstants.globalNxtActIndNo = "";
  }

  groupedButtonEnabled = false;
  samePoNumberExist(customerPoNum: string) {
    this.customerPoNO = customerPoNum;
    const urllink = GlobalConstants.apiCheckPoExist;
    const params = new HttpParams().set('customerPoNum', customerPoNum);
    this.httpcon.get<any[]>(urllink, { params: params })
      .pipe(map(Response => {
        if (Response[0].count > 1) {
          this.groupedButtonEnabled = true;
        }
        else {
          this.groupedButtonEnabled = false;
        }
      })).subscribe();
    return false;
  }

  getIndDetailFromServer(indNum: string) {
    this.isModified = false;
    this.userSelIndNo = indNum;
    const urllink = GlobalConstants.apiIndentDetail + indNum;
    this.httpcon.get<DetailDialogDataSet[]>(urllink)
      .pipe(map(Response => {
        this.detaildatasource = Response;

        this.indentsheetnum = this.detaildatasource[0].indent_sheet_num;
        this.sossummary = this.detaildatasource[0].sos_summary;
        this.contractacntname = this.detaildatasource[0].contract_acnt_name;
        this.indentissuedate = this.datePipe.transform(this.detaildatasource[0].indent_issue_date, 'yyyy-MM-dd');
        this.ordertype = this.detaildatasource[0].order_type;
        this.sales1 = this.detaildatasource[0].sales1_name;
        this.crmoptnum = this.detaildatasource[0].crm_opt_num;
        this.sales2 = this.detaildatasource[0].sales2_name;
        this.reqetdbycustomer = this.datePipe.transform(this.detaildatasource[0].req_etd_by_customer, 'yyyy-MM-dd');
        this.etd1 = this.datePipe.transform(this.detaildatasource[0].etd1, 'yyyy-MM-dd');
        this.etd2 = this.datePipe.transform(this.detaildatasource[0].etd2, 'yyyy-MM-dd');
        this.etd3 = this.datePipe.transform(this.detaildatasource[0].etd3, 'yyyy-MM-dd');
        this.advtype = this.detaildatasource[0].adv_type;
        // new fields
        this.indentDetails.indent_sheet_num.value = this.detaildatasource[0].indent_sheet_num;
        this.indentDetails.indent_issue_date.value = this.detaildatasource[0].indent_issue_date;
        this.indentDetails.crm_opt_num.value = this.detaildatasource[0].crm_opt_num;
        this.indentDetails.sos_summary.value = this.detaildatasource[0].sos_summary;
        this.indentDetails.sales1_id.value = this.detaildatasource[0].sales1_id;
        this.indentDetails.sales1_name.value = this.detaildatasource[0].sales1_name;
        this.indentDetails.sales2_id.value = this.detaildatasource[0].sales2_id;
        this.indentDetails.sales2_name.value = this.detaildatasource[0].sales2_name;
        this.indentDetails.order_type.value = this.detaildatasource[0].order_type;
        this.indentDetails.customer_po_num.value = this.detaildatasource[0].customer_po_num;
        this.indentDetails.customer_po_date.value = this.detaildatasource[0].customer_po_date;
        this.indentDetails.contract_acnt_name.value = this.detaildatasource[0].contract_acnt_name;
        this.indentDetails.cntr_code.value = this.detaildatasource[0].cntr_code;
        this.indentDetails.cntr_country.value = this.detaildatasource[0].cntr_country;
        this.indentDetails.cntr_address.value = this.detaildatasource[0].cntr_address;
        this.indentDetails.cntr_tel.value = this.detaildatasource[0].cntr_tel;
        this.indentDetails.cntr_gst_code.value = this.detaildatasource[0].cntr_gst_code;
        this.indentDetails.cntr_contact_person.value = this.detaildatasource[0].cntr_contact_person;
        this.indentDetails.cntr_email.value = this.detaildatasource[0].cntr_email;
        this.indentDetails.user_acnt_name.value = this.detaildatasource[0].user_acnt_name;
        this.indentDetails.ua_code.value = this.detaildatasource[0].ua_code;
        this.indentDetails.ua_country.value = this.detaildatasource[0].ua_country;
        this.indentDetails.ua_address.value = this.detaildatasource[0].ua_address;
        this.indentDetails.ua_tel.value = this.detaildatasource[0].ua_tel;
        this.indentDetails.ua_gst_code.value = this.detaildatasource[0].ua_gst_code;
        this.indentDetails.ua_contact_person.value = this.detaildatasource[0].ua_contact_person;
        this.indentDetails.ua_email.value = this.detaildatasource[0].ua_email;
        this.indentDetails.key_account_flag.value = this.detaildatasource[0].key_account_flag;
        this.indentDetails.sp_cur.value = this.detaildatasource[0].sp_cur;
        this.indentDetails.lp_total.value = this.detaildatasource[0].lp_total;
        this.indentDetails.sp_total.value = this.detaildatasource[0].sp_total;
        this.indentDetails.pck_and_fwd_amnt.value = this.detaildatasource[0].pck_and_fwd_amnt;
        this.indentDetails.domestic_freight_amnt.value = this.detaildatasource[0].domestic_freight_amnt;


        if (this.detaildatasource[0].sgst_pc) {
          if (this.detaildatasource[0].sgst_pc.toString() == "NA") {   // if it has NaN
            this.indentDetails.sgst_pc.value = ""
          }
          else {
            this.indentDetails.sgst_pc.value = (Number(this.detaildatasource[0].sgst_pc) * 100).toString().concat("%");
          }
        }
        else {
          this.indentDetails.sgst_pc.value = " ";
        }

        if (this.detaildatasource[0].cgst_pc) {
          if (this.detaildatasource[0].cgst_pc.toString() == "NA") {   // if it has NaN
            this.indentDetails.cgst_pc.value = ""
          }
          else {
            this.indentDetails.cgst_pc.value = (Number(this.detaildatasource[0].cgst_pc) * 100).toString().concat("%");
          }
        }
        else {
          this.indentDetails.cgst_pc.value = " ";
        }

        if (this.detaildatasource[0].igst_pc) {
          if (this.detaildatasource[0].igst_pc.toString() == "NA") {   // if it has NaN
            this.indentDetails.igst_pc.value = ""
          }
          else {
            this.indentDetails.igst_pc.value = (Number(this.detaildatasource[0].igst_pc) * 100).toString().concat("%");
          }
        }
        else {
          this.indentDetails.igst_pc.value = " ";
        }

        // this.indentDetails.sgst_pc.value = this.detaildatasource[0].sgst_pc;
        this.indentDetails.sgst_amount.value = this.detaildatasource[0].sgst_amount;
        // this.indentDetails.cgst_pc.value = this.detaildatasource[0].cgst_pc;
        this.indentDetails.cgst_amount.value = this.detaildatasource[0].cgst_amount;
        // this.indentDetails.igst_pc.value = this.detaildatasource[0].igst_pc;
        this.indentDetails.igst_amount.value = this.detaildatasource[0].igst_amount;
        this.indentDetails.inst_com_amnt.value = this.detaildatasource[0].inst_com_amnt;
        this.indentDetails.tp_cur.value = this.detaildatasource[0].tp_cur;
        this.indentDetails.tp1.value = this.detaildatasource[0].tp1;
        this.indentDetails.tp2.value = this.detaildatasource[0].tp2;
        this.indentDetails.iigm.value = this.detaildatasource[0].iigm;
        this.indentDetails.pmt_trms.value = this.detaildatasource[0].pmt_trms;
        this.indentDetails.adv_type.value = this.detaildatasource[0].adv_type;
        // this.indentDetails.adv_pc.value = this.detaildatasource[0].adv_pc;
        if (this.detaildatasource[0].adv_pc) {
          if (this.detaildatasource[0].adv_pc.toString() == "NA") {   // if it has NaN
            this.indentDetails.adv_pc.value = ""
          }
          else {
            this.indentDetails.adv_pc.value = (Number(this.detaildatasource[0].adv_pc) * 100).toString().concat("%");
          }
        }
        else {
          this.indentDetails.adv_pc.value = " ";
        }
        this.indentDetails.adv_amount.value = this.detaildatasource[0].adv_amount;
        this.indentDetails.adv_date.value = this.detaildatasource[0].adv_date;
        this.indentDetails.bsh_type.value = this.detaildatasource[0].bsh_type;
        // this.indentDetails.bsh_pc.value = this.detaildatasource[0].bsh_pc;
        if (this.detaildatasource[0].bsh_pc) {
          if (this.detaildatasource[0].bsh_pc.toString() == "NA") {   // if it has NaN
            this.indentDetails.bsh_pc.value = ""
          }
          else {
            this.indentDetails.bsh_pc.value = (Number(this.detaildatasource[0].bsh_pc) * 100).toString().concat("%");
          }
        }
        else {
          this.indentDetails.bsh_pc.value = " ";
        }
        this.indentDetails.bsh_amount.value = this.detaildatasource[0].bsh_amount;
        this.indentDetails.bsh_date.value = this.detaildatasource[0].bsh_date;
        this.indentDetails.ash_type.value = this.detaildatasource[0].ash_type;
        // this.indentDetails.ash_pc.value = this.detaildatasource[0].ash_pc;
        if (this.detaildatasource[0].ash_pc) {
          if (this.detaildatasource[0].ash_pc.toString() == "NA") {   // if it has NaN
            this.indentDetails.ash_pc.value = ""
          }
          else {
            this.indentDetails.ash_pc.value = (Number(this.detaildatasource[0].ash_pc) * 100).toString().concat("%");
          }
        }
        else {
          this.indentDetails.ash_pc.value = " ";
        }
        this.indentDetails.ash_amount.value = this.detaildatasource[0].ash_amount;
        this.indentDetails.ash_date.value = this.detaildatasource[0].ash_date;
        this.indentDetails.thirdp_com_cur.value = this.detaildatasource[0].thirdp_com_cur;
        this.indentDetails.thirdp_com_amnt.value = this.detaildatasource[0].thirdp_com_amnt;
        this.indentDetails.thirdp_com_paid_by.value = this.detaildatasource[0].thirdp_com_paid_by;
        this.indentDetails.com_acnt_name.value = this.detaildatasource[0].com_acnt_name;
        this.indentDetails.com_code.value = this.detaildatasource[0].com_code;
        this.indentDetails.com_country.value = this.detaildatasource[0].com_country;
        this.indentDetails.com_address.value = this.detaildatasource[0].com_address;
        this.indentDetails.com_tel.value = this.detaildatasource[0].com_tel;
        this.indentDetails.com_gst_code.value = this.detaildatasource[0].com_gst_code;
        this.indentDetails.com_contact_person.value = this.detaildatasource[0].com_contact_person;
        this.indentDetails.com_email.value = this.detaildatasource[0].com_email;
        this.indentDetails.csutomer_application_code.value = this.detaildatasource[0].csutomer_application_code;
        this.indentDetails.customer_application_type.value = this.detaildatasource[0].customer_application_type;
        this.indentDetails.customer_app_desc.value = this.detaildatasource[0].customer_app_desc;
        this.indentDetails.req_etd_by_customer.value = this.detaildatasource[0].req_etd_by_customer;
        this.indentDetails.req_eta_by_customer.value = this.detaildatasource[0].req_eta_by_customer;
        this.indentDetails.trd_trms_with_customer.value = this.detaildatasource[0].trd_trms_with_customer;
        this.indentDetails.dest_port_by_customer.value = this.detaildatasource[0].dest_port_by_customer;
        this.indentDetails.mot.value = this.detaildatasource[0].mot;
        this.indentDetails.freight1.value = this.detaildatasource[0].freight1;
        this.indentDetails.req_etd_to_ij.value = this.detaildatasource[0].req_etd_to_ij;
        this.indentDetails.req_eta_to_ij.value = this.detaildatasource[0].req_eta_to_ij;
        this.indentDetails.trd_trms_with_ij.value = this.detaildatasource[0].trd_trms_with_ij;
        this.indentDetails.dest_port_to_ij.value = this.detaildatasource[0].dest_port_to_ij;
        this.indentDetails.mot_to_ij.value = this.detaildatasource[0].mot_to_ij;
        this.indentDetails.freight2.value = this.detaildatasource[0].freight2;
        this.indentDetails.coo.value = this.detaildatasource[0].coo;
        this.indentDetails.epa.value = this.detaildatasource[0].epa;
        this.indentDetails.ip.value = this.detaildatasource[0].ip;
        this.indentDetails.free_detention_period.value = this.detaildatasource[0].free_detention_period;
        this.indentDetails.consignee_acnt_name.value = this.detaildatasource[0].consignee_acnt_name;
        this.indentDetails.cns_code.value = this.detaildatasource[0].cns_code;
        this.indentDetails.cns_country.value = this.detaildatasource[0].cns_country;
        this.indentDetails.cns_address.value = this.detaildatasource[0].cns_address;
        this.indentDetails.cns_tel.value = this.detaildatasource[0].cns_tel;
        this.indentDetails.cns_gst_code.value = this.detaildatasource[0].cns_gst_code;
        this.indentDetails.cns_contact_person.value = this.detaildatasource[0].cns_contact_person;
        this.indentDetails.cns_email.value = this.detaildatasource[0].cns_email;
        this.indentDetails.cns_iec_code.value = this.detaildatasource[0].cns_iec_code;
        this.indentDetails.bank_name_on_cad.value = this.detaildatasource[0].bank_name_on_cad;
        this.indentDetails.address.value = this.detaildatasource[0].address;
        this.indentDetails.tel.value = this.detaildatasource[0].tel;
        this.indentDetails.notify_acnt_name.value = this.detaildatasource[0].notify_acnt_name;
        this.indentDetails.ntf_code.value = this.detaildatasource[0].ntf_code;
        this.indentDetails.ntf_country.value = this.detaildatasource[0].ntf_country;
        this.indentDetails.ntf_address.value = this.detaildatasource[0].ntf_address;
        this.indentDetails.ntf_tel.value = this.detaildatasource[0].ntf_tel;
        this.indentDetails.ntf_gst_code.value = this.detaildatasource[0].ntf_gst_code;
        this.indentDetails.ntf_contact_person.value = this.detaildatasource[0].ntf_contact_person;
        this.indentDetails.ntf_email.value = this.detaildatasource[0].ntf_email;
        this.indentDetails.production_start.value = this.detaildatasource[0].production_start;
        this.indentDetails.oth_customer_po_sheet.value = this.detaildatasource[0].oth_customer_po_sheet;
        this.indentDetails.oth_sr_spec_sheet.value = this.detaildatasource[0].oth_sr_spec_sheet;
        this.indentDetails.oth_drawing.value = this.detaildatasource[0].oth_drawing;
        this.indentDetails.oth_test_report.value = this.detaildatasource[0].oth_test_report;
        this.indentDetails.oth_pi.value = this.detaildatasource[0].oth_pi;
        this.indentDetails.oth_lc_draft.value = this.detaildatasource[0].oth_lc_draft;
        this.indentDetails.oth_doc1.value = this.detaildatasource[0].oth_doc1;
        this.indentDetails.oth_doc2.value = this.detaildatasource[0].oth_doc2;
        this.indentDetails.remarks1.value = this.detaildatasource[0].remarks1;
        this.indentDetails.pi_no.value = this.detaildatasource[0].pi_no;
        this.indentDetails.pi_date.value = this.detaildatasource[0].pi_date;
        this.indentDetails.iipo_no.value = this.detaildatasource[0].iipo_no;
        this.indentDetails.iipo_date.value = this.detaildatasource[0].iipo_date;
        this.indentDetails.ij_project_num.value = this.detaildatasource[0].ij_project_num;
        this.indentDetails.oc_date.value = this.detaildatasource[0].oc_date;
        this.indentDetails.sa_date.value = this.detaildatasource[0].sa_date;
        this.indentDetails.lc_chk_date_by_ij.value = this.detaildatasource[0].lc_chk_date_by_ij;
        this.indentDetails.lc_open_date.value = this.detaildatasource[0].lc_open_date;
        this.indentDetails.lc_last_revision_date.value = this.detaildatasource[0].lc_last_revision_date;
        this.indentDetails.latest_shipment_date.value = this.detaildatasource[0].latest_shipment_date;
        this.indentDetails.lc_expiry_date.value = this.detaildatasource[0].lc_expiry_date;
        this.indentDetails.exf1.value = this.detaildatasource[0].exf1;
        this.indentDetails.exf1_sts.value = this.detaildatasource[0].exf1_sts;
        this.indentDetails.exf_ij_accment1.value = this.detaildatasource[0].exf_ij_accment1;
        this.indentDetails.exf2.value = this.detaildatasource[0].exf2;
        this.indentDetails.exf2_sts.value = this.detaildatasource[0].exf2_sts;
        this.indentDetails.exf_ij_accment2.value = this.detaildatasource[0].exf_ij_accment2;
        this.indentDetails.exf3.value = this.detaildatasource[0].exf3;
        this.indentDetails.exf3_sts.value = this.detaildatasource[0].exf3_sts;
        this.indentDetails.exf_ij_accment3.value = this.detaildatasource[0].exf_ij_accment3;
        this.indentDetails.fob_fowarder.value = this.detaildatasource[0].fob_fowarder;
        this.indentDetails.invoice_no1.value = this.detaildatasource[0].invoice_no1;
        this.indentDetails.invoice_date1.value = this.detaildatasource[0].invoice_date1;
        this.indentDetails.mode1.value = this.detaildatasource[0].mode1;
        this.indentDetails.from1.value = this.detaildatasource[0].from1;
        this.indentDetails.vessel1.value = this.detaildatasource[0].vessel1;
        this.indentDetails.awb_bl_no1.value = this.detaildatasource[0].awb_bl_no1;
        this.indentDetails.etd_1.value = this.detaildatasource[0].etd1;
        this.indentDetails.eta1.value = this.detaildatasource[0].eta1;
        this.indentDetails.invoice_no2.value = this.detaildatasource[0].invoice_no2;
        this.indentDetails.invoice_date2.value = this.detaildatasource[0].invoice_date2;
        this.indentDetails.mode2.value = this.detaildatasource[0].mode2;
        this.indentDetails.from2.value = this.detaildatasource[0].from2;
        this.indentDetails.vessel2.value = this.detaildatasource[0].vessel2;
        this.indentDetails.awb_bl_no2.value = this.detaildatasource[0].awb_bl_no2;
        this.indentDetails.etd_2.value = this.detaildatasource[0].etd2;
        this.indentDetails.eta2.value = this.detaildatasource[0].eta2;
        this.indentDetails.invoice_no3.value = this.detaildatasource[0].invoice_no3;
        this.indentDetails.invoice_date3.value = this.detaildatasource[0].invoice_date3;
        this.indentDetails.mode3.value = this.detaildatasource[0].mode3;
        this.indentDetails.from3.value = this.detaildatasource[0].from3;
        this.indentDetails.vessel3.value = this.detaildatasource[0].vessel3;
        this.indentDetails.awb_bl_no3.value = this.detaildatasource[0].awb_bl_no3;
        this.indentDetails.etd_3.value = this.detaildatasource[0].etd3;
        this.indentDetails.eta3.value = this.detaildatasource[0].eta3;
        this.indentDetails.eway_bill_req.value = this.detaildatasource[0].eway_bill_req;
        this.indentDetails.eway_bill_num.value = this.detaildatasource[0].eway_bill_num;
        this.indentDetails.remarks2.value = this.detaildatasource[0].remarks2;
        this.indentDetails.com_month.value = this.detaildatasource[0].com_month;
        this.indentDetails.checked_on.value = this.detaildatasource[0].checked_on;
        this.indentDetails.next_check.value = this.detaildatasource[0].next_check;
        this.indentDetails.for_info.value = this.detaildatasource[0].for_info;
        this.indentDetails.pmt_sts.value = this.detaildatasource[0].pmt_sts;
        this.indentDetails.del_sts.value = this.detaildatasource[0].del_sts;
        this.oldPmtStatus = this.detaildatasource[0].pmt_sts;
        this.oldDelStatus = this.detaildatasource[0].del_sts;
        if (this.detaildatasource[0].adv_pc) {
          if (this.detaildatasource[0].adv_pc == "NA") {
            this.advpc = "";
          }
          else {
            this.advpc = (+this.detaildatasource[0].adv_pc * 100).toString().concat("%");
          }
        }
        else {
          this.advpc = "";
        }
        this.advamount = this.detaildatasource[0].adv_amount;
        this.advdate = this.datePipe.transform(this.detaildatasource[0].adv_date, 'yyyy-MM-dd');
        this.bshtype = this.detaildatasource[0].bsh_type;
        if (this.detaildatasource[0].bsh_pc) {
          if (this.detaildatasource[0].bsh_pc == "NA") {
            this.bshpc = "";
          }
          else {
            this.bshpc = (+this.detaildatasource[0].bsh_pc * 100).toString().concat("%");
          }
        }
        else {
          this.bshpc = "";
        }
        this.bshamount = this.detaildatasource[0].bsh_amount;
        this.bshdate = this.datePipe.transform(this.detaildatasource[0].bsh_date, 'yyyy-MM-dd');
        this.ashtype = this.detaildatasource[0].ash_type;
        if (this.detaildatasource[0].ash_pc) {
          if (this.detaildatasource[0].ash_pc == "NA") {
            this.ashpc = "";
          }
          else {
            this.ashpc = (+this.detaildatasource[0].ash_pc * 100).toString().concat("%");
          }
        }
        else {
          this.ashpc = "";
        }
        this.ashamount = this.detaildatasource[0].ash_amount;
        this.ashdate = this.datePipe.transform(this.detaildatasource[0].ash_date, 'yyyy-MM-dd');
        this.pmttrms = this.detaildatasource[0].pmt_trms;

        this.pmtsts = this.detaildatasource[0].pmt_sts;
        this.delsts = this.detaildatasource[0].del_sts;
        this.reqetdtoij = this.detaildatasource[0].req_etd_to_ij;

        this.indFormGroup.controls.indent_no.patchValue(this.detaildatasource[0].indent_sheet_num);
        this.piFormGroup.controls.pi_no.patchValue(this.detaildatasource[0].pi_no);
        this.iipoFormGroup.controls.iipo_no.patchValue(this.detaildatasource[0].iipo_no);
        this.ocFormGroup.controls.ij_project_num.patchValue(this.detaildatasource[0].ij_project_num);
        this.shpinvFormGroup.controls.invoice_no1.patchValue(this.detaildatasource[0].invoice_no1);
        this.shpinvFormGroup.controls.awb_bl_no1.patchValue(this.detaildatasource[0].awb_bl_no1);
        this.shpinvFormGroup.controls.invoice_no2.patchValue(this.detaildatasource[0].invoice_no2);
        this.shpinvFormGroup.controls.awb_bl_no2.patchValue(this.detaildatasource[0].awb_bl_no2);
        this.shpinvFormGroup.controls.invoice_no3.patchValue(this.detaildatasource[0].invoice_no3);
        this.shpinvFormGroup.controls.awb_bl_no3.patchValue(this.detaildatasource[0].awb_bl_no3);
        this.shpinvFormGroup.controls.vessel3.patchValue(this.detaildatasource[0].vessel3);
        this.shpinvFormGroup.controls.vessel2.patchValue(this.detaildatasource[0].vessel2);
        this.shpinvFormGroup.controls.vessel1.patchValue(this.detaildatasource[0].vessel1);
        this.nactionFormGroup.controls.for_info.patchValue(this.detaildatasource[0].for_info);


        if (this.detaildatasource[0].del_sts === null) {
          this.exfFormGroup.controls.del_sts.patchValue('');
        } else {
          this.exfFormGroup.controls.del_sts.patchValue(this.detaildatasource[0].del_sts);
        }

        if (this.detaildatasource[0].exf1_sts === null) {
          this.exfFormGroup.controls.exf1_sts.patchValue('');
        } else {
          this.exfFormGroup.controls.exf1_sts.patchValue(this.detaildatasource[0].exf1_sts);
        }
        if (this.detaildatasource[0].exf2_sts === null) {
          this.exfFormGroup.controls.exf2_sts.patchValue('');
        } else {
          this.exfFormGroup.controls.exf2_sts.patchValue(this.detaildatasource[0].exf2_sts);
        }
        if (this.detaildatasource[0].exf3_sts === null) {
          this.exfFormGroup.controls.exf3_sts.patchValue('');
        } else {
          this.exfFormGroup.controls.exf3_sts.patchValue(this.detaildatasource[0].exf3_sts);
        }

        if (this.detaildatasource[0].pmt_sts === null) {
          this.paymentStatus = '';
          this.pmtFormGroup.controls.pmt_sts.patchValue('');
        } else {
          this.paymentStatus = this.detaildatasource[0].pmt_sts;
          this.pmtFormGroup.controls.pmt_sts.patchValue(this.detaildatasource[0].pmt_sts);
        }

        if (this.detaildatasource[0].del_sts === null) {
          this.shpinvFormGroup.controls.del_sts.patchValue('');
        } else {
          this.shpinvFormGroup.controls.del_sts.patchValue(this.detaildatasource[0].del_sts);
        }

        if (this.detaildatasource[0].mode1 === null) {
          this.shpinvFormGroup.controls.mode1.patchValue('');
        } else {
          this.shpinvFormGroup.controls.mode1.patchValue(this.detaildatasource[0].mode1);
        }
        if (this.detaildatasource[0].from1 === null) {
          this.shpinvFormGroup.controls.from1.patchValue('');
        } else {
          this.shpinvFormGroup.controls.from1.patchValue(this.detaildatasource[0].from1);
        }


        if (this.detaildatasource[0].mode2 === null) {
          this.shpinvFormGroup.controls.mode2.patchValue('');
        } else {
          this.shpinvFormGroup.controls.mode2.patchValue(this.detaildatasource[0].mode2);
        }
        if (this.detaildatasource[0].from2 === null) {
          this.shpinvFormGroup.controls.from2.patchValue('');
        } else {
          this.shpinvFormGroup.controls.from2.patchValue(this.detaildatasource[0].from2);
        }


        if (this.detaildatasource[0].mode3 === null) {
          this.shpinvFormGroup.controls.mode3.patchValue('');
        } else {
          this.shpinvFormGroup.controls.mode3.patchValue(this.detaildatasource[0].mode3);
        }
        if (this.detaildatasource[0].from3 === null) {
          this.shpinvFormGroup.controls.from3.patchValue('');
        } else {
          this.shpinvFormGroup.controls.from3.patchValue(this.detaildatasource[0].from3);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].pi_date) === -1) {
          this.piFormGroup.controls.pi_date.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].pi_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].pi_date, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].pi_date, 'dd'))
          });
        } else {
          this.piFormGroup.controls.pi_date.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].iipo_date) === -1) {
          this.iipoFormGroup.controls.iipo_date.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].iipo_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].iipo_date, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].iipo_date, 'dd'))
          });
        } else {
          this.iipoFormGroup.controls.iipo_date.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].oc_date) === -1) {
          this.ocFormGroup.controls.oc_date.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].oc_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].oc_date, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].oc_date, 'dd'))
          });
        } else {
          this.ocFormGroup.controls.oc_date.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].exf1) === -1) {
          this.exfFormGroup.controls.exf1.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].exf1, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].exf1, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].exf1, 'dd'))
          });
        } else {
          this.exfFormGroup.controls.exf1.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].exf_ij_accment1) === -1) {
          this.exfFormGroup.controls.exf_ij_accment1.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].exf_ij_accment1, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].exf_ij_accment1, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].exf_ij_accment1, 'dd'))
          });
        } else {
          this.exfFormGroup.controls.exf_ij_accment1.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].exf2) === -1) {
          this.exfFormGroup.controls.exf2.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].exf2, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].exf2, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].exf2, 'dd'))
          });
        } else {
          this.exfFormGroup.controls.exf2.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].exf_ij_accment2) === -1) {
          this.exfFormGroup.controls.exf_ij_accment2.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].exf_ij_accment2, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].exf_ij_accment2, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].exf_ij_accment2, 'dd'))
          });
        } else {
          this.exfFormGroup.controls.exf_ij_accment2.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].exf3) === -1) {
          this.exfFormGroup.controls.exf3.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].exf3, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].exf3, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].exf3, 'dd'))
          });
        } else {
          this.exfFormGroup.controls.exf3.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].exf_ij_accment3) === -1) {
          this.exfFormGroup.controls.exf_ij_accment3.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].exf_ij_accment3, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].exf_ij_accment3, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].exf_ij_accment3, 'dd'))
          });
        } else {
          this.exfFormGroup.controls.exf_ij_accment3.patchValue(null);
        }


        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].lc_chk_date_by_ij) === -1) {
          this.lcFormGroup.controls.lc_chk_date_by_ij.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].lc_chk_date_by_ij, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].lc_chk_date_by_ij, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].lc_chk_date_by_ij, 'dd'))
          });
        } else {
          this.lcFormGroup.controls.lc_chk_date_by_ij.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].lc_open_date) === -1) {
          this.lcFormGroup.controls.lc_open_date.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].lc_open_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].lc_open_date, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].lc_open_date, 'dd'))
          });
        } else {
          this.lcFormGroup.controls.lc_open_date.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].lc_last_revision_date) === -1) {
          this.lcFormGroup.controls.lc_last_revision_date.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].lc_last_revision_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].lc_last_revision_date, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].lc_last_revision_date, 'dd'))
          });
        } else {
          this.lcFormGroup.controls.lc_last_revision_date.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].latest_shipment_date) === -1) {
          this.lcFormGroup.controls.latest_shipment_date.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].latest_shipment_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].latest_shipment_date, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].latest_shipment_date, 'dd'))
          });
        } else {
          this.lcFormGroup.controls.latest_shipment_date.patchValue(null);
        }


        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].lc_expiry_date) === -1) {
          this.lcFormGroup.controls.lc_expiry_date.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].lc_expiry_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].lc_expiry_date, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].lc_expiry_date, 'dd'))
          });
        } else {
          this.lcFormGroup.controls.lc_expiry_date.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].com_month) === -1) {
          this.comFormGroup.controls.com_month.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].com_month, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].com_month, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].com_month, 'dd'))
          });
        } else {
          this.comFormGroup.controls.com_month.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].invoice_date1) === -1) {
          this.shpinvFormGroup.controls.invoice_date1.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].invoice_date1, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].invoice_date1, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].invoice_date1, 'dd'))
          });
        } else {
          this.shpinvFormGroup.controls.invoice_date1.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].etd1) === -1) {
          this.shpinvFormGroup.controls.etd1.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].etd1, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].etd1, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].etd1, 'dd'))
          });
        } else {
          this.shpinvFormGroup.controls.etd1.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].eta1) === -1) {
          this.shpinvFormGroup.controls.eta1.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].eta1, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].eta1, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].eta1, 'dd'))
          });
        } else {
          this.shpinvFormGroup.controls.eta1.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].invoice_date2) === -1) {
          this.shpinvFormGroup.controls.invoice_date2.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].invoice_date2, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].invoice_date2, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].invoice_date2, 'dd'))
          });
        } else {
          this.shpinvFormGroup.controls.invoice_date2.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].etd2) === -1) {
          this.shpinvFormGroup.controls.etd2.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].etd2, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].etd2, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].etd2, 'dd'))
          });
        } else {
          this.shpinvFormGroup.controls.etd2.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].eta2) === -1) {
          this.shpinvFormGroup.controls.eta2.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].eta2, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].eta2, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].eta2, 'dd'))
          });
        } else {
          this.shpinvFormGroup.controls.eta2.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].invoice_date3) === -1) {
          this.shpinvFormGroup.controls.invoice_date3.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].invoice_date3, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].invoice_date3, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].invoice_date3, 'dd'))
          });
        } else {
          this.shpinvFormGroup.controls.invoice_date3.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].etd3) === -1) {
          this.shpinvFormGroup.controls.etd3.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].etd3, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].etd3, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].etd3, 'dd'))
          });
        } else {
          this.shpinvFormGroup.controls.etd3.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].eta3) === -1) {
          this.shpinvFormGroup.controls.eta3.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].eta3, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].eta3, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].eta3, 'dd'))
          });
        } else {
          this.shpinvFormGroup.controls.eta3.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].checked_on) === -1) {
          this.nactionFormGroup.controls.checked_on.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].checked_on, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].checked_on, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].checked_on, 'dd'))
          });
        } else {
          this.nactionFormGroup.controls.checked_on.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.detaildatasource[0].next_check) === -1) {
          this.nactionFormGroup.controls.next_check.patchValue({
            year: Number(this.datePipe.transform(this.detaildatasource[0].next_check, 'yyyy')),
            month: Number(this.datePipe.transform(this.detaildatasource[0].next_check, 'MM')),
            day: Number(this.datePipe.transform(this.detaildatasource[0].next_check, 'dd'))
          });
        } else {
          this.nactionFormGroup.controls.next_check.patchValue(null);
        }

        this.pmt_type_detail = this.detaildatasource[0].adv_type;
        this.pmt_percent_detal = this.detaildatasource[0].adv_pc;
        this.pmt_amount_detail = this.detaildatasource[0].adv_amount;

      }))
      .subscribe();
    this.getSubIndentData(indNum);
  }

  getSubIndentData(indNum: string) {
    const url = GlobalConstants.apiIndentSubDetail + indNum;
    this.httpcon.get<IndentUpdateNewTabs[]>(url).subscribe(res => {
      if (res.length != 0) {
        this.updateNewTabs = res;
        //#II-OC PatchControls
        this.iiocFormGroup.controls.job_no.patchValue(this.updateNewTabs[0].job_no);
        this.iiocFormGroup.controls.oc_no.patchValue(this.updateNewTabs[0].oc_no);
        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.updateNewTabs[0].prd_ord_date) === -1) {
          this.iiocFormGroup.controls.prd_ord_date.patchValue({
            year: Number(this.datePipe.transform(this.updateNewTabs[0].prd_ord_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.updateNewTabs[0].prd_ord_date, 'MM')),
            day: Number(this.datePipe.transform(this.updateNewTabs[0].prd_ord_date, 'dd'))
          });
        } else {
          this.iiocFormGroup.controls.prd_ord_date.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.updateNewTabs[0].oc_date) === -1) {
          this.iiocFormGroup.controls.oc_date.patchValue({
            year: Number(this.datePipe.transform(this.updateNewTabs[0].oc_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.updateNewTabs[0].oc_date, 'MM')),
            day: Number(this.datePipe.transform(this.updateNewTabs[0].oc_date, 'dd'))
          });
        } else {
          this.iiocFormGroup.controls.oc_date.patchValue(null);
        }

        //#II-EXF PatchControls
        if (this.updateNewTabs[0].del_sts === null) {
          this.iiexfFormGroup.controls.del_sts.patchValue('');
        } else {
          this.iiexfFormGroup.controls.del_sts.patchValue(this.updateNewTabs[0].del_sts);
        }
        if (this.updateNewTabs[0].exf1_sts === null) {
          this.iiexfFormGroup.controls.exf1_sts.patchValue('');
        } else {
          this.iiexfFormGroup.controls.exf1_sts.patchValue(this.updateNewTabs[0].exf1_sts);
        }
        if (this.updateNewTabs[0].exf2_sts === null) {
          this.iiexfFormGroup.controls.exf2_sts.patchValue('');
        } else {
          this.iiexfFormGroup.controls.exf2_sts.patchValue(this.updateNewTabs[0].exf2_sts);
        }
        if (this.updateNewTabs[0].exf3_sts === null) {
          this.iiexfFormGroup.controls.exf3_sts.patchValue('');
        } else {
          this.iiexfFormGroup.controls.exf3_sts.patchValue(this.updateNewTabs[0].exf3_sts);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.updateNewTabs[0].exf1_date) === -1) {
          this.iiexfFormGroup.controls.exf1_date.patchValue({
            year: Number(this.datePipe.transform(this.updateNewTabs[0].exf1_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.updateNewTabs[0].exf1_date, 'MM')),
            day: Number(this.datePipe.transform(this.updateNewTabs[0].exf1_date, 'dd'))
          });
        } else {
          this.iiexfFormGroup.controls.exf1_date.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.updateNewTabs[0].exf2_date) === -1) {
          this.iiexfFormGroup.controls.exf2_date.patchValue({
            year: Number(this.datePipe.transform(this.updateNewTabs[0].exf2_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.updateNewTabs[0].exf2_date, 'MM')),
            day: Number(this.datePipe.transform(this.updateNewTabs[0].exf2_date, 'dd'))
          });
        } else {
          this.iiexfFormGroup.controls.exf2_date.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.updateNewTabs[0].exf3_date) === -1) {
          this.iiexfFormGroup.controls.exf3_date.patchValue({
            year: Number(this.datePipe.transform(this.updateNewTabs[0].exf3_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.updateNewTabs[0].exf3_date, 'MM')),
            day: Number(this.datePipe.transform(this.updateNewTabs[0].exf3_date, 'dd'))
          });
        } else {
          this.iiexfFormGroup.controls.exf3_date.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.updateNewTabs[0].exf1_annc_date) === -1) {
          this.iiexfFormGroup.controls.exf1_annc_date.patchValue({
            year: Number(this.datePipe.transform(this.updateNewTabs[0].exf1_annc_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.updateNewTabs[0].exf1_annc_date, 'MM')),
            day: Number(this.datePipe.transform(this.updateNewTabs[0].exf1_annc_date, 'dd'))
          });
        } else {
          this.iiexfFormGroup.controls.exf1_annc_date.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.updateNewTabs[0].exf2_annc_date) === -1) {
          this.iiexfFormGroup.controls.exf2_annc_date.patchValue({
            year: Number(this.datePipe.transform(this.updateNewTabs[0].exf2_annc_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.updateNewTabs[0].exf2_annc_date, 'MM')),
            day: Number(this.datePipe.transform(this.updateNewTabs[0].exf2_annc_date, 'dd'))
          });
        } else {
          this.iiexfFormGroup.controls.exf2_annc_date.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.updateNewTabs[0].exf3_annc_date) === -1) {
          this.iiexfFormGroup.controls.exf3_annc_date.patchValue({
            year: Number(this.datePipe.transform(this.updateNewTabs[0].exf3_annc_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.updateNewTabs[0].exf3_annc_date, 'MM')),
            day: Number(this.datePipe.transform(this.updateNewTabs[0].exf3_annc_date, 'dd'))
          });
        } else {
          this.iiexfFormGroup.controls.exf3_annc_date.patchValue(null);
        }

        //#BG PatchControls
        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.updateNewTabs[0].abg_request_anct_date) === -1) {
          this.bgFormGroup.controls.abg_request_anct_date.patchValue({
            year: Number(this.datePipe.transform(this.updateNewTabs[0].abg_request_anct_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.updateNewTabs[0].abg_request_anct_date, 'MM')),
            day: Number(this.datePipe.transform(this.updateNewTabs[0].abg_request_anct_date, 'dd'))
          });
        } else {
          this.bgFormGroup.controls.abg_request_anct_date.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.updateNewTabs[0].abg_issuance_date) === -1) {
          this.bgFormGroup.controls.abg_issuance_date.patchValue({
            year: Number(this.datePipe.transform(this.updateNewTabs[0].abg_issuance_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.updateNewTabs[0].abg_issuance_date, 'MM')),
            day: Number(this.datePipe.transform(this.updateNewTabs[0].abg_issuance_date, 'dd'))
          });
        } else {
          this.bgFormGroup.controls.abg_issuance_date.patchValue(null);
        }
        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.updateNewTabs[0].abg_final_submission_draft_date) === -1) {
          this.bgFormGroup.controls.abg_final_submission_draft_date.patchValue({
            year: Number(this.datePipe.transform(this.updateNewTabs[0].abg_final_submission_draft_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.updateNewTabs[0].abg_final_submission_draft_date, 'MM')),
            day: Number(this.datePipe.transform(this.updateNewTabs[0].abg_final_submission_draft_date, 'dd'))
          });
        } else {
          this.bgFormGroup.controls.abg_final_submission_draft_date.patchValue(null);
        }
        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.updateNewTabs[0].abg_final_submission_bg_date) === -1) {
          this.bgFormGroup.controls.abg_final_submission_bg_date.patchValue({
            year: Number(this.datePipe.transform(this.updateNewTabs[0].abg_final_submission_bg_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.updateNewTabs[0].abg_final_submission_bg_date, 'MM')),
            day: Number(this.datePipe.transform(this.updateNewTabs[0].abg_final_submission_bg_date, 'dd'))
          });
        } else {
          this.bgFormGroup.controls.abg_final_submission_bg_date.patchValue(null);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.updateNewTabs[0].pbg_request_anct_date) === -1) {
          this.bgFormGroup.controls.pbg_request_anct_date.patchValue({
            year: Number(this.datePipe.transform(this.updateNewTabs[0].pbg_request_anct_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.updateNewTabs[0].pbg_request_anct_date, 'MM')),
            day: Number(this.datePipe.transform(this.updateNewTabs[0].pbg_request_anct_date, 'dd'))
          });
        } else {
          this.bgFormGroup.controls.pbg_request_anct_date.patchValue(null);
        }
        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.updateNewTabs[0].pbg_issuance_date) === -1) {
          this.bgFormGroup.controls.pbg_issuance_date.patchValue({
            year: Number(this.datePipe.transform(this.updateNewTabs[0].pbg_issuance_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.updateNewTabs[0].pbg_issuance_date, 'MM')),
            day: Number(this.datePipe.transform(this.updateNewTabs[0].pbg_issuance_date, 'dd'))
          });
        } else {
          this.bgFormGroup.controls.pbg_issuance_date.patchValue(null);
        }
        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.updateNewTabs[0].pbg_final_submission_draft_date) === -1) {
          this.bgFormGroup.controls.pbg_final_submission_draft_date.patchValue({
            year: Number(this.datePipe.transform(this.updateNewTabs[0].pbg_final_submission_draft_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.updateNewTabs[0].pbg_final_submission_draft_date, 'MM')),
            day: Number(this.datePipe.transform(this.updateNewTabs[0].pbg_final_submission_draft_date, 'dd'))
          });
        } else {
          this.bgFormGroup.controls.pbg_final_submission_draft_date.patchValue(null);
        }
        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.updateNewTabs[0].pbg_final_submission_bg_date) === -1) {
          this.bgFormGroup.controls.pbg_final_submission_bg_date.patchValue({
            year: Number(this.datePipe.transform(this.updateNewTabs[0].pbg_final_submission_bg_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.updateNewTabs[0].pbg_final_submission_bg_date, 'MM')),
            day: Number(this.datePipe.transform(this.updateNewTabs[0].pbg_final_submission_bg_date, 'dd'))
          });
        } else {
          this.bgFormGroup.controls.pbg_final_submission_bg_date.patchValue(null);
        }


      }
    }, () => { });
  }

  getInvoiceIndentData(indNum: string) {
    const url = GlobalConstants.apiGetInvIndentData + indNum;
    this.invoiceList = [];
    this.httpcon.get<IndentUpdateINVEWB[]>(url).subscribe(res => {
      if (res.length != 0) {
        this.invoiceList = res;

        let invoiceIds = this.invoiceList.map(d => parseInt(d.invoice_id, 10));
        this.invoiceID = Math.max(...invoiceIds);

        //#INV/eWB PatchControls
        this.invewbFormGroup.controls.inv_no.patchValue(this.invoiceList[0].inv_no);
        this.invewbFormGroup.controls.ewb_no.patchValue(this.invoiceList[0].ewb_no);
        this.invewbFormGroup.controls.dispatch_from_indent.patchValue(this.invoiceList[0].dispatch_from_indent);
        this.invewbFormGroup.controls.dispatch_from_origin.patchValue(this.invoiceList[0].dispatch_from_origin);
        this.invewbFormGroup.controls.dispatch_to_indent.patchValue(this.invoiceList[0].dispatch_to_indent);
        this.invewbFormGroup.controls.dispatch_to_destination.patchValue(this.invoiceList[0].dispatch_to_destination);
        if (this.invoiceList[0].transportation_method === null) {
          this.invewbFormGroup.controls.transportation_method.patchValue('');
        } else {
          this.invewbFormGroup.controls.transportation_method.patchValue(this.invoiceList[0].transportation_method);
        }

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.invoiceList[0].inv_request_anct_date) === -1) {
          this.invewbFormGroup.controls.inv_request_anct_date.patchValue({
            year: Number(this.datePipe.transform(this.invoiceList[0].inv_request_anct_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.invoiceList[0].inv_request_anct_date, 'MM')),
            day: Number(this.datePipe.transform(this.invoiceList[0].inv_request_anct_date, 'dd'))
          });
        } else {
          this.invewbFormGroup.controls.inv_request_anct_date.patchValue(null);
        }
        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.invoiceList[0].inv_issuance_date) === -1) {
          this.invewbFormGroup.controls.inv_issuance_date.patchValue({
            year: Number(this.datePipe.transform(this.invoiceList[0].inv_issuance_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.invoiceList[0].inv_issuance_date, 'MM')),
            day: Number(this.datePipe.transform(this.invoiceList[0].inv_issuance_date, 'dd'))
          });
        } else {
          this.invewbFormGroup.controls.inv_issuance_date.patchValue(null);
        }
        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.invoiceList[0].ewb_issuance_date) === -1) {
          this.invewbFormGroup.controls.ewb_issuance_date.patchValue({
            year: Number(this.datePipe.transform(this.invoiceList[0].ewb_issuance_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.invoiceList[0].ewb_issuance_date, 'MM')),
            day: Number(this.datePipe.transform(this.invoiceList[0].ewb_issuance_date, 'dd'))
          });
        } else {
          this.invewbFormGroup.controls.ewb_issuance_date.patchValue(null);
        }
        if (['undefined--', 'null', '', '0-00-00', null].indexOf(this.invoiceList[0].dispatch_date) === -1) {
          this.invewbFormGroup.controls.dispatch_date.patchValue({
            year: Number(this.datePipe.transform(this.invoiceList[0].dispatch_date, 'yyyy')),
            month: Number(this.datePipe.transform(this.invoiceList[0].dispatch_date, 'MM')),
            day: Number(this.datePipe.transform(this.invoiceList[0].dispatch_date, 'dd'))
          });
        } else {
          this.invewbFormGroup.controls.dispatch_date.patchValue(null);
        }
        this.invewbFormGroup.controls.machine_sn.patchValue(this.invoiceList[0].machine_sn);

      }
    }, () => { });
  }

  getPaymentIndentData(indNum: string) {
    this.paymentList = [];
    const url = GlobalConstants.apiGetPaymentIndentData + indNum;
    this.httpcon.get<IndentUpdatePMT[]>(url).subscribe(res => {
      if (res.length != 0) {
        this.paymentList = res;
      }
    }, () => { });
  }

  dateTextBox_KeyUp(evt, formGroup) {
    this.dateSearchText = evt.target.value;
    this.formControlName = evt.target.getAttribute('formControlName');
    let controlName = evt.target.getAttribute('formControlName');

    if (evt.target) {
      this.isDateInvalid = false;
      if (this.dateSearchText == "") {
        this.dateSearchText = this.dateSearchText.slice(0, 0);
      }

      if (this.dateSearchText.length > 10) {
        this.dateSearchText = this.dateSearchText.slice(0, 10)
      }
      while (this.dateSearchText.includes(" "))                     // 1 spaces.
      {
        this.dateSearchText = this.dateSearchText.replace(/ /g, '');
        this.dateSearchText = this.dateSearchText.trim();
        evt.target.value = this.dateSearchText.replace(/ /g, '');
      }

      if (evt.timeStamp - this.lastkeydown1 > 200) {
        if (this.dateSearchText.length == 4) {
          this.dateSearchText = this.dateSearchText + "-";
        }
        else if (this.dateSearchText.length == 7) {
          this.dateSearchText = this.dateSearchText + "-";
        }
        else if (this.dateSearchText.length == 10) {
          evt.target.value = this.dateSearchText;
        }
        this.dateSearchText = this.dateSearchText.replace(/^[^\d|-]*$/, '');
      }
      evt.target.value = this.dateSearchText;
    }
    if (this.dateSearchText.length == 10) {
      this.isDateInvalid = false;
      this.isMinDateFlag = false;
      this.minDateInvalid = false;
      this.isMaxDateFlag = false;
      this.maxDateInvalid = false;
      this.radioTypeDisabled = false;

      let isValidDate = this.isRegexDateValid(this.dateSearchText);
      if (isValidDate) {
        let validateDate = this.validateDate(this.dateSearchText);
        if (validateDate) {
          let dateValue = this.datePipe.transform(this.dateSearchText, 'yyyy-MM-dd');
          let minValue = this.parserFormatter.format(this.minDate);
          let maxValue = this.parserFormatter.format(this.maxDate);

          var d1 = Date.parse(dateValue);
          var d2 = Date.parse(minValue);
          var d3 = Date.parse(maxValue);
          if (d1 < d2) {
            this.isMinDateFlag = true;
            this.minDateInvalid = true;
            this.minDateMsg = "Date should not be less than " + minValue;
            formGroup.get(controlName).setErrors({ invalid: { date: false } });
            formGroup.get(controlName).setErrors({ invalid: { maxDate: false } });
            formGroup.get(controlName).setErrors({ invalid: { minDate: true } });
            this.radioTypeDisabled = true;
          }
          if (d1 > d3) {
            this.isMaxDateFlag = true;
            this.maxDateInvalid = true;
            this.maxDateMsg = "Date should not be greater than " + maxValue;
            formGroup.get(controlName).setErrors({ invalid: { date: false } });
            formGroup.get(controlName).setErrors({ invalid: { minDate: false } });
            formGroup.get(controlName).setErrors({ invalid: { maxDate: true } });
            this.radioTypeDisabled = true;
          }
        }
        else {
          this.isDateInvalid = true;
          formGroup.get(controlName).setErrors({ invalid: { minDate: false } });
          formGroup.get(controlName).setErrors({ invalid: { maxDate: false } });
          formGroup.get(controlName).setErrors({ invalid: { date: true } });
          this.radioTypeDisabled = true;
        }
      }
    }
    let getError = formGroup.get(controlName).errors;
    if (getError === null && formGroup.valid) {
      this.radioTypeDisabled = false;
    }
    else {
      this.radioTypeDisabled = true;
    }
  }

  dataChangedEvent(event, formGroup) {
    this.isDateInvalid = false;
    this.isMinDateFlag = false;
    this.minDateInvalid = false;
    this.isMaxDateFlag = false;
    this.maxDateInvalid = false;
    this.radioTypeDisabled = false;
    let controlName = event.target.getAttribute('formControlName');
    let getError = formGroup.get(controlName).errors;

    if (event.target.value.length == 10) {
      let isValidDate = this.isRegexDateValid(event.target.value);
      if (isValidDate) {
        let validateDate = this.validateDate(event.target.value);
        if (validateDate) {
          let dateValue = this.datePipe.transform(event.target.value, 'yyyy-MM-dd');
          let minValue = this.parserFormatter.format(this.minDate);
          let maxValue = this.parserFormatter.format(this.maxDate);

          var d1 = Date.parse(dateValue);
          var d2 = Date.parse(minValue);
          var d3 = Date.parse(maxValue);
          if (d1 < d2) {
            this.isMinDateFlag = true;
            this.minDateInvalid = true;
            this.minDateMsg = "Date should not be less than " + minValue;
            formGroup.get(controlName).setErrors({ invalid: { date: false } });
            formGroup.get(controlName).setErrors({ invalid: { maxDate: false } });
            formGroup.get(controlName).setErrors({ invalid: { minDate: true } });
            this.radioTypeDisabled = true;
          }
          if (d1 > d3) {
            this.isMaxDateFlag = true;
            this.maxDateInvalid = true;
            this.maxDateMsg = "Date should not be greater than " + maxValue;
            formGroup.get(controlName).setErrors({ invalid: { date: false } });
            formGroup.get(controlName).setErrors({ invalid: { minDate: false } });
            formGroup.get(controlName).setErrors({ invalid: { maxDate: true } });
            this.radioTypeDisabled = true;
          }
        }
        else {
          this.isDateInvalid = true;
          formGroup.get(controlName).setErrors({ invalid: { minDate: false } });
          formGroup.get(controlName).setErrors({ invalid: { maxDate: false } });
          formGroup.get(controlName).setErrors({ invalid: { date: true } });
          this.radioTypeDisabled = true;
        }
      }
    }
    else if (formGroup.get(controlName).invalid) {
      formGroup.get(controlName).setErrors({ invalid: { minDate: false } });
      formGroup.get(controlName).setErrors({ invalid: { maxDate: false } });
      formGroup.get(controlName).setErrors({ invalid: { date: true } });
      this.radioTypeDisabled = true;
    }
    if (getError === null && formGroup.valid) {
      this.radioTypeDisabled = false;
    }
    else {
      this.radioTypeDisabled = true;
    }
  }

  keyPressNumberOnly(event, formGroup): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    if (event.target.value.length == 10) {
      let year = (event.target.value).substring(0, 4);
      let month = (event.target.value).substring(5, 7);
      let date = (event.target.value).substring(8, 10);
      event.target.value = year + "-" + month + "-" + date;
      let validateDate = this.validateDate(event.target.value);
      if (validateDate) {
        let controlName = event.target.getAttribute('formControlName');
        formGroup.controls[controlName].patchValue({
          year: Number(this.datePipe.transform(event.target.value, 'yyyy')),
          month: Number(this.datePipe.transform(event.target.value, 'MM')),
          day: Number(this.datePipe.transform(event.target.value, 'dd'))
        });
      }
    }

    return true;
  }

  date_ValueSelected(evt, formGroup) {
    this.isDateInvalid = false;
    this.isMinDateFlag = false;
    this.minDateInvalid = false;
    this.isMaxDateFlag = false;
    this.maxDateInvalid = false;
    this.radioTypeDisabled = false;
    let getError = formGroup.getError();
    if (evt.target) {
      let evtVal = evt.target.value;
      let isDate = this.validateDate(evtVal);
      if (isDate) {
        this.isDateInvalid = false;
      }
    }
    if (getError === null && formGroup.valid) {
      this.radioTypeDisabled = false;
    }
    else {
      this.radioTypeDisabled = true;
    }
    this.compareFormChanged(formGroup.value);
  }

  isRegexDateValid(date: string): boolean {
    var date_regex = /^(\d{4})-(\d{2})-(\d{2})$/;
    if (!(date_regex.test(date))) {
      return false;
    }
    else {
      return true;
    }
  }

  updateInvModule(indent_id: string) {
    this.isModified = false;
    this.invewbFormGroup.reset();
    // globalInvoiceNo has value of id instead of indent_id. It has been changed in indentmgmt.component.html file but name 'indent_id' is used instead of 'id'
    this.globalInvoiceNo = indent_id;
    this.isAddOrUpdate = 'UPDATE';

    let selectedRow = this.invoiceList.filter(d => d.id == indent_id)

    let invDoc = selectedRow.map(d => d.invoice_doc);
    let invDocName = selectedRow.map(d => d.inv_doc_name);
    let ewbDoc = selectedRow.map(d => d.ewb_doc);
    let ewbDocName = selectedRow.map(d => d.ewb_doc_name);

    if (invDoc[0] === null && invDocName[0] === null) {
      this.invAttachedFormFiles = [];
      this.invFileNamesTooltip = [];
    } else {

      this.invAttachedFormFiles = selectedRow.map((d) => {

        const base64Str = d.invoice_doc;
        const blob = this.base64ToBlob(base64Str, d.inv_doc_name);
        const name = d.inv_doc_name;
        const type = this.getMimeType(name);

        return new File([blob], name, { type, lastModified: new Date().getTime() });
      });

      this.loadSelectedPdf('INV');
      this.invFileNamesTooltip = this.invAttachedFormFiles.map(d => d.name);
    }

    if (ewbDoc[0] === null && ewbDocName[0] === null) {
      this.ewbAttachedFormFiles = [];
      this.ewbFileNamesTooltip = [];
    } else {

      this.ewbAttachedFormFiles = selectedRow.map((d) => {
        const base64Str = d.ewb_doc;
        const blob = this.base64ToBlob(base64Str, d.ewb_doc_name);
        const name = d.ewb_doc_name;
        const type = this.getMimeType(name);

        return new File([blob], name, { type, lastModified: new Date().getTime() });
      });

      this.loadSelectedPdf('EWB');
      this.ewbFileNamesTooltip = this.ewbAttachedFormFiles.map(d => d.name);
    }

    this.openInvEwbModal();
    this.indentId = indent_id; // just add this line to store indent id.
    for (let i of this.invoiceList) {
      // here indent_id value is replaced by id : its value has been changed in indentmgmt.component.html file but name 'indent_id' is used instead of 'id'
      if (indent_id == i.id) {
        if (['undefined--', 'null', '', '0-00-00', null].indexOf(i.inv_request_anct_date) === -1) {
          this.invewbFormGroup.controls.inv_request_anct_date.patchValue({
            year: Number(this.datePipe.transform(i.inv_request_anct_date, 'yyyy')),
            month: Number(this.datePipe.transform(i.inv_request_anct_date, 'MM')),
            day: Number(this.datePipe.transform(i.inv_request_anct_date, 'dd'))
          });
        } else {
          this.invewbFormGroup.controls.inv_request_anct_date.patchValue(null);
        }
        if (['undefined--', 'null', '', '0-00-00', null].indexOf(i.inv_issuance_date) === -1) {
          this.invewbFormGroup.controls.inv_issuance_date.patchValue({
            year: Number(this.datePipe.transform(i.inv_issuance_date, 'yyyy')),
            month: Number(this.datePipe.transform(i.inv_issuance_date, 'MM')),
            day: Number(this.datePipe.transform(i.inv_issuance_date, 'dd'))
          });
        } else {
          this.invewbFormGroup.controls.inv_issuance_date.patchValue(null);
        }

        this.invewbFormGroup.controls.inv_no.patchValue(i.inv_no);
        this.invewbFormGroup.controls.ewb_no.patchValue(i.ewb_no);

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(i.ewb_issuance_date) === -1) {
          this.invewbFormGroup.controls.ewb_issuance_date.patchValue({
            year: Number(this.datePipe.transform(i.ewb_issuance_date, 'yyyy')),
            month: Number(this.datePipe.transform(i.ewb_issuance_date, 'MM')),
            day: Number(this.datePipe.transform(i.ewb_issuance_date, 'dd'))
          });
        } else {
          this.invewbFormGroup.controls.ewb_issuance_date.patchValue(null);
        }
        this.invewbFormGroup.controls.transportation_method.patchValue(i.transportation_method);

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(i.dispatch_date) === -1) {
          this.invewbFormGroup.controls.dispatch_date.patchValue({
            year: Number(this.datePipe.transform(i.dispatch_date, 'yyyy')),
            month: Number(this.datePipe.transform(i.dispatch_date, 'MM')),
            day: Number(this.datePipe.transform(i.dispatch_date, 'dd'))
          });
        } else {
          this.invewbFormGroup.controls.dispatch_date.patchValue(null);
        }
        this.invewbFormGroup.controls.dispatch_from_indent.patchValue(i.dispatch_from_indent);
        this.invewbFormGroup.controls.dispatch_from_origin.patchValue(i.dispatch_from_origin);
        this.invewbFormGroup.controls.dispatch_to_indent.patchValue(i.dispatch_to_indent);
        this.invewbFormGroup.controls.dispatch_to_destination.patchValue(i.dispatch_to_destination);
        this.invewbFormGroup.controls.machine_sn.patchValue(i.machine_sn);
        this.reactiveForm = this.invewbFormGroup;
        break;
      }
    }

  }

  updatePMTModule(payment_id: string) {
    this.isModified = false;
    this.globalPaymentNo = payment_id;
    this.isAddOrUpdate = 'UPDATE';
    this.paymentId = payment_id;    // just add this line to store payment id.
    let pmt_sts = this.paymentStatus;
    for (let i of this.paymentList) {
      if (this.paymentId == i.id) {
        this.selectedPaymentTypeForUpdate = i.payment_type;
        this.pmtFormGroup.controls.pmt_sts.patchValue(pmt_sts);
        this.pmtFormGroup.controls.payment_amount.patchValue(i.payment_amount);
        this.pmtFormGroup.controls.payment_type.patchValue(i.payment_type);

        if (['undefined--', 'null', '', '0-00-00', null].indexOf(i.payment_date) === -1) {
          this.pmtFormGroup.controls.payment_date.patchValue({
            year: Number(this.datePipe.transform(i.payment_date, 'yyyy')),
            month: Number(this.datePipe.transform(i.payment_date, 'MM')),
            day: Number(this.datePipe.transform(i.payment_date, 'dd'))
          });
        } else {
          this.pmtFormGroup.controls.payment_date.patchValue(null);
        }
        this.setReferenceData();
        break;
      }
    }

  }

  deleteINVModule(invoice_id: string) {
    let msgtext = 'Do You Want To Delete?';
    Swal.fire({
      icon: 'question',
      title: msgtext,
      showDenyButton: true,
      confirmButtonText: `YES`,
      denyButtonText: `NO`,
      confirmButtonColor: '#282E89',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // here invoice_id has value of id 'invoice_id' name is used instead of id because don't want to change the old code.
        this.deleteINVData(invoice_id);
      }
    })
  }

  deletePMTModule(payment_id: string) {
    this.globalPaymentNo = payment_id;

    let msgtext = 'Ok To Delete PMT';
    Swal.fire({
      icon: 'question',
      title: msgtext,
      showDenyButton: true,
      confirmButtonText: `YES`,
      denyButtonText: `NO`,
      confirmButtonColor: '#282E89',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.deletePMTData();
      }
    })
  }

  showAddInvModal() {
    this.invewbFormGroup.reset();
    this.isModified = true;
    this.isAddOrUpdate = 'SAVE';
    this.openInvEwbModal();
  }

  showAddPMTModal() {
    this.isModified = true;
    let pmt_sts = this.paymentStatus;
    this.pmtFormGroup.reset();
    this.pmtFormGroup.controls.pmt_sts.patchValue(pmt_sts);
    this.pmtFormGroup.controls.payment_type.patchValue('ADV');
    this.isAddOrUpdate = 'SAVE';
    this.pmt_type_detail = this.indentDetails.adv_type.value;
    this.pmt_percent_detal = this.indentDetails.adv_pc.value;
    this.pmt_amount_detail = this.indentDetails.adv_amount.value;
  }


  // this function append the index in current array if not exist otherwise delete that index from array.
  expand(index) {
    let isExist = false;
    for (let i of this.current) {
      if (index == i) {
        isExist = true;
        break;
      }
    }
    // if element not exist add it in the current
    if (!isExist) {
      this.current.push(index);
    }
    // if element already exist, remove it from the current
    else {
      const indexOfElement: number = this.current.indexOf(index);
      if (indexOfElement !== -1) {
        this.current.splice(indexOfElement, 1);
      }
    }
  }

  // this function return true if current array has that given index.
  checkCurrentIndex(index) {
    for (let i of this.current) {
      if (index == i) {
        return true;
      }
    }
    return false;
  }

  // new function for button clicks
  btnSelectIND() {
    this.resetAllBtnSelect();
    this.btnINDColor = true;
    this.resetAllLoadFormDetail();
    this.indLoadForm = true;
    this.selectedTab = 'IND';
    this.reactiveForm = this.indFormGroup;
    if (this.reactiveForm) {
      this.indFormGroup.statusChanges.subscribe(change => {
        if (!this.indFormGroup.dirty) {
          this._originalValue = JSON.stringify(this.indFormGroup.value);
        };
      })
      this.checkDataChanged('IND', this.reactiveForm, this.reactiveForm.value);
    }
  }

  btnSelectPI() {
    this.resetAllBtnSelect();
    this.btnPIColor = true;
    this.resetAllLoadFormDetail();
    this.piLoadForm = true;
    this.selectedTab = 'PI';
    this.reactiveForm = this.piFormGroup;
  }

  btnSelectIIPO() {
    this.resetAllBtnSelect();
    this.btnIIPOColor = true;
    this.resetAllLoadFormDetail();
    this.iipoLoadForm = true;
    this.selectedTab = 'II-PO';
    this.reactiveForm = this.iipoFormGroup;
  }

  btnSelectIIOC() {
    this.resetAllBtnSelect();
    this.btnIIOCColor = true;
    this.resetAllLoadFormDetail();
    this.iiocLoadForm = true;
    this.selectedTab = 'II-OC';
    this.reactiveForm = this.iiocFormGroup;
  }


  btnSelectOC() {
    this.resetAllBtnSelect();
    this.btnOCColor = true;
    this.resetAllLoadFormDetail();
    this.ocLoadForm = true;
    this.selectedTab = 'VD-OC';
    this.reactiveForm = this.ocFormGroup;
  }

  btnSelectLC() {
    this.resetAllBtnSelect();
    this.btnLCColor = true;
    this.resetAllLoadFormDetail();
    this.lcLoadForm = true;
    this.resetLcTypeFlag();
    this.lcTyp1Flag = true;
    this.selectedTab = 'LC';
    this.reactiveForm = this.lcFormGroup;
  }

  btnSelectSHPINV() {
    this.resetAllBtnSelect();
    this.btnSHPINVColor = true;
    this.resetAllLoadFormDetail();
    this.shpinvLoadForm = true;
    this.resetShpTypeFlag();
    this.shpTyp1Flag = true;
    this.selectedTab = 'VD-SHP';
    this.reactiveForm = this.shpinvFormGroup;
  }

  btnSelectEXF() {
    this.resetAllBtnSelect();
    this.btnEXFColor = true;
    this.resetAllLoadFormDetail();
    this.exfLoadForm = true;
    this.resetExfTypeFlag();
    this.exfTyp1Flag = true;
    this.selectedTab = 'VD-EXF';
    this.reactiveForm = this.exfFormGroup;
  }

  btnSelectIIEXF() {
    this.resetAllBtnSelect();
    this.btnIIEXFColor = true;
    this.resetAllLoadFormDetail();
    this.iiexfLoadForm = true;
    this.resetIIExfTypeFlag();
    this.iiexfTyp1Flag = true;
    this.selectedTab = 'II-EXF';
    this.reactiveForm = this.iiexfFormGroup;
  }

  btnSelectBG() {
    this.resetAllBtnSelect();
    this.btnBGColor = true;
    this.resetAllLoadFormDetail();
    this.bgLoadForm = true;
    this.resetBGTypeFlag();
    this.bgTyp1Flag = true;
    this.selectedTab = 'BG';
    this.reactiveForm = this.bgFormGroup;
  }

  btnSelectINVeWB() {
    this.resetInvoice();
    this.resetAllBtnSelect();
    this.btnINVeWBColor = true;
    this.resetAllLoadFormDetail();
    this.invewbLoadForm = true;
    this.current = [0];
    this.selectedTab = 'INV/eWB';
    this.invoiceID = null;
    this.getInvoiceIndentData(this.userSelIndNo);
    this.reactiveForm = this.invewbFormGroup;
    this.getsavedEmailData();
    // this.getDelSts();
  }

  btnSelectPMT() {
    this.resetAllBtnSelect();
    this.btnPMTColor = true;
    this.resetAllLoadFormDetail();
    this.pmtLoadForm = true;
    this.current = [0];
    this.selectedTab = 'PMT';
    this.getPaymentIndentData(this.userSelIndNo);
    this.reactiveForm = this.pmtFormGroup;
  }

  btnSelectCOM() {
    this.resetAllBtnSelect();
    this.btnCOMColor = true;
    this.resetAllLoadFormDetail();
    this.comLoadForm = true;
    this.resetComTypeFlag();
    this.comTyp1Flag = true;
    this.selectedTab = 'COM';
    this.reactiveForm = this.comFormGroup;
  }

  btnSelectNXTAXN() {
    this.resetAllBtnSelect();
    this.btnNXTAXNColor = true;
    this.resetAllLoadFormDetail();
    this.nactionLoadForm = true;
    this.selectedTab = 'NXT ACT';
    this.reactiveForm = this.nactionFormGroup;
  }

  resetAllBtnSelect() {
    this.btnPIColor = false;
    this.btnIIPOColor = false;
    this.btnOCColor = false;
    this.btnEXFColor = false;
    this.btnPMTColor = false;
    this.btnLCColor = false;
    this.btnCOMColor = false;
    this.btnSHPINVColor = false;
    this.btnNXTAXNColor = false;
    //new button false;
    this.btnINDColor = false;
    this.btnIIOCColor = false;
    this.btnIIEXFColor = false;
    this.btnBGColor = false;
    this.btnINVeWBColor = false;
  }


  openConfirmation(content, size) {
    if (this.isLoadModal) {
      this.modalReference = this.modalService.open(content, { backdrop: 'static', keyboard: false, size: size, backdropClass: 'light-blue-backdrop', centered: true });
    }
  }

  onSubmitPI(value, content) {
    this.onConfirm(value);
    this.openConfirmation(content, 'md');
  }

  onSubmitIIPO(value, content) {
    this.onConfirm(value);
    this.openConfirmation(content, 'md');
  }

  onSubmitIIOC(value, content) {
    this.onConfirm(value);
    this.openConfirmation(content, 'md');
  }
  onSubmitOC(value, content) {
    this.onConfirm(value);
    this.openConfirmation(content, 'md');
  }

  onSubmitIIEXF(value, content) {
    this.onConfirm(value);
    this.openConfirmation(content, 'md');
  }

  onSubmitEXF(value, content) {
    this.onConfirm(value);
    this.openConfirmation(content, 'md');
  }

  onSubmitBG(value, content) {
    this.onConfirm(value);
    this.openConfirmation(content, 'md');
  }

  onSubmitPMT(value, content) {
    this.onConfirm(value);
    this.openConfirmation(content, 'md');
  }


  onSubmitLC(value, content) {
    this.onConfirm(value);
    this.openConfirmation(content, 'md');
  }


  onSubmitCOM(value, content) {
    this.onConfirm(value);
    this.openConfirmation(content, 'md');
  }


  onSubmitSHPINV(value, content) {
    this.onConfirm(value);
    this.openConfirmation(content, 'md');
  }


  onSubmitNXTAXN(value, content) {
    this.onConfirm(value);
    this.openConfirmation(content, 'md');
  }

  AddorUpdateINVData(value) {
    if (this.isAddOrUpdate === "SAVE") {
      this.addINVEWBToServer(value);
    }
    else {
      this.onConfirm(value);
      this.submitINVEWBFormToServer(this.invewbFormGroup.value);
    }
  }

  AddorUpdatePMTData() {
    let value = this.pmtFormGroup.value;
    if (this.isAddOrUpdate === "SAVE") {
      this.addPMTToServer(value);
    }
    else {
      this.onConfirm(value);
      this.submitPMTFormToServer(value);
    }
  }

  confirmAndUpdate() {
    if (this.piLoadForm === true) {
      this.submitPIFormToServer(this.piFormGroup.value);
    }
    if (this.iipoLoadForm === true) {
      this.submitIIPOFormToServer(this.iipoFormGroup.value);
    }
    if (this.iiocLoadForm === true) {
      this.submitIIOCFormToServer(this.iiocFormGroup.value);
    }
    if (this.ocLoadForm === true) {
      this.submitOCFormToServer(this.ocFormGroup.value);
    }
    if (this.iiexfLoadForm === true) {
      this.submitIIEXFFormToServer(this.iiexfFormGroup.value);
    }
    if (this.exfLoadForm === true) {
      this.submitEXFFormToServer(this.exfFormGroup.value);
    }
    if (this.bgLoadForm === true) {
      this.submitBGFormToServer(this.bgFormGroup.value);
    }
    if (this.invewbLoadForm === true) {
      this.submitINVEWBFormToServer(this.invewbFormGroup.value);
    }
    if (this.pmtLoadForm === true) {
      this.submitPMTFormToServer(this.pmtFormGroup.value);
    }
    if (this.lcLoadForm === true) {
      this.submitLCFormToServer(this.lcFormGroup.value);
    }
    if (this.shpinvLoadForm === true) {
      this.submitSHPINVFormToServer(this.shpinvFormGroup.value);
    }
    if (this.comLoadForm === true) {
      this.submitCOMFormToServer(this.comFormGroup.value);
    }
    if (this.nactionLoadForm === true) {
      this.submitNXTAXNFormToServer(this.nactionFormGroup.value);
    }
  }


  onConfirm(value) {
    this.isLoadModal = false;
    //#PI
    if (this.piLoadForm === true) {
      this.dynamicFormValue = [];
      if (this.pinonew !== this.pinoold) {
        this.piNoChngd = true;
        this.isLoadModal = true;
        if (this.pinonew !== null) {
          this.pinonew = this.pinonew.trim();
        }
        this.dynamicFormValue.push({ name: 'PI No', value: this.pinonew });
      }
      if (this.pidatenew !== this.pidateold) {
        this.piDateChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'PI Date', value: this.pidatenew });
      }
      if (this.isLoadModal === false) {
        this.updateAlertNothing();
      }
    }

    //#IIPO
    if (this.iipoLoadForm === true) {
      this.dynamicFormValue = [];
      if (this.iipononew !== this.iiponoold) {
        this.iipoNoChngd = true;
        this.isLoadModal = true;
        if (this.iipononew != null) {
          this.iipononew = this.iipononew.trim();
        }
        this.dynamicFormValue.push({ name: 'IIPO No', value: this.iipononew });
      }
      if (this.iipodatenew !== this.iipodateold) {
        this.iipoDateChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'IIPO Date', value: this.iipodatenew });
      }
      if (this.isLoadModal === false) {
        this.updateAlertNothing();
      }
    }

    //#IIOC
    if (this.iiocLoadForm === true) {
      this.dynamicFormValue = [];

      if (this.jobnonew !== this.jobnoold) {
        this.jobNoChngd = true;
        this.isLoadModal = true;
        if (this.jobnonew !== null) {
          this.jobnonew = this.jobnonew.trim();
        }
        this.dynamicFormValue.push({ name: 'II JOB No.', value: this.jobnonew });
      }
      if (this.prdorddatenew !== this.prdorddateeold) {
        this.iipoDateChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'II PRD Order Date', value: this.prdorddatenew });
      }
      if (this.iiocnonew !== this.iiocnoold) {
        this.iiocNoChngd = true;
        this.isLoadModal = true;
        if (this.iiocnonew !== null) {
          this.iiocnonew = this.iiocnonew.trim();
        }
        this.dynamicFormValue.push({ name: 'IIOC No.', value: this.iiocnonew });
      }
      if (this.iiocdatenew !== this.iiocdateeold) {
        this.iiocDateChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'IIOC Date', value: this.iiocdatenew });
      }
      if (this.isLoadModal === false) {
        this.updateAlertNothing();
      }
    }

    //#VD-OC
    if (this.ocLoadForm === true) {
      this.dynamicFormValue = [];

      if (this.ijprojectnumnew !== this.ijprojectnumold) {
        this.ijPrjNoChngd = true;
        this.isLoadModal = true;
        if (this.ijprojectnumnew != null) {
          this.ijprojectnumnew = this.ijprojectnumnew.trim();
        }
        this.dynamicFormValue.push({ name: 'VND/IJ PRJ No.', value: this.ijprojectnumnew });
      }
      if (this.ocdatenew !== this.ocdateold) {
        this.ocDateChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'VND/IJ OC Date', value: this.ocdatenew });
      }
      if (this.isLoadModal === false) {
        this.updateAlertNothing();
      }
    }

    //#IIEXF
    if (this.iiexfLoadForm === true) {
      this.dynamicFormValue = [];
      if (this.delstsnew !== this.delstsold) {
        this.delStsChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'DEL Status', value: this.delstsnew });
      }

      if (this.exf1new !== this.exf1old ||
        this.exf1stsnew !== this.exf1stsold ||
        this.exfijannt1new !== this.exfijannt1old) {
        this.dynamicFormValue.push({ name: 'EXF1', value: this.nullHexCode });
      }
      if (this.exf1new !== this.exf1old) {
        this.exf1Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'EXF Date', value: this.exf1new });
      }
      if (this.exf1stsnew !== this.exf1stsold) {
        this.exf1stsChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'EXF Status', value: this.exf1stsnew });
      }
      if (this.exfijannt1new !== this.exfijannt1old) {
        this.exfijannc1Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'EXF Announce Date by VND/OPR', value: this.exfijannt1new });
      }

      if (this.exf2new !== this.exf2old ||
        this.exf2stsnew !== this.exf2stsold ||
        this.exfijannt2new !== this.exfijannt2old) {
        this.dynamicFormValue.push({ name: 'EXF2', value: this.nullHexCode });
      }
      if (this.exf2new !== this.exf2old) {
        this.exf2Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'EXF Date', value: this.exf2new });
      }
      if (this.exf2stsnew !== this.exf2stsold) {
        this.exf2stsChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'EXF Status', value: this.exf2stsnew });
      }
      if (this.exfijannt2new !== this.exfijannt2old) {
        this.exfijannc2Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'EXF Announce Date by VND/OPR', value: this.exfijannt2new });
      }

      if (this.exf3new !== this.exf3old ||
        this.exf3stsnew !== this.exf3stsold ||
        this.exfijannt3new !== this.exfijannt3old) {
        this.dynamicFormValue.push({ name: 'EXF3', value: this.nullHexCode });
      }
      if (this.exf3new !== this.exf3old) {
        this.exf3Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'EXF Date', value: this.exf3new });
      }
      if (this.exf3stsnew !== this.exf3stsold) {
        this.exf3stsChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'EXF Status', value: this.exf3stsnew });
      }
      if (this.exfijannt3new !== this.exfijannt3old) {
        this.exfijannc3Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'EXF Announce Date by VND/OPR', value: this.exfijannt3new });
      }
      if (this.isLoadModal === false) {
        this.updateAlertNothing();
      }
    }

    //#EXF
    if (this.exfLoadForm === true) {
      this.dynamicFormValue = [];

      if (this.delstsnew !== this.delstsold) {
        this.delStsChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'DEL Status', value: this.delstsnew });
      }

      if (this.exf1new !== this.exf1old ||
        this.exf1stsnew !== this.exf1stsold ||
        this.exfijannt1new !== this.exfijannt1old) {
        this.dynamicFormValue.push({ name: 'EXF1', value: this.nullHexCode });
      }
      if (this.exf1new !== this.exf1old) {
        this.exf1Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'EXF Date', value: this.exf1new });
      }
      if (this.exf1stsnew !== this.exf1stsold) {
        this.exf1stsChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'EXF Status', value: this.exf1stsnew });
      }
      if (this.exfijannt1new !== this.exfijannt1old) {
        this.exfijannc1Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'EXF Announce Date by VND/OPR', value: this.exfijannt1new });
      }

      if (this.exf2new !== this.exf2old ||
        this.exf2stsnew !== this.exf2stsold ||
        this.exfijannt2new !== this.exfijannt2old) {
        this.dynamicFormValue.push({ name: 'EXF2', value: this.nullHexCode });
      }
      if (this.exf2new !== this.exf2old) {
        this.exf2Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'EXF Date', value: this.exf2new });
      }
      if (this.exf2stsnew !== this.exf2stsold) {
        this.exf2stsChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'EXF Status', value: this.exf2stsnew });
      }
      if (this.exfijannt2new !== this.exfijannt2old) {
        this.exfijannc2Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'EXF Announce Date by VND/OPR', value: this.exfijannt2new });
      }

      if (this.exf3new !== this.exf3old ||
        this.exf3stsnew !== this.exf3stsold ||
        this.exfijannt3new !== this.exfijannt3old) {
        this.dynamicFormValue.push({ name: 'EXF3', value: this.nullHexCode });
      }
      if (this.exf3new !== this.exf3old) {
        this.exf3Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'EXF Date', value: this.exf3new });
      }
      if (this.exf3stsnew !== this.exf3stsold) {
        this.exf3stsChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'EXF Status', value: this.exf3stsnew });
      }
      if (this.exfijannt3new !== this.exfijannt3old) {
        this.exfijannc3Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'EXF Announce Date by VND/OPR', value: this.exfijannt3new });
      }
      if (this.isLoadModal === false) {
        this.updateAlertNothing();
      }
    }

    //#BG
    if (this.bgLoadForm === true) {
      this.dynamicFormValue = [];

      if (this.abg_request_anct_datenew !== this.abg_request_anct_dateold ||
        this.abg_issuance_datenew !== this.abg_issuance_dateold ||
        this.abg_final_submission_draft_datenew !== this.abg_final_submission_draft_dateold ||
        this.abg_final_submission_bg_datenew !== this.abg_final_submission_bg_dateold) {
        this.dynamicFormValue.push({ name: 'ABG', value: this.nullHexCode });
      }
      if (this.abg_request_anct_datenew !== this.abg_request_anct_dateold) {
        this.abg_request_anct_dateChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Request date to ACNT', value: this.abg_request_anct_datenew });
      }
      if (this.abg_issuance_datenew !== this.abg_issuance_dateold) {
        this.abg_issuance_dateChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Draft Issuance Date', value: this.abg_issuance_datenew });
      }
      if (this.abg_final_submission_draft_datenew !== this.abg_final_submission_draft_dateold) {
        this.abg_final_submission_draft_dateChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Final Submission Date of Draft', value: this.abg_final_submission_draft_datenew });
      }
      if (this.abg_final_submission_bg_datenew !== this.abg_final_submission_bg_dateold) {
        this.abg_final_submission_bg_dateChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Final Submission Date of BG', value: this.abg_final_submission_bg_datenew });
      }

      if (this.pbg_request_anct_datenew !== this.pbg_request_anct_dateold ||
        this.pbg_issuance_datenew !== this.pbg_issuance_dateold ||
        this.pbg_final_submission_draft_datenew !== this.pbg_final_submission_draft_dateold ||
        this.pbg_final_submission_bg_datenew !== this.pbg_final_submission_bg_dateold) {
        this.dynamicFormValue.push({ name: 'PBG', value: this.nullHexCode });
      }
      if (this.pbg_request_anct_datenew !== this.pbg_request_anct_dateold) {
        this.pbg_request_anct_dateChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Request date to ACNT', value: this.pbg_request_anct_datenew });
      }
      if (this.pbg_issuance_datenew !== this.pbg_issuance_dateold) {
        this.pbg_issuance_dateChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Draft Issuance Date', value: this.pbg_issuance_datenew });
      }
      if (this.pbg_final_submission_draft_datenew !== this.pbg_final_submission_draft_dateold) {
        this.pbg_final_submission_draft_dateChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Final Submission Date of Draft', value: this.pbg_final_submission_draft_datenew });
      }
      if (this.pbg_final_submission_bg_datenew !== this.pbg_final_submission_bg_dateold) {
        this.pbg_final_submission_bg_dateChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Final Submission Date of BG', value: this.pbg_final_submission_bg_datenew });
      }
      if (this.isLoadModal === false) {
        this.updateAlertNothing();
      }
    }

    //#INVEWB
    if (this.invewbLoadForm === true) {
      this.dynamicFormValue = [];

      if (this.validateDate(value.inv_request_anct_date) === true) {
        value.inv_request_anct_date = value.inv_request_anct_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.inv_request_anct_date)) !== -1) {
          value.inv_request_anct_date = null;
        } else {
          value.inv_request_anct_date = this.parserFormatter.format(value.inv_request_anct_date);
        }
      }
      if (this.validateDate(value.inv_issuance_date) === true) {
        value.inv_issuance_date = value.inv_issuance_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.inv_issuance_date)) !== -1) {
          value.inv_issuance_date = null;
        } else {
          value.inv_issuance_date = this.parserFormatter.format(value.inv_issuance_date);
        }
      }
      if (this.validateDate(value.ewb_issuance_date) === true) {
        value.ewb_issuance_date = value.ewb_issuance_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.ewb_issuance_date)) !== -1) {
          value.ewb_issuance_date = null;
        } else {
          value.ewb_issuance_date = this.parserFormatter.format(value.ewb_issuance_date);
        }
      }
      if (this.validateDate(value.dispatch_date) === true) {
        value.dispatch_date = value.dispatch_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.dispatch_date)) !== -1) {
          value.dispatch_date = null;
        } else {
          value.dispatch_date = this.parserFormatter.format(value.dispatch_date);
        }
      }

      if (value.transportation_method === "") {
        value.transportation_method = null;
      } else {
        value.transportation_method = value.transportation_method;
      }
    }

    //#PMT
    if (this.pmtLoadForm === true) {
      this.dynamicFormValue = [];

      if (this.validateDate(value.payment_date) === true) {
        value.payment_date = value.payment_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.payment_date)) !== -1) {
          value.payment_date = null;
        } else {
          value.payment_date = this.parserFormatter.format(value.payment_date);
        }
      }

      if (value.pmt_sts === "") {
        value.pmt_sts = null;
      } else {
        value.pmt_sts = value.pmt_sts;
      }
    }

    //#LC
    if (this.lcLoadForm === true) {
      this.dynamicFormValue = [];

      if (this.lcdrftchknew !== this.lcdrftchkold) {
        this.lcdrftchkChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Draft Check Date', value: this.lcdrftchknew });
      }
      if (this.lcopennew !== this.lcopenold) {
        this.lcOpenChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Open Date', value: this.lcopennew });
      }
      if (this.lclastrevnew !== this.lclastrevold) {
        this.lclastrevChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Last Revision Date', value: this.lclastrevnew });
      }
      if (this.lclatshpnew !== this.lclatshpold) {
        this.lcLatestshpChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Latest Shipment Date', value: this.lclatshpnew });
      }
      if (this.lcexpirynew !== this.lcexpiryold) {
        this.lcExpiryChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Expiry Date', value: this.lcexpirynew });
      }
      if (this.isLoadModal === false) {
        this.updateAlertNothing();
      }
    }

    //#COM
    if (this.comLoadForm === true) {
      this.dynamicFormValue = [];

      if (this.commonthnew !== this.commonthold) {
        this.isLoadModal = true;
        this.commonthChngd = true;
        this.dynamicFormValue.push({ name: 'COM Month', value: this.commonthnew });
      }

      if (this.isLoadModal === false) {
        this.updateAlertNothing();
      }
    }

    //#SHP/INV -> VD-SHP
    if (this.shpinvLoadForm === true) {
      this.dynamicFormValue = [];

      if (this.delstsnew !== this.delstsold) {
        this.delStsChngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'DEL Status', value: this.delstsnew });
      }
      if (this.invno1new !== this.invno1old || this.invdate1new !== this.invdate1old
        || this.mode1new !== this.mode1old || this.from1new != this.from1old
        || this.etd1new != this.etd1old || this.eta1new != this.eta1old
        || this.vess1new != this.vess1old || this.awbbl1new != this.awbbl1old) {
        this.dynamicFormValue.push({ name: 'Shipment 1', value: this.nullHexCode });
      }
      if (this.invno1new !== this.invno1old) {
        this.invNo1Chngd = true;
        this.isLoadModal = true;
        if (this.invno1new !== null) {
          this.invno1new = this.invno1new.trim();
        }
        this.dynamicFormValue.push({ name: 'VD Invoice No.', value: this.invno1new });
      }
      if (this.invdate1new !== this.invdate1old) {
        this.invDate1Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'VD Invoice Date', value: this.invdate1new });
      }
      if (this.mode1new !== this.mode1old) {
        this.mode1Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Mode', value: this.mode1new });
      }
      if (this.from1new !== this.from1old) {
        this.from1Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Port Of Origin', value: this.from1new });
      }
      if (this.etd1new !== this.etd1old) {
        this.etd1Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'ETD', value: this.etd1new });
      }
      if (this.eta1new !== this.eta1old) {
        this.eta1Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'ETA', value: this.eta1new });
      }
      if (this.vess1new !== this.vess1old) {
        this.vessel1Chngd = true;
        this.isLoadModal = true;
        if (this.vess1new !== null) {
          this.vess1new = this.vess1new.trim();
        }
        this.dynamicFormValue.push({ name: 'Vessel/Flight No.', value: this.vess1new });
      }
      if (this.awbbl1new !== this.awbbl1old) {
        this.awbbill1Chngd = true;
        this.isLoadModal = true;
        if (this.awbbl1new !== null) {
          this.awbbl1new = this.awbbl1new.trim();
        }
        this.dynamicFormValue.push({ name: 'BL No./AWB No.', value: this.awbbl1new });
      }

      if (this.invno2new !== this.invno2old || this.invdate2new !== this.invdate2old
        || this.mode2new !== this.mode2old || this.from2new != this.from2old
        || this.etd2new != this.etd2old || this.eta2new != this.eta2old
        || this.vess2new != this.vess2old || this.awbbl2new != this.awbbl2old) {
        this.dynamicFormValue.push({ name: 'Shipment 2', value: this.nullHexCode });
      }
      if (this.invno2new !== this.invno2old) {
        this.invNo2Chngd = true;
        this.isLoadModal = true;
        if (this.invno2new !== null) {
          this.invno2new = this.invno2new.trim();
        }
        this.dynamicFormValue.push({ name: 'VD Invoice No.', value: this.invno2new });
      }
      if (this.invdate2new !== this.invdate2old) {
        this.invDate2Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'VD Invoice Date', value: this.invdate2new });
      }
      if (this.mode2new !== this.mode2old) {
        this.mode2Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Mode', value: this.mode2new });
      }
      if (this.from2new !== this.from2old) {
        this.from2Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Port Of Origin', value: this.from2new });
      }
      if (this.etd2new !== this.etd2old) {
        this.etd2Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'ETD', value: this.etd2new });
      }
      if (this.eta2new !== this.eta2old) {
        this.eta2Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'ETA', value: this.eta2new });
      }
      if (this.vess2new !== this.vess2old) {
        this.vessel2Chngd = true;
        this.isLoadModal = true;
        if (this.vess2new !== null) {
          this.vess2new = this.vess2new.trim();
        }
        this.dynamicFormValue.push({ name: 'Vessel/Flight No.', value: this.vess2new });
      }
      if (this.awbbl2new !== this.awbbl2old) {
        this.awbbill2Chngd = true;
        this.isLoadModal = true;
        if (this.awbbl2new !== null) {
          this.awbbl2new = this.awbbl2new.trim();
        }
        this.dynamicFormValue.push({ name: 'BL No./AWB No.', value: this.awbbl2new });
      }

      if (this.invno3new !== this.invno3old || this.invdate3new !== this.invdate3old
        || this.mode3new !== this.mode3old || this.from3new != this.from3old
        || this.etd3new != this.etd3old || this.eta3new != this.eta3old
        || this.vess3new != this.vess3old || this.awbbl3new != this.awbbl3old) {
        this.dynamicFormValue.push({ name: 'Shipment 3', value: this.nullHexCode });
      }
      if (this.invno3new !== this.invno3old) {
        this.invNo3Chngd = true;
        this.isLoadModal = true;
        if (this.invno3new !== null) {
          this.invno3new = this.invno3new.trim();
        }
        this.dynamicFormValue.push({ name: 'VD Invoice No.', value: this.invno3new });
      }
      if (this.invdate3new !== this.invdate3old) {
        this.invDate3Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'VD Invoice Date', value: this.invdate3new });
      }
      if (this.mode3new !== this.mode3old) {
        this.mode3Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Mode', value: this.mode3new });
      }
      if (this.from3new !== this.from3old) {
        this.from3Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'Port Of Origin', value: this.from3new });
      }
      if (this.etd3new !== this.etd3old) {
        this.etd3Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'ETD', value: this.etd3new });
      }
      if (this.eta3new !== this.eta3old) {
        this.eta3Chngd = true;
        this.isLoadModal = true;
        this.dynamicFormValue.push({ name: 'ETA', value: this.eta3new });
      }
      if (this.vess3new !== this.vess3old) {
        this.vessel3Chngd = true;
        this.isLoadModal = true;
        if (this.vess3new !== null) {
          this.vess3new = this.vess3new.trim();
        }
        this.dynamicFormValue.push({ name: 'Vessel/Flight No.', value: this.vess3new });
      }
      if (this.awbbl3new !== this.awbbl3old) {
        this.awbbill3Chngd = true;
        this.isLoadModal = true;
        if (this.awbbl3new !== null) {
          this.awbbl3new = this.awbbl3new.trim();
        }
        this.dynamicFormValue.push({ name: 'BL No./AWB No.', value: this.awbbl3new });
      }


      if (this.isLoadModal === false) {
        this.updateAlertNothing();
      }
    }

    //#NXT AXN
    if (this.nactionLoadForm === true) {
      this.dynamicFormValue = [];

      if (this.chkonnew !== this.chkonold) {
        this.isLoadModal = true;
        this.checkedOnChngd = true;
        this.dynamicFormValue.push({ name: 'Checked Date', value: this.chkonnew });
      }
      if (this.nxtchknew !== this.nxtchkold) {
        this.isLoadModal = true;
        this.nextCheckChngd = true;
        this.dynamicFormValue.push({ name: 'Next Check', value: this.nxtchknew });
      }
      if (this.fornew !== this.forold) {
        this.isLoadModal = true;
        this.forinfoChngd = true;
        if (this.fornew !== null) {
          this.fornew = this.fornew.trim();
        }
        this.dynamicFormValue.push({ name: 'FOR', value: this.fornew });
      }
      if (this.isLoadModal === false) {
        this.updateAlertNothing();
      }
    }
  }

  validateDate(datevalue) {
    if (!isNaN(Date.parse(datevalue))) {
      return true;
    }
  }

  updateAlertNothing() {
    this.alertWarning = 'Nothing to update';
    this.warningMessage = true;
    setTimeout(() => this.warningMessage = false, 5000);
  }

  // empty defined but once called in html file==========================================================
  resetForm() {
    this.isLoadModal = false;
    this.isModified = false;
    this.getIndDetailFromServer(this.userSelIndNo);
  }

  cancelForm() {
    this.isLoadModal = false;
  }
  //end here

  async submitPIFormToServer(formValue: indentFormUpdate) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    let pi_no = formValue.pi_no;
    if (pi_no != null) {
      pi_no = pi_no.trim();
    }
    const param = new HttpParams()
      .set('pi_no', pi_no)
      .set('pi_date', formValue.pi_date)
      .set('indent_sheet_num', this.userSelIndNo);

    const options = { headers };
    return await this.httpcon.post<any>(GlobalConstants.apiUpdatePiData, param, options)
      .pipe(map(Response => {
        this.formUpdateStatus = [];
        this.formUpdateStatus = Response;

        if (this.formUpdateStatus['affectedRows'] === 1) {
          this.openDialogAsperResponce('PI Data Updated Successfully', 'success');
          this.getIndDetailFromServer(this.userSelIndNo);
          this.btnSelectPI();
        } else {
          this.alertWarning = 'PI Data Not Update';
          this.openDialogAsperResponce('PI Data Not Updated. Please Try Again', 'error');
        }
      }, () => {

      }))
      .subscribe();
  }

  async submitIIPOFormToServer(formValue: indentFormUpdate) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    let iipo_no = formValue.iipo_no;
    if (iipo_no !== null) {
      iipo_no = iipo_no.trim();
    }
    const param = new HttpParams()
      .set('iipo_no', iipo_no)
      .set('iipo_date', formValue.iipo_date)
      .set('indent_sheet_num', this.userSelIndNo);

    const options = { headers };
    return await this.httpcon.post<any>(GlobalConstants.apiUpdateIIPOData, param, options)
      .pipe(map(Response => {
        this.formUpdateStatus = [];
        this.formUpdateStatus = Response;


        if (this.formUpdateStatus['affectedRows'] === 1) {
          this.openDialogAsperResponce('II-PO Data Updated Successfully', 'success');
          this.getIndDetailFromServer(this.userSelIndNo);
          this.btnSelectIIPO();
        } else {
          this.openDialogAsperResponce('II-PO Data Not Updated. Please Try Again', 'error');
        }
      }))
      .subscribe(() => { }, () => {

      });

  }

  async submitIIOCFormToServer(formValue: IndentUpdateNewTabs) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    let job_no = formValue.job_no;
    let oc_no = formValue.oc_no;
    if (job_no !== null) {
      job_no = job_no.trim();
    }
    if (oc_no !== null) {
      oc_no = oc_no.trim();
    }
    const param = new HttpParams()
      .set('job_no', job_no)
      .set('prd_ord_date', formValue.prd_ord_date)
      .set('oc_no', oc_no)
      .set('oc_date', formValue.oc_date)
      .set('indent_sheet_num', this.userSelIndNo);

    const options = { headers };
    return await this.httpcon.post<any>(GlobalConstants.apiUpdateIIOCData, param, options)
      .pipe(map(Response => {
        this.formUpdateStatus = [];
        this.formUpdateStatus = Response;


        if (this.formUpdateStatus['affectedRows'] === 1) {
          this.openDialogAsperResponce('II-OC Data Updated Successfully', 'success');
          this.getIndDetailFromServer(this.userSelIndNo);
          this.btnSelectIIOC();

        } else {
          this.openDialogAsperResponce('II-OC Data Not Updated. Please Try Again', 'error');
        }
      }))
      .subscribe(() => { }, () => {
      });

  }

  async submitOCFormToServer(formValue: indentFormUpdate) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    let ij_project_num = formValue.ij_project_num;
    if (ij_project_num !== null) {
      ij_project_num = ij_project_num.trim();
    }
    const param = new HttpParams()
      .set('ij_project_num', ij_project_num)
      .set('oc_date', formValue.oc_date)
      .set('indent_sheet_num', this.userSelIndNo);

    const options = { headers };
    return await this.httpcon.post<any>(GlobalConstants.apiUpdateOCData, param, options)
      .pipe(map(Response => {
        this.formUpdateStatus = [];
        this.formUpdateStatus = Response;


        if (this.formUpdateStatus['affectedRows'] === 1) {
          this.openDialogAsperResponce('VD-OC Data Updated Successfully', 'success');
          this.getIndDetailFromServer(this.userSelIndNo);
          this.btnSelectOC();
        } else {
          this.openDialogAsperResponce('VD-OC Data Not Updated. Please Try Again', 'error');
        }
      }))
      .subscribe(() => { }, () => {
      });

  }

  async submitLCFormToServer(formValue: indentFormUpdate) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const param = new HttpParams()
      .set('lc_chk_date_by_ij', formValue.lc_chk_date_by_ij)
      .set('lc_open_date', formValue.lc_open_date)
      .set('lc_last_revision_date', formValue.lc_last_revision_date)
      .set('latest_shipment_date', formValue.latest_shipment_date)
      .set('lc_expiry_date', formValue.lc_expiry_date)
      .set('indent_sheet_num', this.userSelIndNo);

    const options = { headers };
    return await this.httpcon.post<any>(GlobalConstants.apiUpdateLCData, param, options)
      .pipe(map(Response => {
        this.formUpdateStatus = [];
        this.formUpdateStatus = Response;


        if (this.formUpdateStatus['affectedRows'] === 1) {
          this.openDialogAsperResponce('LC Data Updated Successfully', 'success');
          this.getIndDetailFromServer(this.userSelIndNo);
          this.btnSelectLC();
        } else {
          this.openDialogAsperResponce('LC Data Not Updated. Please Try Again', 'error');
        }
      }))
      .subscribe(() => { }, () => {

      });

  }

  async submitSHPINVFormToServer(formValue: indentFormUpdate) {
    let newDelStatus = formValue.del_sts;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    let invoice_no1 = formValue.invoice_no1;
    let vessel1 = formValue.vessel1;
    let awb_bl_no1 = formValue.awb_bl_no1;
    let invoice_no2 = formValue.invoice_no2;
    let vessel2 = formValue.vessel2;
    let awb_bl_no2 = formValue.awb_bl_no2;
    let invoice_no3 = formValue.invoice_no3;
    let vessel3 = formValue.vessel3;
    let awb_bl_no3 = formValue.awb_bl_no3;

    if (invoice_no1 !== null) {
      invoice_no1 = invoice_no1.trim();
    }
    if (vessel1 !== null) {
      vessel1 = vessel1.trim();
    }
    if (awb_bl_no1 !== null) {
      awb_bl_no1 = awb_bl_no1.trim();
    }
    if (invoice_no2 !== null) {
      invoice_no2 = invoice_no2.trim();
    }
    if (vessel2 !== null) {
      vessel2 = vessel2.trim();
    }
    if (awb_bl_no2 !== null) {
      awb_bl_no2 = awb_bl_no2.trim();
    }
    if (invoice_no3 !== null) {
      invoice_no3 = invoice_no3.trim();
    }
    if (vessel3 !== null) {
      vessel3 = vessel3.trim();
    }
    if (awb_bl_no3 !== null) {
      awb_bl_no3 = awb_bl_no3.trim();
    }

    const param = new HttpParams()
      .set('invoice_no1', invoice_no1)
      .set('invoice_date1', formValue.invoice_date1)
      .set('mode1', formValue.mode1)
      .set('from1', formValue.from1)
      .set('vessel1', vessel1)
      .set('awb_bl_no1', awb_bl_no1)
      .set('etd1', formValue.etd1)
      .set('eta1', formValue.eta1)
      .set('invoice_no2', invoice_no2)
      .set('invoice_date2', formValue.invoice_date2)
      .set('mode2', formValue.mode2)
      .set('from2', formValue.from2)
      .set('vessel2', vessel2)
      .set('awb_bl_no2', awb_bl_no2)
      .set('etd2', formValue.etd2)
      .set('eta2', formValue.eta2)
      .set('invoice_no3', invoice_no3)
      .set('invoice_date3', formValue.invoice_date3)
      .set('mode3', formValue.mode3)
      .set('from3', formValue.from3)
      .set('vessel3', vessel3)
      .set('awb_bl_no3', awb_bl_no3)
      .set('etd3', formValue.etd3)
      .set('eta3', formValue.eta3)
      .set('del_sts', formValue.del_sts)
      .set('indent_sheet_num', this.userSelIndNo);

    const options = { headers };
    return await this.httpcon.post<any>(GlobalConstants.apiUpdateSHPorINVData, param, options)
      .pipe(map(Response => {
        this.formUpdateStatus = [];
        this.formUpdateStatus = Response;
        let affectedRows = this.formUpdateStatus["affectedRows"];
        this.changePmtToCancelIfRequired(this.userSelIndNo, newDelStatus, affectedRows, 'VD-SHP');
        this.btnSelectSHPINV();
      }))
      .subscribe(() => { }, () => {

      });
  }

  async submitEXFFormToServer(formValue: indentFormUpdate) {
    let newDelStatus = formValue.del_sts;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const param = new HttpParams()
      .set('exf1', formValue.exf1)
      .set('exf1_sts', formValue.exf1_sts)
      .set('exf_ij_accment1', formValue.exf_ij_accment1)
      .set('exf2', formValue.exf2)
      .set('exf2_sts', formValue.exf2_sts)
      .set('exf_ij_accment2', formValue.exf_ij_accment2)
      .set('exf3', formValue.exf3)
      .set('exf3_sts', formValue.exf3_sts)
      .set('exf_ij_accment3', formValue.exf_ij_accment3)
      .set('del_sts', formValue.del_sts)
      .set('indent_sheet_num', this.userSelIndNo);

    //checking if exf status is being updated with empty exf date field
    if ((!formValue.exf1 && formValue.exf1_sts) || (formValue.exf1 && !formValue.exf1_sts)) {

      Swal.fire({
        icon: 'error',
        title: 'EXF Date Or Status should not be empty!',
        confirmButtonColor: '#282E89',
        allowOutsideClick: false,
      })

      this.ngxService.stop();

    } else if ((!formValue.exf2 && formValue.exf2_sts) || (formValue.exf2 && !formValue.exf2_sts)) {

      Swal.fire({
        icon: 'error',
        title: 'EXF Date Or Status should not be empty!',
        confirmButtonColor: '#282E89',
        allowOutsideClick: false,
      })

      this.ngxService.stop();

    } else if ((!formValue.exf3 && formValue.exf3_sts) || (formValue.exf3 && !formValue.exf3_sts)) {

      Swal.fire({
        icon: 'error',
        title: 'EXF Date Or Status should not be empty!',
        confirmButtonColor: '#282E89',
        allowOutsideClick: false,
      })

      this.ngxService.stop();

    } else {

      const options = { headers };
      return await this.httpcon.post<any>(GlobalConstants.apiUpdateEXFData, param, options)
        .pipe(map(Response => {
          this.formUpdateStatus = [];
          this.formUpdateStatus = Response;
          let affectedRows = this.formUpdateStatus["affectedRows"];
          this.changePmtToCancelIfRequired(this.userSelIndNo, newDelStatus, affectedRows, 'VD-EXF');
          this.btnSelectEXF();
        }))
        .subscribe(() => { }, () => {

        });
    }
  }

  async submitIIEXFFormToServer(formValue: IndentUpdateNewTabs) {

    // added ngx service start
    this.ngxService.start();

    let newDelStatus = formValue.del_sts;

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const param = new HttpParams()
      .set('exf1_date', formValue.exf1_date)
      .set('exf1_sts', formValue.exf1_sts)
      .set('exf1_annc_date', formValue.exf1_annc_date)
      .set('exf2_date', formValue.exf2_date)
      .set('exf2_sts', formValue.exf2_sts)
      .set('exf2_annc_date', formValue.exf2_annc_date)
      .set('exf3_date', formValue.exf3_date)
      .set('exf3_sts', formValue.exf3_sts)
      .set('exf3_annc_date', formValue.exf3_annc_date)
      .set('del_sts', formValue.del_sts)
      .set('indent_sheet_num', this.userSelIndNo);

    //checking if exf status is being updated with empty exf date field
    if ((!formValue.exf1_date && formValue.exf1_sts) || (formValue.exf1_date && !formValue.exf1_sts)) {

      Swal.fire({
        icon: 'error',
        title: 'EXF Date Or Status should not be empty!',
        confirmButtonColor: '#282E89',
        allowOutsideClick: false,
      })

      this.ngxService.stop();

    } else if ((!formValue.exf2_date && formValue.exf2_sts) || (formValue.exf2_date && !formValue.exf2_sts)) {

      Swal.fire({
        icon: 'error',
        title: 'EXF Date Or Status should not be empty!',
        confirmButtonColor: '#282E89',
        allowOutsideClick: false,
      })

      this.ngxService.stop();

    } else if ((!formValue.exf3_date && formValue.exf3_sts) || (formValue.exf3_date && !formValue.exf3_sts)) {

      Swal.fire({
        icon: 'error',
        title: 'EXF Date Or Status should not be empty!',
        confirmButtonColor: '#282E89',
        allowOutsideClick: false,
      })

      this.ngxService.stop();

    }
    else {

      const options = { headers };
      return await this.httpcon.post<any>(GlobalConstants.apiUpdateIIEXFData, param, options)
        .pipe(map(Response => {
          this.formUpdateStatus = [];
          this.formUpdateStatus = Response;
          let affectedRows = this.formUpdateStatus["affectedRows"];

          //getting response message from server and checking condition for toast
          let message = this.formUpdateStatus["message"];

          // made new function just for IIEXF
          this.changePmtToCancelIfRequiredForIIEXF(this.userSelIndNo, newDelStatus, affectedRows, 'IIEXF', message);
          this.btnSelectIIEXF();

          this.ngxService.stop();
          // added ngx service stop

        }))
        .subscribe(() => { }, () => {
        });
    }
  }

  async submitBGFormToServer(formValue: IndentUpdateNewTabs) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const param = new HttpParams()
      .set('abg_request_anct_date', formValue.abg_request_anct_date)
      .set('abg_issuance_date', formValue.abg_issuance_date)
      .set('abg_final_submission_draft_date', formValue.abg_final_submission_draft_date)
      .set('abg_final_submission_bg_date', formValue.abg_final_submission_bg_date)
      .set('pbg_request_anct_date', formValue.pbg_request_anct_date)
      .set('pbg_issuance_date', formValue.pbg_issuance_date)
      .set('pbg_final_submission_draft_date', formValue.pbg_final_submission_draft_date)
      .set('pbg_final_submission_bg_date', formValue.pbg_final_submission_bg_date)
      .set('indent_sheet_num', this.userSelIndNo);

    const options = { headers };
    return await this.httpcon.post<any>(GlobalConstants.apiUpdateBGData, param, options)
      .pipe(map(Response => {
        this.formUpdateStatus = [];
        this.formUpdateStatus = Response;


        if (this.formUpdateStatus['affectedRows'] === 1) {
          this.openDialogAsperResponce('BG Data Updated Successfully', 'success');
          this.getIndDetailFromServer(this.userSelIndNo);
          this.btnSelectBG();
        } else {
          this.openDialogAsperResponce('BG Data Not Updated. Please Try Again', 'error');
        }
      }))
      .subscribe(() => { }, () => {

      });
  }

  // async addINVEWBToServer(value) {
  //   if (this.validateDate(value.inv_request_anct_date) === true) {
  //     value.inv_request_anct_date = value.inv_request_anct_date;
  //   } else {
  //     if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.inv_request_anct_date)) !== -1) {
  //       value.inv_request_anct_date = null;
  //     } else {
  //       value.inv_request_anct_date = this.parserFormatter.format(value.inv_request_anct_date);
  //     }
  //   }
  //   if (this.validateDate(value.inv_issuance_date) === true) {
  //     value.inv_issuance_date = value.inv_issuance_date;
  //   } else {
  //     if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.inv_issuance_date)) !== -1) {
  //       value.inv_issuance_date = null;
  //     } else {
  //       value.inv_issuance_date = this.parserFormatter.format(value.inv_issuance_date);
  //     }
  //   }
  //   if (this.validateDate(value.ewb_issuance_date) === true) {
  //     value.ewb_issuance_date = value.ewb_issuance_date;
  //   } else {
  //     if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.ewb_issuance_date)) !== -1) {
  //       value.ewb_issuance_date = null;
  //     } else {
  //       value.ewb_issuance_date = this.parserFormatter.format(value.ewb_issuance_date);
  //     }
  //   }
  //   if (this.validateDate(value.dispatch_date) === true) {
  //     value.dispatch_date = value.dispatch_date;
  //   } else {
  //     if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.dispatch_date)) !== -1) {
  //       value.dispatch_date = null;
  //     } else {
  //       value.dispatch_date = this.parserFormatter.format(value.dispatch_date);
  //     }
  //   }

  //   if (value.transportation_method === "") {
  //     value.transportation_method = null;
  //   } else {
  //     value.transportation_method = value.transportation_method;
  //   }


  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   });
  //   let invoice_id = this.invoiceList.length + 1;

  //   let inv_no = value.inv_no;
  //   let ewb_no = value.ewb_no;
  //   let dispatch_from_indent = value.dispatch_from_indent;
  //   let dispatch_from_origin = value.dispatch_from_origin;
  //   let dispatch_to_indent = value.dispatch_to_indent;
  //   let dispatch_to_destination = value.dispatch_to_destination;
  //   let machine_sn = value.machine_sn;
  //   if (inv_no !== null) {
  //     inv_no = inv_no.trim();
  //   }
  //   if (ewb_no !== null) {
  //     ewb_no = ewb_no.trim();
  //   }
  //   if (dispatch_from_indent !== null) {
  //     dispatch_from_indent = dispatch_from_indent.trim();
  //   }
  //   if (dispatch_from_origin !== null) {
  //     dispatch_from_origin = dispatch_from_origin.trim();
  //   }
  //   if (dispatch_to_indent !== null) {
  //     dispatch_to_indent = dispatch_to_indent.trim();
  //   }
  //   if (dispatch_to_destination !== null) {
  //     dispatch_to_destination = dispatch_to_destination.trim();
  //   }
  //   const param = new HttpParams()
  //     .set('inv_request_anct_date', value.inv_request_anct_date)
  //     .set('inv_issuance_date', value.inv_issuance_date)
  //     .set('inv_no', inv_no)
  //     .set('ewb_no', ewb_no)
  //     .set('ewb_issuance_date', value.ewb_issuance_date)
  //     .set('transportation_method', value.transportation_method)
  //     .set('dispatch_date', value.dispatch_date)
  //     .set('dispatch_from_indent', dispatch_from_indent)
  //     .set('dispatch_from_origin', dispatch_from_origin)
  //     .set('dispatch_to_indent', dispatch_to_indent)
  //     .set('dispatch_to_destination', dispatch_to_destination)
  //     .set('invoice_id', invoice_id.toString())
  //     .set('indent_sheet_num', this.userSelIndNo)
  //     .set('machine_sn', machine_sn);

  //   const options = { headers };
  //   return await this.httpcon.post<any>(GlobalConstants.apiInsertINVData, param, options)
  //     .pipe(map(Response => {
  //       this.formUpdateStatus = [];
  //       this.formUpdateStatus = Response;


  //       if (this.formUpdateStatus['affectedRows'] === 1) {
  //         this.openDialogAsperResponce('INV/eWB Data Saved Successfully', 'success');
  //         this.getIndDetailFromServer(this.userSelIndNo);
  //         this.getInvoiceIndentData(this.userSelIndNo);
  //         this.btnSelectINVeWB();
  //       } else {
  //         let message = this.formUpdateStatus['message'];
  //         let title = "INV/eWB Data Not Added."
  //         this.openDialogForError(title, message, 'error');
  //       }
  //       this.resetInvoice();
  //     }))
  //     .subscribe(() => { }, () => {

  //     });
  // }


  //updated implementation including files
  async addINVEWBToServer(value) {

    this.ngxService.start();

    if (this.validateDate(value.inv_request_anct_date) === true) {
      value.inv_request_anct_date = value.inv_request_anct_date;
    } else {
      if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.inv_request_anct_date)) !== -1) {
        value.inv_request_anct_date = null;
      } else {
        value.inv_request_anct_date = this.parserFormatter.format(value.inv_request_anct_date);
      }
    }
    if (this.validateDate(value.inv_issuance_date) === true) {
      value.inv_issuance_date = value.inv_issuance_date;
    } else {
      if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.inv_issuance_date)) !== -1) {
        value.inv_issuance_date = null;
      } else {
        value.inv_issuance_date = this.parserFormatter.format(value.inv_issuance_date);
      }
    }
    if (this.validateDate(value.ewb_issuance_date) === true) {
      value.ewb_issuance_date = value.ewb_issuance_date;
    } else {
      if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.ewb_issuance_date)) !== -1) {
        value.ewb_issuance_date = null;
      } else {
        value.ewb_issuance_date = this.parserFormatter.format(value.ewb_issuance_date);
      }
    }
    if (this.validateDate(value.dispatch_date) === true) {
      value.dispatch_date = value.dispatch_date;
    } else {
      if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.dispatch_date)) !== -1) {
        value.dispatch_date = null;
      } else {
        value.dispatch_date = this.parserFormatter.format(value.dispatch_date);
      }
    }

    if (value.transportation_method === "") {
      value.transportation_method = null;
    } else {
      value.transportation_method = value.transportation_method;
    }


    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    let invoice_id;

    if (!this.invoiceID || this.invoiceID === undefined || this.invoiceID === null) {
      invoice_id = 1;
    } else {
      invoice_id = this.invoiceID + 1;
    }

    let inv_no = value.inv_no;
    let ewb_no = value.ewb_no;
    let dispatch_from_indent = value.dispatch_from_indent;
    let dispatch_from_origin = value.dispatch_from_origin;
    let dispatch_to_indent = value.dispatch_to_indent;
    let dispatch_to_destination = value.dispatch_to_destination;
    let machine_sn = value.machine_sn;
    if (inv_no !== null) {
      inv_no = inv_no.trim();
    }
    if (ewb_no !== null) {
      ewb_no = ewb_no.trim();
    }
    if (dispatch_from_indent !== null) {
      dispatch_from_indent = dispatch_from_indent.trim();
    }
    if (dispatch_from_origin !== null) {
      dispatch_from_origin = dispatch_from_origin.trim();
    }
    if (dispatch_to_indent !== null) {
      dispatch_to_indent = dispatch_to_indent.trim();
    }
    if (dispatch_to_destination !== null) {
      dispatch_to_destination = dispatch_to_destination.trim();
    }

    const formData = new FormData();

    formData.append('inv_request_anct_date', value.inv_request_anct_date || '')
    formData.append('inv_issuance_date', value.inv_issuance_date || '')
    formData.append('inv_no', inv_no || '')
    formData.append('ewb_no', ewb_no || '')
    formData.append('ewb_issuance_date', value.ewb_issuance_date || '')
    formData.append('transportation_method', value.transportation_method || '')
    formData.append('dispatch_date', value.dispatch_date || '')
    formData.append('dispatch_from_indent', dispatch_from_indent || '')
    formData.append('dispatch_from_origin', dispatch_from_origin || '')
    formData.append('dispatch_to_indent', dispatch_to_indent || '')
    formData.append('dispatch_to_destination', dispatch_to_destination || '')
    formData.append('invoice_id', invoice_id.toString() || '')
    formData.append('indent_sheet_num', this.userSelIndNo || '')
    formData.append('machine_sn', machine_sn || '');

    const emptyBlob = new Blob([], { type: '' });

    const invoiceFile = this.invAttachedFormFiles?.[0];
    const ewbFile = this.ewbAttachedFormFiles?.[0];

    formData.append('invoice_doc', invoiceFile || emptyBlob, invoiceFile?.name || '');
    formData.append('inv_doc_name', invoiceFile?.name || '');

    formData.append('ewb_doc', ewbFile || emptyBlob, ewbFile?.name || '');
    formData.append('ewb_doc_name', ewbFile?.name || '');

    const options = { headers };
    return await this.httpcon.post<any>(GlobalConstants.apiInsertINVData, formData)
      .pipe(map(Response => {
        this.formUpdateStatus = [];
        this.formUpdateStatus = Response;

        if (this.formUpdateStatus['affectedRows'] === 1) {

          if (this.formUpdateStatus['message'] === "INV/eWB Inserted successfully and Email is sent too.") {

            this.openDialogAsperResponce('INV/eWB Data Saved Successfully and Email is sent to Respective Employees.', 'success');

          } else if (this.formUpdateStatus['message'] === "INV/eWB Inserted successfully but failed to send Email.") {

            // this.openDialogAsperResponce('INV/eWB Data Saved Successfully but failed to send Email.', 'success');

            Swal.fire({
              icon: "success",
              title: "INV/eWB Data Saved Successfully but failed to send Email.",
              text: "Check Email Setting!",
              showConfirmButton: true,
              confirmButtonColor: '#282E89',
              allowOutsideClick: false,
            })

          } else {
            this.openDialogAsperResponce('INV/eWB Data Saved Successfully', 'success');
          }

          this.getIndDetailFromServer(this.userSelIndNo);
          this.getInvoiceIndentData(this.userSelIndNo);
          this.btnSelectINVeWB();
        } else {
          let message = this.formUpdateStatus['message'];
          let title = "INV/eWB Data Not Added."
          this.openDialogForError(title, message, 'error');
        }
        this.resetInvoice();
        this.closeInvEwbModal();

        this.ngxService.stop();
      }))
      .subscribe(() => { }, () => {

      });

  }

  // async submitINVEWBFormToServer(formValue: IndentUpdateINVEWB) {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   });

  //   let invoice_id = this.globalInvoiceNo;

  //   let inv_no = formValue.inv_no;
  //   let ewb_no = formValue.ewb_no;
  //   let dispatch_from_indent = formValue.dispatch_from_indent;
  //   let dispatch_from_origin = formValue.dispatch_from_origin;
  //   let dispatch_to_indent = formValue.dispatch_to_indent;
  //   let dispatch_to_destination = formValue.dispatch_to_destination;
  //   let machine_sn = formValue.machine_sn;
  //   if (inv_no !== null) {
  //     inv_no = inv_no.trim();
  //   }
  //   if (ewb_no !== null) {
  //     ewb_no = ewb_no.trim();
  //   }
  //   if (dispatch_from_indent !== null) {
  //     dispatch_from_indent = dispatch_from_indent.trim();
  //   }
  //   if (dispatch_from_origin !== null) {
  //     dispatch_from_origin = dispatch_from_origin.trim();
  //   }
  //   if (dispatch_to_indent !== null) {
  //     dispatch_to_indent = dispatch_to_indent.trim();
  //   }
  //   if (dispatch_to_destination !== null) {
  //     dispatch_to_destination = dispatch_to_destination.trim();
  //   }
  //   if (machine_sn !== null) {
  //     machine_sn = machine_sn.trim();
  //   }
  //   const param = new HttpParams()
  //     .set('inv_request_anct_date', formValue.inv_request_anct_date)
  //     .set('inv_issuance_date', formValue.inv_issuance_date)
  //     .set('inv_no', inv_no)
  //     .set('ewb_no', ewb_no)
  //     .set('ewb_issuance_date', formValue.ewb_issuance_date)
  //     .set('transportation_method', formValue.transportation_method)
  //     .set('dispatch_date', formValue.dispatch_date)
  //     .set('dispatch_from_indent', dispatch_from_indent)
  //     .set('dispatch_from_origin', dispatch_from_origin)
  //     .set('dispatch_to_indent', dispatch_to_indent)
  //     .set('dispatch_to_destination', dispatch_to_destination)
  //     .set('invoice_id', invoice_id.toString())
  //     .set('indent_sheet_num', this.userSelIndNo)
  //     .set('machine_sn', machine_sn);

  //   const options = { headers };
  //   return await this.httpcon.post<any>(GlobalConstants.apiUpdateINVData, param, options)
  //     .pipe(map(Response => {
  //       this.formUpdateStatus = [];
  //       this.formUpdateStatus = Response;


  //       if (this.formUpdateStatus['affectedRows'] === 1) {
  //         this.openDialogAsperResponce('INV/eWB Data Updated Successfully', 'success');
  //         this.getIndDetailFromServer(this.userSelIndNo);
  //         this.getInvoiceIndentData(this.userSelIndNo);
  //         this.btnSelectINVeWB();
  //       } else {
  //         let message = this.formUpdateStatus['message'];
  //         let title = "INV/eWB Data Not Updated.";
  //         this.openDialogForError(title, message, 'error');
  //       }
  //       this.resetInvoice();
  //     }))
  //     .subscribe(() => { }, () => {

  //     });
  // }

  //updated implementation including files
  async submitINVEWBFormToServer(formValue: IndentUpdateINVEWB) {
    this.ngxService.start();

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    let invoice_id = this.globalInvoiceNo;

    let inv_no = formValue.inv_no;
    let ewb_no = formValue.ewb_no;
    let dispatch_from_indent = formValue.dispatch_from_indent;
    let dispatch_from_origin = formValue.dispatch_from_origin;
    let dispatch_to_indent = formValue.dispatch_to_indent;
    let dispatch_to_destination = formValue.dispatch_to_destination;
    let machine_sn = formValue.machine_sn;
    if (inv_no !== null) {
      inv_no = inv_no.trim();
    }
    if (ewb_no !== null) {
      ewb_no = ewb_no.trim();
    }
    if (dispatch_from_indent !== null) {
      dispatch_from_indent = dispatch_from_indent.trim();
    }
    if (dispatch_from_origin !== null) {
      dispatch_from_origin = dispatch_from_origin.trim();
    }
    if (dispatch_to_indent !== null) {
      dispatch_to_indent = dispatch_to_indent.trim();
    }
    if (dispatch_to_destination !== null) {
      dispatch_to_destination = dispatch_to_destination.trim();
    }
    if (machine_sn !== null) {
      machine_sn = machine_sn.trim();
    }

    const formData = new FormData();

    formData.append('inv_request_anct_date', formValue.inv_request_anct_date || '')
    formData.append('inv_issuance_date', formValue.inv_issuance_date || '')
    formData.append('inv_no', inv_no || '')
    formData.append('ewb_no', ewb_no || '')
    formData.append('ewb_issuance_date', formValue.ewb_issuance_date || '')
    formData.append('transportation_method', formValue.transportation_method || '')
    formData.append('dispatch_date', formValue.dispatch_date || '')
    formData.append('dispatch_from_indent', dispatch_from_indent || '')
    formData.append('dispatch_from_origin', dispatch_from_origin || '')
    formData.append('dispatch_to_indent', dispatch_to_indent || '')
    formData.append('dispatch_to_destination', dispatch_to_destination || '')
    formData.append('invoice_id', invoice_id.toString() || '')
    formData.append('indent_sheet_num', this.userSelIndNo || '')
    formData.append('machine_sn', machine_sn || '');

    const emptyBlob = new Blob([], { type: '' });

    const invoiceFile = this.invAttachedFormFiles?.[0];
    const ewbFile = this.ewbAttachedFormFiles?.[0];

    formData.append('invoice_doc', invoiceFile || emptyBlob, invoiceFile?.name || '');
    formData.append('inv_doc_name', invoiceFile?.name || '');

    formData.append('ewb_doc', ewbFile || emptyBlob, ewbFile?.name || '');
    formData.append('ewb_doc_name', ewbFile?.name || '');

    const options = { headers };
    return await this.httpcon.post<any>(GlobalConstants.apiUpdateINVData, formData)
      .pipe(map(Response => {
        this.formUpdateStatus = [];
        this.formUpdateStatus = Response;

        if (this.formUpdateStatus['affectedRows'] === 1) {

          if (this.formUpdateStatus['message'] === "INV/eWB Updated successfully and Email is sent too.") {

            this.openDialogAsperResponce('INV/eWB Data Updated Successfully and Email is sent to Respective Employees.', 'success');

          } else if (this.formUpdateStatus['message'] === "INV/eWB Updated successfully but failed to send Email.") {

            // this.openDialogAsperResponce('INV/eWB Data Updated Successfully but failed to send Email.', 'success');

            Swal.fire({
              icon: "success",
              title: "INV/eWB Data Updated Successfully but failed to send Email.",
              text: "Check Email Setting!",
              showConfirmButton: true,
              confirmButtonColor: '#282E89',
              allowOutsideClick: false,
            })


          } else {
            this.openDialogAsperResponce('INV/eWB Data Updated Successfully', 'success');
          }

          this.getIndDetailFromServer(this.userSelIndNo);
          this.getInvoiceIndentData(this.userSelIndNo);
          this.btnSelectINVeWB();
        } else {
          let message = this.formUpdateStatus['message'];
          let title = "INV/eWB Data Not Updated.";
          this.openDialogForError(title, message, 'error');
        }
        this.resetInvoice();
        this.closeInvEwbModal();

        this.ngxService.stop();
      }))
      .subscribe(() => { }, () => {

      });
  }


  // async getIndentFromInvoice(value) {


  //   let inv_no = value.inv_no;

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   });
  //   const options = { headers };
  //   let url = GlobalConstants.apiGetIndentFromInvoice;
  //   let param = new HttpParams();

  //   param = new HttpParams()
  //     .set('inv_no', inv_no)
  //     .set('indent_sheet_num', this.userSelIndNo);

  //   return await this.httpcon.post<IndentFromInvoice[]>(url, param, options)
  //     .pipe(map(Response => {
  //       this.indentListFromInvoice = [];
  //       this.indentListFromInvoice = Response;

  //       if (this.indentListFromInvoice.length == 0) {
  //         // call method for addition of updation
  //         this.AddorUpdateINVData(value);
  //       } else {
  //         this.showSwalMssgForSameInvoice(value);
  //       }
  //     }))
  //     .subscribe();
  // }

  //updated implemtation for checking the files 
  async getIndentFromInvoice(value) {

    if (this.verifiedAttachments === false) {

      this.checkDocs();
    }

    if (this.verifiedAttachments === true) {

      if (this.invAttachedFormFiles.length === 0) {

        this.openDialogAsperResponce("Please attach Invoice Bill.", 'warning');

        return;
      }

      const ewbNo = this.invewbFormGroup.controls['ewb_no'].value;

      if (ewbNo && this.ewbAttachedFormFiles.length === 0) {

        this.openDialogAsperResponce("Please attach E-Way Bill.", 'warning');

        this.verifiedAttachments = false;
        return;
      } else if (!ewbNo && this.ewbAttachedFormFiles.length > 0) {

        this.openDialogAsperResponce("Please enter E-Way Bill Number.", 'warning');
        this.verifiedAttachments = false;
        return;
      }

      let inv_no = value.inv_no;

      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });
      const options = { headers };
      let url = GlobalConstants.apiGetIndentFromInvoice;
      let param = new HttpParams();

      param = new HttpParams()
        .set('inv_no', inv_no)
        .set('indent_sheet_num', this.userSelIndNo);

      return await this.httpcon.post<IndentFromInvoice[]>(url, param, options)
        .pipe(map(Response => {
          this.indentListFromInvoice = [];
          this.indentListFromInvoice = Response;

          if (this.indentListFromInvoice.length == 0) {
            // call method for addition of updation
            this.AddorUpdateINVData(value);
          } else {
            this.showSwalMssgForSameInvoice(value);
          }
        }))
        .subscribe();
    }
  }


  async deleteINVData(value) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const options = { headers };
    let url = GlobalConstants.apiDeleteINVData;
    let param = new HttpParams();

    param = new HttpParams()
      .set('invoice_id', value)
      .set('indent_sheet_num', this.userSelIndNo);

    return await this.httpcon.post<any>(url, param, options)
      .pipe(map(Response => {
        this.formUpdateStatus = [];
        this.formUpdateStatus = Response;


        if (this.formUpdateStatus['affectedRows'] === 1) {
          this.openDialogAsperResponce('INV/eWB Data Deleted Successfully', 'success');
          this.getIndDetailFromServer(this.userSelIndNo);
          this.getInvoiceIndentData(this.userSelIndNo);
          this.btnSelectINVeWB();
        } else {
          this.openDialogAsperResponce('INV/eWB Data Not Deleted. Please Try Again', 'error');
        }
        this.resetInvoice();
      }))
      .subscribe(() => { }, () => {

      });
  }

  async addPMTToServer(value) {
    if (value.pmt_sts === "") {
      value.pmt_sts = null;
    } else {
      value.pmt_sts = value.pmt_sts;
    }
    if (value.payment_type === "") {
      value.payment_type = null;
    } else {
      value.payment_type = value.payment_type;
    }
    if (this.validateDate(value.payment_date) === true) {
      value.payment_date = value.payment_date;
    } else {
      if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.payment_date)) !== -1) {
        value.payment_date = null;
      } else {
        value.payment_date = this.parserFormatter.format(value.payment_date);
      }
    }
    if (value.payment_amount === 'undefined') {
      value.payment_amount = null;
    }



    let payment_type;
    let payment_amount;
    let payment_date;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    let url;

    payment_date = value.payment_date;
    payment_amount = value.payment_amount;
    payment_type = value.payment_type
    url = GlobalConstants.apiAddOrUpdatePMTData;


    const param = new HttpParams()
      .set('pmt_sts', value.pmt_sts)
      .set('payment_date', payment_date)
      .set('payment_amount', payment_amount)
      .set('payment_type', payment_type)
      .set('indent_sheet_num', this.userSelIndNo)
      .set('customer_po_num', this.customerPoNO);
    const options = { headers };
    return await this.httpcon.post<any>(url, param, options)
      .pipe(map(Response => {
        this.formUpdateStatus = [];
        this.formUpdateStatus = Response;
        this.misMatchedDataShown = true;

        if (this.formUpdateStatus['affectedRows'] === 1) {
          let message = this.formUpdateStatus['message']
          this.openDialogAsperResponce(message, 'success');
          this.getIndDetailFromServer(this.userSelIndNo);
          this.getPaymentIndentData(this.userSelIndNo);
          if (this.groupedButtonEnabled && this.indentType == "GROUPED") {
            let customerPoNum = this.customerPoNO;
            this.getIndentListUsingPoNumber(customerPoNum);
          }
        } else {
          this.openDialogAsperResponce('PMT Data Not Inserted. Please Try Again', 'error');
        }
      }))
      .subscribe(() => { }, () => {

      });

  }

  async submitPMTFormToServer(formValue) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const options = { headers };
    let url: string;
    let param = new HttpParams();
    url = GlobalConstants + "PaymentData"

    if (formValue.payment_type === "") {
      formValue.payment_type = null;
    } else {
      formValue.payment_type = formValue.payment_type;
    }
    if (formValue.pmt_sts === "") {
      formValue.pmt_sts = null;
    } else {
      formValue.pmt_sts = formValue.pmt_sts;
    }
    if (this.validateDate(formValue.payment_date) === true) {
      formValue.payment_date = formValue.payment_date;
    } else {
      if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(formValue.payment_date)) !== -1) {
        formValue.payment_date = null;
      } else {
        formValue.payment_date = this.parserFormatter.format(formValue.payment_date);
      }
    }
    if (formValue.payment_amount === 'undefined') {
      formValue.payment_amount = null;
    }


    url = GlobalConstants.apiAddOrUpdatePMTData;
    let payment_id = this.globalPaymentNo;
    let payment_date = formValue.payment_date;
    let payment_amount = formValue.payment_amount;
    let payment_type = formValue.payment_type

    param = new HttpParams()
      .set('pmt_sts', formValue.pmt_sts)
      .set('id', payment_id)
      .set('indent_sheet_num', this.userSelIndNo)
      .set('payment_type', payment_type)
      .set('payment_date', payment_date)
      .set('payment_amount', payment_amount)
      .set('customer_po_num', this.customerPoNO);


    return await this.httpcon.put<any>(url, param, options)
      .pipe(map(Response => {
        this.formUpdateStatus = [];
        this.formUpdateStatus = Response;
        this.misMatchedDataShown = true;


        if (this.formUpdateStatus['affectedRows'] === 1) {
          let message = this.formUpdateStatus['message']
          this.openDialogAsperResponce(message, 'success');
          this.getIndDetailFromServer(this.userSelIndNo);
          this.getPaymentIndentData(this.userSelIndNo);
          if (this.groupedButtonEnabled && this.indentType == "GROUPED") {
            let customerPoNum = this.customerPoNO;
            this.getIndentListUsingPoNumber(customerPoNum);
          }
        } else {
          this.openDialogAsperResponce('PMT Data Not Updated. Please Try Again', 'error');
        }
      }))
      .subscribe(() => { }, () => {

      });

  }

  async deletePMTData() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const options = { headers };
    let url: string;
    let param = new HttpParams();
    let payment_id = this.globalPaymentNo;

    url = GlobalConstants.apiDeletePaymentData;
    param = new HttpParams()
      .set('id', payment_id)
      .set('indent_sheet_num', this.userSelIndNo);

    return await this.httpcon.post<any>(url, param, options)
      .pipe(map(Response => {
        this.formUpdateStatus = [];
        this.formUpdateStatus = Response;


        if (this.formUpdateStatus['affectedRows'] === 1) {
          this.openDialogAsperResponce('PMT Data Deleted Successfully', 'success');
          this.getIndDetailFromServer(this.userSelIndNo);
          this.getPaymentIndentData(this.userSelIndNo);
          if (this.groupedButtonEnabled && this.indentType == "GROUPED") {
            let customerPoNum = this.customerPoNO;
            this.getIndentListUsingPoNumber(customerPoNum);
          }
        } else {
          this.openDialogAsperResponce('PMT Data Not Deleted. Please Try Again', 'error');
        }
      }))
      .subscribe(() => { }, () => {
      });
  }

  async submitCOMFormToServer(formValue: indentFormUpdate) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const param = new HttpParams()
      .set('com_month', formValue.com_month)
      .set('indent_sheet_num', this.userSelIndNo);

    const options = { headers };
    return await this.httpcon.post<any>(GlobalConstants.apiUpdateCOMData, param, options)
      .pipe(map(Response => {
        this.formUpdateStatus = [];
        this.formUpdateStatus = Response;


        if (this.formUpdateStatus['affectedRows'] === 1) {
          this.openDialogAsperResponce('COM Data Updated Successfully', 'success');
          this.getIndDetailFromServer(this.userSelIndNo);
          this.btnSelectCOM();
        } else {
          this.openDialogAsperResponce('COM Data Not Updated. Please Try Again', 'error');
        }
      }))
      .subscribe(() => { }, () => {

      });
  }

  async submitNXTAXNFormToServer(formValue: indentFormUpdate) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    let for_info = formValue.for_info;
    if (for_info !== null) {
      for_info = for_info.trim();
    }
    const param = new HttpParams()
      .set('checked_on', formValue.checked_on)
      .set('next_check', formValue.next_check)
      .set('for_info', for_info)
      .set('indent_sheet_num', this.userSelIndNo);

    const options = { headers };
    return await this.httpcon.post<any>(GlobalConstants.apiUpdateNextActionData, param, options)
      .pipe(map(Response => {
        this.formUpdateStatus = [];
        this.formUpdateStatus = Response;

        if (this.formUpdateStatus['affectedRows'] === 1) {
          this.alertSuccess = 'NXT AXN Data Successfully Update';
          this.openDialogAsperResponce('NXT ACT Data Updated Successfully', 'success');
          this.getIndDetailFromServer(this.userSelIndNo);
          this.btnSelectNXTAXN();
        } else {
          this.openDialogAsperResponce('NXT ACT Not Updated. Please Try Again', 'error');
        }
      }))
      .subscribe(() => { }, () => {
      });

  }

  openDialogAsperResponce(titleMessage, icontext) {
    Swal.fire({
      icon: icontext,
      title: titleMessage,
      showConfirmButton: true,
      confirmButtonColor: '#282E89',
      allowOutsideClick: false,
    })

  }

  resetAllLoadFormDetail() {
    this.piLoadForm = false;
    this.iipoLoadForm = false;
    this.ocLoadForm = false;
    this.exfLoadForm = false;
    this.pmtLoadForm = false;
    this.lcLoadForm = false;
    this.comLoadForm = false;
    this.shpinvLoadForm = false;
    this.nactionLoadForm = false;
    // turn new loadForm to false;
    this.indLoadForm = false;
    this.iiocLoadForm = false;
    this.iiexfLoadForm = false;
    this.bgLoadForm = false;
    this.invewbLoadForm = false;
    this.isDateInvalid = false;
    this.isMinDateFlag = false;
    this.minDateInvalid = false;
    this.isMaxDateFlag = false;
    this.maxDateInvalid = false;
    this.selectedTab = "";
    this.isModified = false;
    this.radioTypeDisabled = false;
    this.reactiveForm = null;
    this.formUpdateStatus = [];
  }

  selectRadioIIEXF(val) {
    switch (val.toString()) {
      case '1': {
        this.resetIIExfTypeFlag();
        this.iiexfTyp1Flag = true;
        this.radioButtonClicked = true;
        break;
      }
      case '2': {
        this.resetIIExfTypeFlag();
        this.iiexfTyp2Flag = true;
        this.radioButtonClicked = true;
        break;
      }
      case '3': {
        this.resetIIExfTypeFlag();
        this.iiexfTyp3Flag = true;
        this.radioButtonClicked = true;
        break;
      }

      default: {
        this.resetIIExfTypeFlag();
        this.iiexfTyp1Flag = true;
        break;
      }
    }
  }

  selectRadioEXF(val) {
    switch (val.toString()) {

      case '1': {
        this.resetExfTypeFlag();
        this.exfTyp1Flag = true;
        this.radioButtonClicked = true;
        break;
      }
      case '2': {
        this.resetExfTypeFlag();
        this.exfTyp2Flag = true;
        this.radioButtonClicked = true;
        break;
      }
      case '3': {
        this.resetExfTypeFlag();
        this.exfTyp3Flag = true;
        this.radioButtonClicked = true;
        break;
      }

      default: {
        this.resetExfTypeFlag();
        this.exfTyp1Flag = true;
        break;
      }
    }

  }

  selectRadioBG(val) {
    switch (val.toString()) {
      case '1': {
        this.resetBGTypeFlag();
        this.bgTyp1Flag = true;
        this.radioButtonClicked = true;
        break;
      }
      case '2': {
        this.resetBGTypeFlag();
        this.bgTyp2Flag = true;
        this.radioButtonClicked = true;
        break;
      }

      default: {
        this.resetBGTypeFlag();
        this.bgTyp1Flag = true;
        break;
      }
    }
  }

  selectRadioSHP(val) {
    switch (val.toString()) {
      case '1': {
        this.resetShpTypeFlag();
        this.shpTyp1Flag = true;
        this.radioButtonClicked = true;
        break;
      }
      case '2': {
        this.resetShpTypeFlag();
        this.shpTyp2Flag = true;
        this.radioButtonClicked = true;
        break;
      }
      case '3': {
        this.resetShpTypeFlag();
        this.shpTyp3Flag = true;
        this.radioButtonClicked = true;
        break;
      }

      default: {
        this.resetShpTypeFlag();
        this.shpTyp1Flag = true;
        break;
      }
    }
  }

  resetIIExfTypeFlag() {
    this.iiexfTyp1Flag = false;
    this.iiexfTyp2Flag = false;
    this.iiexfTyp3Flag = false;
    this.radioButtonClicked = false;
  }

  resetExfTypeFlag() {
    this.exfTyp1Flag = false;
    this.exfTyp2Flag = false;
    this.exfTyp3Flag = false;
    this.radioButtonClicked = false;
  }

  resetBGTypeFlag() {
    this.bgTyp1Flag = false;
    this.bgTyp2Flag = false;
    this.radioButtonClicked = false;
  }


  resetLcTypeFlag() {
    this.lcTyp1Flag = false;
    this.lcTyp2Flag = false;
  }

  resetComTypeFlag() {
    this.comTyp1Flag = false;
    this.comTyp2Flag = false;
  }

  resetShpTypeFlag() {
    this.shpTyp1Flag = false;
    this.shpTyp2Flag = false;
    this.shpTyp3Flag = false;
    this.radioButtonClicked = false;
  }

  //!!!! important
  unsorted() {
    //   !!!! Please do not delete this function this function is empty but still it is doing work because i need an empty function for unsorting..
  }



  tabSwitch(btn: string, content) {
    let form: FormGroup;
    let fromTab: string = "";
    let firstTab: boolean = false;
    this.isDiscardCalled = false;
    if (this.indLoadForm) {
      form = this.indFormGroup;
      fromTab = 'IND';
      this.fromTab = 'IND';
    }
    else if (this.piLoadForm) {
      form = this.piFormGroup;
      fromTab = 'PI';
      this.fromTab = 'PI';
    }
    else if (this.iipoLoadForm) {
      form = this.iipoFormGroup;
      fromTab = 'II-PO';
      this.fromTab = 'II-PO';
    }
    else if (this.iiocLoadForm) {
      form = this.iiocFormGroup;
      fromTab = 'II-OC';
      this.fromTab = 'II-OC';
    }
    else if (this.ocLoadForm) {
      form = this.ocFormGroup;
      fromTab = 'VD-OC';
      this.fromTab = 'VD-OC';
    }
    else if (this.lcLoadForm) {
      form = this.lcFormGroup;
      fromTab = 'LC';
      this.fromTab = 'LC';
    }
    else if (this.shpinvLoadForm) {
      form = this.shpinvFormGroup;
      fromTab = 'VD-SHP';
      this.fromTab = 'VD-SHP';
    }
    else if (this.exfLoadForm) {
      form = this.exfFormGroup;
      fromTab = 'VD-EXF';
      this.fromTab = 'VD-EXF';
    }
    else if (this.iiexfLoadForm) {
      form = this.iiexfFormGroup;
      fromTab = 'II-EXF';
      this.fromTab = 'II-EXF';
    }
    else if (this.bgLoadForm) {
      form = this.bgFormGroup;
      fromTab = 'BG';
      this.fromTab = 'BG';
    }
    else if (this.comLoadForm) {
      form = this.comFormGroup;
      fromTab = 'COM';
      this.fromTab = 'COM';
    }
    else if (this.nactionLoadForm) {
      form = this.nactionFormGroup;
      fromTab = 'NXT ACT';
      this.fromTab = 'NXT ACT';
    }
    else if (this.invewbLoadForm) {
      this.switching(btn);
      this.firstTab = true;
      firstTab = true;
    }
    else if (this.pmtLoadForm) {
      this.switching(btn);
      this.firstTab = true;
      firstTab = true;
    }
    else if (this.indLoadForm) {
      this.switching(btn);
      this.firstTab = true;
      firstTab = true;
    }
    else {
      this.switching(btn);
      this.firstTab = true;
      firstTab = true;
    }
    if (!firstTab) {
      if (this.isModified && form.dirty && form.valid) {
        this.isDiscardCalled = false;
        Swal.fire({
          title: 'UNSAVED DATA',
          text: 'Do you want to update ' + fromTab + ' data changes?  ',
          showDenyButton: true,
          confirmButtonText: `Reflect Changes`,
          denyButtonText: `Discard Changes`,
          confirmButtonColor: '#282E89',
          allowOutsideClick: false,
          position: 'top',
        }).then((result) => {
          if (result.isConfirmed) {
            this.onConfirm(form.value);
            this.switchTab = true;
            this.switchTabName = btn;
            this.openConfirmation(content, 'md');
          }
          else if (result.isDenied) {
            this.isDiscardCalled = true;
            this.switching(btn);
          }
        })
      }
      else {
        this.switching(btn);
      }
    }
  }

  switching(btn: string) {
    this.switchTab = false;
    this.switchTabName = "";
    this.getIndDetailFromServer(this.userSelIndNo);
    switch (btn.toString()) {
      case 'IND':
        this.btnSelectIND();
        break;
      case 'PI':
        this.btnSelectPI();
        break;
      case 'II-PO':
        this.btnSelectIIPO();
        break;
      case 'II-OC':
        this.btnSelectIIOC();
        break;
      case 'VD-OC':
        this.btnSelectOC();
        break;
      case 'LC':
        this.btnSelectLC();
        break;
      case 'VD-SHP':
        this.btnSelectSHPINV();
        break;
      case 'VD-EXF':
        this.btnSelectEXF();
        break;
      case 'II-EXF':
        this.btnSelectIIEXF();
        break;
      case 'BG':
        this.btnSelectBG();
        break;
      case 'INV/eWB':
        this.btnSelectINVeWB();
        break;
      case 'PMT':
        this.misMatchedDataShown = false;
        this.btnSelectPMT();
        break;
      case 'COM':
        this.btnSelectCOM();
        break;
      case 'NXT ACT':
        this.btnSelectNXTAXN();
        break;
    }
  }

  setFormControlsToDisable() {
    this.shpinvFormGroup.controls.del_sts.disable();
    this.shpinvFormGroup.controls.mode1.disable();
    this.shpinvFormGroup.controls.mode2.disable();
    this.shpinvFormGroup.controls.mode3.disable();
    this.shpinvFormGroup.controls.from1.disable();
    this.shpinvFormGroup.controls.from2.disable();
    this.shpinvFormGroup.controls.from3.disable();
    this.exfFormGroup.controls.del_sts.disable();
    this.exfFormGroup.controls.exf1_sts.disable();
    this.exfFormGroup.controls.exf2_sts.disable();
    this.exfFormGroup.controls.exf3_sts.disable();
    this.iiexfFormGroup.controls.del_sts.disable();
    this.iiexfFormGroup.controls.exf1_sts.disable();
    this.iiexfFormGroup.controls.exf2_sts.disable();
    this.iiexfFormGroup.controls.exf3_sts.disable();
    // this.pmtFormGroup.controls.pmt_sts.disable();
  }

  checkDataChanged(tabName: string, reactiveForm: FormGroup, value: any) {
    let isTabSwitched = false;
    this.isTabSwitched = false;
    let isEquivalentProp = false;
    this.isModified = false;

    if (this.reactiveForm) {
      if (!this.reactiveForm.dirty) {
        this._originalValue = JSON.stringify(value);
      }
    }

    if (this.fromTab != "") {
      if (tabName != this.fromTab) {
        isTabSwitched = true;
        this.isTabSwitched = true;
        this._originalValue = JSON.stringify(value);
      }
    }
    this.reactiveForm.valueChanges.pipe(debounceTime(500), distinctUntilChanged((a, b) => {
      return JSON.stringify(a) === JSON.stringify(b);
    }))
      .subscribe((x: any) => {
        if (this.reactiveForm) {
          if (this.reactiveForm.dirty) {
            var current_value = JSON.stringify(this.reactiveForm.value);

            isEquivalentProp = this.isEquivalent(this._originalValue, current_value);
            if (this._originalValue != current_value) {
              if (isEquivalentProp) {
                this.isModified = true;
                this.reactiveForm.updateValueAndValidity({ onlySelf: true, emitEvent: false });
                if (this.formUpdateStatus['affectedRows'] === 1 || this.formUpdateStatus['affectedRows'] === 'undefined') {
                  this.isModified = false; this.formUpdateStatus = [];
                }
                return true;
              }
              else {
                this._originalValue = JSON.stringify(value);
                this.isModified = false;
              }
            }
            else {
              this.isModified = false;
              return false;
            }
          }
        }
      });
  }

  isEquivalent(oldvalue, newvalue) {
    var jsonString1 = oldvalue;
    var jsonString2 = newvalue;

    var jsonObject1 = JSON.parse(jsonString1);
    var jsonObject2 = JSON.parse(jsonString2);

    var obj1Keys = Object.keys(jsonObject1);
    var obj2Keys = Object.keys(jsonObject2);

    for (let i = 0; i < obj1Keys.length; i++) {
      for (let j = 0; j < obj2Keys.length; j++) {
        if (obj1Keys[i] === obj2Keys[j]) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  compareFormChanged(value) {
    //#PI
    if (this.piLoadForm === true) {
      let col1 = false;
      let col2 = false;

      this.pinonew = value.pi_no;
      if (this.pinonew != null) {
        if (this.pinonew.trim().length == 0) {
          this.pinonew = null;
        }
      }
      this.pinoold = this.detaildatasource[0].pi_no;
      if (this.pinonew !== this.pinoold) {
        col1 = true;
      }
      else {
        col1 = false;
      }

      if (this.validateDate(value.pi_date) === true) {
        value.pi_date = value.pi_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.pi_date)) !== -1) {
          value.pi_date = null;
        }
        else {
          value.pi_date = this.parserFormatter.format(value.pi_date);
        }
      }

      this.pidatenew = this.datePipe.transform(value.pi_date, 'yyyy-MM-dd');
      this.pidateold = this.datePipe.transform(this.detaildatasource[0].pi_date, 'yyyy-MM-dd');
      if (this.pidatenew !== this.pidateold) {
        col2 = true;
      }
      else {
        col2 = false;
      }

      if (col1 || col2) {
        this.isModified = true;
      }
      else {
        this.isModified = false;
      }
    }

    //#IIPO
    if (this.iipoLoadForm === true) {
      // column modified
      let col1 = false;
      let col2 = false;

      // validate all date
      if (this.validateDate(value.iipo_date) === true) {
        value.iipo_date = value.iipo_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.iipo_date)) !== -1) {
          value.iipo_date = null;
        } else {
          value.iipo_date = this.parserFormatter.format(value.iipo_date);
        }
      }

      // get data and set null if empty and get date
      this.iipononew = value.iipo_no;
      if (this.iipononew != null) {
        if (this.iipononew.trim().length == 0) {
          this.iipononew = null;
        }
      }

      // test data
      this.iiponoold = this.detaildatasource[0].iipo_no;
      if (this.iipononew !== this.iiponoold) {
        col1 = true;
      }
      else {
        col1 = false;
      }

      this.iipodatenew = this.datePipe.transform(value.iipo_date, 'yyyy-MM-dd');
      this.iipodateold = this.datePipe.transform(this.detaildatasource[0].iipo_date, 'yyyy-MM-dd');
      if (this.iipodatenew !== this.iipodateold) {
        col2 = true;
      }
      else {
        col2 = false;
      }

      // if any column change modified to true.
      if (col1 || col2) {
        this.isModified = true;
      }
      else {
        this.isModified = false;
      }
    }

    // #IIOC
    if (this.iiocLoadForm === true) {
      let col1 = false;
      let col2 = false;
      let col3 = false;
      let col4 = false;

      if (this.validateDate(value.prd_ord_date) === true) {
        value.prd_ord_date = value.prd_ord_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.prd_ord_date)) !== -1) {
          value.prd_ord_date = null;
        }
        else {
          value.prd_ord_date = this.parserFormatter.format(value.prd_ord_date);
        }
      }
      if (this.validateDate(value.oc_date) === true) {
        value.oc_date = value.oc_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.oc_date)) !== -1) {
          value.oc_date = null;
        }
        else {
          value.oc_date = this.parserFormatter.format(value.oc_date);
        }
      }

      this.jobnonew = value.job_no;
      if (this.jobnonew != null) {
        if (this.jobnonew.trim().length == 0) {
          this.jobnonew = null;
        }
      }
      this.jobnoold = this.updateNewTabs[0].job_no;
      this.prdorddatenew = this.datePipe.transform(value.prd_ord_date, 'yyyy-MM-dd');
      this.prdorddateeold = this.datePipe.transform(this.updateNewTabs[0].prd_ord_date, 'yyyy-MM-dd');
      this.iiocnonew = value.oc_no;
      if (this.iiocnonew != null) {
        if (this.iiocnonew.trim().length == 0) {
          this.iiocnonew = null;
        }
      }
      this.iiocnoold = this.updateNewTabs[0].oc_no;
      this.iiocdatenew = this.datePipe.transform(value.oc_date, 'yyyy-MM-dd');
      this.iiocdateeold = this.datePipe.transform(this.updateNewTabs[0].oc_date, 'yyyy-MM-dd');

      if (this.jobnonew !== this.jobnoold) {
        col1 = true;
      }
      else {
        col1 = false;
      }
      if (this.prdorddatenew !== this.prdorddateeold) {
        col2 = true;
      }
      else {
        col2 = false;
      }
      if (this.iiocnonew !== this.iiocnoold) {
        col3 = true;
      }
      else {
        col3 = false;
      }

      if (this.iiocdatenew !== this.iiocdateeold) {
        col4 = true;
      }
      else {
        col4 = false;
      }

      if (col1 || col2 || col3 || col4) {
        this.isModified = true;
      }
      else {
        this.isModified = false;
      }
    }

    //#VD-OC
    if (this.ocLoadForm === true) {
      let col1 = false;
      let col2 = false;
      if (this.validateDate(value.oc_date) === true) {
        value.oc_date = value.oc_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.oc_date)) !== -1) {
          value.oc_date = null;
        } else {
          value.oc_date = this.parserFormatter.format(value.oc_date);
        }
      }

      this.ijprojectnumnew = value.ij_project_num;
      if (this.ijprojectnumnew != null) {
        if (this.ijprojectnumnew.trim().length == 0) {
          this.ijprojectnumnew = null;
        }
      }
      this.ijprojectnumold = this.detaildatasource[0].ij_project_num;


      this.ocdatenew = this.datePipe.transform(value.oc_date, 'yyyy-MM-dd');
      this.ocdateold = this.datePipe.transform(this.detaildatasource[0].oc_date, 'yyyy-MM-dd');

      if (this.ijprojectnumnew !== this.ijprojectnumold) {
        col1 = true;
      }
      else {
        col1 = false;
      }

      if (this.ocdatenew !== this.ocdateold) {
        col2 = true;
      }
      else {
        col2 = false;
      }

      if (col1 || col2) {
        this.isModified = true;
      }
      else {
        this.isModified = false;
      }
    }

    //#LC
    if (this.lcLoadForm === true) {
      let col1 = false;
      let col2 = false;
      let col3 = false;
      let col4 = false;
      let col5 = false;

      if (this.validateDate(value.lc_chk_date_by_ij) === true) {
        value.lc_chk_date_by_ij = value.lc_chk_date_by_ij;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.lc_chk_date_by_ij)) !== -1) {
          value.lc_chk_date_by_ij = null;
        } else {
          value.lc_chk_date_by_ij = this.parserFormatter.format(value.lc_chk_date_by_ij);
        }
      }

      if (this.validateDate(value.lc_open_date) === true) {
        value.lc_open_date = value.lc_open_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.lc_open_date)) !== -1) {
          value.lc_open_date = null;
        } else {
          value.lc_open_date = this.parserFormatter.format(value.lc_open_date);
        }
      }

      if (this.validateDate(value.lc_last_revision_date) === true) {
        value.lc_last_revision_date = value.lc_last_revision_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.lc_last_revision_date)) !== -1) {
          value.lc_last_revision_date = null;
        } else {
          value.lc_last_revision_date = this.parserFormatter.format(value.lc_last_revision_date);
        }
      }

      if (this.validateDate(value.latest_shipment_date) === true) {
        value.latest_shipment_date = value.latest_shipment_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.latest_shipment_date)) !== -1) {
          value.latest_shipment_date = null;
        } else {
          value.latest_shipment_date = this.parserFormatter.format(value.latest_shipment_date);
        }
      }

      if (this.validateDate(value.lc_expiry_date) === true) {
        value.lc_expiry_date = value.lc_expiry_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.lc_expiry_date)) !== -1) {
          value.lc_expiry_date = null;
        } else {
          value.lc_expiry_date = this.parserFormatter.format(value.lc_expiry_date);
        }
      }

      this.lcdrftchknew = this.datePipe.transform(value.lc_chk_date_by_ij, 'yyyy-MM-dd');
      this.lcdrftchkold = this.datePipe.transform(this.detaildatasource[0].lc_chk_date_by_ij, 'yyyy-MM-dd');
      this.lcopennew = this.datePipe.transform(value.lc_open_date, 'yyyy-MM-dd');
      this.lcopenold = this.datePipe.transform(this.detaildatasource[0].lc_open_date, 'yyyy-MM-dd');
      this.lclastrevnew = this.datePipe.transform(value.lc_last_revision_date, 'yyyy-MM-dd');
      this.lclastrevold = this.datePipe.transform(this.detaildatasource[0].lc_last_revision_date, 'yyyy-MM-dd');
      this.lclatshpnew = this.datePipe.transform(value.latest_shipment_date, 'yyyy-MM-dd');
      this.lclatshpold = this.datePipe.transform(this.detaildatasource[0].latest_shipment_date, 'yyyy-MM-dd');
      this.lcexpirynew = this.datePipe.transform(value.lc_expiry_date, 'yyyy-MM-dd');
      this.lcexpiryold = this.datePipe.transform(this.detaildatasource[0].lc_expiry_date, 'yyyy-MM-dd');

      if (this.lcdrftchknew !== this.lcdrftchkold) {
        col1 = true;
      }
      else {
        col1 = false;
      }

      if (this.lcopennew !== this.lcopenold) {
        col2 = true;
      }
      else {
        col2 = false;
      }

      if (this.lclastrevnew !== this.lclastrevold) {
        col3 = true;
      }
      else {
        col3 = false;
      }

      if (this.lclatshpnew !== this.lclatshpold) {
        col4 = true;
      }
      else {
        col4 = false;
      }

      if (this.lcexpirynew !== this.lcexpiryold) {
        col5 = true;
      }
      else {
        col5 = false;
      }

      if (col1 || col2 || col3 || col4 || col5) {
        this.isModified = true;
      }
      else {
        this.isModified = false;
      }
    }

    //#SHP/INV -> VD-SHP
    if (this.shpinvLoadForm === true) {
      let col1 = false;
      let col2 = false;
      let col3 = false;
      let col4 = false;
      let col5 = false;
      let col6 = false;
      let col7 = false;
      let col8 = false;
      let col9 = false;
      let col10 = false;
      let col11 = false;
      let col12 = false;
      let col13 = false;
      let col14 = false;
      let col15 = false;
      let col16 = false;
      let col17 = false;
      let col18 = false;
      let col19 = false;
      let col20 = false;
      let col21 = false;
      let col22 = false;
      let col23 = false;
      let col24 = false;
      let col25 = false;
      let col26 = false;
      let col27 = false;
      let col28 = false;
      if (value.del_sts === "") {
        value.del_sts = null;
      } else {
        value.del_sts = value.del_sts;
      }

      if (this.validateDate(value.invoice_date1) === true) {
        value.invoice_date1 = value.invoice_date1;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.invoice_date1)) !== -1) {
          value.invoice_date1 = null;
        } else {
          value.invoice_date1 = this.parserFormatter.format(value.invoice_date1);
        }
      }
      if (this.validateDate(value.invoice_date2) === true) {
        value.invoice_date2 = value.invoice_date2;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.invoice_date2)) !== -1) {
          value.invoice_date2 = null;
        } else {
          value.invoice_date2 = this.parserFormatter.format(value.invoice_date2);
        }
      }

      if (this.validateDate(value.invoice_date3) === true) {
        value.invoice_date3 = value.invoice_date3;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.invoice_date3)) !== -1) {
          value.invoice_date3 = null;
        } else {
          value.invoice_date3 = this.parserFormatter.format(value.invoice_date3);
        }
      }

      if (value.mode1 === "") {
        value.mode1 = null;
      } else {
        value.mode1 = value.mode1;
      }
      if (value.mode2 === "") {
        value.mode2 = null;
      } else {
        value.mode2 = value.mode2;
      }
      if (value.mode3 === "") {
        value.mode3 = null;
      } else {
        value.mode3 = value.mode3;
      }

      if (value.from1 === "") {
        value.from1 = null;
      } else {
        value.from1 = value.from1;
      }
      if (value.from2 === "") {
        value.from2 = null;
      } else {
        value.from2 = value.from2;
      }
      if (value.from3 === "") {
        value.from3 = null;
      } else {
        value.from3 = value.from3;
      }

      if (this.validateDate(value.etd1) === true) {
        value.etd1 = value.etd1;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.etd1)) !== -1) {
          value.etd1 = null;
        } else {
          value.etd1 = this.parserFormatter.format(value.etd1);
        }
      }

      if (this.validateDate(value.etd2) === true) {
        value.etd2 = value.etd2;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.etd2)) !== -1) {
          value.etd2 = null;
        } else {
          value.etd2 = this.parserFormatter.format(value.etd2);
        }
      }

      if (this.validateDate(value.etd3) === true) {
        value.etd3 = value.etd3;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.etd3)) !== -1) {
          value.etd3 = null;
        } else {
          value.etd3 = this.parserFormatter.format(value.etd3);
        }
      }

      if (this.validateDate(value.eta1) === true) {
        value.eta1 = value.eta1;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.eta1)) !== -1) {
          value.eta1 = null;
        } else {
          value.eta1 = this.parserFormatter.format(value.eta1);
        }
      }

      if (this.validateDate(value.eta2) === true) {
        value.eta2 = value.eta2;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.eta2)) !== -1) {
          value.eta2 = null;
        } else {
          value.eta2 = this.parserFormatter.format(value.eta2);
        }
      }

      if (this.validateDate(value.eta3) === true) {
        value.eta3 = value.eta3;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.eta3)) !== -1) {
          value.eta3 = null;
        } else {
          value.eta3 = this.parserFormatter.format(value.eta3);
        }
      }

      this.delstsnew = value.del_sts;
      this.delstsold = this.detaildatasource[0].del_sts;
      this.invno1new = value.invoice_no1;
      if (this.invno1new != null) {
        if (this.invno1new.trim().length == 0) {
          this.invno1new = null;
        }
      }
      this.invno1old = this.detaildatasource[0].invoice_no1;
      this.invno2new = value.invoice_no2;
      if (this.invno2new != null) {
        if (this.invno2new.trim().length == 0) {
          this.invno2new = null;
        }
      }
      this.invno2old = this.detaildatasource[0].invoice_no2;
      this.invno3new = value.invoice_no3;
      if (this.invno3new != null) {
        if (this.invno3new.trim().length == 0) {
          this.invno3new = null;
        }
      }
      this.invno3old = this.detaildatasource[0].invoice_no3;
      this.invdate1new = this.datePipe.transform(value.invoice_date1, 'yyyy-MM-dd');
      this.invdate1old = this.datePipe.transform(this.detaildatasource[0].invoice_date1, 'yyyy-MM-dd');
      this.invdate2new = this.datePipe.transform(value.invoice_date2, 'yyyy-MM-dd');
      this.invdate2old = this.datePipe.transform(this.detaildatasource[0].invoice_date2, 'yyyy-MM-dd');
      this.invdate3new = this.datePipe.transform(value.invoice_date3, 'yyyy-MM-dd');
      this.invdate3old = this.datePipe.transform(this.detaildatasource[0].invoice_date3, 'yyyy-MM-dd');
      this.mode1new = value.mode1;
      this.mode1old = this.detaildatasource[0].mode1;
      this.mode2new = value.mode2;
      this.mode2old = this.detaildatasource[0].mode2;;
      this.mode3new = value.mode3;
      this.mode3old = this.detaildatasource[0].mode3;;
      this.from1new = value.from1;
      this.from1old = this.detaildatasource[0].from1;
      this.from2new = value.from2;
      this.from2old = this.detaildatasource[0].from2;
      this.from3new = value.from3;
      this.from3old = this.detaildatasource[0].from3;
      this.vess1new = value.vessel1;
      if (this.vess1new != null) {
        if (this.vess1new.trim().length == 0) {
          this.vess1new = null;
        }
      }
      this.vess1old = this.detaildatasource[0].vessel1;
      this.vess2new = value.vessel2;
      if (this.vess2new != null) {
        if (this.vess2new.trim().length == 0) {
          this.vess2new = null;
        }
      }
      this.vess2old = this.detaildatasource[0].vessel2;
      this.vess3new = value.vessel3;
      if (this.vess3new != null) {
        if (this.vess3new.trim().length == 0) {
          this.vess3new = null;
        }
      }
      this.vess3old = this.detaildatasource[0].vessel3;
      this.awbbl1new = value.awb_bl_no1;
      if (this.awbbl1new != null) {
        if (this.awbbl1new.trim().length == 0) {
          this.awbbl1new = null;
        }
      }
      this.awbbl1old = this.detaildatasource[0].awb_bl_no1;
      this.awbbl2new = value.awb_bl_no2;
      if (this.awbbl2new != null) {
        if (this.awbbl2new.trim().length == 0) {
          this.awbbl2new = null;
        }
      }
      this.awbbl2old = this.detaildatasource[0].awb_bl_no2;
      this.awbbl3new = value.awb_bl_no3;
      if (this.awbbl3new != null) {
        if (this.awbbl3new.trim().length == 0) {
          this.awbbl3new = null;
        }
      }
      this.awbbl3old = this.detaildatasource[0].awb_bl_no3;
      this.etd1new = this.datePipe.transform(value.etd1, 'yyyy-MM-dd');
      this.etd1old = this.datePipe.transform(this.detaildatasource[0].etd1, 'yyyy-MM-dd');;
      this.etd2new = this.datePipe.transform(value.etd2, 'yyyy-MM-dd');
      this.etd2old = this.datePipe.transform(this.detaildatasource[0].etd2, 'yyyy-MM-dd');;
      this.etd3new = this.datePipe.transform(value.etd3, 'yyyy-MM-dd');
      this.etd3old = this.datePipe.transform(this.detaildatasource[0].etd3, 'yyyy-MM-dd');;
      this.eta1new = this.datePipe.transform(value.eta1, 'yyyy-MM-dd');
      this.eta1old = this.datePipe.transform(this.detaildatasource[0].eta1, 'yyyy-MM-dd');;
      this.eta2new = this.datePipe.transform(value.eta2, 'yyyy-MM-dd');
      this.eta2old = this.datePipe.transform(this.detaildatasource[0].eta2, 'yyyy-MM-dd');;
      this.eta3new = this.datePipe.transform(value.eta3, 'yyyy-MM-dd');
      this.eta3old = this.datePipe.transform(this.detaildatasource[0].eta3, 'yyyy-MM-dd');;
      if (this.delstsnew !== this.delstsold) {
        col1 = true;
      }
      else {
        col1 = false;
      }
      if (this.invno1new !== this.invno1old) {
        col2 = true;
      }
      else {
        col2 = false;
      }

      if (this.invdate1new !== this.invdate1old) {
        col3 = true;
      }
      else {
        col3 = false;
      }

      if (this.mode1new !== this.mode1old) {
        col4 = true;
      }
      else {
        col4 = false;
      }

      if (this.from1new !== this.from1old) {
        col5 = true;
      }
      else {
        col5 = false;
      }

      if (this.etd1new !== this.etd1old) {
        col6 = true;
      }
      else {
        col6 = false;
      }

      if (this.eta1new !== this.eta1old) {
        col7 = true;
      }
      else {
        col7 = false;
      }

      if (this.vess1new !== this.vess1old) {
        col8 = true;
      }
      else {
        col8 = false;
      }

      if (this.awbbl1new !== this.awbbl1old) {
        col9 = true;
      }
      else {
        col9 = false;
      }

      if (this.invno2new !== this.invno2old) {
        col10 = true;
      }
      else {
        col10 = false;
      }

      if (this.invdate2new !== this.invdate2old) {
        col11 = true;
      }
      else {
        col11 = false;
      }

      if (this.mode2new !== this.mode2old) {
        col12 = true;
      }
      else {
        col12 = false;
      }

      if (this.from2new !== this.from2old) {
        col13 = true;
      }
      else {
        col13 = false;
      }

      if (this.etd2new !== this.etd2old) {
        col14 = true;
      }
      else {
        col14 = false;
      }

      if (this.eta2new !== this.eta2old) {
        col15 = true;
      }
      else {
        col15 = false;
      }

      if (this.vess2new !== this.vess2old) {
        col16 = true;
      }
      else {
        col16 = false;
      }

      if (this.awbbl2new !== this.awbbl2old) {
        col17 = true;
      }
      else {
        col17 = false;
      }

      if (this.invno3new !== this.invno3old) {
        col18 = true;
      }
      else {
        col18 = false;
      }

      if (this.invdate3new !== this.invdate3old) {
        col19 = true;
      }
      else {
        col19 = false;
      }

      if (this.mode3new !== this.mode3old) {
        col20 = true;
      }
      else {
        col20 = false;
      }

      if (this.from3new !== this.from3old) {
        col21 = true;
      }
      else {
        col21 = false;
      }

      if (this.etd3new !== this.etd3old) {
        col22 = true;
      }
      else {
        col22 = false;
      }

      if (this.eta3new !== this.eta3old) {
        col23 = true;
      }
      else {
        col23 = false;
      }

      if (this.vess3new !== this.vess3old) {
        col24 = true;
      }
      else {
        col24 = false;
      }

      if (this.awbbl3new !== this.awbbl3old) {
        col25 = true;
      }
      else {
        col25 = false;
      }

      if (col1 || col2 || col3 || col4 || col5 || col6 || col7 || col8 || col9 || col10 || col11 || col12 ||
        col13 || col14 || col15 || col16 || col17 || col18 || col19 || col20 || col21 || col22 || col23 || col24 || col25) {
        this.isModified = true;
      }
      else {
        this.isModified = false;
      }



    }

    //#EXF
    if (this.exfLoadForm === true) {
      let col1 = false;
      let col2 = false;
      let col3 = false;
      let col4 = false;
      let col5 = false;
      let col6 = false;
      let col7 = false;
      let col8 = false;
      let col9 = false;
      let col10 = false;

      if (this.validateDate(value.exf1) === true) {
        value.exf1 = value.exf1;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.exf1)) !== -1) {
          value.exf1 = null;
        } else {
          value.exf1 = this.parserFormatter.format(value.exf1);
        }
      }

      if (value.exf1_sts === "") {
        value.exf1_sts = null;
      } else {
        value.exf1_sts = value.exf1_sts;
      }

      if (this.validateDate(value.exf_ij_accment1) === true) {
        value.exf_ij_accment1 = value.exf_ij_accment1;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.exf_ij_accment1)) !== -1) {
          value.exf_ij_accment1 = null;
        } else {
          value.exf_ij_accment1 = this.parserFormatter.format(value.exf_ij_accment1);
        }
      }

      if (this.validateDate(value.exf2) === true) {
        value.exf2 = value.exf2;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.exf2)) !== -1) {
          value.exf2 = null;
        } else {
          value.exf2 = this.parserFormatter.format(value.exf2);
        }
      }

      if (value.exf2_sts === "") {
        value.exf2_sts = null;
      } else {
        value.exf2_sts = value.exf2_sts;
      }

      if (this.validateDate(value.exf_ij_accment2) === true) {
        value.exf_ij_accment2 = value.exf_ij_accment2;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.exf_ij_accment2)) !== -1) {
          value.exf_ij_accment2 = null;
        } else {
          value.exf_ij_accment2 = this.parserFormatter.format(value.exf_ij_accment2);
        }
      }

      if (this.validateDate(value.exf3) === true) {
        value.exf3 = value.exf3;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.exf3)) !== -1) {
          value.exf3 = null;
        } else {
          value.exf3 = this.parserFormatter.format(value.exf3);
        }
      }

      if (value.exf3_sts === "") {
        value.exf3_sts = null;
      } else {
        value.exf3_sts = value.exf3_sts;
      }

      if (this.validateDate(value.exf_ij_accment3) === true) {
        value.exf_ij_accment3 = value.exf_ij_accment3;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.exf_ij_accment3)) !== -1) {
          value.exf_ij_accment3 = null;
        } else {
          value.exf_ij_accment3 = this.parserFormatter.format(value.exf_ij_accment3);
        }
      }

      if (value.del_sts === "") {
        value.del_sts = null;
      } else {
        value.del_sts = value.del_sts;
      }

      this.delstsnew = value.del_sts;
      this.delstsold = this.detaildatasource[0].del_sts;
      this.exf1new = this.datePipe.transform(value.exf1, 'yyyy-MM-dd');
      this.exf1old = this.datePipe.transform(this.detaildatasource[0].exf1, 'yyyy-MM-dd');
      this.exf1stsnew = value.exf1_sts;
      this.exf1stsold = this.detaildatasource[0].exf1_sts;
      this.exfijannt1new = this.datePipe.transform(value.exf_ij_accment1, 'yyyy-MM-dd');
      this.exfijannt1old = this.datePipe.transform(this.detaildatasource[0].exf_ij_accment1, 'yyyy-MM-dd');
      this.exf2new = this.datePipe.transform(value.exf2, 'yyyy-MM-dd');
      this.exf2old = this.datePipe.transform(this.detaildatasource[0].exf2, 'yyyy-MM-dd');
      this.exf2stsnew = value.exf2_sts;
      this.exf2stsold = this.detaildatasource[0].exf2_sts;
      this.exfijannt2new = this.datePipe.transform(value.exf_ij_accment2, 'yyyy-MM-dd');
      this.exfijannt2old = this.datePipe.transform(this.detaildatasource[0].exf_ij_accment2, 'yyyy-MM-dd');
      this.exf3new = this.datePipe.transform(value.exf3, 'yyyy-MM-dd');
      this.exf3old = this.datePipe.transform(this.detaildatasource[0].exf3, 'yyyy-MM-dd');
      this.exf3stsnew = value.exf3_sts;
      this.exf3stsold = this.detaildatasource[0].exf3_sts;
      this.exfijannt3new = this.datePipe.transform(value.exf_ij_accment3, 'yyyy-MM-dd');
      this.exfijannt3old = this.datePipe.transform(this.detaildatasource[0].exf_ij_accment3, 'yyyy-MM-dd');

      if (this.delstsnew !== this.delstsold) {
        col1 = true;
      }
      else {
        col1 = false;
      }

      if (this.exf1new !== this.exf1old) {
        col2 = true;
      }
      else {
        col2 = false;
      }

      if (this.exf1stsnew !== this.exf1stsold) {
        col3 = true;
      }
      else {
        col3 = false;
      }

      if (this.exfijannt1new !== this.exfijannt1old) {
        col4 = true;
      }
      else {
        col4 = false;
      }

      if (this.exf2new !== this.exf2old) {
        col5 = true;
      }
      else {
        col5 = false;
      }

      if (this.exf2stsnew !== this.exf2stsold) {
        col6 = true;
      }
      else {
        col6 = false;
      }

      if (this.exfijannt2new !== this.exfijannt2old) {
        col7 = true;
      }
      else {
        col7 = false;
      }

      if (this.exf3new !== this.exf3old) {
        col8 = true;
      }
      else {
        col8 = false;
      }

      if (this.exf3stsnew !== this.exf3stsold) {
        col9 = true;
      }
      else {
        col9 = false;
      }

      if (this.exfijannt3new !== this.exfijannt3old) {
        col10 = true;
      }
      else {
        col10 = false;
      }


      if (col1 || col2 || col3 || col4 || col5 || col6 || col7 || col8 || col9 || col10) {
        this.isModified = true;
      }
      else {
        this.isModified = false;
      }
    }

    //#IIEXF
    if (this.iiexfLoadForm === true) {
      let col1 = false;
      let col2 = false;
      let col3 = false;
      let col4 = false;
      let col5 = false;
      let col6 = false;
      let col7 = false;
      let col8 = false;
      let col9 = false;
      let col10 = false;

      if (this.validateDate(value.exf1_date) === true) {
        value.exf1_date = value.exf1_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.exf1_date)) !== -1) {
          value.exf1_date = null;
        } else {
          value.exf1_date = this.parserFormatter.format(value.exf1_date);
        }
      }

      if (value.exf1_sts === "") {
        value.exf1_sts = null;
      } else {
        value.exf1_sts = value.exf1_sts;
      }

      if (this.validateDate(value.exf1_annc_date) === true) {
        value.exf1_annc_date = value.exf1_annc_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.exf1_annc_date)) !== -1) {
          value.exf1_annc_date = null;
        } else {
          value.exf1_annc_date = this.parserFormatter.format(value.exf1_annc_date);
        }
      }

      if (this.validateDate(value.exf2_date) === true) {
        value.exf2_date = value.exf2_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.exf2_date)) !== -1) {
          value.exf2_date = null;
        } else {
          value.exf2_date = this.parserFormatter.format(value.exf2_date);
        }
      }

      if (value.exf2_sts === "") {
        value.exf2_sts = null;
      } else {
        value.exf2_sts = value.exf2_sts;
      }

      if (this.validateDate(value.exf2_annc_date) === true) {
        value.exf2_annc_date = value.exf2_annc_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.exf2_annc_date)) !== -1) {
          value.exf2_annc_date = null;
        } else {
          value.exf2_annc_date = this.parserFormatter.format(value.exf2_annc_date);
        }
      }

      if (this.validateDate(value.exf3_date) === true) {
        value.exf3_date = value.exf3_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.exf3_date)) !== -1) {
          value.exf3_date = null;
        } else {
          value.exf3_date = this.parserFormatter.format(value.exf3_date);
        }
      }

      if (value.exf3_sts === "") {
        value.exf3_sts = null;
      } else {
        value.exf3_sts = value.exf3_sts;
      }

      if (this.validateDate(value.exf3_annc_date) === true) {
        value.exf3_annc_date = value.exf3_annc_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.exf3_annc_date)) !== -1) {
          value.exf3_annc_date = null;
        } else {
          value.exf3_annc_date = this.parserFormatter.format(value.exf3_annc_date);
        }
      }

      if (value.del_sts === "") {
        value.del_sts = null;
      } else {
        value.del_sts = value.del_sts;
      }

      this.delstsnew = value.del_sts;
      this.delstsold = this.updateNewTabs[0].del_sts;
      this.exf1new = this.datePipe.transform(value.exf1_date, 'yyyy-MM-dd');
      this.exf1old = this.datePipe.transform(this.updateNewTabs[0].exf1_date, 'yyyy-MM-dd');
      this.exf1stsnew = value.exf1_sts;
      this.exf1stsold = this.updateNewTabs[0].exf1_sts;
      this.exfijannt1new = this.datePipe.transform(value.exf1_annc_date, 'yyyy-MM-dd');
      this.exfijannt1old = this.datePipe.transform(this.updateNewTabs[0].exf1_annc_date, 'yyyy-MM-dd');
      this.exf2new = this.datePipe.transform(value.exf2_date, 'yyyy-MM-dd');
      this.exf2old = this.datePipe.transform(this.updateNewTabs[0].exf2_date, 'yyyy-MM-dd');
      this.exf2stsnew = value.exf2_sts;
      this.exf2stsold = this.updateNewTabs[0].exf2_sts;
      this.exfijannt2new = this.datePipe.transform(value.exf2_annc_date, 'yyyy-MM-dd');
      this.exfijannt2old = this.datePipe.transform(this.updateNewTabs[0].exf2_annc_date, 'yyyy-MM-dd');
      this.exf3new = this.datePipe.transform(value.exf3_date, 'yyyy-MM-dd');
      this.exf3old = this.datePipe.transform(this.updateNewTabs[0].exf3_date, 'yyyy-MM-dd');
      this.exf3stsnew = value.exf3_sts;
      this.exf3stsold = this.updateNewTabs[0].exf3_sts;
      this.exfijannt3new = this.datePipe.transform(value.exf3_annc_date, 'yyyy-MM-dd');
      this.exfijannt3old = this.datePipe.transform(this.updateNewTabs[0].exf3_annc_date, 'yyyy-MM-dd');

      if (this.delstsnew !== this.delstsold) {
        col1 = true;
      }
      else {
        col1 = false;
      }

      if (this.exf1new !== this.exf1old) {
        col2 = true;
      }
      else {
        col2 = false;
      }

      if (this.exf1stsnew !== this.exf1stsold) {
        col3 = true;
      }
      else {
        col3 = false;
      }

      if (this.exfijannt1new !== this.exfijannt1old) {
        col4 = true;
      }
      else {
        col4 = false;
      }

      if (this.exf2new !== this.exf2old) {
        col5 = true;
      }
      else {
        col5 = false;
      }

      if (this.exf2stsnew !== this.exf2stsold) {
        col6 = true;
      }
      else {
        col6 = false;
      }

      if (this.exfijannt2new !== this.exfijannt2old) {
        col7 = true;
      }
      else {
        col7 = false;
      }

      if (this.exf3new !== this.exf3old) {
        col8 = true;
      }
      else {
        col8 = false;
      }

      if (this.exf3stsnew !== this.exf3stsold) {
        col9 = true;
      }
      else {
        col9 = false;
      }

      if (this.exfijannt3new !== this.exfijannt3old) {
        col10 = true;
      }
      else {
        col10 = false;
      }



      if (col1 || col2 || col3 || col4 || col5 || col6 || col7 || col8 || col9 || col10) {
        this.isModified = true;
      }
      else {
        this.isModified = false;
      }
    }

    //#BG
    if (this.bgLoadForm === true) {
      let col1 = false;
      let col2 = false;
      let col3 = false;
      let col4 = false;
      let col5 = false;
      let col6 = false;
      let col7 = false;
      let col8 = false;

      if (this.validateDate(value.abg_request_anct_date) === true) {
        value.abg_request_anct_date = value.abg_request_anct_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.abg_request_anct_date)) !== -1) {
          value.abg_request_anct_date = null;
        } else {
          value.abg_request_anct_date = this.parserFormatter.format(value.abg_request_anct_date);
        }
      }
      if (this.validateDate(value.abg_issuance_date) === true) {
        value.abg_issuance_date = value.abg_issuance_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.abg_issuance_date)) !== -1) {
          value.abg_issuance_date = null;
        } else {
          value.abg_issuance_date = this.parserFormatter.format(value.abg_issuance_date);
        }
      }
      if (this.validateDate(value.abg_final_submission_draft_date) === true) {
        value.abg_final_submission_draft_date = value.abg_final_submission_draft_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.abg_final_submission_draft_date)) !== -1) {
          value.abg_final_submission_draft_date = null;
        } else {
          value.abg_final_submission_draft_date = this.parserFormatter.format(value.abg_final_submission_draft_date);
        }
      }
      if (this.validateDate(value.abg_final_submission_bg_date) === true) {
        value.abg_final_submission_bg_date = value.abg_final_submission_bg_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.abg_final_submission_bg_date)) !== -1) {
          value.abg_final_submission_bg_date = null;
        } else {
          value.abg_final_submission_bg_date = this.parserFormatter.format(value.abg_final_submission_bg_date);
        }
      }

      if (this.validateDate(value.pbg_request_anct_date) === true) {
        value.pbg_request_anct_date = value.pbg_request_anct_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.pbg_request_anct_date)) !== -1) {
          value.pbg_request_anct_date = null;
        } else {
          value.pbg_request_anct_date = this.parserFormatter.format(value.pbg_request_anct_date);
        }
      }
      if (this.validateDate(value.pbg_issuance_date) === true) {
        value.pbg_issuance_date = value.pbg_issuance_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.pbg_issuance_date)) !== -1) {
          value.pbg_issuance_date = null;
        } else {
          value.pbg_issuance_date = this.parserFormatter.format(value.pbg_issuance_date);
        }
      }
      if (this.validateDate(value.pbg_final_submission_draft_date) === true) {
        value.pbg_final_submission_draft_date = value.pbg_final_submission_draft_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.pbg_final_submission_draft_date)) !== -1) {
          value.pbg_final_submission_draft_date = null;
        } else {
          value.pbg_final_submission_draft_date = this.parserFormatter.format(value.pbg_final_submission_draft_date);
        }
      }
      if (this.validateDate(value.pbg_final_submission_bg_date) === true) {
        value.pbg_final_submission_bg_date = value.pbg_final_submission_bg_date;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.pbg_final_submission_bg_date)) !== -1) {
          value.pbg_final_submission_bg_date = null;
        } else {
          value.pbg_final_submission_bg_date = this.parserFormatter.format(value.pbg_final_submission_bg_date);
        }
      }

      this.abg_request_anct_datenew = this.datePipe.transform(value.abg_request_anct_date, 'yyyy-MM-dd');
      this.abg_request_anct_dateold = this.datePipe.transform(this.updateNewTabs[0].abg_request_anct_date, 'yyyy-MM-dd');
      this.abg_issuance_datenew = this.datePipe.transform(value.abg_issuance_date, 'yyyy-MM-dd');
      this.abg_issuance_dateold = this.datePipe.transform(this.updateNewTabs[0].abg_issuance_date, 'yyyy-MM-dd');
      this.abg_final_submission_draft_datenew = this.datePipe.transform(value.abg_final_submission_draft_date, 'yyyy-MM-dd');
      this.abg_final_submission_draft_dateold = this.datePipe.transform(this.updateNewTabs[0].abg_final_submission_draft_date, 'yyyy-MM-dd');
      this.abg_final_submission_bg_datenew = this.datePipe.transform(value.abg_final_submission_bg_date, 'yyyy-MM-dd');
      this.abg_final_submission_bg_dateold = this.datePipe.transform(this.updateNewTabs[0].abg_final_submission_bg_date, 'yyyy-MM-dd');

      this.pbg_request_anct_datenew = this.datePipe.transform(value.pbg_request_anct_date, 'yyyy-MM-dd');
      this.pbg_request_anct_dateold = this.datePipe.transform(this.updateNewTabs[0].pbg_request_anct_date, 'yyyy-MM-dd');
      this.pbg_issuance_datenew = this.datePipe.transform(value.pbg_issuance_date, 'yyyy-MM-dd');
      this.pbg_issuance_dateold = this.datePipe.transform(this.updateNewTabs[0].pbg_issuance_date, 'yyyy-MM-dd');
      this.pbg_final_submission_draft_datenew = this.datePipe.transform(value.pbg_final_submission_draft_date, 'yyyy-MM-dd');
      this.pbg_final_submission_draft_dateold = this.datePipe.transform(this.updateNewTabs[0].pbg_final_submission_draft_date, 'yyyy-MM-dd');
      this.pbg_final_submission_bg_datenew = this.datePipe.transform(value.pbg_final_submission_bg_date, 'yyyy-MM-dd');
      this.pbg_final_submission_bg_dateold = this.datePipe.transform(this.updateNewTabs[0].pbg_final_submission_bg_date, 'yyyy-MM-dd');

      if (this.abg_request_anct_datenew !== this.abg_request_anct_dateold) {
        col1 = true;
      }
      else {
        col1 = false;
      }

      if (this.abg_issuance_datenew !== this.abg_issuance_dateold) {
        col2 = true;
      }
      else {
        col2 = false;
      }

      if (this.abg_final_submission_draft_datenew !== this.abg_final_submission_draft_dateold) {
        col3 = true;
      }
      else {
        col3 = false;
      }

      if (this.abg_final_submission_bg_datenew !== this.abg_final_submission_bg_dateold) {
        col4 = true;
      }
      else {
        col4 = false;
      }

      if (this.pbg_request_anct_datenew !== this.pbg_request_anct_dateold) {
        col5 = true;
      }
      else {
        col5 = false;
      }

      if (this.pbg_issuance_datenew !== this.pbg_issuance_dateold) {
        col6 = true;
      }
      else {
        col6 = false;
      }

      if (this.pbg_final_submission_draft_datenew !== this.pbg_final_submission_draft_dateold) {
        col7 = true;
      }
      else {
        col7 = false;
      }

      if (this.pbg_final_submission_bg_datenew !== this.pbg_final_submission_bg_dateold) {
        col8 = true;
      }
      else {
        col8 = false;
      }


      if (col1 || col2 || col3 || col4 || col5 || col6 || col7 || col8) {
        this.isModified = true;
      }
      else {
        this.isModified = false;
      }
    }

    //#INVEWB
    if (this.invewbLoadForm === true) {
      if (this.isAddOrUpdate == 'SAVE') {
        return;
      }
      else {
        let col1 = false;
        let col2 = false;
        let col3 = false;
        let col4 = false;
        let col5 = false;
        let col6 = false;
        let col7 = false;
        let col8 = false;
        let col9 = false;
        let col10 = false;
        let col11 = false;
        let col12 = false;

        if (this.validateDate(value.inv_request_anct_date) === true) {
          value.inv_request_anct_date = value.inv_request_anct_date;
        } else {
          if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.inv_request_anct_date)) !== -1) {
            value.inv_request_anct_date = null;
          } else {
            value.inv_request_anct_date = this.parserFormatter.format(value.inv_request_anct_date);
          }
        }
        if (this.validateDate(value.inv_issuance_date) === true) {
          value.inv_issuance_date = value.inv_issuance_date;
        } else {
          if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.inv_issuance_date)) !== -1) {
            value.inv_issuance_date = null;
          } else {
            value.inv_issuance_date = this.parserFormatter.format(value.inv_issuance_date);
          }
        }
        if (this.validateDate(value.ewb_issuance_date) === true) {
          value.ewb_issuance_date = value.ewb_issuance_date;
        } else {
          if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.ewb_issuance_date)) !== -1) {
            value.ewb_issuance_date = null;
          } else {
            value.ewb_issuance_date = this.parserFormatter.format(value.ewb_issuance_date);
          }
        }
        if (this.validateDate(value.dispatch_date) === true) {
          value.dispatch_date = value.dispatch_date;
        } else {
          if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.dispatch_date)) !== -1) {
            value.dispatch_date = null;
          } else {
            value.dispatch_date = this.parserFormatter.format(value.dispatch_date);
          }
        }

        if (value.transportation_method === "") {
          value.transportation_method = null;
        } else {
          value.transportation_method = value.transportation_method;
        }


        // loading old data;
        let old_inv_request_anct_date;
        let old_inv_issuance_date;
        let old_inv_no;
        let old_ewb_no;
        let old_ewb_issuance_date;
        let old_transportation_method;
        let old_dispatch_date;
        let old_dispatch_from_indent;
        let old_dispatch_from_origin;
        let old_dispatch_to_indent;
        let old_dispatch_to_destination;
        let old_machine_sn;
        for (let i of this.invoiceList) {
          if (this.indentId == i.id) {
            old_inv_request_anct_date = this.datePipe.transform(i.inv_request_anct_date, 'yyyy-MM-dd');
            old_inv_issuance_date = this.datePipe.transform(i.inv_issuance_date, 'yyyy-MM-dd');
            old_inv_no = i.inv_no;
            old_ewb_no = i.ewb_no;
            old_ewb_issuance_date = this.datePipe.transform(i.ewb_issuance_date, 'yyyy-MM-dd');
            old_transportation_method = i.transportation_method;
            old_dispatch_date = this.datePipe.transform(i.dispatch_date, 'yyyy-MM-dd');
            old_dispatch_from_indent = i.dispatch_from_indent;
            old_dispatch_from_origin = i.dispatch_from_origin;
            old_dispatch_to_indent = i.dispatch_to_indent;
            old_dispatch_to_destination = i.dispatch_to_destination;
            old_machine_sn = i.machine_sn;
            break;
          }
        }


        let new_inv_request_anct_date = this.datePipe.transform(value.inv_request_anct_date, 'yyyy-MM-dd');
        let new_inv_issuance_date = this.datePipe.transform(value.inv_issuance_date, 'yyyy-MM-dd');
        let new_inv_no = value.inv_no;
        if (new_inv_no != null) {
          if (new_inv_no.trim().length == 0) {
            new_inv_no = null;
          }
        }
        let new_ewb_no = value.ewb_no;
        if (new_ewb_no != null) {
          if (new_ewb_no.trim().length == 0) {
            new_ewb_no = null;
          }
        }
        let new_ewb_issuance_date = this.datePipe.transform(value.ewb_issuance_date, 'yyyy-MM-dd');
        let new_transportation_method = value.transportation_method;
        let new_dispatch_date = this.datePipe.transform(value.dispatch_date, 'yyyy-MM-dd');
        let new_dispatch_from_indent = value.dispatch_from_indent;
        if (new_dispatch_from_indent != null) {
          if (new_dispatch_from_indent.trim().length == 0) {
            new_dispatch_from_indent = null;
          }
        }
        let new_dispatch_from_origin = value.dispatch_from_origin;
        if (new_dispatch_from_origin != null) {
          if (new_dispatch_from_origin.trim().length == 0) {
            new_dispatch_from_origin = null;
          }
        }
        let new_dispatch_to_indent = value.dispatch_to_indent;
        if (new_dispatch_to_indent != null) {
          if (new_dispatch_to_indent.trim().length == 0) {
            new_dispatch_to_indent = null;
          }
        }
        let new_dispatch_to_destination = value.dispatch_to_destination;
        if (new_dispatch_to_destination != null) {
          if (new_dispatch_to_destination.trim().length == 0) {
            new_dispatch_to_destination = null;
          }
        }

        let new_machine_sn = value.machine_sn;
        if (new_machine_sn != null) {
          if (new_machine_sn.trim().length == 0) {
            new_machine_sn = null;
          }
        }

        if (new_inv_request_anct_date !== old_inv_request_anct_date) {
          col1 = true;
        }
        else {
          col1 = false;
        }

        if (new_inv_issuance_date !== old_inv_issuance_date) {
          col2 = true;
        }
        else {
          col2 = false;
        }

        if (new_inv_no !== old_inv_no) {
          col3 = true;
        }
        else {
          col3 = false;
        }

        if (new_ewb_no !== old_ewb_no) {
          col4 = true;
        }
        else {
          col4 = false;
        }

        if (new_ewb_issuance_date !== old_ewb_issuance_date) {
          col5 = true;
        }
        else {
          col5 = false;
        }

        if (new_transportation_method !== old_transportation_method) {
          col6 = true;
        }
        else {
          col6 = false;
        }

        if (new_dispatch_date !== old_dispatch_date) {
          col7 = true;
        }
        else {
          col7 = false;
        }

        if (new_dispatch_from_indent !== old_dispatch_from_indent) {
          col8 = true;
        }
        else {
          col8 = false;
        }

        if (new_dispatch_from_origin !== old_dispatch_from_origin) {
          col9 = true;
        }
        else {
          col9 = false;
        }

        if (new_dispatch_to_indent !== old_dispatch_to_indent) {
          col10 = true;
        }
        else {
          col10 = false;
        }

        if (new_dispatch_to_destination !== old_dispatch_to_destination) {
          col11 = true;
        }
        else {
          col11 = false;
        }

        if (new_machine_sn !== old_machine_sn) {
          col12 = true;
        }
        else {
          col12 = false;
        }

        if (col1 || col2 || col3 || col4 || col5 || col6 || col7 || col8 || col9 || col10 || col11 || col12) {
          this.isModified = true;
        }
        else {
          this.isModified = false;
        }
      }

      if (this.isLoadModal === false) {
        // this.updateAlertNothing();
      }
    }

    //#PMT
    if (this.pmtLoadForm === true) {

      if (this.isAddOrUpdate == 'SAVE') {
        return;
      }
      else {
        let col1 = false;
        let col2 = false;
        let col3 = false;
        let col4 = false;

        let old_pmt_status = this.paymentStatus;
        let old_payment_type = this.selectedPaymentTypeForUpdate;
        let old_payment_date;
        let old_payment_amount;
        let new_pmt_status;
        let new_payment_type;
        let new_payment_date;
        let new_payment_amount;



        if (value.pmt_sts === "") {
          value.pmt_sts = null;
        } else {
          value.pmt_sts = value.pmt_sts;
        }

        new_pmt_status = value.pmt_sts;

        for (let i of this.paymentList) {
          if (this.paymentId == i.id) {
            old_payment_date = this.datePipe.transform(i.payment_date, 'yyyy-MM-dd');;
            old_payment_amount = i.payment_amount;
            old_payment_type = i.payment_type;
          }
        }

        // checking old and new status
        if (old_pmt_status != new_pmt_status) {
          col1 = true;
        }
        else {
          col1 = false;
        }

        if (this.validateDate(value.payment_date) === true) {
          value.payment_date = value.payment_date;
        } else {
          if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.payment_date)) !== -1) {
            value.payment_date = null;
          } else {
            value.payment_date = this.parserFormatter.format(value.payment_date);
          }
        }
        new_payment_date = this.datePipe.transform(value.payment_date, 'yyyy-MM-dd');;
        new_payment_amount = value.payment_amount;
        new_payment_type = value.payment_type;
        if (new_payment_amount != null) {
          if (new_payment_amount.length == 0) {
            new_payment_amount = null;
          }
        }

        if (old_payment_date != new_payment_date) {
          col2 = true;
        }
        else {
          col2 = false;
        }

        // checking old and new adv_amount
        if (old_payment_amount != new_payment_amount) {
          col3 = true;
        }
        else {
          col3 = false;
        }


        if (old_payment_type != new_payment_type) {
          col4 = true;
        }
        else {
          col4 = false;
        }
        if (col1 || col2 || col3 || col4) {
          this.isModified = true;
          return;
        }
        else {
          this.isModified = false;
          return;
        }


      }
    }

    //#COM
    if (this.comLoadForm === true) {
      if (this.validateDate(value.com_month) === true) {
        value.com_month = value.com_month;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.com_month)) !== -1) {
          value.com_month = null;
        } else {
          value.com_month = this.parserFormatter.format(value.com_month);
        }
      }

      this.commonthnew = this.datePipe.transform(value.com_month, 'yyyy-MM-dd');
      this.commonthold = this.datePipe.transform(this.detaildatasource[0].com_month, 'yyyy-MM-dd');

      if (this.commonthnew !== this.commonthold) {
        this.isModified = true;
      }
      else {
        this.isModified = false;
      }
    }

    //#NXT AXN
    if (this.nactionLoadForm === true) {
      let col1 = false;
      let col2 = false;
      let col3 = false;

      if (this.validateDate(value.checked_on) === true) {
        value.checked_on = value.checked_on;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.checked_on)) !== -1) {
          value.checked_on = null;
        } else {
          value.checked_on = this.parserFormatter.format(value.checked_on);
        }
      }

      if (this.validateDate(value.next_check) === true) {
        value.next_check = value.next_check;
      } else {
        if (['undefined--', 'null', '', '0-00-00'].indexOf(this.parserFormatter.format(value.next_check)) !== -1) {
          value.next_check = null;
        } else {
          value.next_check = this.parserFormatter.format(value.next_check);
        }
      }

      this.chkonnew = this.datePipe.transform(value.checked_on, 'yyyy-MM-dd');
      this.chkonold = this.datePipe.transform(this.detaildatasource[0].checked_on, 'yyyy-MM-dd');
      this.nxtchknew = this.datePipe.transform(value.next_check, 'yyyy-MM-dd');
      this.nxtchkold = this.datePipe.transform(this.detaildatasource[0].next_check, 'yyyy-MM-dd');
      this.fornew = value.for_info;
      if (this.fornew != null) {
        if (this.fornew.trim().length == 0) {
          this.fornew = null;
        }
      }
      this.forold = this.detaildatasource[0].for_info;

      if (this.chkonnew !== this.chkonold) {
        col1 = true;
      }
      else {
        col1 = false;
      }

      if (this.nxtchknew !== this.nxtchkold) {
        col2 = true;
      }
      else {
        col2 = false;
      }

      if (this.fornew !== this.forold) {
        col3 = true;
      }
      else {
        col3 = false;
      }

      if (col1 || col2 || col3) {
        this.isModified = true;
      }
      else {
        this.isModified = false;
      }
    }

  }


  // when user want to move to next page.
  nextPage() {
    if (this.nextButtonDisabled()) {
      return;
    }
    this.startIndex = this.startIndex + this.onePageRow;
    if (this.endIndex + this.onePageRow < this.indents.length) {
      this.endIndex += this.onePageRow;
    }
    else {
      this.endIndex = this.endIndex + (this.indents.length - this.startIndex);
      this.endPageButtonDisabled = false;
    }
    this.selectedPage++;
    this.generatePageListButtons();
  }

  // check if next button should be disabled or not.
  nextButtonDisabled() {
    if (this.endIndex >= this.indents.length - 1) {
      return true;
    }
  }

  // when user want to move to previous page.
  prevPage() {
    if (this.prevButtonDisabled()) {
      return;
    }
    if (this.endIndex >= this.indents.length - 1) {
      this.endIndex = this.endIndex - (this.indents.length - this.startIndex);
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
    let totalIndents = this.indents.length;
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
      if (this.endIndex + this.onePageRow < this.indents.length) {
        this.endIndex += this.onePageRow;
      }
      else {
        this.endIndex = this.endIndex + (this.indents.length - this.startIndex);
        this.endPageButtonDisabled = false;
      }
    }
    this.generatePageListButtons()
  }

  // resetting pageList attributes or parameters.
  resetPageListButtonsParameters() {
    this.startIndex = 0;
    if (this.selectPagesForm.value.pages == 'ALL') {
      this.onePageRow = this.indents.length;
    }
    else {
      this.onePageRow = +this.selectPagesForm.value.pages;
    }
    if (this.onePageRow >= this.indents.length - 1) {
      this.endIndex = this.indents.length - 1;
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

  changeOnePageRow() {
    this.resetPageListButtonsParameters();
  }

  setSelectPageList() {
    let totalIndents = this.indents.length;
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

  resetMainDataScreenOnInput() {
    this.mainDataFlag = false;
    this.mainTitleFlag = true;
    this.resetAllBtnSelect();
    this.resetAllLoadFormDetail();
    this.selectedIndent = "";
    if (this.groupedButtonEnabled && this.indentType == "GROUPED") {
      return false;
    }
    this.filterIndentUsingInvoice();
  }

  showSwalMssgForSameInvoice(value) {
    Swal.fire({
      title: 'Invoice number already exist in some indent',
      text: 'Do you want to continue?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
      cancelButtonText: `Details`,
      confirmButtonColor: '#282E89',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.AddorUpdateINVData(value);
      }
      else if (result.isDenied) {
        // do nothing and this will close the popup
      }
      else if (result.isDismissed) {
        this.formValue = value;
        this.openIndentDetailModal.nativeElement.click();
      }
    })
  }


  openDialogForError(titleMessage, textMessage, icontext) {
    Swal.fire({
      icon: icontext,
      title: titleMessage,
      text: textMessage,
      showConfirmButton: true,
      confirmButtonColor: '#282E89',
      allowOutsideClick: false,
    })

  }


  setReferenceData() {
    let paymentType = this.pmtFormGroup.value.payment_type;
    if (paymentType == 'ADV') {
      this.pmt_type_detail = this.indentDetails.adv_type.value;
      this.pmt_percent_detal = this.indentDetails.adv_pc.value;
      this.pmt_amount_detail = this.indentDetails.adv_amount.value;
      return;
    }
    if (paymentType == 'BSH') {
      this.pmt_type_detail = this.indentDetails.bsh_type.value;
      this.pmt_percent_detal = this.indentDetails.bsh_pc.value;
      this.pmt_amount_detail = this.indentDetails.bsh_amount.value;
      return;
    }
    if (paymentType == 'ASH') {
      this.pmt_type_detail = this.indentDetails.ash_type.value;
      this.pmt_percent_detal = this.indentDetails.ash_pc.value;
      this.pmt_amount_detail = this.indentDetails.ash_amount.value;
      return;
    }
    if (paymentType == 'SGST') {
      this.pmt_type_detail = '';
      this.pmt_percent_detal = this.indentDetails.sgst_pc.value;
      this.pmt_amount_detail = this.indentDetails.sgst_amount.value;
      return;
    }
    if (paymentType == 'CGST') {
      this.pmt_type_detail = '';
      this.pmt_percent_detal = this.indentDetails.cgst_pc.value;
      this.pmt_amount_detail = this.indentDetails.cgst_amount.value;
      return;
    }
    if (paymentType == 'IGST') {
      this.pmt_type_detail = '';
      this.pmt_percent_detal = this.indentDetails.igst_pc.value;
      this.pmt_amount_detail = this.indentDetails.igst_amount.value;
      return;
    }
    if (paymentType == 'P&F') {
      this.pmt_type_detail = '';
      this.pmt_percent_detal = '';
      this.pmt_amount_detail = this.indentDetails.pck_and_fwd_amnt.value;
      return;
    }
    if (paymentType == 'FRT') {
      this.pmt_type_detail = '';
      this.pmt_percent_detal = '';
      this.pmt_amount_detail = this.indentDetails.domestic_freight_amnt.value;
      return;
    }
    if (paymentType == 'INST/COM') {
      this.pmt_type_detail = '';
      this.pmt_percent_detal = '';
      this.pmt_amount_detail = this.indentDetails.inst_com_amnt.value;
      return;
    }
    this.pmt_type_detail = '';
    this.pmt_percent_detal = '';
    this.pmt_amount_detail = '';
  }

  isValidForm() {
    if (this.pmtFormGroup.valid) {
      if (this.pmtFormGroup.value.payment_date == null && (this.pmtFormGroup.value.payment_amount != null && this.pmtFormGroup.value.payment_amount != "")) {
        return false;
      }
      if ((this.pmtFormGroup.value.payment_amount == null || this.pmtFormGroup.value.payment_amount == "") && this.pmtFormGroup.value.payment_date != null) {
        return false;
      }
      return true;
    }
    return false;
  }

  getADVTotal(): number {
    let total = 0;
    for (let data of this.paymentList) {
      if (data.payment_type == 'ADV') {
        if (['undefined--', 'null', '', null].indexOf(data.payment_amount) === -1) {
          total = total + Number(data.payment_amount);
        }
      }

    }
    return total;
  }

  getBSHTotal(): number {
    let total = 0;
    for (let data of this.paymentList) {
      if (data.payment_type == 'BSH') {
        if (['undefined--', 'null', '', null].indexOf(data.payment_amount) === -1) {
          total = total + Number(data.payment_amount);
        }
      }

    }
    return total;
  }

  getASHTotal(): number {
    let total = 0;
    for (let data of this.paymentList) {
      if (data.payment_type == 'ASH') {
        if (['undefined--', 'null', '', null].indexOf(data.payment_amount) === -1) {
          total = total + Number(data.payment_amount);
        }
      }

    }
    return total;
  }

  getBalance(num1, num2) {
    if (num1 == 'undefined' || num1 == 'null' || num1 == '' || num1 == null || num1 == 0) {
      return '';
    }
    if (!this.isNumber(num1)) {
      let y: number = +num1;
      if (isNaN(y)) {
        y = 0;
        return y;
      }
      return y - num2;

    }
    return num1 - num2;
  }

  isNumber(val): boolean { return typeof val === 'number'; }

  isMismatchData(num1, num2) {
    // if (num1 == 'undefined' || num1 == 'null' || num1 == '' || num1 == null || num1 == 0) {
    //   if (this.isNumber(num2)) {
    //     if (num2 > 0) {
    //       this.showMisMatchPopUp();
    //       return true;
    //     }
    //   }
    // }
    // return false;
  }

  showMisMatchPopUp() {
    if (this.misMatchedDataShown == false) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Data Mismatch!',
        text: 'Mismatched Default and Received Payment Data',
        allowOutsideClick: false,
        confirmButtonColor: '#282E89'
      })
      this.misMatchedDataShown = true;
    }
    return;
  }

  getDefaultOtherCharge(): number {
    let total = 0, other_charge = 0;
    let sp_total = this.getNumValueOfField(this.indentDetails.sp_total.value);
    let sgst = this.getNumValueOfField(this.indentDetails.sgst_amount.value);
    let cgst = this.getNumValueOfField(this.indentDetails.cgst_amount.value);
    let igst = this.getNumValueOfField(this.indentDetails.igst_amount.value);
    let pnf = this.getNumValueOfField(this.indentDetails.pck_and_fwd_amnt.value);
    let frt = this.getNumValueOfField(this.indentDetails.domestic_freight_amnt.value);
    let inst_com = this.getNumValueOfField(this.indentDetails.inst_com_amnt.value);
    total = sp_total + sgst + cgst + igst + pnf + frt + inst_com;

    let adv = this.getNumValueOfField(this.indentDetails.adv_amount.value);
    let bsh = this.getNumValueOfField(this.indentDetails.bsh_amount.value);
    let ash = this.getNumValueOfField(this.indentDetails.ash_amount.value);
    other_charge = total - (adv + bsh + ash);
    if (other_charge < 0) {
      other_charge = -1 * (other_charge);
    }
    return other_charge;
  }

  getReceivedOtherCharge(): number {
    let total = 0;
    for (let data of this.paymentList) {
      if (data.payment_type != 'ADV' && data.payment_type != 'BSH' && data.payment_type != 'ASH') {
        if (['undefined--', 'null', '', null].indexOf(data.payment_amount) === -1) {
          total = total + Number(data.payment_amount);
        }
      }
    }
    return total;
  }

  getBalanceOtherCharge(num1: number, num2: number): number {
    return num1 - num2;
  }

  getDefaultGrandTotal(): number {
    let total = 0;
    let sp_total = this.getNumValueOfField(this.indentDetails.sp_total.value);
    let sgst = this.getNumValueOfField(this.indentDetails.sgst_amount.value);
    let cgst = this.getNumValueOfField(this.indentDetails.cgst_amount.value);
    let igst = this.getNumValueOfField(this.indentDetails.igst_amount.value);
    let pnf = this.getNumValueOfField(this.indentDetails.pck_and_fwd_amnt.value);
    let frt = this.getNumValueOfField(this.indentDetails.domestic_freight_amnt.value);
    let inst_com = this.getNumValueOfField(this.indentDetails.inst_com_amnt.value);

    total = sp_total + sgst + cgst + igst + pnf + frt + inst_com;
    return total;
  }

  getReceivedGrandTotal(): number {
    let total = 0;
    for (let data of this.paymentList) {
      if (['undefined--', 'null', '', null].indexOf(data.payment_amount) === -1) {
        total = total + Number(data.payment_amount);
      }
    }
    return total;
  }

  getBalanceGrandTotal(num1: number, num2: number): number {
    return num1 - num2;
  }

  getNumValueOfField(value): number {
    if (value == 'undefined' || value == 'null' || value == '' || value == null || value == 0) {
      return 0;
    }
    else {
      let y: number = +value;
      if (isNaN(y)) {
        y = 0;
      }
      return y;
    }
  }


  // onChangeIndentTypeGetIndentList(){
  //   this.initIndentListFromDb();
  // }

  onClickGetAllIndentList() {
    this.ngxService.start();

    this.indentType = 'ALL';
    this.pageSelectButton(1);
    this.initIndentListFromDb();
    this.resettingFieldOnChangeIndentType();

    this.ngxService.stop();
  }

  onClickGetOpenIndentList() {
    this.ngxService.start();

    this.indentType = 'OPEN';
    this.pageSelectButton(1);
    this.initIndentListFromDb();
    this.resettingFieldOnChangeIndentType();

    this.ngxService.stop();
  }

  onClickGetClosedIndentList() {
    this.ngxService.start();

    this.indentType = 'CLOSED';
    this.pageSelectButton(1);
    this.initIndentListFromDb();
    this.resettingFieldOnChangeIndentType();

    this.ngxService.stop();
  }

  onClickGetCancelledIndentList() {
    this.ngxService.start();

    this.indentType = 'CANCELLED';
    this.pageSelectButton(1);
    this.initIndentListFromDb();
    this.resettingFieldOnChangeIndentType();

    this.ngxService.stop();
  }

  onClickGetGroupedIndentList() {
    this.ngxService.start();

    this.indentType = 'GROUPED';
    this.pageSelectButton(1);
    let customerPoNum = this.customerPoNO;
    this.getIndentListUsingPoNumber(customerPoNum);
    this.resettingFieldOnChangeIndentType();

    this.ngxService.stop();
  }

  resettingFieldOnChangeIndentType() {
    this.orderOfIndent = 'DESC';
    this.mainDataFlag = false;
    this.mainTitleFlag = true;
    this.resetAllBtnSelect();
    this.resetAllLoadFormDetail();
    this.selectedIndent = "";
    this.searchText = "";
    this.selectedFilter = 'indentNumber';
  }

  mouseEnterRow(id: number) {
    this.rowNumber = id;
    this.showRow = true;
  }

  mouseLeaveRow() {
    this.rowNumber = -1;
    this.showRow = false;
  }

  showHoverButtons(id: number) {
    if (this.rowNumber == -1 || this.showRow == false) {
      return false;
    }
    else if (this.rowNumber == id && this.showRow == true) {
      return true;
    }
    return false;
  }

  showInvoice(id: string) {
    for (let i of this.invoiceList) {
      // here indent_id value is replaced by id : its value has been changed in indentmgmt.component.html file but name 'indent_id' is used instead of 'id'
      if (id == i.id) {
        this.invoice.id = id;
        this.invoice.inv_request_anct_date = i.inv_request_anct_date;
        this.invoice.ewb_no = i.ewb_no;
        this.invoice.ewb_issuance_date = i.ewb_issuance_date;
        this.invoice.dispatch_date = i.dispatch_date;
        this.invoice.transportation_method = i.transportation_method;
        this.invoice.dispatch_from_indent = i.dispatch_from_indent;
        this.invoice.dispatch_to_indent = i.dispatch_to_indent;
        this.invoice.dispatch_from_origin = i.dispatch_from_origin;
        this.invoice.dispatch_to_destination = i.dispatch_to_destination;
        this.invoice.machine_sn = i.machine_sn;
        break;
      }
    }
  }

  resetInvoice() {
    this.invoice = {
      id: '',
      invoice_id: '',
      indent_sheet_num: '',
      inv_request_anct_date: '',
      inv_issuance_date: '',
      inv_no: '',
      ewb_no: '',
      ewb_issuance_date: '',
      transportation_method: '',
      dispatch_date: '',
      dispatch_from_indent: '',
      dispatch_from_origin: '',
      dispatch_to_indent: '',
      dispatch_to_destination: '',
      machine_sn: '',

      invoice_doc: '',
      ewb_doc: '',
      inv_doc_name: '',
      ewb_doc_name: '',
      email_sent: ''
    }
  }

  onChangeGetInvoiceFilterData() {
    if (this.groupedButtonEnabled) {
      return false;
    }
    if (this.selectedFilter == 'invoiceNumber') {
      let url = GlobalConstants.apiGetInvoiceFilterData;
      if (this.indentType == 'ALL') {
        url = url + "/ALL";
      }
      if (this.indentType == 'OPEN') {
        url = url + "/OPEN";

      }
      if (this.indentType == 'CLOSED') {
        url = url + "/CLOSED";

      }
      if (this.indentType == 'CANCELLED') {
        url = url + "/CANCELLED";

      }
      this.httpcon.get<InvoiceFilterDataType[]>(url)
        .subscribe(res => {
          this.invoiceFilterData = res;
          let len = this.invoiceFilterData.length;
          let i = 0;
          while (i < len) {
            if (this.isNotValid(this.invoiceFilterData[i].invoice_no1)) {
              this.invoiceFilterData[i].invoice_no1 = '';
            }
            if (this.isNotValid(this.invoiceFilterData[i].invoice_no2)) {
              this.invoiceFilterData[i].invoice_no2 = '';
            }
            if (this.isNotValid(this.invoiceFilterData[i].invoice_no3)) {
              this.invoiceFilterData[i].invoice_no3 = '';
            }
            if (this.isNotValid(this.invoiceFilterData[i].inv_no)) {
              this.invoiceFilterData[i].inv_no = '';
            }
            i++;
          }
        });
    }
    return;
  }

  filterIndentUsingInvoice() {
    this.filteredIndent = [];
    if (this.selectedFilter != 'invoiceNumber') {
      this.filteredIndent = this.indents;
      return;
    }
    let filterData = this.invoiceFilterData.filter(data => data.inv_no.toUpperCase().includes(this.searchText.toUpperCase()) ||
      data.invoice_no1.toUpperCase().includes(this.searchText.toUpperCase()) || data.invoice_no2.toUpperCase().includes(this.searchText.toUpperCase()) ||
      data.invoice_no3.toUpperCase().includes(this.searchText.toUpperCase()));

    for (let indent of this.indents) {
      for (let filterIndent of filterData) {
        if (indent.indent_sheet_num == filterIndent.indent_sheet_num) {
          this.filteredIndent.push(indent);
          break;
        }
      }
    }

  }

  isNotValid(value) {
    if (['undefined--', 'null', null, undefined].indexOf(value) !== -1) {
      return true;
    }
    return false;
  }

  changePmtToCancelIfRequired(indentSheetNum: string, newDelStatus: string, affectedRows: number, tabName: string) {
    if (this.oldDelStatus != newDelStatus && newDelStatus == 'D-9' && this.oldPmtStatus != 'P-9') {
      Swal.fire({
        title: 'Delivery Status Updated Successfully',
        html: `<p>OK: To update payment status automatically to P-9
        <br>NO: To update payment status manually.
        </p>`,
        showDenyButton: true,
        confirmButtonText: `OK`,
        denyButtonText: `NO`,
        confirmButtonColor: '#282E89',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          });

          const param = new HttpParams()
            .set('indent_sheet_num', indentSheetNum);

          const options = { headers };
          this.httpcon.post<any>(GlobalConstants.apiCancelPayment, param, options)
            .pipe(map(Response => {
              this.formUpdateStatus = Response;
              if (this.formUpdateStatus['affectedRows'] === 1) {
                this.openDialogAsperResponce(tabName + ' Data Updated Successfully', 'success');
                this.getIndDetailFromServer(indentSheetNum);
              } else {
                this.openDialogAsperResponce(tabName + ' Data Not Updated. Please Try Again', 'error');
              }
            }))
            .subscribe(() => { }, () => {
            });
        }
        else if (result.isDenied) {
          if (affectedRows === 1) {
            this.openDialogAsperResponce(tabName + ' Data Updated Successfully', 'success');
            this.getIndDetailFromServer(indentSheetNum);
          }
          else {
            this.openDialogAsperResponce(tabName + ' Data Not Updated. Please Try Again', 'error');
          }
        }
      })
    }
    else {
      if (affectedRows === 1) {
        this.openDialogAsperResponce(tabName + ' Data Updated Successfully', 'success');
        this.getIndDetailFromServer(indentSheetNum);
      } else {
        this.openDialogAsperResponce(tabName + ' Data Not Updated. Please Try Again', 'error');
      }
    }
  }




  // made new function just for IIEXF
  changePmtToCancelIfRequiredForIIEXF(indentSheetNum: string, newDelStatus: string, affectedRows: number, tabName: string, message: string) {
    if (this.oldDelStatus != newDelStatus && newDelStatus == 'D-9' && this.oldPmtStatus != 'P-9') {
      Swal.fire({
        title: 'Delivery Status Updated Successfully',
        html: `<p>OK: To update payment status automatically to P-9
        <br>NO: To update payment status manually.
        </p>`,
        showDenyButton: true,
        confirmButtonText: `OK`,
        denyButtonText: `NO`,
        confirmButtonColor: '#282E89',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          });

          const param = new HttpParams()
            .set('indent_sheet_num', indentSheetNum);

          const options = { headers };
          this.httpcon.post<any>(GlobalConstants.apiCancelPayment, param, options)
            .pipe(map(Response => {
              this.formUpdateStatus = Response;
              if (this.formUpdateStatus['affectedRows'] === 1) {
                this.openDialogAsperResponce(tabName + ' Data Updated Successfully', 'success');
                this.getIndDetailFromServer(indentSheetNum);
              } else {
                this.openDialogAsperResponce(tabName + ' Data Not Updated. Please Try Again', 'error');
              }
            }))
            .subscribe(() => { }, () => {
            });
        }
        else if (result.isDenied) {
          if (affectedRows === 1) {
            this.openDialogAsperResponce(tabName + ' Data Updated Successfully', 'success');
            this.getIndDetailFromServer(indentSheetNum);
          }
          else {
            this.openDialogAsperResponce(tabName + ' Data Not Updated. Please Try Again', 'error');
          }
        }
      })
    }
    else {
      if (message === "II-EXF Updated successfully and Email is sent too." && affectedRows === 1) {

        Swal.fire({
          icon: 'success',
          title: 'IIEXF Data Updated Successfully and Email is sent to the respective Sales Person.',
          showConfirmButton: true,
          confirmButtonColor: '#282E89',
          allowOutsideClick: false,
        })
        this.getIndDetailFromServer(indentSheetNum);

      } else if (message === "II-EXF Updated successfully and Email is sent too (with empty User Id)." && affectedRows === 1) {

        Swal.fire({
          icon: 'success',
          title: 'IIEXF Data Updated Successfully (with empty Sales_Id) and Email is sent to the selected emails .',
          showConfirmButton: true,
          confirmButtonColor: '#282E89',
          allowOutsideClick: false,
        })
        this.getIndDetailFromServer(indentSheetNum);

      }

      else if (affectedRows === 1) {
        this.openDialogAsperResponce(tabName + ' Data Updated Successfully', 'success');
        this.getIndDetailFromServer(indentSheetNum);
      }

      else {
        this.openDialogAsperResponce(tabName + ' Data Not Updated. Please Try Again', 'error');
      }
    }
  }


  // Docs implementations before submiting------

  checkDocs() {

    const ewbNo = this.invewbFormGroup.controls['ewb_no'].value;

    if (this.invAttachedFormFiles.length === 0) {

      this.openDialogAsperResponce("Please attach Invoice Bill.", 'warning');

      return;
    }

    if (ewbNo && this.ewbAttachedFormFiles.length === 0) {

      this.openDialogAsperResponce("Please attach E-Way Bill.", 'warning');

      return;
    } else if (!ewbNo && this.ewbAttachedFormFiles.length > 0) {
      this.openDialogAsperResponce("Please enter E-Way Bill Number.", 'warning');
      return;
    }

    this.openPreviewFlag = true;
    this.selectedFileFlag = true;
    this.verifiedAttachments = false;

    this.loadSelectedPdf('INV');
    this.loadSelectedPdf('EWB');

  }

  //attachment implementations

  // changing file in document viewer
  onFilesSelected(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {

      const file = input.files[0];

      if (!this.validateFileType(file)) {
        input.value = '';
        return;
      }
      if (!this.checkFileSize(file)) {
        input.value = ''; // Reset selection if too big
        return;
      }

      this.isModified = true;
      this.addFileData = Array.from(input.files);

      if (type === 'INV') {

        this.invAttachedFormFiles = this.addFileData;
        this.invFileNamesTooltip = this.invAttachedFormFiles.map(f => f.name);

        this.loadSelectedPdf('INV');

      } else if (type === "EWB") {
        this.ewbAttachedFormFiles = this.addFileData;
        this.ewbFileNamesTooltip = this.ewbAttachedFormFiles.map(f => f.name);

        this.loadSelectedPdf('EWB');
      }
    }
  }

  //deletion of files
  deleteFile(index: number, type: string): void {

    if (type == "INV") {
      this.invFileInput.nativeElement.value = '';
      this.invformFileInput.nativeElement.value = '';
      this.fileThumbnail.splice(index, 1);
      this.pdfBlobUrls.splice(index, 1);
      this.pdffiles.splice(index, 1);
      this.invAttachedFormFiles.splice(index, 1);
      this.invFileNamesTooltip = this.invAttachedFormFiles.map(f => f.name);

      // If no files left, clear everything
      if (this.invAttachedFormFiles.length === 0) {
        this.verifiedAttachments = false;
        this.selectedFileUrl = null;
        this.currentFileIndex = 0;
        return;
      }

    } else if (type == "EWB") {
      this.ewbFileInput.nativeElement.value = '';
      this.ewbformFileInput.nativeElement.value = '';
      this.ewbFileThumbnail.splice(index, 1);
      this.ewbPdfBlobUrls.splice(index, 1);
      this.ewbPdffiles.splice(index, 1);
      this.ewbAttachedFormFiles.splice(index, 1);
      this.ewbFileNamesTooltip = this.ewbAttachedFormFiles.map(f => f.name);

      // If no files left, clear everything
      if (this.ewbAttachedFormFiles.length === 0) {
        this.verifiedAttachments = false;
        this.selectedFileUrl = null;
        this.currentFileIndex = 0;
        return;
      }

    }
  }

  // process to load thumbnail and urls of selected files
  loadSelectedPdf(type: string): void {

    if (type === "INV") {
      this.invAttachedFormFiles.forEach((file: File, index: number) => {
        const fileType = file.type;

        if (fileType === 'application/pdf') {
          const reader = new FileReader();

          reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const blob = new Blob([arrayBuffer], { type: fileType });
            const objectUrl = URL.createObjectURL(blob);

            this.pdfBlobUrls[index] = objectUrl;
            this.pdffiles[index] = blob;

            this.generatePdfThumbnail(blob).then((pdfThumbnail) => {
              this.fileThumbnail[index] = pdfThumbnail!;
            }).catch((error) => {
              console.error('Error generating PDF thumbnail:', error);
            });

            this.setCurrentPdf(0, 'INV'); // Show first doc
          };

          reader.readAsArrayBuffer(file);
        } else if (fileType.startsWith('image/')) {
          // Handle image file
          const objectUrl = URL.createObjectURL(file);
          this.pdfBlobUrls[index] = objectUrl;
          this.pdffiles[index] = file;

          this.generateImageThumbnail(file).then((imageThumb) => {
            this.fileThumbnail[index] = imageThumb!;
          }).catch((error) => {
            console.error('Error generating image thumbnail:', error);
          });

          this.setCurrentPdf(0, 'INV'); // Show first doc
        }
      });

    } else if (type === "EWB") {

      this.ewbAttachedFormFiles.forEach((file: File, index: number) => {
        const fileType = file.type;

        if (fileType === 'application/pdf') {
          const reader = new FileReader();

          reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const blob = new Blob([arrayBuffer], { type: fileType });
            const objectUrl = URL.createObjectURL(blob);

            this.ewbPdfBlobUrls[index] = objectUrl;
            this.ewbPdffiles[index] = blob;

            this.generatePdfThumbnail(blob).then((pdfThumbnail) => {
              this.ewbFileThumbnail[index] = pdfThumbnail!;
            }).catch((error) => {
              console.error('Error generating PDF thumbnail:', error);
            });

            this.setCurrentPdf(0, 'EWB'); // Show first doc
          };

          reader.readAsArrayBuffer(file);
        } else if (fileType.startsWith('image/')) {
          // Handle image file
          const objectUrl = URL.createObjectURL(file);
          this.ewbPdfBlobUrls[index] = objectUrl;
          this.ewbPdffiles[index] = file;

          this.generateImageThumbnail(file).then((imageThumb) => {
            this.ewbFileThumbnail[index] = imageThumb!;
          }).catch((error) => {
            console.error('Error generating image thumbnail:', error);
          });

          this.setCurrentPdf(0, 'EWB'); // Show first doc
        }
      });

    } else if (type === "Other") {

      this.otherSelectedFiles.forEach((file: File, index: number) => {
        const fileType = file.type;

        if (fileType === 'application/pdf') {
          const reader = new FileReader();

          reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const blob = new Blob([arrayBuffer], { type: fileType });
            const objectUrl = URL.createObjectURL(blob);

            this.otherPdfBlobUrls[index] = objectUrl;
            this.otherPdffiles[index] = blob;

            this.generatePdfThumbnail(blob).then((pdfThumbnail) => {
              this.otherFileThumbnail[index] = pdfThumbnail!;
            }).catch((error) => {
              console.error('Error generating PDF thumbnail:', error);
            });

            this.setCurrentPdf(0, 'Other'); // Show first doc
          };

          reader.readAsArrayBuffer(file);
        } else if (fileType.startsWith('image/')) {
          // Handle image file
          const objectUrl = URL.createObjectURL(file);
          this.otherPdfBlobUrls[index] = objectUrl;
          this.otherPdffiles[index] = file;

          this.generateImageThumbnail(file).then((imageThumb) => {
            this.otherFileThumbnail[index] = imageThumb!;
          }).catch((error) => {
            console.error('Error generating image thumbnail:', error);
          });

          this.setCurrentPdf(0, 'Other'); // Show first doc
        }
      });
    }
  }

  sanitizeUrl(blobUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  }

  private async generateImageThumbnail(file: File): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string); // Data URL
      };
      reader.onerror = () => {
        reject('Error reading image file');
      };
      reader.readAsDataURL(file);
    });
  }

  private async generatePdfThumbnail(file: Blob): Promise<string | null> {
    try {
      const pdfData = await file.arrayBuffer();
      const pdfDoc: PDFDocumentProxy = await pdfjsLib.getDocument({ data: pdfData }).promise;
      const page = await pdfDoc.getPage(1);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext('2d');

      if (!context) {
        console.error('Canvas context not available');
        return null;
      }

      await page.render({ canvasContext: context, viewport }).promise;
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating PDF thumbnail:', error);
      return null;
    }
  }

  //selecting files for INV and eWB
  onFormFilesSelected(event: Event, docType: string): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (!this.validateFileType(file)) {
      input.value = '';
      return;
    }

    if (!this.checkFileSize(file)) {
      input.value = '';
      return;
    }

    const newFiles = Array.from(input.files);

    if (this.isAddOrUpdate === 'UPDATE') {
      this.isModified = true;
    }

    if (docType === "INV") {

      this.verifiedAttachments = false;
      this.invAttachedFormFiles = newFiles;
      this.invFileNamesTooltip = this.invAttachedFormFiles.map(f => f.name);
    }
    if (docType === "EWB") {

      this.verifiedAttachments = false;
      this.ewbAttachedFormFiles = newFiles;
      this.ewbFileNamesTooltip = this.ewbAttachedFormFiles.map(f => f.name);
    }

  }

  // setting selected file to preview
  setCurrentPdf(index: number, type: string): void {

    this.resetZoom();

    if (type === "INV") {

      this.invEwbToggle = true;
      this.currentFileIndex = index;
      this.selectedFileUrl = this.pdfBlobUrls[index];

    } else if (type === "EWB") {

      this.invEwbToggle = false;
      this.currentFileIndex = index;
      this.selectedFileUrl = this.ewbPdfBlobUrls[index];

    } else if (type === "Other") {
      this.currentFileIndex = index;
      this.selectedFileUrl = this.otherPdfBlobUrls[index];
    }
  }

  // close single preview modal
  closePreviewModal() {
    this.openPreviewFlag = false;
    this.selectedFileFlag = false;
    this.otherDocFlag = false;
    this.previewFlag = false;
    this.pdfSrc = null;
    this.imageSrc = null;
    this.resetZoom();
  }

  //multiple preview zoom in
  insertZoomIn() {

    if (this.invAttachedFormFiles[this.currentFileIndex]?.type === 'application/pdf' && this.selectedFileUrl) {
      this.pdfZoomLevel += 0.1;
    } else {
      this.zoomLevel += 0.1;
    }

    if (this.ewbAttachedFormFiles[this.currentFileIndex]?.type === 'application/pdf' && this.selectedFileUrl) {
      this.pdfZoomLevel += 0.1;
    } else {
      this.zoomLevel += 0.1;
    }

    if (this.otherSelectedFiles[this.currentFileIndex]?.type === 'application/pdf' && this.selectedFileUrl) {
      this.pdfZoomLevel += 0.1;
    } else {
      this.zoomLevel += 0.1;
    }
  }

  //multiple preview zoom out
  insertZoomOut() {

    if (this.invAttachedFormFiles[this.currentFileIndex]?.type === 'application/pdf' && this.selectedFileUrl) {
      this.pdfZoomLevel -= 0.1;
    } else {
      this.zoomLevel -= 0.1;
    }

    if (this.ewbAttachedFormFiles[this.currentFileIndex]?.type === 'application/pdf' && this.selectedFileUrl) {
      this.pdfZoomLevel -= 0.1;
    } else {
      this.zoomLevel -= 0.1;
    }

    if (this.otherSelectedFiles[this.currentFileIndex]?.type === 'application/pdf' && this.selectedFileUrl) {
      this.pdfZoomLevel -= 0.1;
    } else {
      this.zoomLevel -= 0.1;
    }
  }

  //reset zoom for both previews
  resetZoom() {
    this.zoomLevel = 1;
    this.pdfZoomLevel = 1;
  }

  //single preview zoom in 
  zoomIn(pdfFile, imageFile) {

    if (imageFile) {
      this.zoomLevel += 0.1;
    } else if (pdfFile) {
      this.pdfZoomLevel += 0.1;
    }
  }

  //single preview zoom out 
  zoomOut(pdfFile, imageFile) {

    if (imageFile && this.zoomLevel > 0.2) {
      this.zoomLevel -= 0.1;
    } else if (pdfFile && this.pdfZoomLevel > 0.2) {
      this.pdfZoomLevel -= 0.1;
    }
  }

  //open INV/eWB form modal
  openInvEwbModal() {
    this.invoiceModal = true;
    this.verifiedAttachments = false;
  }

  //close INV/eWB form modal
  closeInvEwbModal() {
    this.invoiceModal = false;
    this.invAttachedFormFiles = [];
    this.invFileNamesTooltip = [];
    this.ewbFileNamesTooltip = [];
    this.ewbAttachedFormFiles = [];

    this.fileThumbnail = [];
    this.pdfBlobUrls = [];
    this.pdffiles = [];

    this.ewbFileThumbnail = [];
    this.ewbPdfBlobUrls = [];
    this.ewbPdffiles = [];

  }

  // verfication of files and closing preview modal
  setVerfication() {
    this.verifiedAttachments = true;
    this.closePreviewModal();
  }

  async getDelSts() {

    const url = GlobalConstants.apiGetIndentDelSts + this.userSelIndNo;
    this.httpcon.get<any>(url).subscribe(res => {

      let delSts = res.map(d => d.del_sts);

      if (delSts == "D-4" || delSts == "D-5") {
        this.addButton = true;
      } else {
        this.addButton = false;
      }

    }, () => { });

  }

  //check file size should be under 16 MB
  checkFileSize(file: File): boolean {
    if (!file) return false;

    if (file.size > this.MAX_FILE_SIZE) {
      this.openDialogAsperResponce(
        `File is too large. Maximum allowed size is 16MB.`,
        'warning'
      );
      return false;
    }
    return true;
  }

  //single file preview process
  showSelectedfile(id, type: string) {

    if (type === "INV") {

      this.fileType = type;
      this.filedoc = this.invoiceList.filter(data => data.invoice_id === id);

      const base64Str = this.filedoc[0]?.invoice_doc;
      const fileName = this.filedoc[0]?.inv_doc_name;

      this.setPdfOrImageFromBase64(base64Str, fileName);

      this.previewFlag = true;

    } else if (type === "eWB") {

      this.fileType = type;
      this.filedoc = this.invoiceList.filter(data => data.invoice_id === id);

      const base64Str = this.filedoc[0]?.ewb_doc;
      const fileName = this.filedoc[0]?.ewb_doc_name;

      this.setPdfOrImageFromBase64(base64Str, fileName);

      this.previewFlag = true;

    } else if (type === "Other") {

      this.fileType = "Doc";
      this.filedoc = this.otherFiles.filter(data => data.indent_doc_id === id);

      const base64Str = this.filedoc[0]?.document;
      const fileName = this.filedoc[0]?.doc_name;

      this.setPdfOrImageFromBase64(base64Str, fileName);

      this.previewFlag = true;

    } else if (type === "Image") {

      this.fileType = "Other";
      this.filedoc = this.otherFiles.filter(data => data.indent_img_id === id);

      const base64Str = this.filedoc[0]?.image;
      const fileName = this.filedoc[0]?.image_name;

      this.setPdfOrImageFromBase64(base64Str, fileName);

      this.previewFlag = true;

    } else if (type === "INV2") {

      this.fileType = 'INV';

      this.filedoc = this.invFiles.filter(data => data.id === id);

      const base64Str = this.filedoc[0]?.invoice_doc;
      const fileName = this.filedoc[0]?.inv_doc_name;

      this.setPdfOrImageFromBase64(base64Str, fileName);

      this.previewFlag = true;

    } else if (type === "eWB2") {

      this.fileType = 'eWB';

      this.filedoc = this.ewbFiles.filter(data => data.id === id);

      const base64Str = this.filedoc[0]?.ewb_doc;
      const fileName = this.filedoc[0]?.ewb_doc_name;

      this.setPdfOrImageFromBase64(base64Str, fileName);

      this.previewFlag = true;
    }
  }

  //single file preview url maker
  setPdfOrImageFromBase64(base64Str: string, fileName: string) {
    if (!base64Str || !fileName) {
      this.pdfSrc = null;
      this.imageSrc = null;
      return;
    }

    const fileExt = fileName.split('.').pop()?.toLowerCase();

    let mimeType = '';
    if (fileExt === 'pdf') {
      mimeType = 'application/pdf';
    } else if (['jpg', 'jpeg'].includes(fileExt)) {
      mimeType = 'image/jpeg';
    } else if (fileExt === 'png') {
      mimeType = 'image/png';

    } else if (fileExt === 'xlsx') {
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if (fileExt === 'xls') {
      mimeType = 'application/vnd.ms-excel';
    } else if (fileExt === 'csv') {
      mimeType = 'text/csv';
    }

    else {
      mimeType = 'application/octet-stream';
    }

    const blob = this.base64ToBlob(base64Str, mimeType);
    const fileUrl = URL.createObjectURL(blob);

    if (fileExt === 'pdf') {
      this.pdfSrc = fileUrl;
      this.imageSrc = null;
      this.excelDwnld = null;
    } else if (['jpg', 'jpeg', 'png'].includes(fileExt)) {
      this.imgDwnld = fileUrl;
      this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
      this.pdfSrc = null;
      this.excelDwnld = null;
    } else if (['xlsx', 'xls', 'csv'].includes(fileExt)) {
      this.excelDwnld = fileUrl;
      this.imageSrc = null;
      this.pdfSrc = null;
    } else {
      this.excelDwnld = null;
      this.pdfSrc = null;
      this.imageSrc = null;
    }
  }

  getMimeType(filename: string): string {
    if (!filename) {
      return;
    }

    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'application/pdf';
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      default: return 'application/octet-stream';
    }
  }

  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteChars = atob(base64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  // download file process
  downloadFile(id, type: string) {

    let base64Str = null;
    let fileName = null;

    if (type === "Other") {

      this.filedoc = this.otherFiles.filter(data => data.indent_doc_id === id)

      base64Str = this.filedoc[0]?.document;
      fileName = this.filedoc[0]?.doc_name;

      this.setPdfOrImageFromBase64(base64Str, fileName);
      this.downloadFileLink(fileName);

    } else if (type === "Image") {

      this.filedoc = this.otherFiles.filter(data => data.indent_img_id === id)

      base64Str = this.filedoc[0]?.image;
      fileName = this.filedoc[0]?.image_name;

      this.setPdfOrImageFromBase64(base64Str, fileName);
      this.downloadFileLink(fileName);

    } else if (type === "INV/eWB") {

      this.filedoc = this.invoiceList.filter(data => data.invoice_id === id);

      base64Str = this.filedoc[0]?.invoice_doc;
      fileName = this.filedoc[0]?.inv_doc_name;

      this.setPdfOrImageFromBase64(base64Str, fileName);
      this.downloadFileLink(fileName);


      base64Str = this.filedoc[0]?.ewb_doc;
      fileName = this.filedoc[0]?.ewb_doc_name;

      this.setPdfOrImageFromBase64(base64Str, fileName);

      this.downloadFileLink(fileName);

    } else if (type === "INV2") {

      this.filedoc = this.invFiles.filter(data => data.id === id)

      base64Str = this.filedoc[0]?.invoice_doc;
      fileName = this.filedoc[0]?.inv_doc_name;

      this.setPdfOrImageFromBase64(base64Str, fileName);
      this.downloadFileLink(fileName);

    } else if (type === "eWB2") {

      this.filedoc = this.ewbFiles.filter(data => data.id === id)

      base64Str = this.filedoc[0]?.ewb_doc;
      fileName = this.filedoc[0]?.ewb_doc_name;

      this.setPdfOrImageFromBase64(base64Str, fileName);
      this.downloadFileLink(fileName);

    }
  }

  // download link maker
  downloadFileLink(fileName) {

    if (this.pdfSrc && !this.imageSrc) {

      const link = document.createElement('a');
      link.href = this.pdfSrc;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(this.pdfSrc);

    } else if (!this.pdfSrc && this.imageSrc) {

      const link = document.createElement('a');
      link.href = this.imgDwnld;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(this.imgDwnld);

    } else if (this.excelDwnld) {
      const link = document.createElement('a');
      link.href = this.excelDwnld;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(this.excelDwnld);

    }
  }

  // validating file types
  validateFileType(file: File): boolean {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];

    if (!allowedTypes.includes(file.type)) {
      this.openDialogAsperResponce("Only PDF, Excel or image files (jpg, jpeg, png) are allowed.", 'warning');
      return false;
    }
    return true;
  }

  //get category list
  getCategoryList() {
    let url = GlobalConstants.apiGetCategoryList;
    return this.httpcon.get<any>(url)
      .subscribe(res => {
        this.categoryList = res.map(c => c.doc_category);
      });
  }

  //add row of other docs
  addRow(): void {
    this.rows.push(this.createRow());
    this.selectedFileNames.push('');
    this.otherSelectedFiles.push(new File([], ""));
    this.otherFileThumbnail.push('');
    this.otherPdfBlobUrls.push('');
    this.otherPdffiles.push(new File([], ""));
    this.loadSelectedPdf('Other');
  }

  //delete row of other docs
  deleteRow(): void {
    if (this.rows.length > 1) {
      this.rows.removeAt(this.rows.length - 1);
      this.selectedFileNames.pop();
      this.otherSelectedFiles.pop();
      this.otherFileThumbnail.pop();
      this.otherPdfBlobUrls.pop();
      this.otherPdffiles.pop();
      this.loadSelectedPdf('Other');
    }
  }

  // file selection of other docs
  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!this.validateFileType(file)) {
        input.value = '';
        return;
      }

      if (!this.checkFileSize(file)) {
        input.value = ''; // Reset selection if too big
        return;
      }
      this.rows.at(index).get('file')?.setValue(file);
      this.selectedFileNames[index] = file.name;
      this.otherSelectedFiles[index] = file;
    }
  }

  // close other doc side modal
  closeOtherDocModal() {
    if (this.imgFileInput?.nativeElement?.value) {
      this.imgFileInput.nativeElement.value = '';
    }
    this.indentFileImages = [];
    this.otherDocForm.reset();
    this.otherDocForm = this.fb.group({
      rows: this.fb.array([this.createRow()]),
    });

    this.selectedFileNames = [];
    this.otherSelectedFiles = [];
    this.otherFileThumbnail = [];
    this.otherPdfBlobUrls = [];
    this.otherPdffiles = [];
    this.category = 'All';

    this.filesSelection = false;
    this.selectedFiles = []
    this.selectAll = false;
    this.indeterminate = false;
    this.selectedFiles = [
      ...this.filteredFiles.filter(f => f.selected = false),
      ...this.filteredImgFiles.filter(f => f.selected = false),
      ...this.filteredInvFiles.filter(f => f.selected = false),
      ...this.filteredEwbFiles.filter(f => f.selected = false)
    ];

    this.otherDoc = false;
  }

  // preview other docs
  previewOtherDocs() {

    let rowsValue = this.rows.value || [];

    const allFilled = rowsValue.every(
      (row: any) => row?.category && row?.file
    );

    if (!allFilled) {
      this.rows.controls.forEach((row: any) => {
        row.get('category')?.markAsTouched();
        row.get('file')?.markAsTouched();
      });

      this.openDialogAsperResponce(
        "Please select category and their respective file.",
        'warning'
      );
      return;
    }

    if (this.otherSelectedFiles && this.otherSelectedFiles.length > 0) {
      this.loadSelectedPdf('Other');
      this.openPreviewFlag = true;
      this.otherDocFlag = true;
    } else {
      this.openDialogAsperResponce("Please select category and their respective file.", 'warning');
    }
  }

  //inserting other docs
  async submitOtherDocs() {

    let isValid = true;

    const formData = new FormData();
    this.rows.controls.forEach((row, i) => {

      const category = row.get('category')?.value;
      const file = row.get('file')?.value;

      if (!category || !file) {
        isValid = false;
        row.get('category')?.markAsTouched();
        row.get('file')?.markAsTouched();
      }

      formData.append(`category`, row.get('category')?.value);
      formData.append(`files`, row.get('file')?.value);
      formData.append('indent_sheet_num', this.userSelIndNo);
    });

    if (!isValid) {
      this.openDialogAsperResponce("Please select category and their respective file.", 'warning');
      return;
    }

    let msgtext = 'Do You Want To Upload all the Attached Files?';
    Swal.fire({
      icon: 'question',
      title: msgtext,
      showDenyButton: true,
      confirmButtonText: `YES`,
      denyButtonText: `NO`,
      confirmButtonColor: '#282E89',
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {

        return await this.httpcon.post<any>(GlobalConstants.apiInsertOtherFileData, formData)
          .pipe(map(Response => {
            this.formUpdateStatus = [];
            this.formUpdateStatus = Response;

            if (this.formUpdateStatus['affectedRows'] === 1) {
              this.openDialogAsperResponce('Doc File Data Saved Successfully', 'success');
              this.getOtherDocs();
              this.closeOtherDocModal();
            } else {
              let message = this.formUpdateStatus['message'];
              let title = "Doc File Data Not Added."
              this.openDialogForError(title, message, 'error');
            }

          }))
          .subscribe(() => { }, () => {
          });
      }
    })
  }


  // getting other docs
  getOtherDocs() {
    this.otherDocTab = true;
    this.indentImageTab = false;
    this.otherDoc = false;

    const url = GlobalConstants.apiGetIndentOtherFileData + this.userSelIndNo;
    this.httpcon.get<any[]>(url).subscribe(res => {

      this.otherFiles = res;
      this.imageFiles = this.otherFiles.filter(item => 'indent_img_id' in item);
      this.docFiles = this.otherFiles.filter(item => 'indent_doc_id' in item);

      this.filteredFiles = this.docFiles;
      this.filteredImgFiles = this.imageFiles;

      this.invNewbFiles = this.otherFiles.filter(item => 'id' in item);

      this.invFiles = this.invNewbFiles.filter(item => item.invoice_doc)
        .map(item => ({
          id: item.id,
          invoice_doc: item.invoice_doc,
          inv_doc_name: item.inv_doc_name
        }));

      this.filteredInvFiles = this.invFiles;

      this.ewbFiles = this.invNewbFiles.filter(item => item.ewb_doc)
        .map(item => ({
          id: item.id,
          ewb_doc: item.ewb_doc,
          ewb_doc_name: item.ewb_doc_name
        }));

      this.filteredEwbFiles = this.ewbFiles;

    }, () => { });

    this.category = 'All';
  }

  getImages() {
    const url = GlobalConstants.apiGetIndentOtherFileData + this.userSelIndNo;
    this.httpcon.get<any[]>(url).subscribe(res => {

      this.otherFiles = res;
      this.imageFiles = this.otherFiles.filter(item => 'indent_img_id' in item);
      this.docFiles = this.otherFiles.filter(item => 'indent_doc_id' in item);

      this.filteredFiles = this.docFiles;
      this.filteredImgFiles = this.imageFiles;

    }, () => { });

    this.category = 'All';
  }

  // to open image side modal
  indentImages() {
    this.getImages();
    this.otherDocTab = false;
    this.indentImageTab = true;
  }

  // delete other file
  deleteOtherFile(docId: string, type: string) {
    let msgtext = 'Do You Want To Delete?';
    Swal.fire({
      icon: 'question',
      title: msgtext,
      showDenyButton: true,
      confirmButtonText: `YES`,
      denyButtonText: `NO`,
      confirmButtonColor: '#282E89',
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {

        if (type === 'Other') {

          const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          });
          const options = { headers };
          let url = GlobalConstants.apiDeleteOtherFile;
          let param = new HttpParams();

          param = new HttpParams()
            .set('indent_doc_id', docId)
            .set('indent_sheet_num', this.userSelIndNo);

          return await this.httpcon.post<any>(url, param, options)
            .pipe(map(Response => {
              this.formUpdateStatus = [];
              this.formUpdateStatus = Response;

              if (this.formUpdateStatus['affectedRows'] === 1) {
                this.openDialogAsperResponce('File Deleted Successfully', 'success');
                this.getOtherDocs();
              } else {
                this.openDialogAsperResponce('File Not Deleted. Please Try Again', 'error');
              }
            }))
            .subscribe(() => { }, () => {
            });

        } else if (type === 'Image') {

          const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          });
          const options = { headers };
          let url = GlobalConstants.apiDeleteImageFile;
          let param = new HttpParams();

          param = new HttpParams()
            .set('indent_img_id', docId)
            .set('indent_sheet_num', this.userSelIndNo);

          return await this.httpcon.post<any>(url, param, options)
            .pipe(map(Response => {
              this.formUpdateStatus = [];
              this.formUpdateStatus = Response;

              if (this.formUpdateStatus['affectedRows'] === 1) {
                this.openDialogAsperResponce('File Deleted Successfully', 'success');
                this.getImages();
              } else {
                this.openDialogAsperResponce('File Not Deleted. Please Try Again', 'error');
              }
            }))
            .subscribe(() => { }, () => {
            });
        }
      }
    })
  }

  // other doc filter
  setFilter() {

    if (this.category != 'All' && this.category != 'Image' && this.category != 'INV' && this.category != 'eWB') {

      this.filteredFiles = this.docFiles.filter(file => file.category === this.category);
      this.filteredImgFiles = [];
      this.filteredInvFiles = [];
      this.filteredEwbFiles = [];

    } else if (this.category === 'Image') {

      this.filteredImgFiles = this.imageFiles;
      this.filteredFiles = [];
      this.filteredInvFiles = [];
      this.filteredEwbFiles = [];

    } else if (this.category === 'INV') {

      this.filteredInvFiles = this.invFiles;
      this.filteredFiles = [];
      this.filteredEwbFiles = [];
      this.filteredImgFiles = [];

    } else if (this.category === 'eWB') {

      this.filteredEwbFiles = this.ewbFiles;
      this.filteredFiles = [];
      this.filteredInvFiles = [];
      this.filteredImgFiles = [];

    } else {
      this.filteredFiles = this.docFiles;
      this.filteredImgFiles = this.imageFiles;
      this.filteredInvFiles = this.invFiles;
      this.filteredEwbFiles = this.ewbFiles;
    }
  }

  //selection of images
  onImageFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files: FileList = input.files;

    const validExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
    const validatedFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const isValidExtension = validExtensions.includes(fileExtension || '');

      if (!isValidExtension) {
        this.openDialogAsperResponce(`Allowed file types are ${validExtensions.join(', ')}.`, 'warning');
        input.value = '';
        return;
      }

      if (!this.checkFileSize(file)) {
        input.value = '';
        return;
      }
      validatedFiles.push(file);
    }
    this.indentFileImages = validatedFiles;
  }

  //insert indent images
  async submitIndentImages() {

    if (!this.indentFileImages || this.indentFileImages.length == 0) {
      this.openDialogAsperResponce("Select some files.", 'warning');
    } else {
      const formData = new FormData();

      this.indentFileImages.forEach((row, i) => {
        formData.append(`files`, this.indentFileImages[i]);
        formData.append('indent_sheet_num', this.userSelIndNo);
      });

      return await this.httpcon.post<any>(GlobalConstants.apiInsertImageFileData, formData)
        .pipe(map(Response => {
          this.formUpdateStatus = [];
          this.formUpdateStatus = Response;

          if (this.formUpdateStatus['affectedRows'] === 1) {
            this.openDialogAsperResponce('Other Files Data Saved Successfully', 'success');
            this.imgFileInput.nativeElement.value = '';
            this.getImages();
            this.closeOtherDocModal();
          } else {
            let message = this.formUpdateStatus['message'];
            let title = "Other Files Data Not Added."
            this.openDialogForError(title, message, 'error');
          }

        }))
        .subscribe(() => { }, () => {
        });
    }
  }


  downloadAllFiles() {
    const zip = new JSZip();

    this.imageFiles1 = this.selectedFiles.filter(item => 'indent_img_id' in item);
    this.docFiles1 = this.selectedFiles.filter(item => 'indent_doc_id' in item);

    this.invNewbFiles1 = this.selectedFiles.filter(item => 'id' in item);

    this.invFiles1 = this.invNewbFiles1.filter(item => item.invoice_doc)
      .map(item => ({
        id: item.id,
        invoice_doc: item.invoice_doc,
        inv_doc_name: item.inv_doc_name
      }));

    this.ewbFiles1 = this.invNewbFiles1.filter(item => item.ewb_doc)
      .map(item => ({
        id: item.id,
        ewb_doc: item.ewb_doc,
        ewb_doc_name: item.ewb_doc_name
      }));

    const usedNames = new Map<string, number>();

    this.imageFiles1.forEach(item => {
      let base64String = '';
      let fileName = '';
      let mimeType = '';

      if (item.image) {
        base64String = item.image;
        fileName = item.image_name;
      }

      const fileExt = fileName.split('.').pop()?.toLowerCase();

      if (fileExt === 'pdf') {
        mimeType = 'application/pdf';
      } else if (['jpg', 'jpeg'].includes(fileExt)) {
        mimeType = 'image/jpeg';
      } else if (fileExt === 'png') {
        mimeType = 'image/png';
      } else {
        mimeType = 'application/octet-stream';
      }

      const finalName = this.getUniqueFileName(fileName, usedNames);

      const blob = this.base64ToBlob1(base64String, mimeType);
      zip.file(finalName, blob);
    });

    this.docFiles1.forEach(item => {
      let base64String = '';
      let fileName = '';
      let mimeType = '';

      if (item.document) {
        base64String = item.document;
        fileName = item.doc_name;
      }

      const fileExt = fileName.split('.').pop()?.toLowerCase();

      if (fileExt === 'pdf') {
        mimeType = 'application/pdf';
      } else if (['jpg', 'jpeg'].includes(fileExt)) {
        mimeType = 'image/jpeg';
      } else if (fileExt === 'png') {
        mimeType = 'image/png';
      } else {
        mimeType = 'application/octet-stream';
      }

      const finalName = this.getUniqueFileName(fileName, usedNames);

      const blob = this.base64ToBlob1(base64String, mimeType);
      zip.file(finalName, blob);
    });

    this.invFiles1.forEach(item => {
      let base64String = '';
      let fileName = '';
      let mimeType = '';

      if (item.invoice_doc) {
        base64String = item.invoice_doc;
        fileName = item.inv_doc_name;
      }

      const fileExt = fileName.split('.').pop()?.toLowerCase();

      if (fileExt === 'pdf') {
        mimeType = 'application/pdf';
      } else if (['jpg', 'jpeg'].includes(fileExt)) {
        mimeType = 'image/jpeg';
      } else if (fileExt === 'png') {
        mimeType = 'image/png';
      } else {
        mimeType = 'application/octet-stream';
      }

      const finalName = this.getUniqueFileName(fileName, usedNames);

      const blob = this.base64ToBlob1(base64String, mimeType);
      zip.file(finalName, blob);
    });

    this.ewbFiles1.forEach(item => {
      let base64String = '';
      let fileName = '';
      let mimeType = '';

      if (item.ewb_doc) {
        base64String = item.ewb_doc;
        fileName = item.ewb_doc_name;
      }

      const fileExt = fileName.split('.').pop()?.toLowerCase();

      if (fileExt === 'pdf') {
        mimeType = 'application/pdf';
      } else if (['jpg', 'jpeg'].includes(fileExt)) {
        mimeType = 'image/jpeg';
      } else if (fileExt === 'png') {
        mimeType = 'image/png';
      } else {
        mimeType = 'application/octet-stream';
      }

      const finalName = this.getUniqueFileName(fileName, usedNames);

      const blob = this.base64ToBlob1(base64String, mimeType);
      zip.file(finalName, blob);
    });

    if (this.selectedFiles.length == 0) {
      this.openDialogAsperResponce("Please select any file to make zip file.", 'warning')
    } else {

      // Generate and download
      zip.generateAsync({ type: 'blob' }).then(content => {

        const now = new Date();
        const timestamp = now.getFullYear() + "-" +
          String(now.getMonth() + 1).padStart(2, '0') + "-" +
          String(now.getDate()).padStart(2, '0') + "_" +
          String(now.getHours()).padStart(2, '0') + "-" +
          String(now.getMinutes()).padStart(2, '0') + "-" +
          String(now.getSeconds()).padStart(2, '0');

        saveAs(content, `${this.userSelIndNo}_DOCS_${timestamp}.zip`);
      });
    }

  }


  getUniqueFileName(fileName: string, usedNames: Map<string, number>): string {
    const fileExt = fileName.split('.').pop()?.toLowerCase();
    const baseName = fileName.replace(/\.[^/.]+$/, "");

    let finalName = fileName;

    if (usedNames.has(finalName)) {
      let count = usedNames.get(finalName)!;
      let newName: string;
      do {
        count++;
        newName = `${baseName}(${count}).${fileExt}`;
      } while (usedNames.has(newName));
      finalName = newName;
      usedNames.set(fileName, count); // update count for the base name
    }

    usedNames.set(finalName, 0); // mark as used
    return finalName;
  }

  base64ToBlob1(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: contentType });
  }

  get allLists(): Array<Array<{ selected?: boolean }>> {
    return [
      this.filteredFiles || [],
      this.filteredImgFiles || [],
      this.filteredInvFiles || [],
      this.filteredEwbFiles || []
    ];
  }

  // Master toggle
  toggleAll(checked: boolean): void {
    this.allLists.forEach(list => list.forEach(item => (item.selected = checked)));
    this.selectAll = checked;
    this.indeterminate = false;

    this.selectedFiles = [
      ...this.filteredFiles.filter(f => f.selected),
      ...this.filteredImgFiles.filter(f => f.selected),
      ...this.filteredInvFiles.filter(f => f.selected),
      ...this.filteredEwbFiles.filter(f => f.selected)
    ];

  }

  //Check box selection of files
  onItemToggle(): void {
    const lists = this.allLists;

    const hasAny = lists.some(list => list.length > 0);

    const allSelected = lists.every(
      list => list.length === 0 || list.every(i => !!i.selected)
    );

    const noneSelected = lists.every(
      list => list.length === 0 || list.every(i => !i.selected)
    );

    this.selectAll = hasAny && allSelected;
    this.indeterminate = hasAny && !allSelected && !noneSelected;

    this.selectedFiles = [
      ...this.filteredFiles.filter(f => f.selected),
      ...this.filteredImgFiles.filter(f => f.selected),
      ...this.filteredInvFiles.filter(f => f.selected),
      ...this.filteredEwbFiles.filter(f => f.selected)
    ];
  }

  //Back function to Select Files to Zip
  backSelection() {
    this.filesSelection = !this.filesSelection;
    this.selectedFiles = []
    this.selectAll = false;
    this.indeterminate = false;

    this.selectedFiles = [
      ...this.filteredFiles.filter(f => f.selected = false),
      ...this.filteredImgFiles.filter(f => f.selected = false),
      ...this.filteredInvFiles.filter(f => f.selected = false),
      ...this.filteredEwbFiles.filter(f => f.selected = false)
    ];

  }

  // Open INV Email Modal
  sendEmailModal(id: string) {
    this.getRegionEmails();
    this.getEmailList();
    this.getsavedEmailData();
    this.invId = id;
  }


  // Getting region email data 
  async getRegionEmails() {

    let asyncResult = await this.Emailservice.getRegionEmailList().toPromise();

    this.regionEmailData = asyncResult;

    // create regions array with count of emails
    this.regions = this.regionEmailData.map(item => {
      return {
        region: item.region,
        emails: item.emails,
        emailCount: item.emails
          ? item.emails.split(',').filter(e => e.trim() !== '').length
          : 0
      };
    });
  }

  toggleRegionSelection(region: any) {
    if (this.selectedRegions.includes(region)) {
      this.selectedRegions = this.selectedRegions.filter(r => r !== region);
    } else {
      this.selectedRegions.push(region);
    }
  }

  // Getting email list 
  async getEmailList() {

    let asyncResult = await this.Emailservice.getEmailList().toPromise();

    this.registeredEmails = asyncResult;
    this.filterregisteredEmails = asyncResult;
  }


  // method for search bar
  globalSearchKeyUp() {
    if (this.searchEmailText.length === 0) {
      this.registeredEmails = this.filterregisteredEmails;
      return;
    }
    this.registeredEmails = this.filterregisteredEmails.filter(indent => {
      return Object.values(indent).some(value =>
        value && value.toString().toLowerCase().includes(this.searchEmailText.toString().trim().toLowerCase())
      );
    });
  }

  // Checkbox for Email Selection
  onEmailCheckboxChange(event: Event, email: string) {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      if (!this.selectedEmails.includes(email)) {
        this.selectedEmails.push(email);
      }
    } else {
      this.selectedEmails = this.selectedEmails.filter(e => e !== email);

      // Also unselect region if all its emails are unchecked
      this.selectedRegions = this.selectedRegions.filter(region => {
        const regionObj = this.regionEmailData.find(r => r.region === region);
        if (!regionObj || !regionObj.emails) return false;

        const regionEmails = regionObj.emails.split(',').map((e: string) => e.trim());
        return regionEmails.some(e => this.selectedEmails.includes(e));
      });
    }

  }

  // Getting email form data 
  async getsavedEmailData() {

    let asyncResult = await this.Emailservice.getEmailData("2").toPromise();
    this.emailFormData = asyncResult;

    this.subjectData = (this.emailFormData.map(item => item.subject)).toString();
    this.bodyData = (this.emailFormData.map(item => item.body)).toString();

    const bodyLength = this.bodyData.length;

    this.bodyNote = this.bodyData.substring(bodyLength - 60);
    this.bodyMsg = this.bodyData.substring(0, bodyLength - 60);
    this.eFlag = this.emailFormData[0].email_flag;

    if (this.eFlag === true) {
      this.sendEmailFlag = true;
      this.sendEmailMsg = "Send E-Mail";
    } else {
      this.sendEmailFlag = false;
      this.sendEmailMsg = "Ask Admin to Turn On the Inv Email Setting!";
    }
  }

  // Check box for Region selection
  onRegionCheckboxChange(event: Event, region: any) {
    const checkbox = event.target as HTMLInputElement;

    // Parse region emails into an array
    const regionEmails = region.emails
      ? region.emails.split(',').map((e: string) => e.trim())
      : [];

    if (checkbox.checked) {
      // Add region to selectedRegions
      if (!this.selectedRegions.includes(region.region)) {
        this.selectedRegions.push(region.region);
      }

      // Add emails (avoid duplicates)
      this.selectedEmails = Array.from(new Set([...this.selectedEmails, ...regionEmails]));

    } else {
      // Remove region from selectedRegions
      this.selectedRegions = this.selectedRegions.filter(r => r !== region.region);

      // Remove only that region’s emails (but keep emails from other selected regions)
      const emailsFromOtherRegions = this.regionEmailData
        .filter(r => this.selectedRegions.includes(r.region))
        .map(r => r.emails ? r.emails.split(',').map((e: string) => e.trim()) : [])
        .reduce((acc, val) => acc.concat(val), []);

      this.selectedEmails = this.selectedEmails.filter(email =>
        emailsFromOtherRegions.includes(email)
      );
    }

  }

  //save and send INVOICE Email
  saveAndSendInvEmail() {

    if (this.selectedEmails.length > 0 && this.subjectData) {

      let emailBody = this.bodyMsg + this.bodyNote;

      const emailRequest = { subject: this.subjectData, body: emailBody, emails: this.selectedEmails, invoiceId: this.invId };

      return this.httpcon.post<void>(`${GlobalConstants.apiSendInvMail}`, emailRequest).pipe(map(async Response => {

        var serverResponse = Response;
        let affectedRows = serverResponse["affectedRows"];
        let message = 'Failed to send Invoice Email.';

        if (affectedRows === 1) {

          this.openDialogAsperResponce("INV/eWB Email has been sent to Selected Employees.", 'success');
          this.closeInvEmailSender();
          this.btnSelectINVeWB();
        } else {
          this.openDialogAsperResponce(message, 'error');
          this.closeInvEmailSender();
        }
      })).subscribe();
    }
  }

  //close INVOICE Email Sender modal
  closeInvEmailSender() {

    this.selectedRegions = [];
    this.selectedEmails = [];
    this.bodyMsg = "";
    this.subjectData = "";
    this.searchEmailText = "";
  }

  //toggle function to Other doc and Main docs
  otherDocToggle() {
    this.otherDoc = !this.otherDoc;

    this.indentFileImages = [];
    this.otherDocForm.reset();
    this.otherDocForm = this.fb.group({
      rows: this.fb.array([this.createRow()]),
    });

    this.selectedFileNames = [];
    this.otherSelectedFiles = [];
    this.otherFileThumbnail = [];
    this.otherPdfBlobUrls = [];
    this.otherPdffiles = [];

    if (this.imgFileInput?.nativeElement?.value) {
      this.imgFileInput.nativeElement.value = '';
    }

  }


}
