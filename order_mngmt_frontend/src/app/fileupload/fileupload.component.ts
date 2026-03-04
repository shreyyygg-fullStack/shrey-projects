import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { IndentUpdateStatus, DetailDialogDataSet, getYear, updateIndentData, GetFileList, GetAllFilterDownloadList, SelectedFileIndentSts, IndentDetail } from '../shared/services/indentdb.type';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UploadfileService } from '../shared/services/uploadfile.service';
import { NgbModalOptions, NgbModalRef, ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompareUploadedfilesComponent } from '../shared/compare-uploadedfiles/compare-uploadedfiles.component';
import { saveAs } from 'file-saver';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { convertArrayToCSV } from 'convert-array-to-csv';
import { GlobalConstants } from '../shared/common/global-constants';
import { CommonServiceService } from '../shared/services/common-service.service';
import { FilemanagementService } from '../shared/services/filemanagement.service';
import { UtilService } from '../shared/services/util.service';


@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css'],
  providers: [DatePipe, CommonServiceService, FilemanagementService]
})
export class FileuploadComponent implements OnInit {

  @ViewChild('fileUploader') fileUploader: ElementRef;

  uploadForm: FormGroup;
  currentFileMsg: any;
  existingFileMsg: any;
  msgSAFileProcess: any;
  obj: any;
  chkLenght: string[];
  errDialogList: string[];
  uploadObj: any;
  file: File;
  fileToReadIndentNo: File;
  currentFileUpload: File;
  fileName;
  fileSize;
  progress = 0;
  arrayBuffer: any;
  exCellStartData = 1;
  exCellEndData = 172;
  exStartRow = 3;
  date;
  oneDay;
  intDate;
  numberOfDaysToAdd;
  dayDiff;
  dateValidate;
  fileDetailFlag = false;
  fileProgressFlag = true;
  successMessage;
  warningMessage;
  dangerMessage;
  alertSuccess;
  alertWarning;
  alertDanger;
  new_successMessage = false;
  new_warningMessage = false;
  new_dangerMessage = false;
  modalFireCondition = true;
  modelType;
  formUpdateStatus: IndentUpdateStatus[] = [];

  dp = new DatePipe('en-US');
  // isUpload = true;
  isLoadModal = false;
  saTitle = '';
  saMessage = '';
  selectFileIndentNo: any;
  MAXINDENTNO = 16;

  /* Init Model */
  detaildatasource: DetailDialogDataSet[] = [];
  /* End Init Model */

  selectedFiles: FileList;
  currentFile: File;
  message = '';


  indentNumber: string;

  modalOptions: NgbModalOptions;   // never used ===========================================
  modalRef: NgbModalRef;
  closeResult: string;
  indentSheetNumber: any;

  isRevised = false;
  testString: string;
  fileIndentNo: string;

  existingRevFileToCompare: any;

  //Indent Data 
  indent_sheet_num;
  indent_issue_date;
  crm_opt_num;
  sos_summary;
  sales1_id;
  sales1_name;
  sales2_id;
  sales2_name;
  order_type;
  customer_po_num;
  customer_po_date;
  contract_acnt_name;
  cntr_code;
  cntr_country;
  cntr_address;
  cntr_tel;
  cntr_gst_code;
  cntr_contact_person;
  cntr_email;
  user_acnt_name;
  ua_code;
  ua_country;
  ua_address;
  ua_tel;
  ua_gst_code;
  ua_contact_person;
  ua_email;
  key_account_flag;
  sp_cur;
  lp_total;
  sp_total;
  pck_and_fwd_amnt;
  domestic_freight_amnt;
  igst_pc;
  igst_amount;
  sgst_pc;
  sgst_amount;
  cgst_pc;
  cgst_amount;
  inst_com_amnt;
  tp_cur;
  tp1;
  tp2;
  iigm;
  pmt_trms;
  adv_type;
  adv_pc;
  adv_amount;
  adv_date;
  bsh_type;
  bsh_pc;
  bsh_amount;
  bsh_date;
  ash_type;
  ash_pc;
  ash_amount;
  ash_date;
  thirdp_com_cur;
  thirdp_com_amnt;
  thirdp_com_paid_by;
  com_acnt_name;
  com_code;
  com_country;
  com_address;
  com_tel;
  com_gst_code;
  com_contact_person;
  com_email;
  csutomer_application_code;
  customer_application_type;
  customer_app_desc;
  req_etd_by_customer;
  req_eta_by_customer;
  trd_trms_with_customer;
  dest_port_by_customer;
  mot;
  freight1;
  req_etd_to_ij;
  req_eta_to_ij;
  trd_trms_with_ij;
  dest_port_to_ij;
  mot_to_ij;
  freight2;
  coo;
  epa;
  ip;
  free_detention_period;
  consignee_acnt_name;
  cns_code;
  cns_country;
  cns_address;
  cns_tel;
  cns_gst_code;
  cns_contact_person;
  cns_email;
  cns_iec_code;
  bank_name_on_cad;
  address;
  tel;
  notify_acnt_name;
  ntf_code;
  ntf_country;
  ntf_address;
  ntf_tel;
  ntf_gst_code;
  ntf_contact_person;
  ntf_email;
  production_start;
  oth_customer_po_sheet;
  oth_sr_spec_sheet;
  oth_drawing;
  oth_test_report;
  oth_pi;
  oth_lc_draft;
  oth_doc1;
  oth_doc2;
  remarks1;
  pi_no;
  pi_date;
  iipo_no;
  iipo_date;
  ij_project_num;
  oc_date;
  sa_date;
  lc_chk_date_by_ij;
  lc_open_date;
  lc_last_revision_date;
  latest_shipment_date;
  lc_expiry_date;
  exf1;
  exf1_sts;
  exf_ij_accment1;
  exf2;
  exf2_sts;
  exf_ij_accment2;
  exf3;
  exf3_sts;
  exf_ij_accment3;
  fob_fowarder;
  invoice_no1;
  invoice_date1;
  mode1;
  from1;
  vessel1;
  awb_bl_no1;
  etd1;
  eta1;
  invoice_no2;
  invoice_date2;
  mode2;
  from2;
  vessel2;
  awb_bl_no2;
  etd2;
  eta2;
  invoice_no3;
  invoice_date3;
  mode3;
  from3;
  vessel3;
  awb_bl_no3;
  etd3;
  eta3;
  eway_bill_req;
  eway_bill_num;
  remarks2;
  com_month;
  checked_on;
  next_check;
  for_info;
  pmt_sts;
  del_sts;
  //End here


  yearList: getYear[] = [];
  errorMessage: '';
  loading: boolean;
  loaded: boolean;   // never used ===========================================
  filterForm2: FormGroup;
  selectedYear: any;
  selectedFilter: any;
  isYearSelected: boolean;
  isSubmitted = false;
  dynamicMsgValue: updateIndentData[] = [];

  list: GetFileList[] = [];
  title: string;
  isResponseLoaded = false;
  isInserted = false;
  errorCount = 0;
  errorList: any;
  errorMsgListToHtmlFormat;
  specNotFinal = false;
  advPending = false;
  letterCredPending = false;
  befShpPending = false;
  outstanding = false;
  prodNotStarted = false;
  lcCheckPending = false;
  pExfPending = false;
  fExfPending = false;
  shpSchPendning = false;
  shpAdvicePending = false;

  yearSelFlag = false;
  filterSelflag = false;


  selFileIndSts: SelectedFileIndentSts[] = [];


  indentDownloadDetail: any[] = [];
  indentDowanloadList: any[][] = [];

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


  constructor(private httpcon: HttpClient, private modalService: NgbModal, private datePipe: DatePipe, private router: Router, private uploadService: UploadfileService, private fb: FormBuilder, private commonService: CommonServiceService, private filemanagementService: FilemanagementService, private utilService: UtilService) {
    this.filterForm2 = this.fb.group({
      checkArray: this.fb.array([]),
      year: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.uploadForm = this.fb.group({
      profile: ['']
    });
    this.resetDownload(false);
  }

  homeRouterInit() {
    this.router.navigate(['ii/home']);
  }

  fileUploadRouterInit() {
    location.reload();
  }



  async selectFile(event) {

    this.selectedFiles = event.target.files;
    this.file = event.target.files[0];
    this.isRevised = false;

    this.uploadForm.get('profile').setValue(this.file);

    this.fileName = '';
    this.fileSize = 0;

    if (this.file.name.slice(this.file.name.length - 4).includes('.xls') || this.file.name.slice(this.file.name.length - 5).includes('.xlsx')) {
      this.incomingfile(event);
    }
    else {
      this.fileUploader.nativeElement.value = null;
      this.commonService.toast('info', 'Only excel file can be uploaded. [Accept: xls, xlsx]');
      return;
    }

  }


  chkSelFileIndNoSts() {

    if (this.selectFileIndentNo.length === this.MAXINDENTNO) {
      const urllink = GlobalConstants.apiCheckIndentStatus + this.selectFileIndentNo;
      this.httpcon.get<SelectedFileIndentSts[]>(urllink)
        .pipe(map(Response => {
          this.selFileIndSts = [];
          this.selFileIndSts = Response;

          if (this.selFileIndSts['selFileNotExistFlag'] === '1') {
            this.fileName = this.file.name;
            this.fileSize = this.file.size;
            this.fileDetailFlag = true;
          }

          if (this.selFileIndSts['selFileExistAndEqualFlag'] === '1') {
            this.commonService.toast("error", 'Selected file exist in database. Please try with different file.')

          }


          if (this.selFileIndSts['selFileRevisedFileExist'] === '1') {

            this.currentFileMsg = this.selectFileIndentNo;
            this.existingFileMsg = this.selFileIndSts['existingIndentFile'];
            this.msgSAFileProcess = "Do you want to upload the file? ";
            Swal.close();
            Swal.fire({
              title: 'Selected File Revision Exist In Database',
              html: `
              <pre>Selected File: <code style="color:red">${this.currentFileMsg}</code></pre>
           <pre>Existing Revision File: <code>${this.existingFileMsg}</code></pre>
           <pre><code>${this.msgSAFileProcess}</code></pre>
         `,
              icon: 'info',
              showDenyButton: true,
              denyButtonText: 'NO',
              denyButtonColor: '#dc3545',
              confirmButtonText: 'YES',
              confirmButtonColor: '#282E89',
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                this.fileName = this.file.name;
                this.fileSize = this.file.size;
                this.fileDetailFlag = true;
                this.existingRevFileToCompare = this.selFileIndSts['existingIndentFile'];
                this.indentNumber = this.selectFileIndentNo;
                this.isRevised = true;
              }
              else if (result.isDenied) {
                this.onClearFile();
              }
            })


          }

        }))
        .subscribe();

    } else {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'File Cannot be Upload',
        text: 'Indent Number Format Is Not Correct',
        allowOutsideClick: false,
        confirmButtonColor: '#282E89'
      })
    }
  }




  async upload() {
    this.openDialogOnUploadFile();
    this.currentFile = this.selectedFiles.item(0);
    const formData: FormData = new FormData();
    formData.append('file', this.currentFile);

    return await this.httpcon.post<any>(GlobalConstants.apiUploadData, formData)
      .pipe(map(Response => {

        if (Response === null || undefined) {
          this.openPopupDialogForNullCheck();
          return;
        } else {
          this.obj = Response;
        }

        if (this.obj.error_title === 'File Uploaded Successfully') {

          if (this.isRevised === true) {
            this.isRevised = false;
          }
          this.saTitle = this.obj.error_title;
          this.saMessage = this.obj.message;
          Swal.close();
          Swal.fire({
            icon: 'success',
            title: this.saTitle,
            allowOutsideClick: false,
            html: this.saMessage,
            confirmButtonColor: '#282E89',
          }).then((result) => {
            if (result.isConfirmed) {
              this.onClearFile();
              
              // if(this.obj.cust_po != null || undefined || '') {
              //   Swal.close();
              //   Swal.fire({
              //     title: 'CUSTOMER PO',
              //     icon: 'info',
              //     allowOutsideClick: false,
              //     html:
              //       this.obj.cust_po +
              //       ' '+
              //       'already exists in multiple indent',
              //       confirmButtonColor: '#282E89',
              //   })

              // }

            }
          })
        } else {

          if (this.obj.responseList !== null || undefined) {
            this.chkLenght = this.obj.responseList;

            if (this.chkLenght.length !== 0) {
              this.errorMsgListToHtmlFormat = '';
              this.saTitle = this.obj.error_title;
              for (var i = 0; i < this.chkLenght.length; i++) {
                this.errorMsgListToHtmlFormat += this.obj.responseList[i];
              }

              Swal.close();
              Swal.fire({
                icon: 'error',
                title: this.saTitle,
                allowOutsideClick: false,
                html: this.errorMsgListToHtmlFormat,
                confirmButtonColor: '#282E89',
              })
            } else {
              this.saTitle = this.obj.error_title;
              this.saMessage = this.obj.message;
              Swal.close();
              Swal.fire({
                icon: 'error',
                title: this.saTitle,
                allowOutsideClick: false,
                html: this.saMessage,
                confirmButtonColor: '#282E89',
              })

            }
          } else {
            this.saTitle = this.obj.error_title;
            this.saMessage = this.obj.message;
            Swal.close();
            Swal.fire({
              icon: 'error',
              title: this.saTitle,
              allowOutsideClick: false,
              html: this.saMessage,
              confirmButtonColor: '#282E89',
            })
          }

        }

      }, error => {

      }))
      .subscribe();
  }


  openPopupDialogForNullCheck() {
    Swal.close();
    this.commonService.toast("error", 'Something went wrong. Please try again');

  }


  openDialogOnUploadFile() {
    Swal.fire({
      title: 'File Uploading!',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading()
      },
    })

  }



  onModalOpenDetailDialog(indentNo) {


    indentNo = this.existingRevFileToCompare;

    this.indentSheetNumber = indentNo;
    this.modalRef = this.modalService.open(CompareUploadedfilesComponent);
    this.modalRef.componentInstance.my_modal_title = 'compare-uploadedfiles';
    this.modalRef.componentInstance.my_modal_content = indentNo;
    this.modalRef.componentInstance.indentSheetNumber = this.indentSheetNumber;
    this.modalRef.componentInstance.new_indentsheetnum = this.indent_sheet_num;
    this.modalRef.componentInstance.new_indentissuedate = this.datePipe.transform(this.indent_issue_date, 'yyyy-MM-dd'); 
    this.modalRef.componentInstance.new_crmoptnum = this.crm_opt_num;
    this.modalRef.componentInstance.new_sossummary = this.sos_summary;
    this.modalRef.componentInstance.new_sales1id = this.sales1_id;
    this.modalRef.componentInstance.new_sales1 = this.sales1_name;
    this.modalRef.componentInstance.new_sales2id = this.sales2_id;
    this.modalRef.componentInstance.new_sales2 = this.sales2_name;
    this.modalRef.componentInstance.new_ordertype = this.order_type;
    this.modalRef.componentInstance.new_customerponum = this.customer_po_num;
    this.modalRef.componentInstance.new_customerpodate = this.datePipe.transform(this.customer_po_date, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_contractacntname = this.contract_acnt_name;
    this.modalRef.componentInstance.new_cntrcode = this.cntr_code;
    this.modalRef.componentInstance.new_cntrcountry = this.cntr_country;
    this.modalRef.componentInstance.new_cntraddress = this.cntr_address;
    this.modalRef.componentInstance.new_cntrtel = this.cntr_tel;
    this.modalRef.componentInstance.new_cntrgstcode = this.cntr_gst_code;
    this.modalRef.componentInstance.new_cntrcontactperson = this.cntr_contact_person;
    this.modalRef.componentInstance.new_cntremail = this.cntr_email;
    this.modalRef.componentInstance.new_useracntname = this.user_acnt_name;
    this.modalRef.componentInstance.new_uacode = this.ua_code;
    this.modalRef.componentInstance.new_uacountry = this.ua_country;
    this.modalRef.componentInstance.new_uaaddress = this.ua_address;
    this.modalRef.componentInstance.new_uatel = this.ua_tel;
    this.modalRef.componentInstance.new_uagstcode = this.ua_gst_code;
    this.modalRef.componentInstance.new_uacontactperson = this.ua_contact_person;
    this.modalRef.componentInstance.new_uaemail = this.ua_email;
    this.modalRef.componentInstance.new_keyaccountflag = this.key_account_flag;
    this.modalRef.componentInstance.new_spcur = this.sp_cur;
    this.modalRef.componentInstance.new_lptotal = this.lp_total;
    this.modalRef.componentInstance.new_sptotal = this.sp_total;
    this.modalRef.componentInstance.new_pckandfwdamnt = this.pck_and_fwd_amnt;
    this.modalRef.componentInstance.new_domesticfreightamnt = this.domestic_freight_amnt;
    this.modalRef.componentInstance.new_igstpc = this.igst_pc;
    this.modalRef.componentInstance.new_igstamount = this.igst_amount;
    this.modalRef.componentInstance.new_sgstpc = this.sgst_pc;
    this.modalRef.componentInstance.new_sgstamount = this.sgst_amount;
    this.modalRef.componentInstance.new_cgstpc = this.cgst_pc;
    this.modalRef.componentInstance.new_cgstamount = this.cgst_amount;
    this.modalRef.componentInstance.new_instorcomamnt = this.inst_com_amnt;
    this.modalRef.componentInstance.new_tpcur = this.tp_cur;
    this.modalRef.componentInstance.new_tp1 = this.tp1;
    this.modalRef.componentInstance.new_tp2 = this.tp2;
    this.modalRef.componentInstance.new_iigm = this.iigm;
    this.modalRef.componentInstance.new_pmttrms = this.pmt_trms;
    this.modalRef.componentInstance.new_advtype = this.adv_type;
    this.modalRef.componentInstance.new_advpc = this.adv_pc;
    this.modalRef.componentInstance.new_advamount = this.adv_amount;
    this.modalRef.componentInstance.new_advdate = this.datePipe.transform(this.adv_date, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_bshtype = this.bsh_type;
    this.modalRef.componentInstance.new_bshpc = this.bsh_pc;
    this.modalRef.componentInstance.new_bshamount = this.bsh_amount;
    this.modalRef.componentInstance.new_bshdate = this.datePipe.transform(this.bsh_date, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_ashtype = this.ash_type;
    this.modalRef.componentInstance.new_ashpc = this.ash_pc;
    this.modalRef.componentInstance.new_ashamount = this.ash_amount;
    this.modalRef.componentInstance.new_ashdate = this.datePipe.transform(this.ash_date, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_thirdpcomcur = this.thirdp_com_cur;
    this.modalRef.componentInstance.new_thirdpcomamnt = this.thirdp_com_amnt;
    this.modalRef.componentInstance.new_thirdpcompaidby = this.thirdp_com_paid_by;
    this.modalRef.componentInstance.new_comacntname = this.com_acnt_name;
    this.modalRef.componentInstance.new_comcode = this.com_code;
    this.modalRef.componentInstance.new_comcountry = this.com_country;
    this.modalRef.componentInstance.new_comaddress = this.com_address;
    this.modalRef.componentInstance.new_comtel = this.com_tel;
    this.modalRef.componentInstance.new_comgstcode = this.com_gst_code;
    this.modalRef.componentInstance.new_comcontactperson = this.com_contact_person;
    this.modalRef.componentInstance.new_comemail = this.com_email;
    this.modalRef.componentInstance.new_csutomerapplicationcode = this.csutomer_application_code;
    this.modalRef.componentInstance.new_customerapplicationtype = this.customer_application_type;
    this.modalRef.componentInstance.new_customerappdesc = this.customer_app_desc;
    this.modalRef.componentInstance.new_reqetdbycustomer = this.datePipe.transform(this.req_etd_by_customer, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_reqetabycustomer = this.datePipe.transform(this.req_eta_by_customer, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_trdtrmswithcustomer = this.trd_trms_with_customer;
    this.modalRef.componentInstance.new_destportbycustomer = this.dest_port_by_customer;
    this.modalRef.componentInstance.new_mot = this.mot;
    this.modalRef.componentInstance.new_freight1 = this.freight1;
    this.modalRef.componentInstance.new_reqetdtoij = this.datePipe.transform(this.req_etd_to_ij, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_reqetatoij = this.datePipe.transform(this.req_eta_to_ij, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_trdtrmswithij = this.trd_trms_with_ij;
    this.modalRef.componentInstance.new_destporttoij = this.dest_port_to_ij;
    this.modalRef.componentInstance.new_mottoij = this.mot_to_ij;
    this.modalRef.componentInstance.new_freight2 = this.freight2;
    this.modalRef.componentInstance.new_coo = this.coo;
    this.modalRef.componentInstance.new_epa = this.epa;
    this.modalRef.componentInstance.new_ip = this.ip;
    this.modalRef.componentInstance.new_freedetentionperiod = this.free_detention_period;
    this.modalRef.componentInstance.new_consigneeacntname = this.consignee_acnt_name;
    this.modalRef.componentInstance.new_cnscode = this.cns_code;
    this.modalRef.componentInstance.new_cnscountry = this.cns_country;
    this.modalRef.componentInstance.new_cnsaddress = this.cns_address;
    this.modalRef.componentInstance.new_cnstel = this.cns_tel;
    this.modalRef.componentInstance.new_cnsgstcode = this.cns_gst_code;
    this.modalRef.componentInstance.new_cnscontactperson = this.cns_contact_person;
    this.modalRef.componentInstance.new_cnsemail = this.cns_email;
    this.modalRef.componentInstance.new_cnsieccode = this.cns_iec_code;
    this.modalRef.componentInstance.new_banknameoncad = this.bank_name_on_cad;
    this.modalRef.componentInstance.new_bankaddress = this.address;
    this.modalRef.componentInstance.new_banktel = this.tel;
    this.modalRef.componentInstance.new_notifyacntname = this.notify_acnt_name;
    this.modalRef.componentInstance.new_ntfcode = this.ntf_code;
    this.modalRef.componentInstance.new_ntfcountry = this.ntf_country;
    this.modalRef.componentInstance.new_ntfaddress = this.ntf_address;
    this.modalRef.componentInstance.new_ntftel = this.ntf_tel;
    this.modalRef.componentInstance.new_ntfgstcode = this.ntf_gst_code;
    this.modalRef.componentInstance.new_ntfcontactperson = this.ntf_contact_person;
    this.modalRef.componentInstance.new_ntfemail = this.ntf_email;
    this.modalRef.componentInstance.new_productionstart = this.production_start;
    this.modalRef.componentInstance.new_customerposheet = this.oth_customer_po_sheet;
    this.modalRef.componentInstance.new_customersrsheet = this.oth_sr_spec_sheet;
    this.modalRef.componentInstance.new_othdrawing = this.oth_drawing;
    this.modalRef.componentInstance.new_othtestreport = this.oth_test_report;
    this.modalRef.componentInstance.new_customerpi = this.oth_pi;
    this.modalRef.componentInstance.new_othlcdraft = this.oth_lc_draft;
    this.modalRef.componentInstance.new_othdoc1 = this.oth_doc1;
    this.modalRef.componentInstance.new_othdoc2 = this.oth_doc2;
    this.modalRef.componentInstance.new_remarks1 = this.remarks1;
    this.modalRef.componentInstance.new_pino = this.pi_no;
    this.modalRef.componentInstance.new_pidate = this.datePipe.transform(this.pi_date, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_iipono = this.iipo_no;
    this.modalRef.componentInstance.new_iipodate = this.datePipe.transform(this.iipo_date, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_ijprjno = this.ij_project_num;
    this.modalRef.componentInstance.new_ocdate = this.datePipe.transform(this.oc_date, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_sadate = this.datePipe.transform(this.sa_date, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_lcchkdateij = this.datePipe.transform(this.lc_chk_date_by_ij, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_lcopendate = this.datePipe.transform(this.lc_open_date, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_lclastrevisiondate = this.datePipe.transform(this.lc_last_revision_date, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_latestshipmentdate = this.datePipe.transform(this.latest_shipment_date, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_lcexpirydate = this.datePipe.transform(this.lc_expiry_date, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_exf1 = this.datePipe.transform(this.exf1, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_exf1sts = this.exf1_sts;
    this.modalRef.componentInstance.new_exfaccouncement1 = this.datePipe.transform(this.exf_ij_accment1, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_exf2 = this.datePipe.transform(this.exf2, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_exf2sts = this.exf2_sts;
    this.modalRef.componentInstance.new_exfaccouncement2 = this.datePipe.transform(this.exf_ij_accment2, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_exf3 = this.datePipe.transform(this.exf3, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_exf3sts = this.exf3_sts;
    this.modalRef.componentInstance.new_exfaccouncement3 = this.datePipe.transform(this.exf_ij_accment3, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_fobfowarder = this.fob_fowarder;
    this.modalRef.componentInstance.new_invoiceno1 = this.invoice_no1;
    this.modalRef.componentInstance.new_invoicedate1 = this.datePipe.transform(this.invoice_date1, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_mode1 = this.mode1;
    this.modalRef.componentInstance.new_from1 = this.from1;
    this.modalRef.componentInstance.new_vessel1 = this.vessel1;
    this.modalRef.componentInstance.new_awborblno1 = this.awb_bl_no1;
    this.modalRef.componentInstance.new_etd1 = this.datePipe.transform(this.etd1, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_eta1 = this.datePipe.transform(this.eta1, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_invoiceno2 = this.invoice_no2;
    this.modalRef.componentInstance.new_invoicedate2 = this.datePipe.transform(this.invoice_date2, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_mode2 = this.mode2;
    this.modalRef.componentInstance.new_from2 = this.from2;
    this.modalRef.componentInstance.new_vessel2 = this.vessel2;
    this.modalRef.componentInstance.new_awborblno2 = this.awb_bl_no2;
    this.modalRef.componentInstance.new_etd2 = this.datePipe.transform(this.etd2, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_eta2 = this.datePipe.transform(this.eta2, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_invoiceno3 = this.invoice_no3;
    this.modalRef.componentInstance.new_invoicedate3 = this.datePipe.transform(this.invoice_date3, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_mode3 = this.mode3;
    this.modalRef.componentInstance.new_from3 = this.from3;
    this.modalRef.componentInstance.new_vessel3 = this.vessel3;
    this.modalRef.componentInstance.new_awborblno3 = this.awb_bl_no3;
    this.modalRef.componentInstance.new_etd3 = this.datePipe.transform(this.etd3, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_eta3 = this.datePipe.transform(this.eta3, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_ewaybillreq = this.eway_bill_req;
    this.modalRef.componentInstance.new_ewaybillno = this.eway_bill_num;
    this.modalRef.componentInstance.new_remarks2 = this.remarks2;
    this.modalRef.componentInstance.new_commonth = this.datePipe.transform(this.com_month, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_checkedon = this.datePipe.transform(this.checked_on, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_nextcheck = this.datePipe.transform(this.next_check, 'yyyy-MM-dd');
    this.modalRef.componentInstance.new_forinfo = this.for_info;
    this.modalRef.componentInstance.new_pmtsts = this.pmt_sts;
    this.modalRef.componentInstance.new_delsts = this.del_sts;

    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  setSelectedFileIndentNo(cNum, cData) {

    cData = cData.toString().replace(/(\r\n|\n|\r)/gm, '').trim();

    if (cData === 'blank') {
      cData = cData.toString().replace('blank', '');
    }

    switch (cNum.toString()) {

      case '1': { this.selectFileIndentNo = cData; break; }
      default: { break; }
    }
  }


  incomingfile(event) {
    this.file = event.target.files[0];
    this.selectFileIndentNo = '';
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result; /* Store in array buffer to convert type array */
      const exceldata = new Uint8Array(this.arrayBuffer);
      const workbook = XLSX.read(exceldata, { type: 'array', cellDates: true });
      const firstsheetname = workbook.SheetNames[0];      /* get first excel sheet name */
      const worksheet = workbook.Sheets[firstsheetname];  /* Create worksheet with ref of sheet name */

      for (let wkrow = this.exCellStartData; wkrow <= this.exCellEndData; wkrow++) {
        const cellId = 'B' + (wkrow + this.exStartRow);
        let desiredcell = worksheet[cellId];

        if (!desiredcell) {
          worksheet[cellId] = { t: 'z' };
          worksheet[cellId] = { v: 'blank' };
          desiredcell = worksheet[cellId];
        }
        this.validateExcelData(wkrow, desiredcell.v);
      }

      this.chkSelFileIndNoSts();

    };

    fileReader.readAsArrayBuffer(this.file);
  }

  // selectUpload(val) {
  //   this.isUpload = true;
  //   this.resetDownload(false);
  // }

  onClearFile() {
    this.progress = 0;

    // if(this.isUpload==true){
      this.fileUploader.nativeElement.value = null;
    // }
    
    this.fileDetailFlag = false;
    this.message = "";
    this.isResponseLoaded = false;
    this.dynamicMsgValue = [];
    this.isInserted = false;

    this.new_successMessage = false;
    this.new_warningMessage = false;
    this.new_dangerMessage = false;

    //clear varibales
    this.indent_sheet_num = "";
    this.indent_issue_date = "";
    this.crm_opt_num = "";
    this.sos_summary = "";
    this.sales1_id = "";
    this.sales1_name = "";
    this.sales2_id = "";
    this.sales2_name = "";
    this.order_type = "";
    this.customer_po_num = "";
    this.customer_po_date = "";
    this.contract_acnt_name = "";
    this.cntr_code = "";
    this.cntr_country = "";
    this.cntr_address = "";
    this.cntr_tel = "";
    this.cntr_gst_code = "";
    this.cntr_contact_person = "";
    this.cntr_email = "";
    this.user_acnt_name = "";
    this.ua_code = "";
    this.ua_country = "";
    this.ua_address = "";
    this.ua_tel = "";
    this.ua_gst_code = "";
    this.ua_contact_person = "";
    this.ua_email = "";
    this.key_account_flag = "";
    this.sp_cur = "";
    this.lp_total = "";
    this.sp_total = "";
    this.pck_and_fwd_amnt = "";
    this.domestic_freight_amnt = "";
    this.igst_pc = "";
    this.igst_amount = "";
    this.sgst_pc = "";
    this.sgst_amount = "";
    this.cgst_pc = "";
    this.cgst_amount = "";
    this.inst_com_amnt = "";
    this.tp_cur = "";
    this.tp1 = "";
    this.tp2 = "";
    this.iigm = "";
    this.pmt_trms = "";
    this.adv_type = "";
    this.adv_pc = "";
    this.adv_amount = "";
    this.adv_date = "";
    this.bsh_type = "";
    this.bsh_pc = "";
    this.bsh_amount = "";
    this.bsh_date = "";
    this.ash_type = "";
    this.ash_pc = "";
    this.ash_amount = "";
    this.ash_date = "";
    this.thirdp_com_cur = "";
    this.thirdp_com_amnt = "";
    this.thirdp_com_paid_by = "";
    this.com_acnt_name = "";
    this.com_code = "";
    this.com_country = "";
    this.com_address = "";
    this.com_tel = "";
    this.com_gst_code = "";
    this.com_contact_person = "";
    this.com_email = "";
    this.csutomer_application_code = "";
    this.customer_application_type = "";
    this.customer_app_desc = "";
    this.req_etd_by_customer = "";
    this.req_eta_by_customer = "";
    this.trd_trms_with_customer = "";
    this.dest_port_by_customer = "";
    this.mot = "";
    this.freight1 = "";
    this.req_etd_to_ij = "";
    this.req_eta_to_ij = "";
    this.trd_trms_with_ij = "";
    this.dest_port_to_ij = "";
    this.mot_to_ij = "";
    this.freight2 = "";
    this.coo = "";
    this.epa = "";
    this.ip = "";
    this.free_detention_period = "";
    this.consignee_acnt_name = "";
    this.cns_code = "";
    this.cns_country = "";
    this.cns_address = "";
    this.cns_tel = "";
    this.cns_gst_code = "";
    this.cns_contact_person = "";
    this.cns_email = "";
    this.cns_iec_code = "";
    this.bank_name_on_cad = "";
    this.address = "";
    this.tel = "";
    this.notify_acnt_name = "";
    this.ntf_code = "";
    this.ntf_country = "";
    this.ntf_address = "";
    this.ntf_tel = "";
    this.ntf_gst_code = "";
    this.ntf_contact_person = "";
    this.ntf_email = "";
    this.production_start = "";
    this.oth_customer_po_sheet = "";
    this.oth_sr_spec_sheet = "";
    this.oth_drawing = "";
    this.oth_test_report = "";
    this.oth_pi = "";
    this.oth_lc_draft = "";
    this.oth_doc1 = "";
    this.oth_doc2 = "";
    this.remarks1 = "";
    this.pi_no = "";
    this.pi_date = "";
    this.iipo_no = "";
    this.iipo_date = "";
    this.ij_project_num = "";
    this.oc_date = "";
    this.sa_date = "";
    this.lc_chk_date_by_ij = "";
    this.lc_open_date = "";
    this.lc_last_revision_date = "";
    this.latest_shipment_date = "";
    this.lc_expiry_date = "";
    this.exf1 = "";
    this.exf1_sts = "";
    this.exf_ij_accment1 = "";
    this.exf2 = "";
    this.exf2_sts = "";
    this.exf_ij_accment2 = "";
    this.exf3 = "";
    this.exf3_sts = "";
    this.exf_ij_accment3 = "";
    this.fob_fowarder = "";
    this.invoice_no1 = "";
    this.invoice_date1 = "";
    this.mode1 = "";
    this.from1 = "";
    this.vessel1 = "";
    this.awb_bl_no1 = "";
    this.etd1 = "";
    this.eta1 = "";
    this.invoice_no2 = "";
    this.invoice_date2 = "";
    this.mode2 = "";
    this.from2 = "";
    this.vessel2 = "";
    this.awb_bl_no2 = "";
    this.etd2 = "";
    this.eta2 = "";
    this.invoice_no3 = "";
    this.invoice_date3 = "";
    this.mode3 = "";
    this.from3 = "";
    this.vessel3 = "";
    this.awb_bl_no3 = "";
    this.etd3 = "";
    this.eta3 = "";
    this.eway_bill_req = "";
    this.eway_bill_num = "";
    this.remarks2 = "";
    this.com_month = "";
    this.checked_on = "";
    this.next_check = "";
    this.for_info = "";
    this.pmt_sts = "";
    this.del_sts = "";
  }

  validateExcelData(cellNum, cellData) {
    cellData = cellData.toString().replace(/(\r\n|\n|\r)/gm, '').trim();

    if (cellData === 'blank') {
      cellData = cellData.toString().replace('blank', '');
    }

    switch (cellNum.toString()) {

      case '1': { this.indent_sheet_num = cellData; this.selectFileIndentNo = cellData; break; }
      case '3': { this.crm_opt_num = cellData; break; }
      case '4': { this.sos_summary = cellData; break; }
      case '5': { this.sales1_id = cellData; break; }
      case '6': { this.sales1_name = cellData; break; }
      case '7': { this.sales2_id = cellData; break; }
      case '8': { this.sales2_name = cellData; break; }
      case '9': { this.order_type = cellData; break; }
      case '10': { this.customer_po_num = cellData; break; }
      case '12': { this.contract_acnt_name = cellData; break; }
      case '13': { this.cntr_code = cellData; break; }
      case '14': { this.cntr_country = cellData; break; }
      case '15': { this.cntr_address = cellData; break; }
      case '16': { this.cntr_tel = cellData; break; }
      case '17': { this.cntr_gst_code = cellData; break; }
      case '18': { this.cntr_contact_person = cellData; break; }
      case '19': { this.cntr_email = cellData; break; }
      case '20': { this.user_acnt_name = cellData; break; }
      case '21': { this.ua_code = cellData; break; }
      case '22': { this.ua_country = cellData; break; }
      case '23': { this.ua_address = cellData; break; }
      case '24': { this.ua_tel = cellData; break; }
      case '25': { this.ua_gst_code = cellData; break; }
      case '26': { this.ua_contact_person = cellData; break; }
      case '27': { this.ua_email = cellData; break; }
      case '28': { this.key_account_flag = cellData; break; }
      case '29': { this.sp_cur = cellData; break; }
      case '30': { this.lp_total = cellData; break; }
      case '31': { this.sp_total = cellData; break; }
      case '32': { this.pck_and_fwd_amnt = cellData; break; }
      case '33': { this.domestic_freight_amnt = cellData; break; }
      case '34': { this.sgst_pc = cellData; break; }
      case '35': { this.sgst_amount = cellData; break; }
      case '36': { this.cgst_pc = cellData; break; }
      case '37': { this.cgst_amount = cellData; break; }
      case '38': { this.igst_pc = cellData; break; }
      case '39': { this.igst_amount = cellData; break; }
      case '40': { this.inst_com_amnt = cellData; break; }
      case '41': { this.tp_cur = cellData; break; }
      case '42': { this.tp1 = cellData; break; }
      case '43': { this.tp2 = cellData; break; }
      case '44': { this.iigm = cellData; break; }
      case '45': { this.pmt_trms = cellData; break; }
      case '46': { this.adv_type = cellData; break; }
      case '47': { this.adv_pc = cellData; break; }
      case '48': { this.adv_amount = cellData; break; }
      case '50': { this.bsh_type = cellData; break; }
      case '51': { this.bsh_pc = cellData; break; }
      case '52': { this.bsh_amount = cellData; break; }
      case '54': { this.ash_type = cellData; break; }
      case '55': { this.ash_pc = cellData; break; }
      case '56': { this.ash_amount = cellData; break; }
      case '58': { this.thirdp_com_cur = cellData; break; }
      case '59': { this.thirdp_com_amnt = cellData; break; }
      case '60': { this.thirdp_com_paid_by = cellData; break; }
      case '61': { this.com_acnt_name = cellData; break; }
      case '62': { this.com_code = cellData; break; }
      case '63': { this.com_country = cellData; break; }
      case '64': { this.com_address = cellData; break; }
      case '65': { this.com_tel = cellData; break; }
      case '66': { this.com_gst_code = cellData; break; }
      case '67': { this.com_contact_person = cellData; break; }
      case '68': { this.com_email = cellData; break; }
      case '69': { this.csutomer_application_code = cellData; break; }
      case '70': { this.customer_application_type = cellData; break; }
      case '71': { this.customer_app_desc = cellData; break; }
      case '74': { this.trd_trms_with_customer = cellData; break; }
      case '75': { this.dest_port_by_customer = cellData; break; }
      case '76': { this.mot = cellData; break; }
      case '77': { this.freight1 = cellData; break; }
      case '80': { this.trd_trms_with_ij = cellData; break; }
      case '81': { this.dest_port_to_ij = cellData; break; }
      case '82': { this.mot_to_ij = cellData; break; }
      case '83': { this.freight2 = cellData; break; }
      case '84': { this.coo = cellData; break; }
      case '85': { this.epa = cellData; break; }
      case '86': { this.ip = cellData; break; }
      case '87': { this.free_detention_period = cellData; break; }
      case '88': { this.consignee_acnt_name = cellData; break; }
      case '89': { this.cns_code = cellData; break; }
      case '90': { this.cns_country = cellData; break; }
      case '91': { this.cns_address = cellData; break; }
      case '92': { this.cns_tel = cellData; break; }
      case '93': { this.cns_gst_code = cellData; break; }
      case '94': { this.cns_contact_person = cellData; break; }
      case '95': { this.cns_email = cellData; break; }
      case '96': { this.cns_iec_code = cellData; break; }
      case '97': { this.bank_name_on_cad = cellData; break; }
      case '98': { this.address = cellData; break; }
      case '99': { this.tel = cellData; break; }
      case '100': { this.notify_acnt_name = cellData; break; }
      case '101': { this.ntf_code = cellData; break; }
      case '102': { this.ntf_country = cellData; break; }
      case '103': { this.ntf_address = cellData; break; }
      case '104': { this.ntf_tel = cellData; break; }
      case '105': { this.ntf_gst_code = cellData; break; }
      case '106': { this.ntf_contact_person = cellData; break; }
      case '107': { this.ntf_email = cellData; break; }
      case '108': { this.production_start = cellData; break; }
      case '109': { this.oth_customer_po_sheet = cellData; break; }
      case '110': { this.oth_sr_spec_sheet = cellData; break; }
      case '111': { this.oth_drawing = cellData; break; }
      case '112': { this.oth_test_report = cellData; break; }
      case '113': { this.oth_pi = cellData; break; }
      case '114': { this.oth_lc_draft = cellData; break; }
      case '115': { this.oth_doc1 = cellData; break; }
      case '116': { this.oth_doc2 = cellData; break; }
      case '117': { this.remarks1 = cellData; break; }
      case '118': { this.pi_no = cellData; break; }
      case '120': { this.iipo_no = cellData; break; }
      case '122': { this.ij_project_num = cellData; break; }
      case '131': { this.exf1_sts = cellData; break; }
      case '134': { this.exf2_sts = cellData; break; }
      case '137': { this.exf3_sts = cellData; break; }
      case '139': { this.fob_fowarder = cellData; break; }
      case '140': { this.invoice_no1 = cellData; break; }
      case '142': { this.mode1 = cellData; break; }
      case '143': { this.from1 = cellData; break; }
      case '144': { this.vessel1 = cellData; break; }
      case '145': { this.awb_bl_no1 = cellData; break; }
      case '148': { this.invoice_no2 = cellData; break; }
      case '150': { this.mode2 = cellData; break; }
      case '151': { this.from2 = cellData; break; }
      case '152': { this.vessel2 = cellData; break; }
      case '153': { this.awb_bl_no2 = cellData; break; }
      case '156': { this.invoice_no3 = cellData; break; }
      case '158': { this.mode3 = cellData; break; }
      case '159': { this.from3 = cellData; break; }
      case '160': { this.vessel3 = cellData; break; }
      case '161': { this.awb_bl_no3 = cellData; break; }
      case '164': { this.eway_bill_req = cellData; break; }
      case '165': { this.eway_bill_num = cellData; break; }
      case '166': { this.remarks2 = cellData; break; }
      case '170': { this.for_info = cellData; break; }
      case '171': { this.pmt_sts = cellData; break; }
      case '172': { this.del_sts = cellData; break; }

      case '2': { this.validateDateFields(cellData); this.indent_issue_date = this.dateValidate; break; }
      case '11': { this.validateDateFields(cellData); this.customer_po_date = this.dateValidate; break; }
      case '49': { this.validateDateFields(cellData); this.adv_date = this.dateValidate; break; }
      case '53': { this.validateDateFields(cellData); this.bsh_date = this.dateValidate; break; }
      case '57': { this.validateDateFields(cellData); this.ash_date = this.dateValidate; break; }
      case '72': { this.validateDateFields(cellData); this.req_etd_by_customer = this.dateValidate; break; }
      case '73': { this.validateDateFields(cellData); this.req_eta_by_customer = this.dateValidate; break; }
      case '78': { this.validateDateFields(cellData); this.req_etd_to_ij = this.dateValidate; break; }
      case '79': { this.validateDateFields(cellData); this.req_eta_to_ij = this.dateValidate; break; }
      case '119': { this.validateDateFields(cellData); this.pi_date = this.dateValidate; break; }
      case '121': { this.validateDateFields(cellData); this.iipo_date = this.dateValidate; break; }
      case '123': { this.validateDateFields(cellData); this.oc_date = this.dateValidate; break; }
      case '124': { this.validateDateFields(cellData); this.sa_date = this.dateValidate; break; }
      case '125': { this.validateDateFields(cellData); this.lc_chk_date_by_ij = this.dateValidate; break; }
      case '126': { this.validateDateFields(cellData); this.lc_open_date = this.dateValidate; break; }
      case '127': { this.validateDateFields(cellData); this.lc_last_revision_date = this.dateValidate; break; }
      case '128': { this.validateDateFields(cellData); this.latest_shipment_date = this.dateValidate; break; }
      case '129': { this.validateDateFields(cellData); this.lc_expiry_date = this.dateValidate; break; }
      case '130': { this.validateDateFields(cellData); this.exf1 = this.dateValidate; break; }
      case '132': { this.validateDateFields(cellData); this.exf_ij_accment1 = this.dateValidate; break; }
      case '133': { this.validateDateFields(cellData); this.exf2 = this.dateValidate; break; }
      case '135': { this.validateDateFields(cellData); this.exf_ij_accment2 = this.dateValidate; break; }
      case '136': { this.validateDateFields(cellData); this.exf3 = this.dateValidate; break; }
      case '138': { this.validateDateFields(cellData); this.exf_ij_accment3 = this.dateValidate; break; }
      case '141': { this.validateDateFields(cellData); this.invoice_date1 = this.dateValidate; break; }
      case '146': { this.validateDateFields(cellData); this.etd1 = this.dateValidate; break; }
      case '147': { this.validateDateFields(cellData); this.eta1 = this.dateValidate; break; }
      case '149': { this.validateDateFields(cellData); this.invoice_date2 = this.dateValidate; break; }
      case '154': { this.validateDateFields(cellData); this.etd2 = this.dateValidate; break; }
      case '155': { this.validateDateFields(cellData); this.eta2 = this.dateValidate; break; }
      case '157': { this.validateDateFields(cellData); this.invoice_date3 = this.dateValidate; break; }
      case '162': { this.validateDateFields(cellData); this.etd3 = this.dateValidate; break; }
      case '163': { this.validateDateFields(cellData); this.eta3 = this.dateValidate; break; }
      case '167': { this.validateDateFields(cellData); this.com_month = this.dateValidate; break; }
      case '168': { this.validateDateFields(cellData); this.checked_on = this.dateValidate; break; }
      case '169': { this.validateDateFields(cellData); this.next_check = this.dateValidate; break; }

      default: { break; }
    }
  }

  // validateDateFields(cellValue) {
  //   if (cellValue !== '') {
  //     if (isNumber(cellValue) === true || isNaN(Number(cellValue)) === false) {
  //       this.numberOfDaysToAdd = cellValue;
  //       this.oneDay = 24 * 60 * 60 * 1000;
  //       this.dayDiff = 25567;
  //       this.intDate = new Date((this.numberOfDaysToAdd - (this.dayDiff + 2)) * this.oneDay);
  //       this.dateValidate = this.dp.transform(this.intDate, 'yyyy-MM-dd');
  //     }
  //     else if (isNaN(Number(cellValue)) === true) {
  //       this.date = new Date(cellValue);
  //       this.dateValidate = this.dp.transform(this.date, 'yyyy-MM-dd');
  //     }
  //   }
  //   else {
  //     this.dateValidate = '';
  //   }
  // }

  validateDateFields(cellValue) {
    if (cellValue !== '') {
      if (this.isNumber(cellValue) === true || isNaN(Number(cellValue)) === false) {
        this.numberOfDaysToAdd = cellValue;
        this.oneDay = 24 * 60 * 60 * 1000;
        this.dayDiff = 25567;
        this.intDate = new Date((this.numberOfDaysToAdd - (this.dayDiff + 2)) * this.oneDay);
        this.dateValidate = this.dp.transform(this.intDate, 'yyyy-MM-dd');
      }
      else if (isNaN(Number(cellValue)) === true && this.isNumber(cellValue)) {
        this.date = new Date(cellValue);
        this.dateValidate = this.dp.transform(this.date, 'yyyy-MM-dd');
      }
      else if (!this.isNumber(cellValue)) {
        // this.dateValidate = cellValue;
      }
    }
    else {
      this.dateValidate = '';
    }
  }

  isNumber(value: string | number): boolean {
    return ((value != null) &&
      (value != '') &&
      !isNaN(Number(value.toString())));
  }


  onInputClick(event) {
    event.target.value = '';
    this.fileDetailFlag = false;
    this.fileProgressFlag = false;
  }

  

  // selectDownload(val) {
  //   this.isUpload = false;
  //   this.onClearFile()
  //   this.filterForm2.controls.year.patchValue('');
  //   this.loadYearFromServer();
  //   this.isYearSelected = true;
  //   this.isSubmitted = true;
  //   this.resetDownload(false);
  //   this.setAllDate();
  //   // reset Select Year .
  //   if (this.date2.getMonth() > 2) {
  //     this.selectYear = String(this.date2.getUTCFullYear() + 1);
  //     this.maxYear = this.date2.getUTCFullYear() + 1
  //   }
  //   else {
  //     this.selectYear = String(this.date2.getUTCFullYear());
  //     this.maxYear = this.date2.getUTCFullYear();
  //   }
  //   // reset fromDate and To Date.
  //   this.rfromDate = { day: this.date2.getUTCDate(), month: this.date2.getUTCMonth() + 1, year: this.date2.getUTCFullYear() };
  //   this.rtoDate = { day: this.date2.getUTCDate(), month: this.date2.getUTCMonth() + 1, year: this.date2.getUTCFullYear() };

  // }

  async loadYearFromServer() {
    const param = new HttpParams()
    return await this.httpcon.get<any>(GlobalConstants.apiGetYearList)
      .pipe(map(Response => {
        this.yearList = Response;
        return Response;
      }))
      .subscribe(Response => {
        this.yearList = Response;
      },
        (error) => {
          this.errorMessage = error.message; this.loading = false;
        },
        () => { this.loading = false; })
  }




  resetDownload(value) {
    this.resetFilter(this.filterForm2.value);
  }

  resetFilter(value: GetAllFilterDownloadList) {
    this.specNotFinal = false;
    this.advPending = false;
    this.letterCredPending = false;
    this.befShpPending = false;
    this.outstanding = false;
    this.prodNotStarted = false;
    this.lcCheckPending = false;
    this.pExfPending = false;
    this.fExfPending = false;
    this.shpSchPendning = false;
    this.shpAdvicePending = false;

    value.specNotFinal = 'undefined';
    value.advPending = 'undefined';
    value.letterCredPending = 'undefined';
    value.befShpPending = 'undefined';
    value.outstanding = 'undefined';
    value.prodNotStarted = 'undefined';
    value.lcCheckPending = 'undefined';
    value.pExfPending = 'undefined';
    value.fExfPending = 'undefined';
    value.shpSchPendning = 'undefined';
    value.shpAdvicePending = 'undefined';
  }

  // ----------------------------------FORM DOWNLOAD MODULE------------------------------------- //
}