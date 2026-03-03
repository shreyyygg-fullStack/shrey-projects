import { Component, OnInit, OnDestroy, NgModuleRef } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IndentData, DetailDialogDataSet, IndFilterCountA } from '../../shared/services/indentdb.type';
import { CommonServiceService } from '../../shared/services/common-service.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { NgbModalOptions, NgbModal, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from '../common/global-constants';

export interface IndentDetailSelect {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-details-template',
  templateUrl: './details-template.component.html',
  styleUrls: ['./details-template.component.css'],
  providers: [DatePipe]
})

export class DetailsTemplateComponent implements OnInit {
  indentSheetNumber: string;
  my_modal_title: string;
  my_modal_content: any;

  collapseExpandFlag = false;
  globalFlagColl;
  selectInfoCount;
  ysCount;
  dropDwTitle = 'PO DETAILS';
  chartFlag;
  tabtitlebtn;
  selectTypExpandNum = 0;
  blErrorChk;
  ysErrorChk;
  ipFilTitleText = '';

  titleFgFlag1 = true;
  titleFgFlag2 = true;

  colplistGroup = false;
  hidets = true;

  genLoadForm = false;

  listLoadForm = true;
  indents: IndentData[] = [];
  selectedIndent: IndentData[];
  filtcount: IndFilterCountA[] = [];
  filtYellocount: IndFilterCountA[] = [];

  currentValue: any;

  name;
  /* Card Display Signal */
  ySignal;
  snfSignal;
  apSignal;
  lcSignal;
  bpSignal;
  outSignal;
  pnsSignal;
  lcpSignal;
  pexfpSignal;
  fexfpSignal;
  sspSignal;
  sapSignal;
  /* End Card Display Signal */
  displayTitle = '';
  /* Ng if Form flag Init*/
  indentAllFormDetail = false;
  poDFlag = false;
  accountDFlag = false;
  paymentDFlag = false;
  thirdparDFlag = false;
  applicationDFlag = false;
  shpinstoneDFlag = false;
  shpinsttwoDFlag = false;
  indremarkDFlag = false;
  proformaDFlag = false;
  lcDFlag = false;
  exfactoryDFlag = false;
  shpadvDFlag = false;
  salesadDFlag = false;
  /* End Ng if flag Init*/

  /* Ng if filter to show list card flag */
  snfDropDwFlag = true;
  apDropDwFlag = true;
  lpDropDwFlag = true;
  bpDropDwFlag = true;
  outDropDwFlag = true;
  pnsDropDwFlag = true;
  lcpDropDwFlag = true;
  pexfpDropDwFlag = true;
  fexfpDropDwFlag = true;
  sspDropDwFlag = true;
  sapDropDwFlag = true;

  /* END Ng if filter drowpdown flag */

  /* Init Indent Details display List */
  dselectType: IndentDetailSelect[] = [
    { value: '1', viewValue: 'PO Details' },
    { value: '2', viewValue: 'Account Details' },
    { value: '3', viewValue: 'Payment Details' },
    { value: '4', viewValue: '3P Comm Details' },
    { value: '5', viewValue: 'Application Details' },
    { value: '6', viewValue: 'SHP Inst1 Details' },
    { value: '7', viewValue: 'SHP Inst2 Details' },
    { value: '8', viewValue: 'IND Remarks Details' },
    { value: '9', viewValue: 'PI Details' },
    { value: '10', viewValue: 'LC Details' },
    { value: '11', viewValue: 'EXF Details' },
    { value: '12', viewValue: 'SHP Adv Details' },
    { value: '13', viewValue: 'Sales Admin Details' },
  ];
  /* End Init Indent Details display List */

  /* Init Model */
  detaildatasource: DetailDialogDataSet[] = [];
  /* End Init Model */

  /* Detail Indent Init Data */
  indentsheetnum;
  sossummary;
  sales1id;
  indentissuedate;
  ordertype;
  sales1;
  crmoptnum;
  sales2id;
  sales2;
  customerponum;
  spcur;
  lptotal;
  customerpodate;
  sptotal;
  tpcur;
  tp1;
  tp2;
  pmttrms;
  iigm;
  pckandfwdamnt;
  domesticfreightamnt;
  instorcomamnt;
  sgstpc;
  sgstamount;
  cgstpc;
  cgstamount;
  igstpc;
  igstamount;
  contractacntname;
  cntrcode;
  cntraddress;
  cntrcountry;
  cntrgstcode;
  cntrtel;
  cntrcontactperson;
  cntremail;
  useracntname;
  uacode;
  uaaddress;
  uacountry;
  uagstcode;
  uatel;
  uacontactperson;
  uaemail;
  keyaccountflag;
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
  thirdpcomcur;
  thirdpcomamnt;
  thirdpcompaidby;
  comacntname;
  comcode;
  comaddress;
  comcountry;
  comgstcode;
  comtel;
  comcontactperson;
  comemail;
  csutomerapplicationcode;
  customerapplicationtype;
  customerappdesc;
  reqetdbycustomer;
  reqetdtoij;
  reqetabycustomer;
  reqetatoij;
  trdtrmswithcustomer;
  trdtrmswithij;
  destportbycustomer;
  destporttoij;
  mot;
  mottoij;
  freight1;
  freight2;
  coo;
  epa;
  ip;
  freedetentionperiod;
  consigneeacntname;
  cnscode;
  cnsaddress;
  cnscountry;
  cnsgstcode;
  cnscontactperson;
  cnstel;
  cnsemail;
  cnsieccode;
  banknameoncad;
  banktel;
  bankaddress;
  notifyacntname;
  ntfcode;
  ntfaddress;
  ntfcountry;
  ntfgstcode;
  ntfcontactperson;
  ntftel;
  ntfemail;
  ntfieccode;
  fobfowarder;
  productionstart;
  customerposheet;
  customerpi;
  customersrsheet;
  othlcdraft;
  othdrawing;
  othdoc1;
  othtestreport;
  othdoc2;
  remarks1;
  pino;
  pidate;
  iipono;
  iipodate;
  ijprjno;
  ocdate;
  sadate;
  lcchkdateij;
  lcopendate;
  lclastrevisiondate;
  latestshipmentdate;
  lcexpirydate;
  exf1;
  exf1sts;
  exfaccouncement1;
  exf2;
  exf2sts;
  exfaccouncement2;
  exf3;
  exf3sts;
  exfaccouncement3;
  invoiceno1;
  invoiceno2;
  invoiceno3;
  invoicedate1;
  invoicedate2;
  invoicedate3;
  etd1;
  etd2;
  etd3;
  eta1;
  eta2;
  eta3;
  mode1;
  mode2;
  mode3;
  from1;
  from2;
  from3;
  vessel1;
  vessel2;
  vessel3;
  awborblno1;
  awborblno2;
  awborblno3;
  ewaybillreq;
  ewaybillno;
  remarks2;
  commonth;
  checkedon;
  forinfo;
  nextcheck;
  pmtsts;
  delsts;
  /* End*/

  /* Chart test*/
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: number[] = [];
  public doughnutChartType = 'doughnut';
  /* end */

  /* bar chart */
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
  };

  public barChartLabels: Label[] = [];
  public barChartData: ChartDataSets[] = [];
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = true;
  public barChartColors: Color[] = [
    { backgroundColor: '#E6E6FA' },
    { backgroundColor: '#FFFF99' },
  ];

  /* end */
  modalOptions: NgbModalOptions;
  modalRef: NgbModalRef;
  ispopUpShow: boolean;

  constructor(private httpcon: HttpClient, public activeModal: NgbActiveModal, private datePipe: DatePipe, private router: Router) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop'
    }

  }

  ngOnInit() {
    this.onSelect(this.indentSheetNumber);
    GlobalConstants.globalNxtActIndNo = this.indentSheetNumber;
    this.getIndDetailFromServer(this.indentSheetNumber);
  }

  onSelect(indentlist) {
    this.selectedIndent = indentlist;
    this.hideDetailFlag();
    this.chartFlag = false;
    this.indentAllFormDetail = true;
    this.tabtitlebtn = 'PO DETAILS';
    this.dropDwTitle = 'PO DETAILS';
    this.poDFlag = true;
  }

  selectDetailValue(id) {
    switch (id) {
      case '1': {
        this.hideDetailFlag();
        this.tabtitlebtn = 'PO DETAILS';
        this.dropDwTitle = 'PO DETAILS';
        this.poDFlag = true;
        break;
      }
      case '2': {
        this.hideDetailFlag();
        this.tabtitlebtn = 'ACCOUNT DETAILS';
        this.dropDwTitle = 'ACCOUNT DETAILS';
        this.accountDFlag = true;
        break;
      }
      case '3': {
        this.hideDetailFlag();
        this.tabtitlebtn = 'PAYMENT DETAILS';
        this.dropDwTitle = 'PAYMENT DETAILS';
        this.paymentDFlag = true;
        break;
      }
      case '4': {
        this.hideDetailFlag();
        this.tabtitlebtn = '3P COM DETAILS';
        this.dropDwTitle = '3P COM DETAILS';
        this.thirdparDFlag = true;
        break;
      }
      case '5': {
        this.hideDetailFlag();
        this.tabtitlebtn = 'APPLICATION DETAILS';
        this.dropDwTitle = 'APPLICATION DETAILS';
        this.applicationDFlag = true;
        break;
      }
      case '6': {
        this.hideDetailFlag();
        this.tabtitlebtn = 'SHP INST1 DETAILS';
        this.dropDwTitle = 'SHP INST1 DETAILS';
        this.shpinstoneDFlag = true;
        break;
      }
      case '7': {
        this.hideDetailFlag();
        this.tabtitlebtn = 'SHP INST2 DETAILS';
        this.dropDwTitle = 'SHP INST2 DETAILS';
        this.shpinsttwoDFlag = true;
        break;
      }
      case '8': {
        this.hideDetailFlag();
        this.tabtitlebtn = 'IND REMARKS DETAILS';
        this.dropDwTitle = 'IND REMARKS DETAILS';
        this.indremarkDFlag = true;
        break;
      }
      case '9': {
        this.hideDetailFlag();
        this.tabtitlebtn = 'PI DETAILS';
        this.dropDwTitle = 'PI DETAILS';
        this.proformaDFlag = true;
        break;
      }
      case '10': {
        this.hideDetailFlag();
        this.tabtitlebtn = 'LC DETAILS';
        this.dropDwTitle = 'LC DETAILS';
        this.lcDFlag = true;
        break;
      }
      case '11': {
        this.hideDetailFlag();
        this.tabtitlebtn = 'EXF DETAILS';
        this.dropDwTitle = 'EXF DETAILS';
        this.exfactoryDFlag = true;
        break;
      }
      case '12': {
        this.hideDetailFlag();
        this.tabtitlebtn = 'SHP ADV DETAILS';
        this.dropDwTitle = 'SHP ADV DETAILS';
        this.shpadvDFlag = true;
        break;
      }
      case '13': {
        this.hideDetailFlag();
        this.tabtitlebtn = 'SALES ADMIN DETAILS';
        this.dropDwTitle = 'SALES ADMIN DETAILS';
        this.salesadDFlag = true;
        break;
      }
      default: {
        this.hideDetailFlag();
        this.tabtitlebtn = 'PO DETAILS';
        this.dropDwTitle = 'PO DETAILS';
        this.poDFlag = true;
        break;
      }
    }
  }

  hideDetailFlag() {
    this.accountDFlag = false;
    this.applicationDFlag = false;
    this.exfactoryDFlag = false;
    this.indremarkDFlag = false;
    this.lcDFlag = false;
    this.paymentDFlag = false;
    this.poDFlag = false;
    this.proformaDFlag = false;
    this.salesadDFlag = false;
    this.shpadvDFlag = false;
    this.shpinstoneDFlag = false;
    this.shpinsttwoDFlag = false;
    this.thirdparDFlag = false;
  }

  getIndDetailFromServer(indNum: string) {
    let urllink = GlobalConstants.apiIndentDetail + indNum;
    this.httpcon.get<DetailDialogDataSet[]>(urllink).subscribe(res => {
      if (res['data'] === '0' || res.length === undefined) {
      } else if (res['errorCode'] === '1') {
        // future log design
      } else {
        if (res.length !== null) {
          this.detaildatasource = res;
          this.indentAllFormDetail = true;
          this.indentsheetnum = this.detaildatasource[0].indent_sheet_num;
          this.sossummary = this.detaildatasource[0].sos_summary;
          this.sales1id = this.detaildatasource[0].sales1_id;
          this.indentissuedate = this.datePipe.transform(this.detaildatasource[0].indent_issue_date, 'yyyy-MM-dd');
          this.ordertype = this.detaildatasource[0].order_type;
          this.sales1 = this.detaildatasource[0].sales1_name;
          this.crmoptnum = this.detaildatasource[0].crm_opt_num;
          this.sales2id = this.detaildatasource[0].sales2_id;
          this.sales2 = this.detaildatasource[0].sales2_name;
          this.customerponum = this.detaildatasource[0].customer_po_num;
          this.spcur = this.detaildatasource[0].sp_cur;
          this.lptotal = this.detaildatasource[0].lp_total;
          this.customerpodate = this.datePipe.transform(this.detaildatasource[0].customer_po_date, 'yyyy-MM-dd');
          this.sptotal = this.detaildatasource[0].sp_total;
          this.tpcur = this.detaildatasource[0].tp_cur;
          this.tp1 = this.detaildatasource[0].tp1;
          this.tp2 = this.detaildatasource[0].tp2;
          this.pmttrms = this.detaildatasource[0].pmt_trms;
          this.iigm = this.detaildatasource[0].iigm;
          this.pckandfwdamnt = this.detaildatasource[0].pck_and_fwd_amnt;
          this.domesticfreightamnt = this.detaildatasource[0].domestic_freight_amnt;
          this.instorcomamnt = this.detaildatasource[0].inst_com_amnt;
          if (this.detaildatasource[0].sgst_pc) {
            if (this.detaildatasource[0].sgst_pc == "NA") {
              this.sgstpc = "";
            }
            else {
              this.sgstpc = (+this.detaildatasource[0].sgst_pc * 100).toString().concat("%");
            }
          }
          else {
            this.sgstpc = "";
          }
          this.sgstamount = this.detaildatasource[0].sgst_amount;
          if (this.detaildatasource[0].cgst_pc) {
            if (this.detaildatasource[0].cgst_pc == "NA") {
              this.cgstpc = "";
            }
            else {
              this.cgstpc = (+this.detaildatasource[0].cgst_pc * 100).toString().concat("%");
            }
          }
          else {
            this.cgstpc = "";
          }
          this.cgstamount = this.detaildatasource[0].cgst_amount;
          if (this.detaildatasource[0].igst_pc) {
            if (this.detaildatasource[0].igst_pc == "NA") {
              this.igstpc = "";
            }
            else {
              this.igstpc = (+this.detaildatasource[0].igst_pc * 100).toString().concat("%");
            }
          }
          else {
            this.igstpc = "";
          }
          this.igstamount = this.detaildatasource[0].igst_amount;
          this.contractacntname = this.detaildatasource[0].contract_acnt_name;
          this.cntrcode = this.detaildatasource[0].cntr_code;
          this.cntraddress = this.detaildatasource[0].cntr_address;
          this.cntrcountry = this.detaildatasource[0].cntr_country;
          this.cntrgstcode = this.detaildatasource[0].cntr_gst_code;
          this.cntrtel = this.detaildatasource[0].cntr_tel;
          this.cntrcontactperson = this.detaildatasource[0].cntr_contact_person;
          this.cntremail = this.detaildatasource[0].cntr_email;
          this.useracntname = this.detaildatasource[0].user_acnt_name;
          this.uacode = this.detaildatasource[0].ua_code;
          this.uaaddress = this.detaildatasource[0].ua_address;
          this.uacountry = this.detaildatasource[0].ua_country;
          this.uagstcode = this.detaildatasource[0].ua_gst_code;
          this.uatel = this.detaildatasource[0].ua_tel;
          this.uacontactperson = this.detaildatasource[0].ua_contact_person;
          this.uaemail = this.detaildatasource[0].ua_email;
          this.keyaccountflag = this.detaildatasource[0].key_account_flag;
          this.advtype = this.detaildatasource[0].adv_type;
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
          this.thirdpcomcur = this.detaildatasource[0].thirdp_com_cur;
          this.thirdpcomamnt = this.detaildatasource[0].thirdp_com_amnt;
          this.thirdpcompaidby = this.detaildatasource[0].thirdp_com_paid_by;
          this.comacntname = this.detaildatasource[0].com_acnt_name;
          this.comcode = this.detaildatasource[0].com_code;
          this.comaddress = this.detaildatasource[0].com_address;
          this.comcountry = this.detaildatasource[0].com_country;
          this.comgstcode = this.detaildatasource[0].com_gst_code;
          this.comtel = this.detaildatasource[0].com_tel;
          this.comcontactperson = this.detaildatasource[0].com_contact_person;
          this.comemail = this.detaildatasource[0].com_email;
          this.csutomerapplicationcode = this.detaildatasource[0].csutomer_application_code;
          this.customerapplicationtype = this.detaildatasource[0].customer_application_type;
          this.customerappdesc = this.detaildatasource[0].customer_app_desc;
          this.reqetdbycustomer = this.datePipe.transform(this.detaildatasource[0].req_etd_by_customer, 'yyyy-MM-dd');
          this.reqetdtoij = this.datePipe.transform(this.detaildatasource[0].req_etd_to_ij, 'yyyy-MM-dd');
          this.reqetabycustomer = this.datePipe.transform(this.detaildatasource[0].req_eta_by_customer, 'yyyy-MM-dd');
          this.reqetatoij = this.datePipe.transform(this.detaildatasource[0].req_eta_to_ij, 'yyyy-MM-dd');
          this.trdtrmswithcustomer = this.detaildatasource[0].trd_trms_with_customer;
          this.trdtrmswithij = this.detaildatasource[0].trd_trms_with_ij;
          this.destportbycustomer = this.detaildatasource[0].dest_port_by_customer;
          this.destporttoij = this.detaildatasource[0].dest_port_to_ij;
          this.mot = this.detaildatasource[0].mot;
          this.mottoij = this.detaildatasource[0].mot_to_ij;
          this.freight1 = this.detaildatasource[0].freight1;
          this.freight2 = this.detaildatasource[0].freight2;
          this.coo = this.detaildatasource[0].coo;
          this.epa = this.detaildatasource[0].epa;
          this.ip = this.detaildatasource[0].ip;
          this.freedetentionperiod = this.detaildatasource[0].free_detention_period;
          this.consigneeacntname = this.detaildatasource[0].consignee_acnt_name;
          this.cnscode = this.detaildatasource[0].cns_code;
          this.cnsaddress = this.detaildatasource[0].cns_address;
          this.cnscountry = this.detaildatasource[0].cns_country;
          this.cnsgstcode = this.detaildatasource[0].cns_gst_code;
          this.cnscontactperson = this.detaildatasource[0].cns_contact_person;
          this.cnstel = this.detaildatasource[0].cns_tel;
          this.cnsemail = this.detaildatasource[0].cns_email;
          this.cnsieccode = this.detaildatasource[0].cns_iec_code;
          this.banknameoncad = this.detaildatasource[0].bank_name_on_cad;
          this.banktel = this.detaildatasource[0].tel;
          this.bankaddress = this.detaildatasource[0].address;
          this.notifyacntname = this.detaildatasource[0].notify_acnt_name;
          this.ntfcode = this.detaildatasource[0].ntf_code;
          this.ntfaddress = this.detaildatasource[0].ntf_address;
          this.ntfcountry = this.detaildatasource[0].ntf_country;
          this.ntfgstcode = this.detaildatasource[0].ntf_gst_code;
          this.ntfcontactperson = this.detaildatasource[0].ntf_contact_person;
          this.ntftel = this.detaildatasource[0].ntf_tel;
          this.ntfemail = this.detaildatasource[0].ntf_email;
          this.fobfowarder = this.detaildatasource[0].fob_fowarder;
          this.productionstart = this.detaildatasource[0].production_start;
          this.customerposheet = this.detaildatasource[0].oth_customer_po_sheet;
          this.customerpi = this.detaildatasource[0].oth_pi;
          this.customersrsheet = this.detaildatasource[0].oth_sr_spec_sheet;
          this.othlcdraft = this.detaildatasource[0].oth_lc_draft;
          this.othdrawing = this.detaildatasource[0].oth_drawing;
          this.othdoc1 = this.detaildatasource[0].oth_doc1;
          this.othtestreport = this.detaildatasource[0].oth_test_report;
          this.othdoc2 = this.detaildatasource[0].oth_doc2;
          this.remarks1 = this.detaildatasource[0].remarks1;
          this.pino = this.detaildatasource[0].pi_no;
          this.pidate = this.datePipe.transform(this.detaildatasource[0].pi_date, 'yyyy-MM-dd');
          this.iipono = this.detaildatasource[0].iipo_no;
          this.iipodate = this.datePipe.transform(this.detaildatasource[0].iipo_date, 'yyyy-MM-dd');
          this.ijprjno = this.detaildatasource[0].ij_project_num;
          this.ocdate = this.datePipe.transform(this.detaildatasource[0].oc_date, 'yyyy-MM-dd');
          this.sadate = this.datePipe.transform(this.detaildatasource[0].sa_date, 'yyyy-MM-dd');
          this.lcchkdateij = this.datePipe.transform(this.detaildatasource[0].lc_chk_date_by_ij, 'yyyy-MM-dd');
          this.lcopendate = this.datePipe.transform(this.detaildatasource[0].lc_open_date, 'yyyy-MM-dd');
          this.lclastrevisiondate = this.datePipe.transform(this.detaildatasource[0].lc_last_revision_date, 'yyyy-MM-dd');
          this.latestshipmentdate = this.datePipe.transform(this.detaildatasource[0].latest_shipment_date, 'yyyy-MM-dd');
          this.lcexpirydate = this.datePipe.transform(this.detaildatasource[0].lc_expiry_date, 'yyyy-MM-dd');
          this.exf1 = this.datePipe.transform(this.detaildatasource[0].exf1, 'yyyy-MM-dd');
          this.exf1sts = this.detaildatasource[0].exf1_sts;
          this.exfaccouncement1 = this.datePipe.transform(this.detaildatasource[0].exf_ij_accment1, 'yyyy-MM-dd');
          this.exf2 = this.datePipe.transform(this.detaildatasource[0].exf2, 'yyyy-MM-dd');
          this.exf2sts = this.detaildatasource[0].exf2_sts;
          this.exfaccouncement2 = this.datePipe.transform(this.detaildatasource[0].exf_ij_accment2, 'yyyy-MM-dd');
          this.exf3 = this.datePipe.transform(this.detaildatasource[0].exf3, 'yyyy-MM-dd');
          this.exf3sts = this.detaildatasource[0].exf3_sts;
          this.exfaccouncement3 = this.datePipe.transform(this.detaildatasource[0].exf_ij_accment3, 'yyyy-MM-dd');
          this.invoiceno1 = this.detaildatasource[0].invoice_no1;
          this.invoiceno2 = this.detaildatasource[0].invoice_no2;
          this.invoiceno3 = this.detaildatasource[0].invoice_no3;
          this.invoicedate1 = this.datePipe.transform(this.detaildatasource[0].invoice_date1, 'yyyy-MM-dd');
          this.invoicedate2 = this.datePipe.transform(this.detaildatasource[0].invoice_date2, 'yyyy-MM-dd');
          this.invoicedate3 = this.datePipe.transform(this.detaildatasource[0].invoice_date3, 'yyyy-MM-dd');
          this.etd1 = this.datePipe.transform(this.detaildatasource[0].etd1, 'yyyy-MM-dd');
          this.etd2 = this.datePipe.transform(this.detaildatasource[0].etd2, 'yyyy-MM-dd');
          this.etd3 = this.datePipe.transform(this.detaildatasource[0].etd3, 'yyyy-MM-dd');
          this.eta1 = this.datePipe.transform(this.detaildatasource[0].eta1, 'yyyy-MM-dd');
          this.eta2 = this.datePipe.transform(this.detaildatasource[0].eta2, 'yyyy-MM-dd');
          this.eta3 = this.datePipe.transform(this.detaildatasource[0].eta3, 'yyyy-MM-dd');
          this.mode1 = this.detaildatasource[0].mode1;
          this.mode2 = this.detaildatasource[0].mode2;
          this.mode3 = this.detaildatasource[0].mode3;
          this.from1 = this.detaildatasource[0].from1;
          this.from2 = this.detaildatasource[0].from2;
          this.from3 = this.detaildatasource[0].from3;
          this.vessel1 = this.detaildatasource[0].vessel1;
          this.vessel2 = this.detaildatasource[0].vessel2;
          this.vessel3 = this.detaildatasource[0].vessel3;
          this.awborblno1 = this.detaildatasource[0].awb_bl_no1;
          this.awborblno2 = this.detaildatasource[0].awb_bl_no2;
          this.awborblno3 = this.detaildatasource[0].awb_bl_no3;
          this.ewaybillreq = this.detaildatasource[0].eway_bill_req;
          this.ewaybillno = this.detaildatasource[0].eway_bill_num;
          this.remarks2 = this.detaildatasource[0].remarks2;
          this.commonth = this.datePipe.transform(this.detaildatasource[0].com_month, 'yyyy-MM-dd');
          this.checkedon = this.datePipe.transform(this.detaildatasource[0].checked_on, 'yyyy-MM-dd');
          this.forinfo = this.detaildatasource[0].for_info;
          this.nextcheck = this.datePipe.transform(this.detaildatasource[0].next_check, 'yyyy-MM-dd');
          this.pmtsts = this.detaildatasource[0].pmt_sts;
          this.delsts = this.detaildatasource[0].del_sts;
        }
      }
    });
  }

  hideListCardFlag() {
    this.snfDropDwFlag = false;
    this.apDropDwFlag = false;
    this.lpDropDwFlag = false;
    this.bpDropDwFlag = false;
    this.outDropDwFlag = false;
    this.pnsDropDwFlag = false;
    this.lcpDropDwFlag = false;
    this.pexfpDropDwFlag = false;
    this.fexfpDropDwFlag = false;
    this.sspDropDwFlag = false;
    this.sapDropDwFlag = false;
  }

  showistCardFlag() {
    this.snfDropDwFlag = true;
    this.apDropDwFlag = true;
    this.lpDropDwFlag = true;
    this.bpDropDwFlag = true;
    this.outDropDwFlag = true;
    this.pnsDropDwFlag = true;
    this.lcpDropDwFlag = true;
    this.pexfpDropDwFlag = true;
    this.fexfpDropDwFlag = true;
    this.sspDropDwFlag = true;
    this.sapDropDwFlag = true;
  }

  onClickLeftMov() {

    if (this.poDFlag === true) {
      this.tabtitlebtn = 'PO DETAILS';
      this.dropDwTitle = 'PO DETAILS';
      return;
    }

    if (this.accountDFlag === true) {
      this.accountDFlag = false;
      this.tabtitlebtn = 'PO DETAILS';
      this.dropDwTitle = 'PO DETAILS';
      this.poDFlag = true;
      return;
    }

    if (this.paymentDFlag === true) {
      this.paymentDFlag = false;
      this.tabtitlebtn = 'ACCOUNT DETAILS';
      this.dropDwTitle = 'ACCOUNT DETAILS';
      this.accountDFlag = true;
      return;
    }

    if (this.thirdparDFlag === true) {
      this.thirdparDFlag = false;
      this.tabtitlebtn = 'PAYMENT DETAILS';
      this.dropDwTitle = 'PAYMENT DETAILS';
      this.paymentDFlag = true;
      return;
    }

    if (this.applicationDFlag === true) {
      this.applicationDFlag = false;
      this.tabtitlebtn = '3P COM DETAILS';
      this.dropDwTitle = '3P COM DETAILS';
      this.thirdparDFlag = true;
      return;
    }

    if (this.shpinstoneDFlag === true) {
      this.shpinstoneDFlag = false;
      this.tabtitlebtn = 'APPLICATION DETAILS';
      this.dropDwTitle = 'APPLICATION DETAILS';
      this.applicationDFlag = true;
      return;
    }

    if (this.shpinsttwoDFlag === true) {
      this.shpinsttwoDFlag = false;
      this.tabtitlebtn = 'SHP INST1 DETAILS';
      this.dropDwTitle = 'SHP INST1 DETAILS';
      this.shpinstoneDFlag = true;
      return;
    }

    if (this.indremarkDFlag === true) {
      this.indremarkDFlag = false;
      this.tabtitlebtn = 'SHP INST2 DETAILS';
      this.dropDwTitle = 'SHP INST2 DETAILS';
      this.shpinsttwoDFlag = true;
      return;
    }

    if (this.proformaDFlag === true) {
      this.proformaDFlag = false;
      this.tabtitlebtn = 'IND REMARKS DETAILS';
      this.dropDwTitle = 'IND REMARKS DETAILS';
      this.indremarkDFlag = true;
      return;
    }

    if (this.lcDFlag === true) {
      this.lcDFlag = false;
      this.tabtitlebtn = 'PI DETAILS';
      this.dropDwTitle = 'PI DETAILS';
      this.proformaDFlag = true;
      return;
    }

    if (this.exfactoryDFlag === true) {
      this.exfactoryDFlag = false;
      this.tabtitlebtn = 'LC DETAILS';
      this.dropDwTitle = 'LC DETAILS';
      this.lcDFlag = true;
      return;
    }

    if (this.shpadvDFlag === true) {
      this.shpadvDFlag = false;
      this.tabtitlebtn = 'EXF DETAILS';
      this.dropDwTitle = 'EXF DETAILS';
      this.exfactoryDFlag = true;
      return;
    }

    if (this.salesadDFlag === true) {
      this.salesadDFlag = false;
      this.tabtitlebtn = 'SHP ADV DETAILS';
      this.dropDwTitle = 'SHP ADV DETAILS';
      this.shpadvDFlag = true;
      return;
    }


  }

  onClickRightMov() {

    if (this.poDFlag === true) {
      this.poDFlag = false;
      this.tabtitlebtn = 'ACCOUNT DETAILS';
      this.dropDwTitle = 'ACCOUNT DETAILS';
      this.accountDFlag = true;
      return;
    }

    if (this.accountDFlag === true) {
      this.accountDFlag = false;
      this.tabtitlebtn = 'PAYMENT DETAILS';
      this.dropDwTitle = 'PAYMENT DETAILS';
      this.paymentDFlag = true;
      return;
    }

    if (this.paymentDFlag === true) {
      this.paymentDFlag = false;
      this.tabtitlebtn = '3P COM DETAILS';
      this.dropDwTitle = '3P COM DETAILS';
      this.thirdparDFlag = true;
      return;
    }

    if (this.thirdparDFlag === true) {
      this.thirdparDFlag = false;
      this.tabtitlebtn = 'APPLICATION DETAILS';
      this.dropDwTitle = 'APPLICATION DETAILS';
      this.applicationDFlag = true;
      return;
    }

    if (this.applicationDFlag === true) {
      this.applicationDFlag = false;
      this.tabtitlebtn = 'SHP INST1 DETAILS';
      this.dropDwTitle = 'SHP INST1 DETAILS';
      this.shpinstoneDFlag = true;
      return;
    }

    if (this.shpinstoneDFlag === true) {
      this.shpinstoneDFlag = false;
      this.tabtitlebtn = 'SHP INST2 DETAILS';
      this.dropDwTitle = 'SHP INST2 DETAILS';
      this.shpinsttwoDFlag = true;
      return;
    }

    if (this.shpinsttwoDFlag === true) {
      this.shpinsttwoDFlag = false;
      this.tabtitlebtn = 'IND REMARKS DETAILS';
      this.dropDwTitle = 'IND REMARKS DETAILS';
      this.indremarkDFlag = true;
      return;
    }

    if (this.indremarkDFlag === true) {
      this.indremarkDFlag = false;
      this.tabtitlebtn = 'PI DETAILS';
      this.dropDwTitle = 'PI DETAILS';
      this.proformaDFlag = true;
      return;
    }

    if (this.proformaDFlag === true) {
      this.proformaDFlag = false;
      this.tabtitlebtn = 'LC DETAILS';
      this.dropDwTitle = 'LC DETAILS';
      this.lcDFlag = true;
      return;
    }

    if (this.lcDFlag === true) {
      this.lcDFlag = false;
      this.tabtitlebtn = 'EXF DETAILS';
      this.dropDwTitle = 'EXF DETAILS';
      this.exfactoryDFlag = true;
      return;
    }

    if (this.exfactoryDFlag === true) {
      this.exfactoryDFlag = false;
      this.tabtitlebtn = 'SHP ADV DETAILS';
      this.dropDwTitle = 'SHP ADV DETAILS';
      this.shpadvDFlag = true;
      return;
    }

    if (this.shpadvDFlag === true) {
      this.shpadvDFlag = false;
      this.tabtitlebtn = 'SALES ADMIN DETAILS';
      this.dropDwTitle = 'SALES ADMIN DETAILS';
      this.salesadDFlag = true;
      return;
    }

    if (this.salesadDFlag === true) {
      this.tabtitlebtn = 'SALES ADMIN DETAILS';
      this.dropDwTitle = 'SALES ADMIN DETAILS';
      return;
    }

  }

  updateNxtActIndent() {

    if (GlobalConstants.globalNxtActIndNo != "") {
      this.activeModal.dismiss('Cross click');
      this.router.navigate(['ii/indentmgmt']);
    }

    this.activeModal.dismiss('Cross click');
  }

  closeModel() {
    GlobalConstants.globalNxtActIndNo = "";
    this.activeModal.dismiss('Cross click');
  }

  isNumber(val): boolean { return typeof val === 'number'; }
}









