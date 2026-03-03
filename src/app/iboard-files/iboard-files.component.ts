import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PriorityIndents } from '../shared/services/indentdb.type';
import { GlobalConstants } from '../shared/common/global-constants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { convertArrayToCSV } from 'convert-array-to-csv';
import { CommonServiceService } from '../shared/services/common-service.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DisplayBoardService } from '../shared/services/display-board.service';

@Component({
  selector: 'app-iboard-files',
  templateUrl: './iboard-files.component.html',
  styleUrls: ['./iboard-files.component.css'],
  providers: [DatePipe, CommonServiceService]
})
export class IboardFilesComponent implements OnInit {

  allIndentFlag = true;
  highIndentFlag = false;
  medIndentFlag = false;
  lowIndentFlag = false;
  indentsPriorityForm: FormGroup;
  selectedValue = 'All';
  originalIndents: PriorityIndents[] = [];
  indents: PriorityIndents[] = [];
  indentsLength = 0;
  highPriorityData: PriorityIndents[] = [];
  lowPriorityData: PriorityIndents[] = [];
  medPriorityData: PriorityIndents[] = [];
  highPriorityDataLength: number = 0;
  medPriorityDataLength: number = 0;
  lowPriorityDataLength: number = 0;
  highPriorityData2: PriorityIndents[] = [];
  lowPriorityData2: PriorityIndents[] = [];
  medPriorityData2: PriorityIndents[] = [];
  rangeDateFlag = false;
  date2 = new Date;
  Year;
  selectYear;
  maxYear;
  error;
  fromDate;
  toDate;
  rfromDate: any;
  rtoDate: any;
  searchMaxLength: number = 50;
  searchText: string = "";


  constructor(private router: Router, private httpcon: HttpClient, private commonService: CommonServiceService, private datePipe: DatePipe, private displayBoardService: DisplayBoardService, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.indentsPriorityForm = this.fb.group({
      indentsPriority: new FormControl('')
    });

    const indentPriorityControl = this.indentsPriorityForm.get('indentsPriority');
    indentPriorityControl.setValue("All");

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

    this.fromDate = this.datePipe.transform(new Date(this.rfromDate.year, this.rfromDate.month - 1, this.rfromDate.day), 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(new Date(this.rtoDate.year, this.rtoDate.month - 1, this.rtoDate.day), 'yyyy-MM-dd');

    this.Year = [
      { value: null, label: 'Select Year' },
      { value: this.maxYear, label: String(this.maxYear - 1).concat("-").concat(String(this.maxYear)) },
      { value: this.maxYear - 1, label: String(this.maxYear - 2).concat("-").concat(String(this.maxYear - 1)) },
      { value: this.maxYear - 2, label: String(this.maxYear - 3).concat("-").concat(String(this.maxYear - 2)) },
      { value: this.maxYear - 3, label: String(this.maxYear - 4).concat("-").concat(String(this.maxYear - 3)) },
      { value: this.maxYear - 4, label: String(this.maxYear - 5).concat("-").concat(String(this.maxYear - 4)) },
    ]

    this.getAllIndents();
  }


  // fetching all indents from backend
  getAllIndents() {
    return this.httpcon.get<any>(GlobalConstants.apiAllPriorityIndents).pipe(map(Response => {

      this.indents = Response;
      this.indentsLength = this.indents.length;
      this.originalIndents = Response;

      this.highPriorityData = this.indents.filter(item => item.priority_type == 1);
      this.highPriorityData2 = this.highPriorityData;

      this.medPriorityData = this.indents.filter(item => item.priority_type == 2);
      this.medPriorityData2 = this.medPriorityData;

      this.lowPriorityData = this.indents.filter(item => item.priority_type == 3);
      this.lowPriorityData2 = this.lowPriorityData;

      this.highPriorityDataLength = this.highPriorityData.length;
      this.medPriorityDataLength = this.medPriorityData.length;
      this.lowPriorityDataLength = this.lowPriorityData.length;

      return this.indents;
    }))
      .subscribe();
  }

  //default data toggle
  toggle() {
    if (!this.rangeDateFlag) {
      this.rfromDate = { day: this.date2.getUTCDate(), month: this.date2.getUTCMonth() + 1, year: this.date2.getUTCFullYear() };
      this.rtoDate = { day: this.date2.getUTCDate(), month: this.date2.getUTCMonth() + 1, year: this.date2.getUTCFullYear() };
      this.getAllIndents();

      const indentPriorityControl = this.indentsPriorityForm.get('indentsPriority');
      indentPriorityControl.setValue("All");
      this.allIndentFlag = true;
      this.highIndentFlag = false;
      this.medIndentFlag = false;
      this.lowIndentFlag = false;

    } else {
      const indentPriorityControl = this.indentsPriorityForm.get('indentsPriority');
      indentPriorityControl.setValue("All");
      this.allIndentFlag = true;
      this.highIndentFlag = false;
      this.medIndentFlag = false;
      this.lowIndentFlag = false;

      this.fetchIndentByDate();
    }
  }

  //date filter
  fetchIndentByDate() {

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

  //getting filter data by date
  fetchIndentByFilter() {
    const fromDate = this.fromDate;
    const toDate = this.toDate;

    this.displayBoardService.getPriorityIndentsByDate(fromDate, toDate)
      .subscribe(Response => {
       
        this.indents = Response;
        this.indentsLength = this.indents.length;
        this.originalIndents = Response;

        this.highPriorityData = this.indents.filter(item => item.priority_type == 1);
        this.highPriorityData2 = this.highPriorityData;

        this.medPriorityData = this.indents.filter(item => item.priority_type == 2);
        this.medPriorityData2 = this.medPriorityData;

        this.lowPriorityData = this.indents.filter(item => item.priority_type == 3);
        this.lowPriorityData2 = this.lowPriorityData;

        this.highPriorityDataLength = this.highPriorityData.length;
        this.medPriorityDataLength = this.medPriorityData.length;
        this.lowPriorityDataLength = this.lowPriorityData.length;
      });
  }

  // method for search bar
  globalSearchKeyUp() {

    if (this.searchText.length === 0) {

      this.indents = this.originalIndents;
      this.highPriorityData = this.highPriorityData2;
      this.medPriorityData = this.medPriorityData2
      this.lowPriorityData = this.lowPriorityData2;
      return;
    }

    this.indents = this.originalIndents.filter(indent => {
      return Object.values(indent).some(value =>
        value && value.toString().toLowerCase().includes(this.searchText.toString().trim().toLowerCase())
      );
    });

    this.highPriorityData = this.highPriorityData2.filter(indent => {
      return Object.values(indent).some(value =>
        value && value.toString().toLowerCase().includes(this.searchText.toString().trim().toLowerCase())
      );
    });

    this.medPriorityData = this.medPriorityData2.filter(indent => {
      return Object.values(indent).some(value =>
        value && value.toString().toLowerCase().includes(this.searchText.toString().trim().toLowerCase())
      );
    });

    this.lowPriorityData = this.lowPriorityData2.filter(indent => {
      return Object.values(indent).some(value =>
        value && value.toString().toLowerCase().includes(this.searchText.toString().trim().toLowerCase())
      );
    });

  }


  //priority dropdown method
  onChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedValue = selectElement.value;

    if (this.selectedValue === "All") {
      this.allIndentFlag = true;
      this.highIndentFlag = false;
      this.medIndentFlag = false;
      this.lowIndentFlag = false;
    } else if (this.selectedValue === "High Priority") {
      this.allIndentFlag = false;
      this.highIndentFlag = true;
      this.medIndentFlag = false;
      this.lowIndentFlag = false;
    } else if (this.selectedValue === "Medium Priority") {
      this.allIndentFlag = false;
      this.highIndentFlag = false;
      this.medIndentFlag = true;
      this.lowIndentFlag = false;
    } else if (this.selectedValue === "Low Priority") {
      this.allIndentFlag = false;
      this.highIndentFlag = false;
      this.medIndentFlag = false;
      this.lowIndentFlag = true;
    }
  }

  //method to convert table data into excel sheet
  exportCSV() {

    const header = ['INDENT SHEET NO.', 'INDENT ISSUE DATE', 'SOS SUMMARY', 'CONTRACT ACNT NAME', 'ORDER TYPE', 'SALES NAME','REGION', 'IIPO NO.', 'VD-INVOICE', 'VD-EXF', 'VD-EXF STATUS', 'VD-ETD', 'PROD. EXF DATE', 'PROD. EXF STATUS', 'DEL STATUS', 'PMT STATUS', 'FOR INFO', 'REMARKS'];
    const data: [{}] = [{}];
    var indentType;

    let currentDate = new Date();
    let timeString = this.datePipe.transform(currentDate, '_hh_mm_ss');

    if (this.selectedValue === "All") {

      if (this.indents.length == 0) {
        this.commonService.toast("warning", "There is no indent to export for selected filter!!");
      } else {
        for (let indent of this.indents) {
          data.push(
            {
              'INDENT SHEET NO.': indent.indent_sheet_num,
              'INDENT ISSUE DATE': indent.indent_issue_date,
              'SOS SUMMARY': indent.sos_summary,
              'CONTRACT ACNT NAME': indent.contract_acnt_name,
              'ORDER TYPE': indent.order_type,
              'SALES NAME': indent.sales1_name,
              'REGION': indent.region,
              'IIPO NO.': indent.iipo_no,
              'VD-INVOICE': indent.invoice_no1,
              'VD-EXF': indent.exf1,
              'VD-EXF STATUS': indent.exf1_sts,
              'VD-ETD': indent.etd1,
              'PROD. EXF DATE': indent.prod_date,
              'PROD. EXF STATUS': indent.prod_sts,
              'DEL STATUS': indent.del_sts,
              'PMT STATUS': indent.pmt_sts,
              'FOR INFO': indent.for_info,
              'REMARKS': indent.remark1,
            }
          )
        }
        indentType = "All";
        let fileName;

        if (this.fromDate === this.toDate) {
          fileName = indentType + "_Priority_Indents_" + "On_" + this.fromDate + timeString;
        } else {
          fileName = indentType + "_Priority_Indents_" + "From_" + this.fromDate + "_To_" + this.toDate + timeString;
        }

        const csv = convertArrayToCSV(data, { seperator: ',', header: header });
        var blob = new Blob([csv], { type: "csv;charset=utf-8" });
        saveAs(blob, fileName + '.csv');

      }
    } else if (this.selectedValue === "High Priority") {

      if (this.highPriorityData.length == 0) {
        this.commonService.toast("warning", "There is no indent to export for selected filter!!");
      } else {
        for (let indent of this.highPriorityData) {
          data.push(
            {
              'INDENT SHEET NO.': indent.indent_sheet_num,
              'INDENT ISSUE DATE': indent.indent_issue_date,
              'SOS SUMMARY': indent.sos_summary,
              'CONTRACT ACNT NAME': indent.contract_acnt_name,
              'ORDER TYPE': indent.order_type,
              'SALES NAME': indent.sales1_name,
              'REGION': indent.region,
              'IIPO NO.': indent.iipo_no,
              'VD-INVOICE': indent.invoice_no1,
              'VD-EXF': indent.exf1,
              'VD-EXF STATUS': indent.exf1_sts,
              'VD-ETD': indent.etd1,
              'PROD. EXF DATE': indent.prod_date,
              'PROD. EXF STATUS': indent.prod_sts,
              'DEL STATUS': indent.del_sts,
              'PMT STATUS': indent.pmt_sts,
              'FOR INFO': indent.for_info,
              'REMARKS': indent.remark1,
            }
          )
        }
        indentType = "High";

        let fileName;

        if (this.fromDate === this.toDate) {
          fileName = indentType + "_Priority_Indents_" + "On_" + this.fromDate + timeString;
        } else {
          fileName = indentType + "_Priority_Indents_" + "From_" + this.fromDate + "_To_" + this.toDate + timeString;
        }

        const csv = convertArrayToCSV(data, { seperator: ',', header: header });
        var blob = new Blob([csv], { type: "csv;charset=utf-8" });
        saveAs(blob, fileName + '.csv');

      }
    } else if (this.selectedValue === "Medium Priority") {

      if (this.medPriorityData.length == 0) {
        this.commonService.toast("warning", "There is no indent to export for selected filter!!");
      } else {
        for (let indent of this.medPriorityData) {
          data.push(
            {
              'INDENT SHEET NO.': indent.indent_sheet_num,
              'INDENT ISSUE DATE': indent.indent_issue_date,
              'SOS SUMMARY': indent.sos_summary,
              'CONTRACT ACNT NAME': indent.contract_acnt_name,
              'ORDER TYPE': indent.order_type,
              'SALES NAME': indent.sales1_name,
              'REGION': indent.region,
              'IIPO NO.': indent.iipo_no,
              'VD-INVOICE': indent.invoice_no1,
              'VD-EXF': indent.exf1,
              'VD-EXF STATUS': indent.exf1_sts,
              'VD-ETD': indent.etd1,
              'PROD. EXF DATE': indent.prod_date,
              'PROD. EXF STATUS': indent.prod_sts,
              'DEL STATUS': indent.del_sts,
              'PMT STATUS': indent.pmt_sts,
              'FOR INFO': indent.for_info,
              'REMARKS': indent.remark1,
            }
          )
        }
        indentType = "Medium";

        let fileName;

        if (this.fromDate === this.toDate) {
          fileName = indentType + "_Priority_Indents_" + "On_" + this.fromDate + timeString;
        } else {
          fileName = indentType + "_Priority_Indents_" + "From_" + this.fromDate + "_To_" + this.toDate + timeString;
        }

        const csv = convertArrayToCSV(data, { seperator: ',', header: header });
        var blob = new Blob([csv], { type: "csv;charset=utf-8" });
        saveAs(blob, fileName + '.csv');

      }

    } else if (this.selectedValue === "Low Priority") {

      if (this.lowPriorityData.length == 0) {
        this.commonService.toast("warning", "There is no indent to export for selected filter!!");
      } else {
        for (let indent of this.lowPriorityData) {
          data.push(
            {
              'INDENT SHEET NO.': indent.indent_sheet_num,
              'INDENT ISSUE DATE': indent.indent_issue_date,
              'SOS SUMMARY': indent.sos_summary,
              'CONTRACT ACNT NAME': indent.contract_acnt_name,
              'ORDER TYPE': indent.order_type,
              'SALES NAME': indent.sales1_name,
              'REGION': indent.region,
              'IIPO NO.': indent.iipo_no,
              'VD-INVOICE': indent.invoice_no1,
              'VD-EXF': indent.exf1,
              'VD-EXF STATUS': indent.exf1_sts,
              'VD-ETD': indent.etd1,
              'PROD. EXF DATE': indent.prod_date,
              'PROD. EXF STATUS': indent.prod_sts,
              'DEL STATUS': indent.del_sts,
              'PMT STATUS': indent.pmt_sts,
              'FOR INFO': indent.for_info,
              'REMARKS': indent.remark1,
            }
          )
        }
        indentType = "Low";

        let fileName;

        if (this.fromDate === this.toDate) {
          fileName = indentType + "_Priority_Indents_" + "On_" + this.fromDate + timeString;
        } else {
          fileName = indentType + "_Priority_Indents_" + "From_" + this.fromDate + "_To_" + this.toDate + timeString;
        }

        const csv = convertArrayToCSV(data, { seperator: ',', header: header });
        var blob = new Blob([csv], { type: "csv;charset=utf-8" });
        saveAs(blob, fileName + '.csv');
      }
    }
  }

  // routing to display board component
  iboardFilesInit() {
    this.router.navigate(['ii/iboard-files']);
  }

  // routing to home component
  homeRouterInit() {
    this.router.navigate(['ii/home']);
  }

}
