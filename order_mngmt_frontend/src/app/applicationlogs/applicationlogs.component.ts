import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { GlobalConstants } from '../shared/common/global-constants';
import { getApplicationLog } from '../shared/services/indentdb.type';
import { UtilService } from '../shared/services/util.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-applicationlogs',
  templateUrl: './applicationlogs.component.html',
  styleUrls: ['./applicationlogs.component.css'],
  providers: [DatePipe]
})

export class ApplicationlogsComponent implements OnInit {

  planList = [];
  filterPlanForm: FormGroup;
  dateViewFormat: string = "yyyy-MM-dd";
  dateInsertFormat: string = "yyyy-MM-dd";
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  applicationLog: getApplicationLog[] = [];

  Label_rowCount_Text: number = 0;
  button_ExportDisabled: boolean = true;
  button_DeleteDisabled: boolean = true;
  txtFromDateReadOnly: boolean = true;
  txtToDateReadOnly: boolean = true;

  searchPlaceholder: string = "Search [ User ID, User Name, Indent No, Message, Controller...]";
  url: string;

  HighlightRow: Number;
  newFilteredList: any = [];
  filterIndentCount: number = -1;

  searchMaxLength: number = 50;
  searchText: string = "";

  txtFromDate: Date;
  txtFromDateValue: any;
  txtToDate: Date;
  txtToDateValue: any;
  minDate: any;
  maxDate: any;
  stringStartDate: any;
  stringEndDate: any;

  constructor(private httpCon: HttpClient, private router: Router, private datePipe: DatePipe, private calendar: NgbCalendar, private utilService: UtilService, private ngxService: NgxUiLoaderService) {
    this.filterPlanForm = new FormGroup({
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      filterString: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.minDate = this.calendar.getPrev(this.calendar.getToday(), 'y', 5);
    this.maxDate = this.calendar.getNext(this.calendar.getToday(), 'y', 5);
    this.stringStartDate = this.setStartDate();
    this.stringEndDate = this.setEndDate();
    this.stringStartDate = this.datePipe.transform(this.stringStartDate, this.dateInsertFormat);
    this.stringEndDate = this.datePipe.transform(this.stringEndDate, this.dateInsertFormat);
    this.patchDataToControl();
    this.loadFromDatabase();
  }

  homeRouterInit() {
    this.router.navigate(['ii/home']);
  }

  indentUpdateLogsInit() {
    location.reload();
  }

  //!!!! important
  unsorted() {
    //   !!!! Please do not delete this function this function is empty but still it is doing work because i need an empty function for unsorting..
  }

  setStartDate() {
    var date = new Date();
    return date.setMonth(date.getMonth() - 1);
  }

  setEndDate() {
    return new Date();
  }

  patchDataToControl() {
    this.txtFromDateValue = this.stringStartDate;
    this.txtToDateValue = this.stringEndDate;
    this.filterPlanForm.controls.fromDate.patchValue({
      year: Number(this.datePipe.transform(this.txtFromDateValue, 'yyyy')),
      month: Number(this.datePipe.transform(this.txtFromDateValue, 'MM')),
      day: Number(this.datePipe.transform(this.txtFromDateValue, 'dd'))
    });
    this.filterPlanForm.controls.toDate.patchValue({
      year: Number(this.datePipe.transform(this.txtFromDateValue, 'yyyy')),
      month: Number(this.datePipe.transform(this.txtToDateValue, 'MM')),
      day: Number(this.datePipe.transform(this.txtToDateValue, 'dd'))
    });
  }

  loadFromDatabase() {

    this.HighlightRow = -1;
    this.Label_rowCount_Text = 0;
    this.applicationLog = [];
    let startDate = this.datePipe.transform(this.txtFromDateValue, this.dateInsertFormat);  //moment(this.txtFromDateValue).format(this.dateViewFormat);
    let endDate = this.datePipe.transform(this.txtToDateValue, this.dateInsertFormat);  //moment(this.txtToDateValue).format(this.dateViewFormat);
    this.filterIndentCount = -1;
    this.resetFilterText();
    this.ngxService.start();
    this.url = GlobalConstants.apiGetApplicationLogWithDate + "?fromDate=" + startDate + "&toDate=" + endDate;
    this.httpCon.get<getApplicationLog[]>(this.url).subscribe(res => {
      if (res.length != 0) {
        this.applicationLog = res;
        this.Label_rowCount_Text = this.applicationLog.length;
        this.button_ExportDisabled = false;
        this.button_DeleteDisabled = false;
      }
      else {
        this.button_ExportDisabled = true;
        this.button_DeleteDisabled = true;
      }

      this.ngxService.stop();

    },
      () => {
        this.utilService.SwalMsg('error', 'Server Error', 'Server not connected.');
      });
  }

  fromDate_ValueSelected(evt) {
    this.txtFromDate = new Date(evt.year, evt.month - 1, evt.day);
    this.txtFromDateValue = this.datePipe.transform(this.txtFromDate, this.dateViewFormat);
    this.filterPlanForm.controls.fromDate.patchValue({
      year: Number(this.datePipe.transform(this.txtFromDateValue, 'yyyy')),
      month: Number(this.datePipe.transform(this.txtFromDateValue, 'MM')),
      day: Number(this.datePipe.transform(this.txtFromDateValue, 'dd'))
    });

    this.loadFromDatabase();
  }

  toDate_ValueSelected(evt) {
    this.txtToDate = new Date(evt.year, evt.month - 1, evt.day);
    this.txtToDateValue = this.datePipe.transform(this.txtToDate, this.dateViewFormat);
    this.filterPlanForm.controls.toDate.patchValue({
      year: Number(this.datePipe.transform(this.txtFromDateValue, 'yyyy')),
      month: Number(this.datePipe.transform(this.txtToDateValue, 'MM')),
      day: Number(this.datePipe.transform(this.txtToDateValue, 'dd'))
    });
    this.loadFromDatabase();
  }

  fromDate_ValueNavigated(evt) {
    this.loadFromDatabase();
  }

  toDate_ValueNavigated(evt) {
    this.loadFromDatabase();
  }

  clickOnReload() {
    this.clearAllTextBox();
    this.patchDataToControl();
    this.loadFromDatabase();
    this.filterIndentCount = -1;
  }

  clickOnDelete() {
    Swal.close();
    Swal.fire({
      icon: 'question',
      title: 'Do you want to delete all the records?',
      text: 'Click on YES to delete and it will generate an excel backup file for your future reference.',
      showDenyButton: true,
      confirmButtonText: 'YES',
      denyButtonText: 'NO',
      confirmButtonColor: '#282E89',
      denyButtonColor: '#dc3545',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.export();
        this.deleteLogs();
      }
      else if (result.isDenied) {
        Swal.close();
      }
    });
  }

  deleteLogs() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const options = { headers };
    this.url = GlobalConstants.apiGetDeleteApplicationLog;
    this.httpCon.post<any>(this.url, options).subscribe(res => {
      if (res['affectedRows'] >= 1) {
        this.utilService.SwalMsg('success', 'Logs Deleted Successfully!', '');

      }
      else {
        this.utilService.SwalMsg('error', 'There is some error while deletion!', '');
      }
      this.loadFromDatabase();
    });
  }

  clearAllTextBox() {
    this.searchText = "";
    this.Label_rowCount_Text = 0;
    this.filterPlanForm.patchValue({
      filterString: ""
    })
  }

  export() {
    this.filterApplicationLog();
    this.generateExcel();
  }

  filterApplicationLog() {
    let searchText = "";
    this.newFilteredList = [];
    if (this.filterPlanForm.value.filterString == '') {
      this.newFilteredList = this.applicationLog;
      return;
    }
    if (this.filterPlanForm.value.filterString != '') {
      searchText = this.filterPlanForm.value.filterString;
    }
    for (let row of this.applicationLog) {
      for (let i in row) {
        if (row[i] != null || row[i] != undefined) {
          if (row[i].toString().toLowerCase().includes(searchText.toString().toLowerCase())) {
            this.newFilteredList.push(row);
            break;
          }
        }
      }
    }
    return;
  }

  generateExcel() {
    let header = ['SN.', 'DATE TIME', 'USER ID', 'USER NAME', 'INDENT NO', 'MESSAGE', 'CONTROLLER'];
    //  Create workbook
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet();
    let fromdate = new Date(this.filterPlanForm.value.fromDate.year, this.filterPlanForm.value.fromDate.month - 1, this.filterPlanForm.value.fromDate.day);
    let todate = new Date(this.filterPlanForm.value.toDate.year, this.filterPlanForm.value.toDate.month - 1, this.filterPlanForm.value.toDate.day);
    worksheet.addRow(['Exported On :']);
    worksheet.getCell('C1').value = this.datePipe.transform(new Date(), "yyyy-MM-dd hh:mm:ss");
    worksheet.addRow(['Exported From Date :']);
    worksheet.getCell('C2').value = this.datePipe.transform(fromdate, this.dateInsertFormat);
    worksheet.addRow(['Exported To Date :']);
    worksheet.getCell('C3').value = this.datePipe.transform(todate, this.dateInsertFormat);
    worksheet.addRow(['Exported By :']);
    worksheet.getCell('C4').value = sessionStorage.getItem('username');
    worksheet.mergeCells('A1', 'B1');
    worksheet.mergeCells('C1', 'D1');
    worksheet.mergeCells('A2', 'B2');
    worksheet.mergeCells('C2', 'D2');
    worksheet.mergeCells('A3', 'B3');
    worksheet.mergeCells('C3', 'D3');
    worksheet.mergeCells('A4', 'B4');
    worksheet.mergeCells('C4', 'D4');
    worksheet.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell('A2').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell('A3').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell('A4').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell('C2').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell('C3').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell('C4').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

    worksheet.addRow([]);
    worksheet.mergeCells('A5', 'G5');
    var FileName = "iOTSApplicationLogs_" + this.datePipe.transform(new Date(), "yyMMdd_hhmmss");

    //Add Header Row
    const headerRow = worksheet.addRow(header);
    // Cell Style : Fill and Border
    headerRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
    });

    worksheet.columns.forEach(function (column) {
      var maxLength = 0;
      column["eachCell"]({ includeEmpty: true }, function (cell) {
        var columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });

    let excelData = [];
    let date1: Date;
    let date2: Date;
    for (let i = 0; i < this.newFilteredList.length; i++) {
      excelData.push([
        i + 1,
        this.datePipe.transform(this.newFilteredList[i].CREATE_TIME, "yyyy-MM-dd hh:mm:ss"),
        this.newFilteredList[i].USER_ID,
        this.newFilteredList[i].USER_NAME,
        this.newFilteredList[i].INDENT_NO,
        this.newFilteredList[i].LOG_MESSAGE,
        this.newFilteredList[i].CONTROLLER_NAME
      ]);
    }

    excelData.forEach(d => {
      const row = worksheet.addRow(d);
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      });
    });

    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 40;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 50;
    worksheet.getColumn(7).width = 30;
    workbook.xlsx.writeBuffer().then((excelData) => {
      let blob = new Blob([excelData], { type: this.EXCEL_TYPE });
      FileSaver.saveAs(blob, FileName + this.EXCEL_EXTENSION);
    });
  }

  resetFilterText() {
    this.filterPlanForm.patchValue({
      filterString: "",
    })
  }
}

