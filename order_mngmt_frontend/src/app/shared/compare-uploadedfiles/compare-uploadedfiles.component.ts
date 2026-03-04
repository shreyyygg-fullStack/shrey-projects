import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IndentData, DetailDialogDataSet, IndFilterCountA } from '../../shared/services/indentdb.type';
import { NgbModalOptions, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from '../common/global-constants';

export interface IndentDetailSelect {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-compare-uploadedfiles',
  templateUrl: './compare-uploadedfiles.component.html',
  styleUrls: ['./compare-uploadedfiles.component.css'],
  providers: [DatePipe]
})

export class CompareUploadedfilesComponent implements OnInit {

  modalOptions: NgbModalOptions;
  modalRef: NgbModalRef;
  ispopUpShow: boolean;

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

  new_indentsheetnum;
  new_sossummary;
  new_sales1id;
  new_indentissuedate;
  new_ordertype;
  new_sales1;
  new_crmoptnum;
  new_sales2id;
  new_sales2;
  new_customerponum;
  new_spcur;
  new_lptotal;
  new_customerpodate;
  new_sptotal;
  new_tpcur;
  new_tp1;
  new_tp2;
  new_pmttrms;
  new_iigm;
  new_pckandfwdamnt;
  new_domesticfreightamnt;
  new_instorcomamnt;
  new_sgstpc;
  new_sgstamount;
  new_cgstpc;
  new_cgstamount;
  new_igstpc;
  new_igstamount;
  new_contractacntname;
  new_cntrcode;
  new_cntraddress;
  new_cntrcountry;
  new_cntrgstcode;
  new_cntrtel;
  new_cntrcontactperson;
  new_cntremail;
  new_useracntname;
  new_uacode;
  new_uaaddress;
  new_uacountry;
  new_uagstcode;
  new_uatel;
  new_uacontactperson;
  new_uaemail;
  new_keyaccountflag;
  new_advtype;
  new_advpc;
  new_advamount;
  new_advdate;
  new_bshtype;
  new_bshpc;
  new_bshamount;
  new_bshdate;
  new_ashtype;
  new_ashpc;
  new_ashamount;
  new_ashdate;
  new_thirdpcomcur;
  new_thirdpcomamnt;
  new_thirdpcompaidby;
  new_comacntname;
  new_comcode;
  new_comaddress;
  new_comcountry;
  new_comgstcode;
  new_comtel;
  new_comcontactperson;
  new_comemail;
  new_csutomerapplicationcode;
  new_customerapplicationtype;
  new_customerappdesc;
  new_reqetdbycustomer;
  new_reqetdtoij;
  new_reqetabycustomer;
  new_reqetatoij;
  new_trdtrmswithcustomer;
  new_trdtrmswithij;
  new_destportbycustomer;
  new_destporttoij;
  new_mot;
  new_mottoij;
  new_freight1;
  new_freight2;
  new_coo;
  new_epa;
  new_ip;
  new_freedetentionperiod;
  new_consigneeacntname;
  new_cnscode;
  new_cnsaddress;
  new_cnscountry;
  new_cnsgstcode;
  new_cnscontactperson;
  new_cnstel;
  new_cnsemail;
  new_cnsieccode;
  new_banknameoncad;
  new_banktel;
  new_bankaddress;
  new_notifyacntname;
  new_ntfcode;
  new_ntfaddress;
  new_ntfcountry;
  new_ntfgstcode;
  new_ntfcontactperson;
  new_ntftel;
  new_ntfemail;
  new_fobfowarder;
  new_productionstart;
  new_customerposheet;
  new_customerpi;
  new_customersrsheet;
  new_othlcdraft;
  new_othdrawing;
  new_othdoc1;
  new_othtestreport;
  new_othdoc2;
  new_remarks1;
  new_pino;
  new_pidate;
  new_iipono;
  new_iipodate;
  new_ijprjno;
  new_ocdate;
  new_sadate;
  new_lcchkdateij;
  new_lcopendate;
  new_lclastrevisiondate;
  new_latestshipmentdate;
  new_lcexpirydate;
  new_exf1;
  new_exf1sts;
  new_exfaccouncement1;
  new_exf2;
  new_exf2sts;
  new_exfaccouncement2;
  new_exf3;
  new_exf3sts;
  new_exfaccouncement3;
  new_invoiceno1;
  new_invoiceno2;
  new_invoiceno3;
  new_invoicedate1;
  new_invoicedate2;
  new_invoicedate3;
  new_etd1;
  new_etd2;
  new_etd3;
  new_eta1;
  new_eta2;
  new_eta3;
  new_mode1;
  new_mode2;
  new_mode3;
  new_from1;
  new_from2;
  new_from3;
  new_vessel1;
  new_vessel2;
  new_vessel3;
  new_awborblno1;
  new_awborblno2;
  new_awborblno3;
  new_ewaybillreq;
  new_ewaybillno;
  new_remarks2;
  new_commonth;
  new_checkedon;
  new_forinfo;
  new_nextcheck;
  new_pmtsts;
  new_delsts;
  /* End*/

  // compare Flag var
  indentsheetnumFlag;
  sossummaryFlag;
  sales1idFlag;
  indentissuedateFlag;
  ordertypeFlag;
  sales1Flag;
  crmoptnumFlag;
  sales2idFlag;
  sales2Flag;
  customerponumFlag;
  spcurFlag;
  lptotalFlag;
  customerpodateFlag;
  sptotalFlag;
  tpcurFlag;
  tp1Flag;
  tp2Flag;
  pmttrmsFlag;
  iigmFlag;
  pckandfwdamntFlag;
  domesticfreightamntFlag;
  instorcomamntFlag;
  sgstpcFlag;
  sgstamountFlag;
  cgstpcFlag;
  cgstamountFlag;
  igstpcFlag;
  igstamountFlag;
  contractacntnameFlag;
  cntrcodeFlag;
  cntraddressFlag;
  cntrcountryFlag;
  cntrgstcodeFlag;
  cntrtelFlag;
  cntrcontactpersonFlag;
  cntremailFlag;
  useracntnameFlag;
  uacodeFlag;
  uaaddressFlag;
  uacountryFlag;
  uagstcodeFlag;
  uatelFlag;
  uacontactpersonFlag;
  uaemailFlag;
  keyaccountflagFlag;
  advtypeFlag;
  advpcFlag;
  advamountFlag;
  advdateFlag;
  bshtypeFlag;
  bshpcFlag;
  bshamountFlag;
  bshdateFlag;
  ashtypeFlag;
  ashpcFlag;
  ashamountFlag;
  ashdateFlag;
  thirdpcomcurFlag;
  thirdpcomamntFlag;
  thirdpcompaidbyFlag;
  comacntnameFlag;
  comcodeFlag;
  comaddressFlag;
  comcountryFlag;
  comgstcodeFlag;
  comtelFlag;
  comcontactpersonFlag;
  comemailFlag;
  csutomerapplicationcodeFlag;
  customerapplicationtypeFlag;
  customerappdescFlag;
  reqetdbycustomerFlag;
  reqetdtoijFlag;
  reqetabycustomerFlag;
  reqetatoijFlag;
  trdtrmswithcustomerFlag;
  trdtrmswithijFlag;
  destportbycustomerFlag;
  destporttoijFlag;
  motFlag;
  mottoijFlag;
  freight1Flag;
  freight2Flag;
  cooFlag;
  epaFlag;
  ipFlag;
  freedetentionperiodFlag;
  consigneeacntnameFlag;
  cnscodeFlag;
  cnsaddressFlag;
  cnscountryFlag;
  cnsgstcodeFlag;
  cnscontactpersonFlag;
  cnstelFlag;
  cnsemailFlag;
  cnsieccodeFlag;
  banknameoncadFlag;
  banktelFlag;
  bankaddressFlag;
  notifyacntnameFlag;
  ntfcodeFlag;
  ntfaddressFlag;
  ntfcountryFlag;
  ntfgstcodeFlag;
  ntfcontactpersonFlag;
  ntftelFlag;
  ntfemailFlag;
  fobfowarderFlag;
  productionstartFlag;
  customerposheetFlag;
  customerpiFlag;
  customersrsheetFlag;
  othlcdraftFlag;
  othdrawingFlag;
  othdoc1Flag;
  othtestreportFlag;
  othdoc2Flag;
  remarks1Flag;
  pinoFlag;
  pidateFlag;
  iiponoFlag;
  iipodateFlag;
  ijprjnoFlag;
  ocdateFlag;
  sadateFlag;
  lcchkdateijFlag;
  lcopendateFlag;
  lclastrevisiondateFlag;
  latestshipmentdateFlag;
  lcexpirydateFlag;
  exf1Flag;
  exf1stsFlag;
  exfaccouncement1Flag;
  exf2Flag;
  exf2stsFlag;
  exfaccouncement2Flag;
  exf3Flag;
  exf3stsFlag;
  exfaccouncement3Flag;
  invoiceno1Flag;
  invoiceno2Flag;
  invoiceno3Flag;
  invoicedate1Flag;
  invoicedate2Flag;
  invoicedate3Flag;
  etd1Flag;
  etd2Flag;
  etd3Flag;
  eta1Flag;
  eta2Flag;
  eta3Flag;
  mode1Flag;
  mode2Flag;
  mode3Flag;
  from1Flag;
  from2Flag;
  from3Flag;
  vessel1Flag;
  vessel2Flag;
  vessel3Flag;
  awborblno1Flag;
  awborblno2Flag;
  awborblno3Flag;
  ewaybillreqFlag;
  ewaybillnoFlag;
  remarks2Flag;
  commonthFlag;
  checkedonFlag;
  forinfoFlag;
  nextcheckFlag;
  pmtstsFlag;
  delstsFlag;
  // end Flag var

  constructor(private httpcon: HttpClient, public activeModal: NgbActiveModal, private datePipe: DatePipe, private router: Router) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop'
    }
  }

  ngOnInit() {
    this.onSelect(this.indentSheetNumber);
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
    const urllink = GlobalConstants.apiIndentDetail + indNum;
    this.httpcon.get<DetailDialogDataSet[]>(urllink).subscribe(res => {
      if (res['data'] === '0' || res.length === undefined) {
      } else if (res['errorCode'] === '1') {
        // future log design
      } else {
        if (res.length !== null) {
          this.detaildatasource = res;
          this.indentAllFormDetail = true;
          this.indentsheetnum = this.detaildatasource[0].indent_sheet_num;
          this.indentissuedate = this.datePipe.transform(this.detaildatasource[0].indent_issue_date, 'yyyy-MM-dd');
          this.crmoptnum = this.detaildatasource[0].crm_opt_num;
          this.sossummary = this.detaildatasource[0].sos_summary;
          this.sales1id = this.detaildatasource[0].sales1_id;
          this.sales1 = this.detaildatasource[0].sales1_name;
          this.sales2id = this.detaildatasource[0].sales2_id;
          this.sales2 = this.detaildatasource[0].sales2_name;
          this.ordertype = this.detaildatasource[0].order_type;
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
          this.sgstpc = this.detaildatasource[0].sgst_pc;
          this.sgstamount = this.detaildatasource[0].sgst_amount;
          this.cgstpc = this.detaildatasource[0].cgst_pc;
          this.cgstamount = this.detaildatasource[0].cgst_amount;
          this.igstpc = this.detaildatasource[0].igst_pc;
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
          this.advpc = this.detaildatasource[0].adv_pc;
          this.advamount = this.detaildatasource[0].adv_amount;
          this.advdate = this.datePipe.transform(this.detaildatasource[0].adv_date, 'yyyy-MM-dd');
          this.bshtype = this.detaildatasource[0].bsh_type;
          this.bshpc = this.detaildatasource[0].bsh_pc;
          this.bshamount = this.detaildatasource[0].bsh_amount;
          this.bshdate = this.datePipe.transform(this.detaildatasource[0].bsh_date, 'yyyy-MM-dd');
          this.ashtype = this.detaildatasource[0].ash_type;
          this.ashpc = this.detaildatasource[0].ash_pc;
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
          this.chkRoNullCondition();
        }
      }
    });
  }

  compareIndentResult() {
    if (String(this.new_indentsheetnum) === String(this.indentsheetnum)) { this.indentsheetnumFlag = false; } else { this.indentsheetnumFlag = true; }
    if (String(this.new_sossummary) === String(this.sossummary)) { this.sossummaryFlag = false; } else { this.sossummaryFlag = true; }
    if (String(this.new_sales1id) === String(this.sales1id)) { this.sales1idFlag = false; } else { this.sales1idFlag = true; }
    if (String(this.new_indentissuedate) === String(this.indentissuedate)) { this.indentissuedateFlag = false; } else { this.indentissuedateFlag = true; }
    if (String(this.new_ordertype) === String(this.ordertype)) { this.ordertypeFlag = false; } else { this.ordertypeFlag = true; }
    if (String(this.new_sales1) === String(this.sales1)) { this.sales1Flag = false; } else { this.sales1Flag = true; }
    if (String(this.new_crmoptnum) === String(this.crmoptnum)) { this.crmoptnumFlag = false; } else { this.crmoptnumFlag = true; }
    if (String(this.new_sales2id) === String(this.sales2id)) { this.sales2idFlag = false; } else { this.sales2idFlag = true; }
    if (String(this.new_sales2) === String(this.sales2)) { this.sales2Flag = false; } else { this.sales2Flag = true; }
    if (String(this.new_customerponum) === String(this.customerponum)) { this.customerponumFlag = false; } else { this.customerponumFlag = true; }
    if (String(this.new_spcur) === String(this.spcur)) { this.spcurFlag = false; } else { this.spcurFlag = true; }
    if (String(this.new_lptotal) === String(this.lptotal)) { this.lptotalFlag = false; } else { this.lptotalFlag = true; }
    if (String(this.new_customerpodate) === String(this.customerpodate)) { this.customerpodateFlag = false; } else { this.customerpodateFlag = true; }
    if (String(this.new_sptotal) === String(this.sptotal)) { this.sptotalFlag = false; } else { this.sptotalFlag = true; }
    if (String(this.new_tpcur) === String(this.tpcur)) { this.tpcurFlag = false; } else { this.tpcurFlag = true; }
    if (String(this.new_tp1) === String(this.tp1)) { this.tp1Flag = false; } else { this.tp1Flag = true; }
    if (String(this.new_tp2) === String(this.tp2)) { this.tp2Flag = false; } else { this.tp2Flag = true; }
    if (String(this.new_pmttrms) === String(this.pmttrms)) { this.pmttrmsFlag = false; } else { this.pmttrmsFlag = true; }
    if (String(this.new_iigm) === String(this.iigm)) { this.iigmFlag = false; } else { this.iigmFlag = true; }
    if (String(this.new_pckandfwdamnt) === String(this.pckandfwdamnt)) { this.pckandfwdamntFlag = false; } else { this.pckandfwdamntFlag = true; }
    if (String(this.new_domesticfreightamnt) === String(this.domesticfreightamnt)) { this.domesticfreightamntFlag = false; } else { this.domesticfreightamntFlag = true; }
    if (String(this.new_instorcomamnt) === String(this.instorcomamnt)) { this.instorcomamntFlag = false; } else { this.instorcomamntFlag = true; }
    if (String(this.new_sgstpc) === String(this.sgstpc)) { this.sgstpcFlag = false; } else { this.sgstpcFlag = true; }
    if (String(this.new_sgstamount) === String(this.sgstamount)) { this.sgstamountFlag = false; } else { this.sgstamountFlag = true; }
    if (String(this.new_cgstpc) === String(this.cgstpc)) { this.cgstpcFlag = false; } else { this.cgstpcFlag = true; }
    if (String(this.new_cgstamount) === String(this.cgstamount)) { this.cgstamountFlag = false; } else { this.cgstamountFlag = true; }
    if (String(this.new_igstpc) === String(this.igstpc)) { this.igstpcFlag = false; } else { this.igstpcFlag = true; }
    if (String(this.new_igstamount) === String(this.igstamount)) { this.igstamountFlag = false; } else { this.igstamountFlag = true; }
    if (String(this.new_contractacntname) === String(this.contractacntname)) { this.contractacntnameFlag = false; } else { this.contractacntnameFlag = true; }
    if (String(this.new_cntrcode) === String(this.cntrcode)) { this.cntrcodeFlag = false; } else { this.cntrcodeFlag = true; }
    if (String(this.new_cntraddress) === String(this.cntraddress)) { this.cntraddressFlag = false; } else { this.cntraddressFlag = true; }
    if (String(this.new_cntrcountry) === String(this.cntrcountry)) { this.cntrcountryFlag = false; } else { this.cntrcountryFlag = true; }
    if (String(this.new_cntrgstcode) === String(this.cntrgstcode)) { this.cntrgstcodeFlag = false; } else { this.cntrgstcodeFlag = true; }
    if (String(this.new_cntrtel) === String(this.cntrtel)) { this.cntrtelFlag = false; } else { this.cntrtelFlag = true; }
    if (String(this.new_cntrcontactperson) === String(this.cntrcontactperson)) { this.cntrcontactpersonFlag = false; } else { this.cntrcontactpersonFlag = true; }
    if (String(this.new_cntremail) === String(this.cntremail)) { this.cntremailFlag = false; } else { this.cntremailFlag = true; }
    if (String(this.new_useracntname) === String(this.useracntname)) { this.useracntnameFlag = false; } else { this.useracntnameFlag = true; }
    if (String(this.new_uacode) === String(this.uacode)) { this.uacodeFlag = false; } else { this.uacodeFlag = true; }
    if (String(this.new_uaaddress) === String(this.uaaddress)) { this.uaaddressFlag = false; } else { this.uaaddressFlag = true; }
    if (String(this.new_uacountry) === String(this.uacountry)) { this.uacountryFlag = false; } else { this.uacountryFlag = true; }
    if (String(this.new_uagstcode) === String(this.uagstcode)) { this.uagstcodeFlag = false; } else { this.uagstcodeFlag = true; }
    if (String(this.new_uatel) === String(this.uatel)) { this.uatelFlag = false; } else { this.uatelFlag = true; }
    if (String(this.new_uacontactperson) === String(this.uacontactperson)) { this.uacontactpersonFlag = false; } else { this.uacontactpersonFlag = true; }
    if (String(this.new_uaemail) === String(this.uaemail)) { this.uaemailFlag = false; } else { this.uaemailFlag = true; }
    if (String(this.new_keyaccountflag) === String(this.keyaccountflag)) { this.keyaccountflagFlag = false; } else { this.keyaccountflagFlag = true; }
    if (String(this.new_advtype) === String(this.advtype)) { this.advtypeFlag = false; } else { this.advtypeFlag = true; }
    if (String(this.new_advpc) === String(this.advpc)) { this.advpcFlag = false; } else { this.advpcFlag = true; }
    if (String(this.new_advamount) === String(this.advamount)) { this.advamountFlag = false; } else { this.advamountFlag = true; }
    if (String(this.new_advdate) === String(this.advdate)) { this.advdateFlag = false; } else { this.advdateFlag = true; }
    if (String(this.new_bshtype) === String(this.bshtype)) { this.bshtypeFlag = false; } else { this.bshtypeFlag = true; }
    if (String(this.new_bshpc) === String(this.bshpc)) { this.bshpcFlag = false; } else { this.bshpcFlag = true; }
    if (String(this.new_bshamount) === String(this.bshamount)) { this.bshamountFlag = false; } else { this.bshamountFlag = true; }
    if (String(this.new_bshdate) === String(this.bshdate)) { this.bshdateFlag = false; } else { this.bshdateFlag = true; }
    if (String(this.new_ashtype) === String(this.ashtype)) { this.ashtypeFlag = false; } else { this.ashtypeFlag = true; }
    if (String(this.new_ashpc) === String(this.ashpc)) { this.ashpcFlag = false; } else { this.ashpcFlag = true; }
    if (String(this.new_ashamount) === String(this.ashamount)) { this.ashamountFlag = false; } else { this.ashamountFlag = true; }
    if (String(this.new_ashdate) === String(this.ashdate)) { this.ashdateFlag = false; } else { this.ashdateFlag = true; }
    if (String(this.new_thirdpcomcur) === String(this.thirdpcomcur)) { this.thirdpcomcurFlag = false; } else { this.thirdpcomcurFlag = true; }
    if (String(this.new_thirdpcomamnt) === String(this.thirdpcomamnt)) { this.thirdpcomamntFlag = false; } else { this.thirdpcomamntFlag = true; }
    if (String(this.new_thirdpcompaidby) === String(this.thirdpcompaidby)) { this.thirdpcompaidbyFlag = false; } else { this.thirdpcompaidbyFlag = true; }
    if (String(this.new_comacntname) === String(this.comacntname)) { this.comacntnameFlag = false; } else { this.comacntnameFlag = true; }
    if (String(this.new_comcode) === String(this.comcode)) { this.comcodeFlag = false; } else { this.comcodeFlag = true; }
    if (String(this.new_comaddress) === String(this.comaddress)) { this.comaddressFlag = false; } else { this.comaddressFlag = true; }
    if (String(this.new_comcountry) === String(this.comcountry)) { this.comcountryFlag = false; } else { this.comcountryFlag = true; }
    if (String(this.new_comgstcode) === String(this.comgstcode)) { this.comgstcodeFlag = false; } else { this.comgstcodeFlag = true; }
    if (String(this.new_comtel) === String(this.comtel)) { this.comtelFlag = false; } else { this.comtelFlag = true; }
    if (String(this.new_comcontactperson) === String(this.comcontactperson)) { this.comcontactpersonFlag = false; } else { this.comcontactpersonFlag = true; }
    if (String(this.new_comemail) === String(this.comemail)) { this.comemailFlag = false; } else { this.comemailFlag = true; }
    if (String(this.new_csutomerapplicationcode) === String(this.csutomerapplicationcode)) { this.csutomerapplicationcodeFlag = false; } else { this.csutomerapplicationcodeFlag = true; }
    if (String(this.new_customerapplicationtype) === String(this.customerapplicationtype)) { this.customerapplicationtypeFlag = false; } else { this.customerapplicationtypeFlag = true; }
    if (String(this.new_customerappdesc) === String(this.customerappdesc)) { this.customerappdescFlag = false; } else { this.customerappdescFlag = true; }
    if (String(this.new_reqetdbycustomer) === String(this.reqetdbycustomer)) { this.reqetdbycustomerFlag = false; } else { this.reqetdbycustomerFlag = true; }
    if (String(this.new_reqetdtoij) === String(this.reqetdtoij)) { this.reqetdtoijFlag = false; } else { this.reqetdtoijFlag = true; }
    if (String(this.new_reqetabycustomer) === String(this.reqetabycustomer)) { this.reqetabycustomerFlag = false; } else { this.reqetabycustomerFlag = true; }
    if (String(this.new_reqetatoij) === String(this.reqetatoij)) { this.reqetatoijFlag = false; } else { this.reqetatoijFlag = true; }
    if (String(this.new_trdtrmswithcustomer) === String(this.trdtrmswithcustomer)) { this.trdtrmswithcustomerFlag = false; } else { this.trdtrmswithcustomerFlag = true; }
    if (String(this.new_trdtrmswithij) === String(this.trdtrmswithij)) { this.trdtrmswithijFlag = false; } else { this.trdtrmswithijFlag = true; }
    if (String(this.new_destportbycustomer) === String(this.destportbycustomer)) { this.destportbycustomerFlag = false; } else { this.destportbycustomerFlag = true; }
    if (String(this.new_destporttoij) === String(this.destporttoij)) { this.destporttoijFlag = false; } else { this.destporttoijFlag = true; }
    if (String(this.new_mot) === String(this.mot)) { this.motFlag = false; } else { this.motFlag = true; }
    if (String(this.new_mottoij) === String(this.mottoij)) { this.mottoijFlag = false; } else { this.mottoijFlag = true; }
    if (String(this.new_freight1) === String(this.freight1)) { this.freight1Flag = false; } else { this.freight1Flag = true; }
    if (String(this.new_freight2) === String(this.freight2)) { this.freight2Flag = false; } else { this.freight2Flag = true; }
    if (String(this.new_coo) === String(this.coo)) { this.cooFlag = false; } else { this.cooFlag = true; }
    if (String(this.new_epa) === String(this.epa)) { this.epaFlag = false; } else { this.epaFlag = true; }
    if (String(this.new_ip) === String(this.ip)) { this.ipFlag = false; } else { this.ipFlag = true; }
    if (String(this.new_freedetentionperiod) === String(this.freedetentionperiod)) { this.freedetentionperiodFlag = false; } else { this.freedetentionperiodFlag = true; }
    if (String(this.new_consigneeacntname) === String(this.consigneeacntname)) { this.consigneeacntnameFlag = false; } else { this.consigneeacntnameFlag = true; }
    if (String(this.new_cnscode) === String(this.cnscode)) { this.cnscodeFlag = false; } else { this.cnscodeFlag = true; }
    if (String(this.new_cnsaddress) === String(this.cnsaddress)) { this.cnsaddressFlag = false; } else { this.cnsaddressFlag = true; }
    if (String(this.new_cnscountry) === String(this.cnscountry)) { this.cnscountryFlag = false; } else { this.cnscountryFlag = true; }
    if (String(this.new_cnsgstcode) === String(this.cnsgstcode)) { this.cnsgstcodeFlag = false; } else { this.cnsgstcodeFlag = true; }
    if (String(this.new_cnscontactperson) === String(this.cnscontactperson)) { this.cnscontactpersonFlag = false; } else { this.cnscontactpersonFlag = true; }
    if (String(this.new_cnstel) === String(this.cnstel)) { this.cnstelFlag = false; } else { this.cnstelFlag = true; }
    if (String(this.new_cnsemail) === String(this.cnsemail)) { this.cnsemailFlag = false; } else { this.cnsemailFlag = true; }
    if (String(this.new_cnsieccode) === String(this.cnsieccode)) { this.cnsieccodeFlag = false; } else { this.cnsieccodeFlag = true; }
    if (String(this.new_banknameoncad) === String(this.banknameoncad)) { this.banknameoncadFlag = false; } else { this.banknameoncadFlag = true; }
    if (String(this.new_banktel) === String(this.banktel)) { this.banktelFlag = false; } else { this.banktelFlag = true; }
    if (String(this.new_bankaddress) === String(this.bankaddress)) { this.bankaddressFlag = false; } else { this.bankaddressFlag = true; }
    if (String(this.new_notifyacntname) === String(this.notifyacntname)) { this.notifyacntnameFlag = false; } else { this.notifyacntnameFlag = true; }
    if (String(this.new_ntfcode) === String(this.ntfcode)) { this.ntfcodeFlag = false; } else { this.ntfcodeFlag = true; }
    if (String(this.new_ntfaddress) === String(this.ntfaddress)) { this.ntfaddressFlag = false; } else { this.ntfaddressFlag = true; }
    if (String(this.new_ntfcountry) === String(this.ntfcountry)) { this.ntfcountryFlag = false; } else { this.ntfcountryFlag = true; }
    if (String(this.new_ntfgstcode) === String(this.ntfgstcode)) { this.ntfgstcodeFlag = false; } else { this.ntfgstcodeFlag = true; }
    if (String(this.new_ntfcontactperson) === String(this.ntfcontactperson)) { this.ntfcontactpersonFlag = false; } else { this.ntfcontactpersonFlag = true; }
    if (String(this.new_ntftel) === String(this.ntftel)) { this.ntftelFlag = false; } else { this.ntftelFlag = true; }
    if (String(this.new_ntfemail) === String(this.ntfemail)) { this.ntfemailFlag = false; } else { this.ntfemailFlag = true; }
    if (String(this.new_fobfowarder) === String(this.fobfowarder)) { this.fobfowarderFlag = false; } else { this.fobfowarderFlag = true; }
    if (String(this.new_productionstart) === String(this.productionstart)) { this.productionstartFlag = false; } else { this.productionstartFlag = true; }
    if (String(this.new_customerposheet) === String(this.customerposheet)) { this.customerposheetFlag = false; } else { this.customerposheetFlag = true; }
    if (String(this.new_customerpi) === String(this.customerpi)) { this.customerpiFlag = false; } else { this.customerpiFlag = true; }
    if (String(this.new_customersrsheet) === String(this.customersrsheet)) { this.customersrsheetFlag = false; } else { this.customersrsheetFlag = true; }
    if (String(this.new_othlcdraft) === String(this.othlcdraft)) { this.othlcdraftFlag = false; } else { this.othlcdraftFlag = true; }
    if (String(this.new_othdrawing) === String(this.othdrawing)) { this.othdrawingFlag = false; } else { this.othdrawingFlag = true; }
    if (String(this.new_othdoc1) === String(this.othdoc1)) { this.othdoc1Flag = false; } else { this.othdoc1Flag = true; }
    if (String(this.new_othtestreport) === String(this.othtestreport)) { this.othtestreportFlag = false; } else { this.othtestreportFlag = true; }
    if (String(this.new_othdoc2) === String(this.othdoc2)) { this.othdoc2Flag = false; } else { this.othdoc2Flag = true; }
    if (String(this.new_remarks1) === String(this.remarks1)) { this.remarks1Flag = false; } else { this.remarks1Flag = true; }
    if (String(this.new_pino) === String(this.pino)) { this.pinoFlag = false; } else { this.pinoFlag = true; }
    if (String(this.new_pidate) === String(this.pidate)) { this.pidateFlag = false; } else { this.pidateFlag = true; }
    if (String(this.new_iipono) === String(this.iipono)) { this.iiponoFlag = false; } else { this.iiponoFlag = true; }
    if (String(this.new_iipodate) === String(this.iipodate)) { this.iipodateFlag = false; } else { this.iipodateFlag = true; }
    if (String(this.new_ijprjno) === String(this.ijprjno)) { this.ijprjnoFlag = false; } else { this.ijprjnoFlag = true; }
    if (String(this.new_ocdate) === String(this.ocdate)) { this.ocdateFlag = false; } else { this.ocdateFlag = true; }
    if (String(this.new_sadate) === String(this.sadate)) { this.sadateFlag = false; } else { this.sadateFlag = true; }
    if (String(this.new_lcchkdateij) === String(this.lcchkdateij)) { this.lcchkdateijFlag = false; } else { this.lcchkdateijFlag = true; }
    if (String(this.new_lcopendate) === String(this.lcopendate)) { this.lcopendateFlag = false; } else { this.lcopendateFlag = true; }
    if (String(this.new_lclastrevisiondate) === String(this.lclastrevisiondate)) { this.lclastrevisiondateFlag = false; } else { this.lclastrevisiondateFlag = true; }
    if (String(this.new_latestshipmentdate) === String(this.latestshipmentdate)) { this.latestshipmentdateFlag = false; } else { this.latestshipmentdateFlag = true; }
    if (String(this.new_lcexpirydate) === String(this.lcexpirydate)) { this.lcexpirydateFlag = false; } else { this.lcexpirydateFlag = true; }
    if (String(this.new_exf1) === String(this.exf1)) { this.exf1Flag = false; } else { this.exf1Flag = true; }
    if (String(this.new_exf1sts) === String(this.exf1sts)) { this.exf1stsFlag = false; } else { this.exf1stsFlag = true; }
    if (String(this.new_exfaccouncement1) === String(this.exfaccouncement1)) { this.exfaccouncement1Flag = false; } else { this.exfaccouncement1Flag = true; }
    if (String(this.new_exf2) === String(this.exf2)) { this.exf2Flag = false; } else { this.exf2Flag = true; }
    if (String(this.new_exf2sts) === String(this.exf2sts)) { this.exf2stsFlag = false; } else { this.exf2stsFlag = true; }
    if (String(this.new_exfaccouncement2) === String(this.exfaccouncement2)) { this.exfaccouncement2Flag = false; } else { this.exfaccouncement2Flag = true; }
    if (String(this.new_exf3) === String(this.exf3)) { this.exf3Flag = false; } else { this.exf3Flag = true; }
    if (String(this.new_exf3sts) === String(this.exf3sts)) { this.exf3stsFlag = false; } else { this.exf3stsFlag = true; }
    if (String(this.new_exfaccouncement3) === String(this.exfaccouncement3)) { this.exfaccouncement3Flag = false; } else { this.exfaccouncement3Flag = true; }
    if (String(this.new_invoiceno1) === String(this.invoiceno1)) { this.invoiceno1Flag = false; } else { this.invoiceno1Flag = true; }
    if (String(this.new_invoiceno2) === String(this.invoiceno2)) { this.invoiceno2Flag = false; } else { this.invoiceno2Flag = true; }
    if (String(this.new_invoiceno3) === String(this.invoiceno3)) { this.invoiceno3Flag = false; } else { this.invoiceno3Flag = true; }
    if (String(this.new_invoicedate1) === String(this.invoicedate1)) { this.invoicedate1Flag = false; } else { this.invoicedate1Flag = true; }
    if (String(this.new_invoicedate2) === String(this.invoicedate2)) { this.invoicedate2Flag = false; } else { this.invoicedate2Flag = true; }
    if (String(this.new_invoicedate3) === String(this.invoicedate3)) { this.invoicedate3Flag = false; } else { this.invoicedate3Flag = true; }
    if (String(this.new_etd1) === String(this.etd1)) { this.etd1Flag = false; } else { this.etd1Flag = true; }
    if (String(this.new_etd2) === String(this.etd2)) { this.etd2Flag = false; } else { this.etd2Flag = true; }
    if (String(this.new_etd3) === String(this.etd3)) { this.etd3Flag = false; } else { this.etd3Flag = true; }
    if (String(this.new_eta1) === String(this.eta1)) { this.eta1Flag = false; } else { this.eta1Flag = true; }
    if (String(this.new_eta2) === String(this.eta2)) { this.eta2Flag = false; } else { this.eta2Flag = true; }
    if (String(this.new_eta3) === String(this.eta3)) { this.eta3Flag = false; } else { this.eta3Flag = true; }
    if (String(this.new_mode1) === String(this.mode1)) { this.mode1Flag = false; } else { this.mode1Flag = true; }
    if (String(this.new_mode2) === String(this.mode2)) { this.mode2Flag = false; } else { this.mode2Flag = true; }
    if (String(this.new_mode3) === String(this.mode3)) { this.mode3Flag = false; } else { this.mode3Flag = true; }
    if (String(this.new_from1) === String(this.from1)) { this.from1Flag = false; } else { this.from1Flag = true; }
    if (String(this.new_from2) === String(this.from2)) { this.from2Flag = false; } else { this.from2Flag = true; }
    if (String(this.new_from3) === String(this.from3)) { this.from3Flag = false; } else { this.from3Flag = true; }
    if (String(this.new_vessel1) === String(this.vessel1)) { this.vessel1Flag = false; } else { this.vessel1Flag = true; }
    if (String(this.new_vessel2) === String(this.vessel2)) { this.vessel2Flag = false; } else { this.vessel2Flag = true; }
    if (String(this.new_vessel3) === String(this.vessel3)) { this.vessel3Flag = false; } else { this.vessel3Flag = true; }
    if (String(this.new_awborblno1) === String(this.awborblno1)) { this.awborblno1Flag = false; } else { this.awborblno1Flag = true; }
    if (String(this.new_awborblno2) === String(this.awborblno2)) { this.awborblno2Flag = false; } else { this.awborblno2Flag = true; }
    if (String(this.new_awborblno3) === String(this.awborblno3)) { this.awborblno3Flag = false; } else { this.awborblno3Flag = true; }
    if (String(this.new_ewaybillreq) === String(this.ewaybillreq)) { this.ewaybillreqFlag = false; } else { this.ewaybillreqFlag = true; }
    if (String(this.new_ewaybillno) === String(this.ewaybillno)) { this.ewaybillnoFlag = false; } else { this.ewaybillnoFlag = true; }
    if (String(this.new_remarks2) === String(this.remarks2)) { this.remarks2Flag = false; } else { this.remarks2Flag = true; }
    if (String(this.new_commonth) === String(this.commonth)) { this.commonthFlag = false; } else { this.commonthFlag = true; }
    if (String(this.new_checkedon) === String(this.checkedon)) { this.checkedonFlag = false; } else { this.checkedonFlag = true; }
    if (String(this.new_forinfo) === String(this.forinfo)) { this.forinfoFlag = false; } else { this.forinfoFlag = true; }
    if (String(this.new_nextcheck) === String(this.nextcheck)) { this.nextcheckFlag = false; } else { this.nextcheckFlag = true; }
    if (String(this.new_pmtsts) === String(this.pmtsts)) { this.pmtstsFlag = false; } else { this.pmtstsFlag = true; }
    if (String(this.new_delsts) === String(this.delsts)) { this.delstsFlag = false; } else { this.delstsFlag = true; }
  }

  chkRoNullCondition() {
    if (this.indentsheetnum === null || undefined) { this.indentsheetnum = '' }
    if (this.sossummary === null || undefined) { this.sossummary = '' }
    if (this.sales1id === null || undefined) { this.sales1id = '' }
    if (this.indentissuedate === null || undefined) { this.indentissuedate = '' }
    if (this.ordertype === null || undefined) { this.ordertype = '' }
    if (this.sales1 === null || undefined) { this.sales1 = '' }
    if (this.crmoptnum === null || undefined) { this.crmoptnum = '' }
    if (this.sales2id === null || undefined) { this.sales2id = '' }
    if (this.sales2 === null || undefined) { this.sales2 = '' }
    if (this.customerponum === null || undefined) { this.customerponum = '' }
    if (this.spcur === null || undefined) { this.spcur = '' }
    if (this.lptotal === null || undefined) { this.lptotal = '' }
    if (this.customerpodate === null || undefined) { this.customerpodate = '' }
    if (this.sptotal === null || undefined) { this.sptotal = '' }
    if (this.tpcur === null || undefined) { this.tpcur = '' }
    if (this.tp1 === null || undefined) { this.tp1 = '' }
    if (this.tp2 === null || undefined) { this.tp2 = '' }
    if (this.pmttrms === null || undefined) { this.pmttrms = '' }
    if (this.iigm === null || undefined) { this.iigm = '' }
    if (this.pckandfwdamnt === null || undefined) { this.pckandfwdamnt = '' }
    if (this.domesticfreightamnt === null || undefined) { this.domesticfreightamnt = '' }
    if (this.instorcomamnt === null || undefined) { this.instorcomamnt = '' }
    if (this.sgstpc === null || undefined) { this.sgstpc = '' }
    if (this.sgstamount === null || undefined) { this.sgstamount = '' }
    if (this.cgstpc === null || undefined) { this.cgstpc = '' }
    if (this.cgstamount === null || undefined) { this.cgstamount = '' }
    if (this.igstpc === null || undefined) { this.igstpc = '' }
    if (this.igstamount === null || undefined) { this.igstamount = '' }
    if (this.contractacntname === null || undefined) { this.contractacntname = '' }
    if (this.cntrcode === null || undefined) { this.cntrcode = '' }
    if (this.cntraddress === null || undefined) { this.cntraddress = '' }
    if (this.cntrcountry === null || undefined) { this.cntrcountry = '' }
    if (this.cntrgstcode === null || undefined) { this.cntrgstcode = '' }
    if (this.cntrtel === null || undefined) { this.cntrtel = '' }
    if (this.cntrcontactperson === null || undefined) { this.cntrcontactperson = '' }
    if (this.cntremail === null || undefined) { this.cntremail = '' }
    if (this.useracntname === null || undefined) { this.useracntname = '' }
    if (this.uacode === null || undefined) { this.uacode = '' }
    if (this.uaaddress === null || undefined) { this.uaaddress = '' }
    if (this.uacountry === null || undefined) { this.uacountry = '' }
    if (this.uagstcode === null || undefined) { this.uagstcode = '' }
    if (this.uatel === null || undefined) { this.uatel = '' }
    if (this.uacontactperson === null || undefined) { this.uacontactperson = '' }
    if (this.uaemail === null || undefined) { this.uaemail = '' }
    if (this.keyaccountflag === null || undefined) { this.keyaccountflag = '' }
    if (this.advtype === null || undefined) { this.advtype = '' }
    if (this.advpc === null || undefined) { this.advpc = '' }
    if (this.advamount === null || undefined) { this.advamount = '' }
    if (this.advdate === null || undefined) { this.advdate = '' }
    if (this.bshtype === null || undefined) { this.bshtype = '' }
    if (this.bshpc === null || undefined) { this.bshpc = '' }
    if (this.bshamount === null || undefined) { this.bshamount = '' }
    if (this.bshdate === null || undefined) { this.bshdate = '' }
    if (this.ashtype === null || undefined) { this.ashtype = '' }
    if (this.ashpc === null || undefined) { this.ashpc = '' }
    if (this.ashamount === null || undefined) { this.ashamount = '' }
    if (this.ashdate === null || undefined) { this.ashdate = '' }
    if (this.thirdpcomcur === null || undefined) { this.thirdpcomcur = '' }
    if (this.thirdpcomamnt === null || undefined) { this.thirdpcomamnt = '' }
    if (this.thirdpcompaidby === null || undefined) { this.thirdpcompaidby = '' }
    if (this.comacntname === null || undefined) { this.comacntname = '' }
    if (this.comcode === null || undefined) { this.comcode = '' }
    if (this.comaddress === null || undefined) { this.comaddress = '' }
    if (this.comcountry === null || undefined) { this.comcountry = '' }
    if (this.comgstcode === null || undefined) { this.comgstcode = '' }
    if (this.comtel === null || undefined) { this.comtel = '' }
    if (this.comcontactperson === null || undefined) { this.comcontactperson = '' }
    if (this.comemail === null || undefined) { this.comemail = '' }
    if (this.csutomerapplicationcode === null || undefined) { this.csutomerapplicationcode = '' }
    if (this.customerapplicationtype === null || undefined) { this.customerapplicationtype = '' }
    if (this.customerappdesc === null || undefined) { this.customerappdesc = '' }
    if (this.reqetdbycustomer === null || undefined) { this.reqetdbycustomer = '' }
    if (this.reqetdtoij === null || undefined) { this.reqetdtoij = '' }
    if (this.reqetabycustomer === null || undefined) { this.reqetabycustomer = '' }
    if (this.reqetatoij === null || undefined) { this.reqetatoij = '' }
    if (this.trdtrmswithcustomer === null || undefined) { this.trdtrmswithcustomer = '' }
    if (this.trdtrmswithij === null || undefined) { this.trdtrmswithij = '' }
    if (this.destportbycustomer === null || undefined) { this.destportbycustomer = '' }
    if (this.destporttoij === null || undefined) { this.destporttoij = '' }
    if (this.mot === null || undefined) { this.mot = '' }
    if (this.mottoij === null || undefined) { this.mottoij = '' }
    if (this.freight1 === null || undefined) { this.freight1 = '' }
    if (this.freight2 === null || undefined) { this.freight2 = '' }
    if (this.coo === null || undefined) { this.coo = '' }
    if (this.epa === null || undefined) { this.epa = '' }
    if (this.ip === null || undefined) { this.ip = '' }
    if (this.freedetentionperiod === null || undefined) { this.freedetentionperiod = '' }
    if (this.consigneeacntname === null || undefined) { this.consigneeacntname = '' }
    if (this.cnscode === null || undefined) { this.cnscode = '' }
    if (this.cnsaddress === null || undefined) { this.cnsaddress = '' }
    if (this.cnscountry === null || undefined) { this.cnscountry = '' }
    if (this.cnsgstcode === null || undefined) { this.cnsgstcode = '' }
    if (this.cnscontactperson === null || undefined) { this.cnscontactperson = '' }
    if (this.cnstel === null || undefined) { this.cnstel = '' }
    if (this.cnsemail === null || undefined) { this.cnsemail = '' }
    if (this.cnsieccode === null || undefined) { this.cnsieccode = '' }
    if (this.banknameoncad === null || undefined) { this.banknameoncad = '' }
    if (this.banktel === null || undefined) { this.banktel = '' }
    if (this.bankaddress === null || undefined) { this.bankaddress = '' }
    if (this.notifyacntname === null || undefined) { this.notifyacntname = '' }
    if (this.ntfcode === null || undefined) { this.ntfcode = '' }
    if (this.ntfaddress === null || undefined) { this.ntfaddress = '' }
    if (this.ntfcountry === null || undefined) { this.ntfcountry = '' }
    if (this.ntfgstcode === null || undefined) { this.ntfgstcode = '' }
    if (this.ntfcontactperson === null || undefined) { this.ntfcontactperson = '' }
    if (this.ntftel === null || undefined) { this.ntftel = '' }
    if (this.ntfemail === null || undefined) { this.ntfemail = '' }
    if (this.fobfowarder === null || undefined) { this.fobfowarder = '' }
    if (this.productionstart === null || undefined) { this.productionstart = '' }
    if (this.customerposheet === null || undefined) { this.customerposheet = '' }
    if (this.customerpi === null || undefined) { this.customerpi = '' }
    if (this.customersrsheet === null || undefined) { this.customersrsheet = '' }
    if (this.othlcdraft === null || undefined) { this.othlcdraft = '' }
    if (this.othdrawing === null || undefined) { this.othdrawing = '' }
    if (this.othdoc1 === null || undefined) { this.othdoc1 = '' }
    if (this.othtestreport === null || undefined) { this.othtestreport = '' }
    if (this.othdoc2 === null || undefined) { this.othdoc2 = '' }
    if (this.remarks1 === null || undefined) { this.remarks1 = '' }
    if (this.pino === null || undefined) { this.pino = '' }
    if (this.pidate === null || undefined) { this.pidate = '' }
    if (this.iipono === null || undefined) { this.iipono = '' }
    if (this.iipodate === null || undefined) { this.iipodate = '' }
    if (this.ijprjno === null || undefined) { this.ijprjno = '' }
    if (this.ocdate === null || undefined) { this.ocdate = '' }
    if (this.sadate === null || undefined) { this.sadate = '' }
    if (this.lcchkdateij === null || undefined) { this.lcchkdateij = '' }
    if (this.lcopendate === null || undefined) { this.lcopendate = '' }
    if (this.lclastrevisiondate === null || undefined) { this.lclastrevisiondate = '' }
    if (this.latestshipmentdate === null || undefined) { this.latestshipmentdate = '' }
    if (this.lcexpirydate === null || undefined) { this.lcexpirydate = '' }
    if (this.exf1 === null || undefined) { this.exf1 = '' }
    if (this.exf1sts === null || undefined) { this.exf1sts = '' }
    if (this.exfaccouncement1 === null || undefined) { this.exfaccouncement1 = '' }
    if (this.exf2 === null || undefined) { this.exf2 = '' }
    if (this.exf2sts === null || undefined) { this.exf2sts = '' }
    if (this.exfaccouncement2 === null || undefined) { this.exfaccouncement2 = '' }
    if (this.exf3 === null || undefined) { this.exf3 = '' }
    if (this.exf3sts === null || undefined) { this.exf3sts = '' }
    if (this.exfaccouncement3 === null || undefined) { this.exfaccouncement3 = '' }
    if (this.invoiceno1 === null || undefined) { this.invoiceno1 = '' }
    if (this.invoiceno2 === null || undefined) { this.invoiceno2 = '' }
    if (this.invoiceno3 === null || undefined) { this.invoiceno3 = '' }
    if (this.invoicedate1 === null || undefined) { this.invoicedate1 = '' }
    if (this.invoicedate2 === null || undefined) { this.invoicedate2 = '' }
    if (this.invoicedate3 === null || undefined) { this.invoicedate3 = '' }
    if (this.etd1 === null || undefined) { this.etd1 = '' }
    if (this.etd2 === null || undefined) { this.etd2 = '' }
    if (this.etd3 === null || undefined) { this.etd3 = '' }
    if (this.eta1 === null || undefined) { this.eta1 = '' }
    if (this.eta2 === null || undefined) { this.eta2 = '' }
    if (this.eta3 === null || undefined) { this.eta3 = '' }
    if (this.mode1 === null || undefined) { this.mode1 = '' }
    if (this.mode2 === null || undefined) { this.mode2 = '' }
    if (this.mode3 === null || undefined) { this.mode3 = '' }
    if (this.from1 === null || undefined) { this.from1 = '' }
    if (this.from2 === null || undefined) { this.from2 = '' }
    if (this.from3 === null || undefined) { this.from3 = '' }
    if (this.vessel1 === null || undefined) { this.vessel1 = '' }
    if (this.vessel2 === null || undefined) { this.vessel2 = '' }
    if (this.vessel3 === null || undefined) { this.vessel3 = '' }
    if (this.awborblno1 === null || undefined) { this.awborblno1 = '' }
    if (this.awborblno2 === null || undefined) { this.awborblno2 = '' }
    if (this.awborblno3 === null || undefined) { this.awborblno3 = '' }
    if (this.ewaybillreq === null || undefined) { this.ewaybillreq = '' }
    if (this.ewaybillno === null || undefined) { this.ewaybillno = '' }
    if (this.remarks2 === null || undefined) { this.remarks2 = '' }
    if (this.commonth === null || undefined) { this.commonth = '' }
    if (this.checkedon === null || undefined) { this.checkedon = '' }
    if (this.forinfo === null || undefined) { this.forinfo = '' }
    if (this.nextcheck === null || undefined) { this.nextcheck = '' }
    if (this.pmtsts === null || undefined) { this.pmtsts = '' }
    if (this.delsts === null || undefined) { this.delsts = '' }
    this.chkR1NullCondition();
  }

  chkR1NullCondition() {
    if (this.new_indentsheetnum === null || undefined) { this.new_indentsheetnum = '' }
    if (this.new_sossummary === null || undefined) { this.new_sossummary = '' }
    if (this.new_sales1id === null || undefined) { this.new_sales1id = '' }
    if (this.new_indentissuedate === null || undefined) { this.new_indentissuedate = '' }
    if (this.new_ordertype === null || undefined) { this.new_ordertype = '' }
    if (this.new_sales1 === null || undefined) { this.new_sales1 = '' }
    if (this.new_crmoptnum === null || undefined) { this.new_crmoptnum = '' }
    if (this.new_sales2id === null || undefined) { this.new_sales2id = '' }
    if (this.new_sales2 === null || undefined) { this.new_sales2 = '' }
    if (this.new_customerponum === null || undefined) { this.new_customerponum = '' }
    if (this.new_spcur === null || undefined) { this.new_spcur = '' }
    if (this.new_lptotal === null || undefined) { this.new_lptotal = '' }
    if (this.new_customerpodate === null || undefined) { this.new_customerpodate = '' }
    if (this.new_sptotal === null || undefined) { this.new_sptotal = '' }
    if (this.new_tpcur === null || undefined) { this.new_tpcur = '' }
    if (this.new_tp1 === null || undefined) { this.new_tp1 = '' }
    if (this.new_tp2 === null || undefined) { this.new_tp2 = '' }
    if (this.new_pmttrms === null || undefined) { this.new_pmttrms = '' }
    if (this.new_iigm === null || undefined) { this.new_iigm = '' }
    if (this.new_pckandfwdamnt === null || undefined) { this.new_pckandfwdamnt = '' }
    if (this.new_domesticfreightamnt === null || undefined) { this.new_domesticfreightamnt = '' }
    if (this.new_instorcomamnt === null || undefined) { this.new_instorcomamnt = '' }
    if (this.new_sgstpc === null || undefined) { this.new_sgstpc = '' }
    if (this.new_sgstamount === null || undefined) { this.new_sgstamount = '' }
    if (this.new_cgstpc === null || undefined) { this.new_cgstpc = '' }
    if (this.new_cgstamount === null || undefined) { this.new_cgstamount = '' }
    if (this.new_igstpc === null || undefined) { this.new_igstpc = '' }
    if (this.new_igstamount === null || undefined) { this.new_igstamount = '' }
    if (this.new_contractacntname === null || undefined) { this.new_contractacntname = '' }
    if (this.new_cntrcode === null || undefined) { this.new_cntrcode = '' }
    if (this.new_cntraddress === null || undefined) { this.new_cntraddress = '' }
    if (this.new_cntrcountry === null || undefined) { this.new_cntrcountry = '' }
    if (this.new_cntrgstcode === null || undefined) { this.new_cntrgstcode = '' }
    if (this.new_cntrtel === null || undefined) { this.new_cntrtel = '' }
    if (this.new_cntrcontactperson === null || undefined) { this.new_cntrcontactperson = '' }
    if (this.new_cntremail === null || undefined) { this.new_cntremail = '' }
    if (this.new_useracntname === null || undefined) { this.new_useracntname = '' }
    if (this.new_uacode === null || undefined) { this.new_uacode = '' }
    if (this.new_uaaddress === null || undefined) { this.new_uaaddress = '' }
    if (this.new_uacountry === null || undefined) { this.new_uacountry = '' }
    if (this.new_uagstcode === null || undefined) { this.new_uagstcode = '' }
    if (this.new_uatel === null || undefined) { this.new_uatel = '' }
    if (this.new_uacontactperson === null || undefined) { this.new_uacontactperson = '' }
    if (this.new_uaemail === null || undefined) { this.new_uaemail = '' }
    if (this.new_keyaccountflag === null || undefined) { this.new_keyaccountflag = '' }
    if (this.new_advtype === null || undefined) { this.new_advtype = '' }
    if (this.new_advpc === null || undefined) { this.new_advpc = '' }
    if (this.new_advamount === null || undefined) { this.new_advamount = '' }
    if (this.new_advdate === null || undefined) { this.new_advdate = '' }
    if (this.new_bshtype === null || undefined) { this.new_bshtype = '' }
    if (this.new_bshpc === null || undefined) { this.new_bshpc = '' }
    if (this.new_bshamount === null || undefined) { this.new_bshamount = '' }
    if (this.new_bshdate === null || undefined) { this.new_bshdate = '' }
    if (this.new_ashtype === null || undefined) { this.new_ashtype = '' }
    if (this.new_ashpc === null || undefined) { this.new_ashpc = '' }
    if (this.new_ashamount === null || undefined) { this.new_ashamount = '' }
    if (this.new_ashdate === null || undefined) { this.new_ashdate = '' }
    if (this.new_thirdpcomcur === null || undefined) { this.new_thirdpcomcur = '' }
    if (this.new_thirdpcomamnt === null || undefined) { this.new_thirdpcomamnt = '' }
    if (this.new_thirdpcompaidby === null || undefined) { this.new_thirdpcompaidby = '' }
    if (this.new_comacntname === null || undefined) { this.new_comacntname = '' }
    if (this.new_comcode === null || undefined) { this.new_comcode = '' }
    if (this.new_comaddress === null || undefined) { this.new_comaddress = '' }
    if (this.new_comcountry === null || undefined) { this.new_comcountry = '' }
    if (this.new_comgstcode === null || undefined) { this.new_comgstcode = '' }
    if (this.new_comtel === null || undefined) { this.new_comtel = '' }
    if (this.new_comcontactperson === null || undefined) { this.new_comcontactperson = '' }
    if (this.new_comemail === null || undefined) { this.new_comemail = '' }
    if (this.new_csutomerapplicationcode === null || undefined) { this.new_csutomerapplicationcode = '' }
    if (this.new_customerapplicationtype === null || undefined) { this.new_customerapplicationtype = '' }
    if (this.new_customerappdesc === null || undefined) { this.new_customerappdesc = '' }
    if (this.new_reqetdbycustomer === null || undefined) { this.new_reqetdbycustomer = '' }
    if (this.new_reqetdtoij === null || undefined) { this.new_reqetdtoij = '' }
    if (this.new_reqetabycustomer === null || undefined) { this.new_reqetabycustomer = '' }
    if (this.new_reqetatoij === null || undefined) { this.new_reqetatoij = '' }
    if (this.new_trdtrmswithcustomer === null || undefined) { this.new_trdtrmswithcustomer = '' }
    if (this.new_trdtrmswithij === null || undefined) { this.new_trdtrmswithij = '' }
    if (this.new_destportbycustomer === null || undefined) { this.new_destportbycustomer = '' }
    if (this.new_destporttoij === null || undefined) { this.new_destporttoij = '' }
    if (this.new_mot === null || undefined) { this.new_mot = '' }
    if (this.new_mottoij === null || undefined) { this.new_mottoij = '' }
    if (this.new_freight1 === null || undefined) { this.new_freight1 = '' }
    if (this.new_freight2 === null || undefined) { this.new_freight2 = '' }
    if (this.new_coo === null || undefined) { this.new_coo = '' }
    if (this.new_epa === null || undefined) { this.new_epa = '' }
    if (this.new_ip === null || undefined) { this.new_ip = '' }
    if (this.new_freedetentionperiod === null || undefined) { this.new_freedetentionperiod = '' }
    if (this.new_consigneeacntname === null || undefined) { this.new_consigneeacntname = '' }
    if (this.new_cnscode === null || undefined) { this.new_cnscode = '' }
    if (this.new_cnsaddress === null || undefined) { this.new_cnsaddress = '' }
    if (this.new_cnscountry === null || undefined) { this.new_cnscountry = '' }
    if (this.new_cnsgstcode === null || undefined) { this.new_cnsgstcode = '' }
    if (this.new_cnscontactperson === null || undefined) { this.new_cnscontactperson = '' }
    if (this.new_cnstel === null || undefined) { this.new_cnstel = '' }
    if (this.new_cnsemail === null || undefined) { this.new_cnsemail = '' }
    if (this.new_cnsieccode === null || undefined) { this.new_cnsieccode = '' }
    if (this.new_banknameoncad === null || undefined) { this.new_banknameoncad = '' }
    if (this.new_banktel === null || undefined) { this.new_banktel = '' }
    if (this.new_bankaddress === null || undefined) { this.new_bankaddress = '' }
    if (this.new_notifyacntname === null || undefined) { this.new_notifyacntname = '' }
    if (this.new_ntfcode === null || undefined) { this.new_ntfcode = '' }
    if (this.new_ntfaddress === null || undefined) { this.new_ntfaddress = '' }
    if (this.new_ntfcountry === null || undefined) { this.new_ntfcountry = '' }
    if (this.new_ntfgstcode === null || undefined) { this.new_ntfgstcode = '' }
    if (this.new_ntfcontactperson === null || undefined) { this.new_ntfcontactperson = '' }
    if (this.new_ntftel === null || undefined) { this.new_ntftel = '' }
    if (this.new_ntfemail === null || undefined) { this.new_ntfemail = '' }
    if (this.new_fobfowarder === null || undefined) { this.new_fobfowarder = '' }
    if (this.new_productionstart === null || undefined) { this.new_productionstart = '' }
    if (this.new_customerposheet === null || undefined) { this.new_customerposheet = '' }
    if (this.new_customerpi === null || undefined) { this.new_customerpi = '' }
    if (this.new_customersrsheet === null || undefined) { this.new_customersrsheet = '' }
    if (this.new_othlcdraft === null || undefined) { this.new_othlcdraft = '' }
    if (this.new_othdrawing === null || undefined) { this.new_othdrawing = '' }
    if (this.new_othdoc1 === null || undefined) { this.new_othdoc1 = '' }
    if (this.new_othtestreport === null || undefined) { this.new_othtestreport = '' }
    if (this.new_othdoc2 === null || undefined) { this.new_othdoc2 = '' }
    if (this.new_remarks1 === null || undefined) { this.new_remarks1 = '' }
    if (this.new_pino === null || undefined) { this.new_pino = '' }
    if (this.new_pidate === null || undefined) { this.new_pidate = '' }
    if (this.new_iipono === null || undefined) { this.new_iipono = '' }
    if (this.new_iipodate === null || undefined) { this.new_iipodate = '' }
    if (this.new_ijprjno === null || undefined) { this.new_ijprjno = '' }
    if (this.new_ocdate === null || undefined) { this.new_ocdate = '' }
    if (this.new_sadate === null || undefined) { this.new_sadate = '' }
    if (this.new_lcchkdateij === null || undefined) { this.new_lcchkdateij = '' }
    if (this.new_lcopendate === null || undefined) { this.new_lcopendate = '' }
    if (this.new_lclastrevisiondate === null || undefined) { this.new_lclastrevisiondate = '' }
    if (this.new_latestshipmentdate === null || undefined) { this.new_latestshipmentdate = '' }
    if (this.new_lcexpirydate === null || undefined) { this.new_lcexpirydate = '' }
    if (this.new_exf1 === null || undefined) { this.new_exf1 = '' }
    if (this.new_exf1sts === null || undefined) { this.new_exf1sts = '' }
    if (this.new_exfaccouncement1 === null || undefined) { this.new_exfaccouncement1 = '' }
    if (this.new_exf2 === null || undefined) { this.new_exf2 = '' }
    if (this.new_exf2sts === null || undefined) { this.new_exf2sts = '' }
    if (this.new_exfaccouncement2 === null || undefined) { this.new_exfaccouncement2 = '' }
    if (this.new_exf3 === null || undefined) { this.new_exf3 = '' }
    if (this.new_exf3sts === null || undefined) { this.new_exf3sts = '' }
    if (this.new_exfaccouncement3 === null || undefined) { this.new_exfaccouncement3 = '' }
    if (this.new_invoiceno1 === null || undefined) { this.new_invoiceno1 = '' }
    if (this.new_invoiceno2 === null || undefined) { this.new_invoiceno2 = '' }
    if (this.new_invoiceno3 === null || undefined) { this.new_invoiceno3 = '' }
    if (this.new_invoicedate1 === null || undefined) { this.new_invoicedate1 = '' }
    if (this.new_invoicedate2 === null || undefined) { this.new_invoicedate2 = '' }
    if (this.new_invoicedate3 === null || undefined) { this.new_invoicedate3 = '' }
    if (this.new_etd1 === null || undefined) { this.new_etd1 = '' }
    if (this.new_etd2 === null || undefined) { this.new_etd2 = '' }
    if (this.new_etd3 === null || undefined) { this.new_etd3 = '' }
    if (this.new_eta1 === null || undefined) { this.new_eta1 = '' }
    if (this.new_eta2 === null || undefined) { this.new_eta2 = '' }
    if (this.new_eta3 === null || undefined) { this.new_eta3 = '' }
    if (this.new_mode1 === null || undefined) { this.new_mode1 = '' }
    if (this.new_mode2 === null || undefined) { this.new_mode2 = '' }
    if (this.new_mode3 === null || undefined) { this.new_mode3 = '' }
    if (this.new_from1 === null || undefined) { this.new_from1 = '' }
    if (this.new_from2 === null || undefined) { this.new_from2 = '' }
    if (this.new_from3 === null || undefined) { this.new_from3 = '' }
    if (this.new_vessel1 === null || undefined) { this.new_vessel1 = '' }
    if (this.new_vessel2 === null || undefined) { this.new_vessel2 = '' }
    if (this.new_vessel3 === null || undefined) { this.new_vessel3 = '' }
    if (this.new_awborblno1 === null || undefined) { this.new_awborblno1 = '' }
    if (this.new_awborblno2 === null || undefined) { this.new_awborblno2 = '' }
    if (this.new_awborblno3 === null || undefined) { this.new_awborblno3 = '' }
    if (this.new_ewaybillreq === null || undefined) { this.new_ewaybillreq = '' }
    if (this.new_ewaybillno === null || undefined) { this.new_ewaybillno = '' }
    if (this.new_remarks2 === null || undefined) { this.new_remarks2 = '' }
    if (this.new_commonth === null || undefined) { this.new_commonth = '' }
    if (this.new_checkedon === null || undefined) { this.new_checkedon = '' }
    if (this.new_forinfo === null || undefined) { this.new_forinfo = '' }
    if (this.new_nextcheck === null || undefined) { this.new_nextcheck = '' }
    if (this.new_pmtsts === null || undefined) { this.new_pmtsts = '' }
    if (this.new_delsts === null || undefined) { this.new_delsts = '' }
    this.compareIndentResult();
  }
}
