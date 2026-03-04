import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from '../shared/common/global-constants';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { convertArrayToCSV } from 'convert-array-to-csv';
import { CommonServiceService } from '../shared/services/common-service.service';

@Component({
  selector: 'app-service-management',
  templateUrl: './service-management.component.html',
  styleUrls: ['./service-management.component.css']
})
export class ServiceManagementComponent implements OnInit {

  indentInfo: boolean = false;
  searchMaxLength: number = 50;
  searchText: string = "";
  enableEdit: boolean = false;
  tabType: string = "Open";

  inProdIndents: any[] = [];
  serviceOperationindents: any[] = [];
  completedItems: any[] = [];
  archivedItems: any[] = [];
  openIndentList: any[] = [];
  allIndentList: any[] = [];
  closedIndents: any[] = [];
  closedIndents2: any[] = [];

  inProdIndents2: any[] = [];
  serviceOperationindents2: any[] = [];
  completedItems2: any[] = [];
  archivedItems2: any[] = [];
  openIndentList2: any[] = [];
  openIndex: number | null = null;
  inProdIndex: number | null = null;
  serviceOpIndex: number | null = null;
  completedIndex: number | null = null;
  archivedIndex: number | null = null;
  closedIndex: number | null = null;
  selectedValue;
  selectedIndentInv: any[] = [];

  filedoc;
  previewFlag: boolean = false;
  pdfSrc: string;
  imageSrc;
  imgDwnld;
  zoomLevel: number = 1; // For images 
  pdfZoomLevel: number = 1; // For PDFs 

  selectIndentNo;
  selectedCustomerName;
  serviceRemarks;
  serviceStatus;
  shippingRegion = "";

  constructor(private router: Router, private httpcon: HttpClient, private commonService: CommonServiceService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {

    let department = sessionStorage.getItem('department');
    if (department === "Service") {
      this.enableEdit = true;
    } else {
      this.enableEdit = false;
    }

    this.getServiceMasterData();
  }

  homeRouterInit() {
    this.router.navigate(['ii/home']);
  }

  serviceMgmtRouterInit() {
    location.reload();
  }

  changeTab(type) {

    if (type === "Open") {

      this.tabType = "Open";
      this.searchText = "";
      this.globalSearchKeyUp();
      this.openIndex = null;
      this.inProdIndex = null;
      this.serviceOpIndex = null;
      this.completedIndex = null;
      this.archivedIndex = null;
      this.closedIndex = null;
      this.getServiceMasterData();

    } else if (type === "Closed") {

      this.tabType = "Closed";
      this.searchText = "";
      this.globalSearchKeyUp();
      this.openIndex = null;
      this.inProdIndex = null;
      this.serviceOpIndex = null;
      this.completedIndex = null;
      this.archivedIndex = null;
      this.closedIndex = null;
      this.getServiceMasterData();

    } else if (type === "In Prod") {

      this.tabType = "In Prod";
      this.searchText = "";
      this.globalSearchKeyUp();
      this.openIndex = null;
      this.inProdIndex = null;
      this.serviceOpIndex = null;
      this.completedIndex = null;
      this.archivedIndex = null;
      this.closedIndex = null;
      this.getServiceMasterData();

    } else if (type === "Service Op") {

      this.tabType = "Service Op";
      this.searchText = "";
      this.globalSearchKeyUp();
      this.openIndex = null;
      this.inProdIndex = null;
      this.serviceOpIndex = null;
      this.completedIndex = null;
      this.archivedIndex = null;
      this.closedIndex = null;
      this.getServiceMasterData();

    } else if (type === "Completed") {

      this.tabType = "Completed";
      this.searchText = "";
      this.globalSearchKeyUp();
      this.openIndex = null;
      this.inProdIndex = null;
      this.serviceOpIndex = null;
      this.completedIndex = null;
      this.archivedIndex = null;
      this.closedIndex = null;
      this.getServiceMasterData();

    } else if (type === "Archived") {

      this.tabType = "Archived";
      this.searchText = "";
      this.globalSearchKeyUp();
      this.openIndex = null;
      this.inProdIndex = null;
      this.serviceOpIndex = null;
      this.completedIndex = null;
      this.archivedIndex = null;
      this.closedIndex = null;
      this.getServiceMasterData();
    }

  }

  toggleAccordion(index: number, indentNo, type) {

    if (type === 'Open') {

      if (this.openIndex === index) {
        this.openIndex = null;
      } else {
        this.openIndex = index;
      }

    } else if (type === 'Closed') {

      if (this.closedIndex === index) {
        this.closedIndex = null;
      } else {
        this.closedIndex = index;
      }

    } else if (type === 'In Prod') {

      if (this.inProdIndex === index) {
        this.inProdIndex = null;
      } else {
        this.inProdIndex = index;
      }

    } else if (type === 'Service Op') {

      if (this.serviceOpIndex === index) {
        this.serviceOpIndex = null;
      } else {
        this.serviceOpIndex = index;
      }

    } else if (type === 'Completed') {

      if (this.completedIndex === index) {
        this.completedIndex = null;
      } else {
        this.completedIndex = index;
      }

    } else if (type === 'Archived') {

      if (this.archivedIndex === index) {
        this.archivedIndex = null;
      } else {
        this.archivedIndex = index;
      }

    }

    const url = GlobalConstants.apiGetInvIndentData + indentNo;
    this.httpcon.get<any[]>(url).subscribe(res => {
      this.selectedIndentInv = res;

    }, () => { });

  }

  getServiceMasterData() {
    const url = GlobalConstants.apiServiceData;
    this.httpcon.get<any[]>(url).subscribe(res => {

      let result = res;
      this.allIndentList = res;

      this.openIndentList = this.allIndentList.filter(i => i.service_status_flag === 0);
      this.inProdIndents = this.allIndentList.filter(i => i.service_status_flag === 1);
      this.serviceOperationindents = this.allIndentList.filter(i => i.service_status_flag === 2 || i.service_status_flag === 3 ||
        i.service_status_flag === 4 || i.service_status_flag === 5 || i.service_status_flag === 6 || i.service_status_flag === 8);
      this.completedItems = this.allIndentList.filter(i => i.service_status_flag === 7);
      this.archivedItems = this.allIndentList.filter(i => i.service_status_flag === 9);

      this.closedIndents = this.allIndentList.filter(i => i.service_status_flag === 10);


      this.serviceOperationindents.sort((a, b) => {
        return b.del_sts.localeCompare(a.del_sts) || b.updated_on.localeCompare(a.updated_on);
      }
      );

      this.inProdIndents.sort((a, b) => {
        return b.del_sts.localeCompare(a.del_sts) || b.updated_on.localeCompare(a.updated_on);
      }
      );

      this.openIndentList2 = this.openIndentList;
      this.closedIndents2 = this.closedIndents;
      this.inProdIndents2 = this.inProdIndents;
      this.serviceOperationindents2 = this.serviceOperationindents;
      this.completedItems2 = this.completedItems;
      this.archivedItems2 = this.archivedItems;

    }, () => { });
  }


  onChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedValue = selectElement.value;
    this.serviceOpIndex = null;

    if (this.selectedValue === 'All') {

      this.serviceOperationindents = this.serviceOperationindents2;

    } else if (this.selectedValue === '2') {

      this.serviceOperationindents = this.serviceOperationindents2.filter(item => item.service_status_flag === 2);

    } else if (this.selectedValue === '3') {

      this.serviceOperationindents = this.serviceOperationindents2.filter(item => item.service_status_flag === 3);

    } else if (this.selectedValue === '4') {

      this.serviceOperationindents = this.serviceOperationindents2.filter(item => item.service_status_flag === 4);

    } else if (this.selectedValue === '5') {

      this.serviceOperationindents = this.serviceOperationindents2.filter(item => item.service_status_flag === 5);

    } else if (this.selectedValue === '6') {

      this.serviceOperationindents = this.serviceOperationindents2.filter(item => item.service_status_flag === 6);

    } else if (this.selectedValue === '8') {

      this.serviceOperationindents = this.serviceOperationindents2.filter(item => item.service_status_flag === 8);

    } else if (this.selectedValue === 'Dispatched') {

      this.serviceOperationindents = this.serviceOperationindents2.filter(item => item.del_sts === "D-4" || item.del_sts === "D-5");

    }

  }


  showInvoiceDoc(id) {

    this.filedoc = this.selectedIndentInv.filter(data => data.id === id);

    const base64Str = this.filedoc[0]?.invoice_doc;
    const fileName = this.filedoc[0]?.inv_doc_name;

    this.setPdfOrImageFromBase64(base64Str, fileName);

    this.previewFlag = true;

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
    } else {
      mimeType = 'application/octet-stream';
    }

    const blob = this.base64ToBlob(base64Str, mimeType);
    const fileUrl = URL.createObjectURL(blob);

    if (fileExt === 'pdf') {
      this.pdfSrc = fileUrl;
      this.imageSrc = null;
    } else if (['jpg', 'jpeg', 'png'].includes(fileExt)) {
      this.imgDwnld = fileUrl;
      this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
      this.pdfSrc = null;
    } else {
      this.pdfSrc = null;
      this.imageSrc = null;
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

  //reset zoom for both previews
  resetZoom() {
    this.zoomLevel = 1;
    this.pdfZoomLevel = 1;
  }

  // close single preview modal
  closePreviewModal() {
    this.previewFlag = false;
    this.pdfSrc = null;
    this.imageSrc = null;
    this.resetZoom();
  }

  downloadInvoiceDoc(id) {

    let base64Str = null;
    let fileName = null;

    this.filedoc = this.selectedIndentInv.filter(data => data.id === id);

    base64Str = this.filedoc[0]?.invoice_doc;
    fileName = this.filedoc[0]?.inv_doc_name;

    this.setPdfOrImageFromBase64(base64Str, fileName);
    this.downloadFileLink(fileName);

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

    }
  }

  createServiceStatus(indent, customer, currentStatus, currentRemarks, currentShippingRegion) {

    this.selectIndentNo = indent;
    this.selectedCustomerName = customer;
    this.serviceStatus = currentStatus;
    this.serviceRemarks = currentRemarks;

    if (currentShippingRegion != null) {
      this.shippingRegion = currentShippingRegion;
    } else {
      this.shippingRegion = "";
    }


  }
  closeModal() {
    this.selectIndentNo = "";
    this.selectedCustomerName = "";
    this.serviceRemarks = "";
    this.serviceStatus = "";
    this.shippingRegion = "";
  }

  setIndentStatus(type) {

    let indentStatusFlag = "0";

    if (this.serviceStatus) {
      indentStatusFlag = this.serviceStatus.toString();
    }

    let listType = "Updated";

    if (type === 'Service') {

      if (this.serviceStatus === '2') {

        indentStatusFlag = '2';
        listType = 'moved to Service Operation List';

      } else if (this.serviceStatus === '9') {

        indentStatusFlag = '9';
        listType = 'moved to Archived List';

      }

    } else if (type === 'Service Status') {

      if (this.serviceStatus === '2') {

        indentStatusFlag = '2';
        listType = 'Status Updated';

      } else if (this.serviceStatus === '3') {

        indentStatusFlag = '3';
        listType = 'Status Updated';

      } else if (this.serviceStatus === '4') {

        indentStatusFlag = '4';
        listType = 'Status Updated';

      } else if (this.serviceStatus === '5') {

        indentStatusFlag = '5';
        listType = 'Status Updated';

      }
      else if (this.serviceStatus === '6') {

        indentStatusFlag = '6';
        listType = 'Status Updated';

      } else if (this.serviceStatus === '7') {

        indentStatusFlag = '7';
        listType = 'moved to Completed List';

      } else if (this.serviceStatus === '8') {

        indentStatusFlag = '8';
        listType = 'Status Updated';

      } else if (this.serviceStatus === '9') {

        indentStatusFlag = '9';
        listType = 'moved to Archived List';

      }

    } else if (type === 'Archive') {

      indentStatusFlag = '9';
      listType = 'moved to Archived List';

    } else if (indentStatusFlag === this.serviceStatus.toString()) {
      listType = 'Status Updated';
    }

    const statusRequest = { indentNo: this.selectIndentNo, serviceRemarks: this.serviceRemarks, statusFlag: indentStatusFlag, shipRegion: this.shippingRegion };

    return this.httpcon.post<void>(`${GlobalConstants.apiSetIndentStatus}`, statusRequest).pipe(map(async Response => {

      var serverResponse = Response;
      let affectedRows = serverResponse["affectedRows"];


      if (affectedRows === 1) {

        this.getServiceMasterData();
        Swal.fire({
          icon: "success",
          title: `Indent No. '${this.selectIndentNo}' Successfully ${listType}.`,
          showConfirmButton: true,
          confirmButtonColor: '#282E89',
          allowOutsideClick: false,
        })

        this.openIndex = null;
        this.inProdIndex = null;
        this.serviceOpIndex = null;
        this.completedIndex = null;
        this.archivedIndex = null;
        this.closedIndex = null;

        this.selectIndentNo = "";
        this.selectedCustomerName = "";
        this.serviceRemarks = "";
        this.serviceStatus = "";
        this.shippingRegion = "";
      } else {

        Swal.fire({
          icon: 'error',
          title: 'Failed to Update!',
          confirmButtonColor: '#282E89',
          allowOutsideClick: false,
        })

      }
    })).subscribe();
  }

  archiveIndent(selectedIndent, currentRemark, currentShippingRegion) {

    this.selectIndentNo = selectedIndent;

    if (currentShippingRegion != null) {
      this.shippingRegion = currentShippingRegion;
    } else {
      this.shippingRegion = "";
    }

    if (currentRemark === null) {
      this.serviceRemarks = "";
    } else {
      this.serviceRemarks = currentRemark;
    }

    let msgtext = `Are you sure service operations are not required for Indent " ${this.selectIndentNo} " ?`;

    Swal.fire({
      icon: 'question',
      title: `<p style="font-size:18px;" > ${msgtext} </p>`,
      html: `
    <div style="text-align: left;">
      <label for="swal-input-remark" style="display:block; margin-bottom:6px; font-weight:500;font-size:18px;">
        Service Remarks:
      </label>
      <input id="swal-input-remark" type="text" placeholder="Enter service remarks (optional)" value="${this.serviceRemarks}"
             style="width: 100%; height: 40px; padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px;">
    </div>
  `,
      showDenyButton: true,
      confirmButtonText: 'YES',
      denyButtonText: 'NO',
      confirmButtonColor: '#282E89',
      allowOutsideClick: false,
      preConfirm: () => {
        const remark = (document.getElementById('swal-input-remark') as HTMLInputElement).value;
        return remark;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const enteredRemark = result.value;
        this.serviceRemarks = enteredRemark;
        this.setIndentStatus('Archive');

      } else if (result.isDenied) {
        this.selectIndentNo = "";
        this.selectedCustomerName = "";
        this.serviceRemarks = "";
        this.serviceStatus = "";
        this.shippingRegion = "";
      }
    });

  }

  // method for search bar
  globalSearchKeyUp() {
    this.openIndex = null;
    this.inProdIndex = null;
    this.serviceOpIndex = null;
    this.completedIndex = null;
    this.archivedIndex = null;
    this.closedIndex = null;

    if (this.searchText.length === 0) {

      this.openIndentList = this.openIndentList2;
      this.closedIndents = this.closedIndents2
      this.inProdIndents = this.inProdIndents2;
      this.serviceOperationindents = this.serviceOperationindents2;
      this.completedItems = this.completedItems2;
      this.archivedItems = this.archivedItems2;


      return;
    }

    if (this.tabType === "Open") {

      this.openIndentList = this.openIndentList2.filter(indent => {
        return Object.values(indent).some(value =>
          value && value.toString().toLowerCase().includes(this.searchText.toString().trim().toLowerCase())
        );
      });

    } else if (this.tabType === "Closed") {

      this.closedIndents = this.closedIndents2.filter(indent => {
        return Object.values(indent).some(value =>
          value && value.toString().toLowerCase().includes(this.searchText.toString().trim().toLowerCase())
        );
      });

    } else if (this.tabType === "In Prod") {

      this.inProdIndents = this.inProdIndents2.filter(indent => {
        return Object.values(indent).some(value =>
          value && value.toString().toLowerCase().includes(this.searchText.toString().trim().toLowerCase())
        );
      });

    } else if (this.tabType === "Service Op") {

      this.serviceOperationindents = this.serviceOperationindents2.filter(indent => {
        return Object.values(indent).some(value =>
          value && value.toString().toLowerCase().includes(this.searchText.toString().trim().toLowerCase())
        );
      });

    } else if (this.tabType === "Completed") {

      this.completedItems = this.completedItems2.filter(indent => {
        return Object.values(indent).some(value =>
          value && value.toString().toLowerCase().includes(this.searchText.toString().trim().toLowerCase())
        );
      });

    } else if (this.tabType === "Archived") {

      this.archivedItems = this.archivedItems2.filter(indent => {
        return Object.values(indent).some(value =>
          value && value.toString().toLowerCase().includes(this.searchText.toString().trim().toLowerCase())
        );
      });

    }
  }

  //method to convert table data into excel sheet
  exportCSV() {

    if (this.tabType === "Open") {

      const header = ['INDENT SHEET NO.', 'INDENT ISSUE DATE', 'SOS SUMMARY', 'CONTRACT ACNT NAME', 'ORDER TYPE', 'SALES1 ID', 'SALES1 NAME', 'SALES2 ID', 'SALES2 NAME', 'CNTR COUNTRY', 'CNTR ADDRESS', 'PMT TERMS', 'PMT STATUS', 'DEL STATUS', 'REGION', 'SHIPPING REGION', 'EXF1 DATE', 'EXF1 STATUS', 'EXF2 DATE', 'EXF2 STATUS', 'EXF3 DATE', 'EXF3 STATUS', 'PROD.1 EXF DATE', 'PROD.1 EXF STATUS', 'PROD.2 EXF DATE', 'PROD.2 EXF STATUS', 'PROD.3 EXF DATE', 'PROD.3 EXF STATUS', 'SERVICE REMARKS', 'SERVICE STATUS', 'UPDATED ON', 'UPDATED BY'];
      const data: [{}] = [{}];
      var indentType;
      var serviceStatusString;

      const currentDate = new Date();
      const timestamp = currentDate.getFullYear() + "-" +
        String(currentDate.getMonth() + 1).padStart(2, '0') + "-" +
        String(currentDate.getDate()).padStart(2, '0') + "_" +
        String(currentDate.getHours()).padStart(2, '0') + "-" +
        String(currentDate.getMinutes()).padStart(2, '0') + "-" +
        String(currentDate.getSeconds()).padStart(2, '0');

      if (this.openIndentList2.length == 0) {
        this.commonService.toast("warning", "There is no indent to export!!");
      } else {
        for (let indent of this.openIndentList2) {

          if (indent.service_status_flag === 0) {

            serviceStatusString = "Open";

          } else if (indent.service_status_flag === 1) {

            serviceStatusString = "Ready To Deliver";

          } else if (indent.service_status_flag === 2) {

            serviceStatusString = "I&C Required";

          } else if (indent.service_status_flag === 3) {

            serviceStatusString = "Pre-Installation Call";

          } else if (indent.service_status_flag === 4) {

            serviceStatusString = "Installation in Process";

          } else if (indent.service_status_flag === 5) {

            serviceStatusString = "Installation Completed, Commissioning Pending";

          } else if (indent.service_status_flag === 6) {

            serviceStatusString = "Commissioning In Process";

          } else if (indent.service_status_flag === 7) {

            serviceStatusString = "I&C Completed";

          } else if (indent.service_status_flag === 8) {

            serviceStatusString = "Site Not Ready";

          } else if (indent.service_status_flag === 9) {

            serviceStatusString = "No I&C required";

          }

          var updatedOn;
          const utcDateStr = indent.updated_on;
          const date = new Date(utcDateStr);

          const istDateStr = date.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });

          updatedOn = istDateStr;

          data.push(
            {
              'INDENT SHEET NO.': indent.indent_sheet_num,
              'INDENT ISSUE DATE': indent.indent_issue_date,
              'SOS SUMMARY': indent.sos_summary,
              'CONTRACT ACNT NAME': indent.contract_acnt_name,
              'ORDER TYPE': indent.order_type,
              'SALES1 ID': indent.sales1_id,
              'SALES1 NAME': indent.sales1_name,
              'SALES2 ID': indent.sales2_id,
              'SALES2 NAME': indent.sales2_name,
              'CNTR COUNTRY': indent.cntr_country,
              'CNTR ADDRESS': indent.cntr_address,
              'PMT TERMS': indent.pmt_trms,
              'PMT STATUS': indent.pmt_sts,
              'DEL STATUS': indent.del_sts,
              'REGION': indent.region,
              'SHIPPING REGION': indent.shipping_region,
              'EXF1 DATE': indent.exf1,
              'EXF1 STATUS': indent.exf1_sts,
              'EXF2 DATE': indent.exf2,
              'EXF2 STATUS': indent.exf2_sts,
              'EXF3 DATE': indent.exf3,
              'EXF3 STATUS': indent.exf3_sts,
              'PROD.1 EXF DATE': indent.prod1_date,
              'PROD.1 EXF STATUS': indent.prod1_sts,
              'PROD.2 EXF DATE': indent.prod2_date,
              'PROD.2 EXF STATUS': indent.prod2_sts,
              'PROD.3 EXF DATE': indent.prod3_date,
              'PROD.3 EXF STATUS': indent.prod3_sts,
              'SERVICE REMARKS': indent.service_remarks,
              'SERVICE STATUS': serviceStatusString,
              'UPDATED ON': updatedOn,
              'UPDATED BY': indent.updated_by,
            }
          )
        }

        indentType = "Open";
        let fileName;

        fileName = indentType + "_Indents_" + timestamp;

        const csv = convertArrayToCSV(data, { seperator: ',', header: header });
        var blob = new Blob([csv], { type: "csv;charset=utf-8" });
        saveAs(blob, fileName + '.csv');

      }


    } else if (this.tabType === "Closed") {

      const header = ['INDENT SHEET NO.', 'INDENT ISSUE DATE', 'SOS SUMMARY', 'CONTRACT ACNT NAME', 'ORDER TYPE', 'SALES1 ID', 'SALES1 NAME', 'SALES2 ID', 'SALES2 NAME', 'CNTR COUNTRY', 'CNTR ADDRESS', 'PMT TERMS', 'PMT STATUS', 'DEL STATUS', 'REGION', 'SHIPPING REGION', 'EXF1 DATE', 'EXF1 STATUS', 'EXF2 DATE', 'EXF2 STATUS', 'EXF3 DATE', 'EXF3 STATUS', 'PROD.1 EXF DATE', 'PROD.1 EXF STATUS', 'PROD.2 EXF DATE', 'PROD.2 EXF STATUS', 'PROD.3 EXF DATE', 'PROD.3 EXF STATUS', 'SERVICE REMARKS', 'SERVICE STATUS', 'UPDATED ON', 'UPDATED BY'];
      const data: [{}] = [{}];
      var indentType;
      var serviceStatusString;

      const currentDate = new Date();
      const timestamp = currentDate.getFullYear() + "-" +
        String(currentDate.getMonth() + 1).padStart(2, '0') + "-" +
        String(currentDate.getDate()).padStart(2, '0') + "_" +
        String(currentDate.getHours()).padStart(2, '0') + "-" +
        String(currentDate.getMinutes()).padStart(2, '0') + "-" +
        String(currentDate.getSeconds()).padStart(2, '0');

      if (this.closedIndents2.length == 0) {
        this.commonService.toast("warning", "There is no indent to export!!");
      } else {
        for (let indent of this.closedIndents2) {

          if (indent.service_status_flag === 0) {

            serviceStatusString = "Open";

          } else if (indent.service_status_flag === 1) {

            serviceStatusString = "Ready To Deliver";

          } else if (indent.service_status_flag === 2) {

            serviceStatusString = "I&C Required";

          } else if (indent.service_status_flag === 3) {

            serviceStatusString = "Pre-Installation Call";

          } else if (indent.service_status_flag === 4) {

            serviceStatusString = "Installation in Process";

          } else if (indent.service_status_flag === 5) {

            serviceStatusString = "Installation Completed, Commissioning Pending";

          } else if (indent.service_status_flag === 6) {

            serviceStatusString = "Commissioning In Process";

          } else if (indent.service_status_flag === 7) {

            serviceStatusString = "I&C Completed";

          } else if (indent.service_status_flag === 8) {

            serviceStatusString = "Site Not Ready";

          } else if (indent.service_status_flag === 9) {

            serviceStatusString = "No I&C required";

          }

          var updatedOn;
          const utcDateStr = indent.updated_on;
          const date = new Date(utcDateStr);

          const istDateStr = date.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });

          updatedOn = istDateStr;

          data.push(
            {
              'INDENT SHEET NO.': indent.indent_sheet_num,
              'INDENT ISSUE DATE': indent.indent_issue_date,
              'SOS SUMMARY': indent.sos_summary,
              'CONTRACT ACNT NAME': indent.contract_acnt_name,
              'ORDER TYPE': indent.order_type,
              'SALES1 ID': indent.sales1_id,
              'SALES1 NAME': indent.sales1_name,
              'SALES2 ID': indent.sales2_id,
              'SALES2 NAME': indent.sales2_name,
              'CNTR COUNTRY': indent.cntr_country,
              'CNTR ADDRESS': indent.cntr_address,
              'PMT TERMS': indent.pmt_trms,
              'PMT STATUS': indent.pmt_sts,
              'DEL STATUS': indent.del_sts,
              'REGION': indent.region,
              'SHIPPING REGION': indent.shipping_region,
              'EXF1 DATE': indent.exf1,
              'EXF1 STATUS': indent.exf1_sts,
              'EXF2 DATE': indent.exf2,
              'EXF2 STATUS': indent.exf2_sts,
              'EXF3 DATE': indent.exf3,
              'EXF3 STATUS': indent.exf3_sts,
              'PROD.1 EXF DATE': indent.prod1_date,
              'PROD.1 EXF STATUS': indent.prod1_sts,
              'PROD.2 EXF DATE': indent.prod2_date,
              'PROD.2 EXF STATUS': indent.prod2_sts,
              'PROD.3 EXF DATE': indent.prod3_date,
              'PROD.3 EXF STATUS': indent.prod3_sts,
              'SERVICE REMARKS': indent.service_remarks,
              'SERVICE STATUS': serviceStatusString,
              'UPDATED ON': updatedOn,
              'UPDATED BY': indent.updated_by,
            }
          )
        }

        indentType = "Closed";
        let fileName;

        fileName = indentType + "_Indents_" + timestamp;

        const csv = convertArrayToCSV(data, { seperator: ',', header: header });
        var blob = new Blob([csv], { type: "csv;charset=utf-8" });
        saveAs(blob, fileName + '.csv');

      }


    } else if (this.tabType === "In Prod") {

      const header = ['INDENT SHEET NO.', 'INDENT ISSUE DATE', 'SOS SUMMARY', 'CONTRACT ACNT NAME', 'ORDER TYPE', 'SALES1 ID', 'SALES1 NAME', 'SALES2 ID', 'SALES2 NAME', 'CNTR COUNTRY', 'CNTR ADDRESS', 'PMT TERMS', 'PMT STATUS', 'DEL STATUS', 'REGION', 'SHIPPING REGION', 'EXF1 DATE', 'EXF1 STATUS', 'EXF2 DATE', 'EXF2 STATUS', 'EXF3 DATE', 'EXF3 STATUS', 'PROD.1 EXF DATE', 'PROD.1 EXF STATUS', 'PROD.2 EXF DATE', 'PROD.2 EXF STATUS', 'PROD.3 EXF DATE', 'PROD.3 EXF STATUS', 'SERVICE REMARKS', 'SERVICE STATUS', 'UPDATED ON', 'UPDATED BY'];
      const data: [{}] = [{}];
      var indentType;
      var serviceStatusString;

      const currentDate = new Date();
      const timestamp = currentDate.getFullYear() + "-" +
        String(currentDate.getMonth() + 1).padStart(2, '0') + "-" +
        String(currentDate.getDate()).padStart(2, '0') + "_" +
        String(currentDate.getHours()).padStart(2, '0') + "-" +
        String(currentDate.getMinutes()).padStart(2, '0') + "-" +
        String(currentDate.getSeconds()).padStart(2, '0');

      if (this.inProdIndents2.length == 0) {
        this.commonService.toast("warning", "There is no indent to export!!");
      } else {
        for (let indent of this.inProdIndents2) {

          if (indent.service_status_flag === 0) {

            serviceStatusString = "Open";

          } else if (indent.service_status_flag === 1) {

            serviceStatusString = "Ready To Deliver";

          } else if (indent.service_status_flag === 2) {

            serviceStatusString = "I&C Required";

          } else if (indent.service_status_flag === 3) {

            serviceStatusString = "Pre-Installation Call";

          } else if (indent.service_status_flag === 4) {

            serviceStatusString = "Installation in Process";

          } else if (indent.service_status_flag === 5) {

            serviceStatusString = "Installation Completed, Commissioning Pending";

          } else if (indent.service_status_flag === 6) {

            serviceStatusString = "Commissioning In Process";

          } else if (indent.service_status_flag === 7) {

            serviceStatusString = "I&C Completed";

          } else if (indent.service_status_flag === 8) {

            serviceStatusString = "Site Not Ready";

          } else if (indent.service_status_flag === 9) {

            serviceStatusString = "No I&C required";

          }

          var updatedOn;
          const utcDateStr = indent.updated_on;
          const date = new Date(utcDateStr);

          const istDateStr = date.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });

          updatedOn = istDateStr;

          data.push(
            {
              'INDENT SHEET NO.': indent.indent_sheet_num,
              'INDENT ISSUE DATE': indent.indent_issue_date,
              'SOS SUMMARY': indent.sos_summary,
              'CONTRACT ACNT NAME': indent.contract_acnt_name,
              'ORDER TYPE': indent.order_type,
              'SALES1 ID': indent.sales1_id,
              'SALES1 NAME': indent.sales1_name,
              'SALES2 ID': indent.sales2_id,
              'SALES2 NAME': indent.sales2_name,
              'CNTR COUNTRY': indent.cntr_country,
              'CNTR ADDRESS': indent.cntr_address,
              'PMT TERMS': indent.pmt_trms,
              'PMT STATUS': indent.pmt_sts,
              'DEL STATUS': indent.del_sts,
              'REGION': indent.region,
              'SHIPPING REGION': indent.shipping_region,
              'EXF1 DATE': indent.exf1,
              'EXF1 STATUS': indent.exf1_sts,
              'EXF2 DATE': indent.exf2,
              'EXF2 STATUS': indent.exf2_sts,
              'EXF3 DATE': indent.exf3,
              'EXF3 STATUS': indent.exf3_sts,
              'PROD.1 EXF DATE': indent.prod1_date,
              'PROD.1 EXF STATUS': indent.prod1_sts,
              'PROD.2 EXF DATE': indent.prod2_date,
              'PROD.2 EXF STATUS': indent.prod2_sts,
              'PROD.3 EXF DATE': indent.prod3_date,
              'PROD.3 EXF STATUS': indent.prod3_sts,
              'SERVICE REMARKS': indent.service_remarks,
              'SERVICE STATUS': serviceStatusString,
              'UPDATED ON': updatedOn,
              'UPDATED BY': indent.updated_by,
            }
          )
        }

        indentType = "Ready_To_Deliver";
        let fileName;

        fileName = indentType + "_Indents_" + timestamp;

        const csv = convertArrayToCSV(data, { seperator: ',', header: header });
        var blob = new Blob([csv], { type: "csv;charset=utf-8" });
        saveAs(blob, fileName + '.csv');

      }


    } else if (this.tabType === "Service Op") {

      const header = ['INDENT SHEET NO.', 'INDENT ISSUE DATE', 'SOS SUMMARY', 'CONTRACT ACNT NAME', 'ORDER TYPE', 'SALES1 ID', 'SALES1 NAME', 'SALES2 ID', 'SALES2 NAME', 'CNTR COUNTRY', 'CNTR ADDRESS', 'PMT TERMS', 'PMT STATUS', 'DEL STATUS', 'REGION', 'SHIPPING REGION', 'EXF1 DATE', 'EXF1 STATUS', 'EXF2 DATE', 'EXF2 STATUS', 'EXF3 DATE', 'EXF3 STATUS', 'PROD.1 EXF DATE', 'PROD.1 EXF STATUS', 'PROD.2 EXF DATE', 'PROD.2 EXF STATUS', 'PROD.3 EXF DATE', 'PROD.3 EXF STATUS', 'SERVICE REMARKS', 'SERVICE STATUS', 'UPDATED ON', 'UPDATED BY'];
      const data: [{}] = [{}];
      var indentType;
      var serviceStatusString;

      const currentDate = new Date();
      const timestamp = currentDate.getFullYear() + "-" +
        String(currentDate.getMonth() + 1).padStart(2, '0') + "-" +
        String(currentDate.getDate()).padStart(2, '0') + "_" +
        String(currentDate.getHours()).padStart(2, '0') + "-" +
        String(currentDate.getMinutes()).padStart(2, '0') + "-" +
        String(currentDate.getSeconds()).padStart(2, '0');

      if (this.serviceOperationindents.length == 0) {
        this.commonService.toast("warning", "There is no indent to export!!");
      } else {
        for (let indent of this.serviceOperationindents) {

          if (indent.service_status_flag === 0) {

            serviceStatusString = "Open";

          } else if (indent.service_status_flag === 1) {

            serviceStatusString = "Ready To Deliver";

          } else if (indent.service_status_flag === 2) {

            serviceStatusString = "I&C Required";

          } else if (indent.service_status_flag === 3) {

            serviceStatusString = "Pre-Installation Call";

          } else if (indent.service_status_flag === 4) {

            serviceStatusString = "Installation in Process";

          } else if (indent.service_status_flag === 5) {

            serviceStatusString = "Installation Completed, Commissioning Pending";

          } else if (indent.service_status_flag === 6) {

            serviceStatusString = "Commissioning In Process";

          } else if (indent.service_status_flag === 7) {

            serviceStatusString = "I&C Completed";

          } else if (indent.service_status_flag === 8) {

            serviceStatusString = "Site Not Ready";

          } else if (indent.service_status_flag === 9) {

            serviceStatusString = "No I&C required";

          }

          var updatedOn;
          const utcDateStr = indent.updated_on;
          const date = new Date(utcDateStr);

          const istDateStr = date.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });

          updatedOn = istDateStr;

          data.push(
            {
              'INDENT SHEET NO.': indent.indent_sheet_num,
              'INDENT ISSUE DATE': indent.indent_issue_date,
              'SOS SUMMARY': indent.sos_summary,
              'CONTRACT ACNT NAME': indent.contract_acnt_name,
              'ORDER TYPE': indent.order_type,
              'SALES1 ID': indent.sales1_id,
              'SALES1 NAME': indent.sales1_name,
              'SALES2 ID': indent.sales2_id,
              'SALES2 NAME': indent.sales2_name,
              'CNTR COUNTRY': indent.cntr_country,
              'CNTR ADDRESS': indent.cntr_address,
              'PMT TERMS': indent.pmt_trms,
              'PMT STATUS': indent.pmt_sts,
              'DEL STATUS': indent.del_sts,
              'REGION': indent.region,
              'SHIPPING REGION': indent.shipping_region,
              'EXF1 DATE': indent.exf1,
              'EXF1 STATUS': indent.exf1_sts,
              'EXF2 DATE': indent.exf2,
              'EXF2 STATUS': indent.exf2_sts,
              'EXF3 DATE': indent.exf3,
              'EXF3 STATUS': indent.exf3_sts,
              'PROD.1 EXF DATE': indent.prod1_date,
              'PROD.1 EXF STATUS': indent.prod1_sts,
              'PROD.2 EXF DATE': indent.prod2_date,
              'PROD.2 EXF STATUS': indent.prod2_sts,
              'PROD.3 EXF DATE': indent.prod3_date,
              'PROD.3 EXF STATUS': indent.prod3_sts,
              'SERVICE REMARKS': indent.service_remarks,
              'SERVICE STATUS': serviceStatusString,
              'UPDATED ON': updatedOn,
              'UPDATED BY': indent.updated_by,
            }
          )
        }

        indentType = "Service_Operation";
        let fileName;

        fileName = indentType + "_Indents_" + timestamp;

        const csv = convertArrayToCSV(data, { seperator: ',', header: header });
        var blob = new Blob([csv], { type: "csv;charset=utf-8" });
        saveAs(blob, fileName + '.csv');

      }

    } else if (this.tabType === "Completed") {

      const header = ['INDENT SHEET NO.', 'INDENT ISSUE DATE', 'SOS SUMMARY', 'CONTRACT ACNT NAME', 'ORDER TYPE', 'SALES1 ID', 'SALES1 NAME', 'SALES2 ID', 'SALES2 NAME', 'CNTR COUNTRY', 'CNTR ADDRESS', 'PMT TERMS', 'PMT STATUS', 'DEL STATUS', 'REGION', 'SHIPPING REGION', 'EXF1 DATE', 'EXF1 STATUS', 'EXF2 DATE', 'EXF2 STATUS', 'EXF3 DATE', 'EXF3 STATUS', 'PROD.1 EXF DATE', 'PROD.1 EXF STATUS', 'PROD.2 EXF DATE', 'PROD.2 EXF STATUS', 'PROD.3 EXF DATE', 'PROD.3 EXF STATUS', 'SERVICE REMARKS', 'SERVICE STATUS', 'UPDATED ON', 'UPDATED BY'];
      const data: [{}] = [{}];
      var indentType;
      var serviceStatusString;

      const currentDate = new Date();
      const timestamp = currentDate.getFullYear() + "-" +
        String(currentDate.getMonth() + 1).padStart(2, '0') + "-" +
        String(currentDate.getDate()).padStart(2, '0') + "_" +
        String(currentDate.getHours()).padStart(2, '0') + "-" +
        String(currentDate.getMinutes()).padStart(2, '0') + "-" +
        String(currentDate.getSeconds()).padStart(2, '0');

      if (this.completedItems2.length == 0) {
        this.commonService.toast("warning", "There is no indent to export!!");
      } else {
        for (let indent of this.completedItems2) {

          if (indent.service_status_flag === 0) {

            serviceStatusString = "Open";

          } else if (indent.service_status_flag === 1) {

            serviceStatusString = "Ready To Deliver";

          } else if (indent.service_status_flag === 2) {

            serviceStatusString = "I&C Required";

          } else if (indent.service_status_flag === 3) {

            serviceStatusString = "Pre-Installation Call";

          } else if (indent.service_status_flag === 4) {

            serviceStatusString = "Installation in Process";

          } else if (indent.service_status_flag === 5) {

            serviceStatusString = "Installation Completed, Commissioning Pending";

          } else if (indent.service_status_flag === 6) {

            serviceStatusString = "Commissioning In Process";

          } else if (indent.service_status_flag === 7) {

            serviceStatusString = "I&C Completed";

          } else if (indent.service_status_flag === 8) {

            serviceStatusString = "Site Not Ready";

          } else if (indent.service_status_flag === 9) {

            serviceStatusString = "No I&C required";

          }

          var updatedOn;
          const utcDateStr = indent.updated_on;
          const date = new Date(utcDateStr);

          const istDateStr = date.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });

          updatedOn = istDateStr;

          data.push(
            {
              'INDENT SHEET NO.': indent.indent_sheet_num,
              'INDENT ISSUE DATE': indent.indent_issue_date,
              'SOS SUMMARY': indent.sos_summary,
              'CONTRACT ACNT NAME': indent.contract_acnt_name,
              'ORDER TYPE': indent.order_type,
              'SALES1 ID': indent.sales1_id,
              'SALES1 NAME': indent.sales1_name,
              'SALES2 ID': indent.sales2_id,
              'SALES2 NAME': indent.sales2_name,
              'CNTR COUNTRY': indent.cntr_country,
              'CNTR ADDRESS': indent.cntr_address,
              'PMT TERMS': indent.pmt_trms,
              'PMT STATUS': indent.pmt_sts,
              'DEL STATUS': indent.del_sts,
              'REGION': indent.region,
              'SHIPPING REGION': indent.shipping_region,
              'EXF1 DATE': indent.exf1,
              'EXF1 STATUS': indent.exf1_sts,
              'EXF2 DATE': indent.exf2,
              'EXF2 STATUS': indent.exf2_sts,
              'EXF3 DATE': indent.exf3,
              'EXF3 STATUS': indent.exf3_sts,
              'PROD.1 EXF DATE': indent.prod1_date,
              'PROD.1 EXF STATUS': indent.prod1_sts,
              'PROD.2 EXF DATE': indent.prod2_date,
              'PROD.2 EXF STATUS': indent.prod2_sts,
              'PROD.3 EXF DATE': indent.prod3_date,
              'PROD.3 EXF STATUS': indent.prod3_sts,
              'SERVICE REMARKS': indent.service_remarks,
              'SERVICE STATUS': serviceStatusString,
              'UPDATED ON': updatedOn,
              'UPDATED BY': indent.updated_by,
            }
          )
        }

        indentType = "Completed";
        let fileName;

        fileName = indentType + "_Indents_" + timestamp;

        const csv = convertArrayToCSV(data, { seperator: ',', header: header });
        var blob = new Blob([csv], { type: "csv;charset=utf-8" });
        saveAs(blob, fileName + '.csv');

      }


    } else if (this.tabType === "Archived") {

      const header = ['INDENT SHEET NO.', 'INDENT ISSUE DATE', 'SOS SUMMARY', 'CONTRACT ACNT NAME', 'ORDER TYPE', 'SALES1 ID', 'SALES1 NAME', 'SALES2 ID', 'SALES2 NAME', 'CNTR COUNTRY', 'CNTR ADDRESS', 'PMT TERMS', 'PMT STATUS', 'DEL STATUS', 'REGION', 'SHIPPING REGION', 'EXF1 DATE', 'EXF1 STATUS', 'EXF2 DATE', 'EXF2 STATUS', 'EXF3 DATE', 'EXF3 STATUS', 'PROD.1 EXF DATE', 'PROD.1 EXF STATUS', 'PROD.2 EXF DATE', 'PROD.2 EXF STATUS', 'PROD.3 EXF DATE', 'PROD.3 EXF STATUS', 'SERVICE REMARKS', 'SERVICE STATUS', 'UPDATED ON', 'UPDATED BY'];
      const data: [{}] = [{}];
      var indentType;
      var serviceStatusString;

      const currentDate = new Date();
      const timestamp = currentDate.getFullYear() + "-" +
        String(currentDate.getMonth() + 1).padStart(2, '0') + "-" +
        String(currentDate.getDate()).padStart(2, '0') + "_" +
        String(currentDate.getHours()).padStart(2, '0') + "-" +
        String(currentDate.getMinutes()).padStart(2, '0') + "-" +
        String(currentDate.getSeconds()).padStart(2, '0');

      if (this.archivedItems2.length == 0) {
        this.commonService.toast("warning", "There is no indent to export!!");
      } else {
        for (let indent of this.archivedItems2) {

          if (indent.service_status_flag === 0) {

            serviceStatusString = "Open";

          } else if (indent.service_status_flag === 1) {

            serviceStatusString = "Ready To Deliver";

          } else if (indent.service_status_flag === 2) {

            serviceStatusString = "I&C Required";

          } else if (indent.service_status_flag === 3) {

            serviceStatusString = "Pre-Installation Call";

          } else if (indent.service_status_flag === 4) {

            serviceStatusString = "Installation in Process";

          } else if (indent.service_status_flag === 5) {

            serviceStatusString = "Installation Completed, Commissioning Pending";

          } else if (indent.service_status_flag === 6) {

            serviceStatusString = "Commissioning In Process";

          } else if (indent.service_status_flag === 7) {

            serviceStatusString = "I&C Completed";

          } else if (indent.service_status_flag === 8) {

            serviceStatusString = "Site Not Ready";

          } else if (indent.service_status_flag === 9) {

            serviceStatusString = "No I&C required";

          }

          var updatedOn;
          const utcDateStr = indent.updated_on;
          const date = new Date(utcDateStr);

          const istDateStr = date.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });

          updatedOn = istDateStr;

          data.push(
            {
              'INDENT SHEET NO.': indent.indent_sheet_num,
              'INDENT ISSUE DATE': indent.indent_issue_date,
              'SOS SUMMARY': indent.sos_summary,
              'CONTRACT ACNT NAME': indent.contract_acnt_name,
              'ORDER TYPE': indent.order_type,
              'SALES1 ID': indent.sales1_id,
              'SALES1 NAME': indent.sales1_name,
              'SALES2 ID': indent.sales2_id,
              'SALES2 NAME': indent.sales2_name,
              'CNTR COUNTRY': indent.cntr_country,
              'CNTR ADDRESS': indent.cntr_address,
              'PMT TERMS': indent.pmt_trms,
              'PMT STATUS': indent.pmt_sts,
              'DEL STATUS': indent.del_sts,
              'REGION': indent.region,
              'SHIPPING REGION': indent.shipping_region,
              'EXF1 DATE': indent.exf1,
              'EXF1 STATUS': indent.exf1_sts,
              'EXF2 DATE': indent.exf2,
              'EXF2 STATUS': indent.exf2_sts,
              'EXF3 DATE': indent.exf3,
              'EXF3 STATUS': indent.exf3_sts,
              'PROD.1 EXF DATE': indent.prod1_date,
              'PROD.1 EXF STATUS': indent.prod1_sts,
              'PROD.2 EXF DATE': indent.prod2_date,
              'PROD.2 EXF STATUS': indent.prod2_sts,
              'PROD.3 EXF DATE': indent.prod3_date,
              'PROD.3 EXF STATUS': indent.prod3_sts,
              'SERVICE REMARKS': indent.service_remarks,
              'SERVICE STATUS': serviceStatusString,
              'UPDATED ON': updatedOn,
              'UPDATED BY': indent.updated_by,
            }
          )
        }

        indentType = "Archived";
        let fileName;

        fileName = indentType + "_Indents_" + timestamp;

        const csv = convertArrayToCSV(data, { seperator: ',', header: header });
        var blob = new Blob([csv], { type: "csv;charset=utf-8" });
        saveAs(blob, fileName + '.csv');

      }
    }
  }

}
