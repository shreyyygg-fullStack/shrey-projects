import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from '../shared/common/global-constants';
import { map } from 'rxjs/operators';
import { PriorityIndents, Regions } from '../shared/services/indentdb.type';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { DisplayBoardService } from '../shared/services/display-board.service';

@Component({
  selector: 'app-display-board',
  templateUrl: './display-board.component.html',
  styleUrls: ['./display-board.component.css']
})
export class DisplayBoardComponent implements OnInit {

  indentType: "High Priority" | "Medium Priority" | "Low Priority" | "All Priorities" = "High Priority";
  indentDetail: PriorityIndents[] = [];

  indentSheetNum;
  sosSummary;
  contractAcntName;
  region;
  sales1;
  orderType;
  poNo;
  invoice;
  etd;
  exf;
  exfStatus;
  remarks1;
  priorityType;
  priorityPosition;
  prod_date;
  prod_sts;
  del_sts;
  pmt_sts;
  for_info;
  linked_indents: string;
  frieght_trms: string;
  dispatch_location: string;
  pmt_trms: string;
  customer_etd: string;
  customer_po_num: string;

  isFormChanged: boolean = false;

  highLengthFlag = false;
  mediumLengthFlag = false;
  lowLengthFlag = false;
  allLengthFlag = false;

  indentFormDetail = false;
  defaultTitle = true;
  remarks: string;
  indentPriority;
  indentPosition;
  indentRegion;
  indentFrieghtTrms;
  indentDispatchLocation;
  indentsLinked;

  originalIndents: PriorityIndents[] = [];
  indents: PriorityIndents[] = [];

  region_list: Regions[] = [];
  regions: Regions[] = [];

  indentsLength = 0;

  searchMaxLength: number = 50;
  searchText: string = "";

  tabtitlebtn = "SET PRIORITY";

  indentPriorityForm: FormGroup;

  highPriorityData: PriorityIndents[] = [];
  lowPriorityData: PriorityIndents[] = [];
  medPriorityData: PriorityIndents[] = [];

  highPriorityData2: PriorityIndents[] = [];
  lowPriorityData2: PriorityIndents[] = [];
  medPriorityData2: PriorityIndents[] = [];

  filteredHighPriorityData: PriorityIndents[] = [];
  filteredHighPriorityDataLength = 0;
  highPriorityDataLength: number = 0;
  medPriorityDataLength: number = 0;
  lowPriorityDataLength: number = 0;
  allPriorityDataLength: number = 0;
  selectedIndent;

  responseIndentnum: any;
  responseIndentnumber;

  highPriorityList = false;
  medPriorityList = false;
  lowPriorityList = false;
  allPriorityList = false;

  positions: number[] = [];
  numOfIndents = 500;
  remarksLength = 1000;

  constructor(private router: Router, private httpcon: HttpClient, private fb: FormBuilder, private displayBoardService: DisplayBoardService) {

    //No. of positions for SET POSITION dropdown
    for (let i = 1; i <= this.numOfIndents; i++) {
      this.positions.push(i);
    }
  }

  ngOnInit() {

    this.indentPriorityForm = this.fb.group({
      remarks: new FormControl(''),
      indentPriority: new FormControl({ value: '', disabled: true }),
      indentPosition: new FormControl(''),
      indentRegion: new FormControl(''),
      linked_indents: new FormControl(''),
      dispatch_location: new FormControl(''),
      frieght_trms: new FormControl(''),

    });
    this.getAllIndents();
    this.getHighPrIndents();
    this.getRegionList();
  }


  // setting default value and disabling the input field
  initialCheck(selectedIndentPriority) {
    const indentPositionControl = this.indentPriorityForm.get('indentPosition');

    if (selectedIndentPriority === '3') {
      indentPositionControl.disable();
    } else {
      indentPositionControl.enable();
    }
  }

  //THIS FUNCTION CAN BE USED IN FUTURE WHEN WE ALLOW USER TO INPUT PRIORITY TYPE

  // onPriorityChange(event: Event): void {
  //   const selectElement = event.target as HTMLSelectElement;
  //   const selectedValue = selectElement.value;
  //   const indentPositionControl = this.indentPriorityForm.get('indentPosition');

  //   if (selectedValue === '1') {
  //     indentPositionControl.enable();
  //   } else {
  //     indentPositionControl.setValue('99');
  //     indentPositionControl.disable();
  //   }
  // }


  // fetching all indents from backend
  getAllIndents() {
    return this.httpcon.get<any>(GlobalConstants.apiAllPriorityIndents).pipe(map(Response => {

      this.indents = Response;
      this.indentsLength = this.indents.length;
      this.originalIndents = Response;
      this.highPriorityData = this.indents.filter(item => item.priority_type == 1);
      this.highPriorityData2 = this.highPriorityData;

      this.filteredHighPriorityData = this.indents.filter(item =>
        item.priority_position >= 1 && item.priority_position <= this.numOfIndents
      );
      this.filteredHighPriorityDataLength = this.filteredHighPriorityData.length;

      this.medPriorityData = this.indents.filter(item => item.priority_type == 2);
      this.medPriorityData2 = this.medPriorityData;

      this.lowPriorityData = this.indents.filter(item => item.priority_type == 3);
      this.lowPriorityData2 = this.lowPriorityData;

      this.highPriorityDataLength = this.highPriorityData.length;
      this.medPriorityDataLength = this.medPriorityData.length;
      this.lowPriorityDataLength = this.lowPriorityData.length;
      this.allPriorityDataLength = this.indents.length;

      return this.indents;
    }))
      .subscribe();
  }

  // fetching region list from backend
  getRegionList() {
    return this.httpcon.get<any>(GlobalConstants.apiRegionList).pipe(map(Response => {
      this.region_list = Response;
      this.regions = this.region_list;
      return this.indents;
    }))
      .subscribe();
  }

  // to display High priority Indents
  getHighPrIndents() {

    this.indentType = "High Priority";
    this.allLengthFlag = false;
    this.highLengthFlag = true;
    this.mediumLengthFlag = false;
    this.lowLengthFlag = false;
    this.highPriorityList = true;
    this.medPriorityList = false;
    this.lowPriorityList = false;
    this.searchText = "";
    this.highPriorityData = this.highPriorityData2;
    this.selectedIndent = null;
    this.defaultTitle = true;
    this.indentFormDetail = false;

  }

  // to display medium priority Indents
  getMedPrIndents() {

    this.indentType = "Medium Priority";
    this.allLengthFlag = false;
    this.mediumLengthFlag = true;
    this.highLengthFlag = false;
    this.lowLengthFlag = false;
    this.medPriorityList = true;
    this.lowPriorityList = false;
    this.highPriorityList = false;
    this.searchText = "";
    this.medPriorityData = this.medPriorityData2;
    this.selectedIndent = null;
    this.defaultTitle = true;
    this.indentFormDetail = false;

  }

  // to display low priority Indents
  getLowPrIndents() {

    this.indentType = "Low Priority";
    this.allLengthFlag = false;
    this.lowLengthFlag = true;
    this.highLengthFlag = false;
    this.mediumLengthFlag = false;
    this.lowPriorityList = true;
    this.highPriorityList = false;
    this.medPriorityList = false;
    this.searchText = "";
    this.lowPriorityData = this.lowPriorityData2;
    this.selectedIndent = null;
    this.defaultTitle = true;
    this.indentFormDetail = false;

  }

  // to display all priority Indents
  getAllPrIndents() {

    this.indentType = "All Priorities";
    this.allLengthFlag = true;
    this.lowLengthFlag = false;
    this.highLengthFlag = false;
    this.mediumLengthFlag = false;
    this.lowPriorityList = false;
    this.allPriorityList = true;
    this.highPriorityList = false;
    this.medPriorityList = false;
    this.searchText = "";
    this.indents = this.originalIndents;
    this.selectedIndent = null;
    this.defaultTitle = true;
    this.indentFormDetail = false;

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

  // to display the selected indent details
  onSelect(indentlist: any) {

    this.selectedIndent = indentlist;
    this.defaultTitle = false;
    this.indentFormDetail = true;

    if (this.selectedIndent['indent_sheet_num'] !== null) {
      this.getIndDetailFromServer(this.selectedIndent['indent_sheet_num'].toString());
      this.initialCheck(this.selectedIndent['priority_type'].toString());
    }
  }


  // getting the selected indent details
  getIndDetailFromServer(indent: any) {

    const urllink = GlobalConstants.apiSelectedIndent + indent;

    this.httpcon.get<PriorityIndents[]>(urllink)
      .pipe(map(Response => {
        this.indentDetail = Response;
        this.indentSheetNum = this.indentDetail[0].indent_sheet_num;
        this.sosSummary = this.indentDetail[0].sos_summary;
        this.contractAcntName = this.indentDetail[0].contract_acnt_name;
        this.sales1 = this.indentDetail[0].sales1_name;
        this.orderType = this.indentDetail[0].order_type;
        this.poNo = this.indentDetail[0].iipo_no;
        this.invoice = this.indentDetail[0].invoice_no1;
        this.etd = this.indentDetail[0].etd1;
        this.exf = this.indentDetail[0].exf1;
        this.exfStatus = this.indentDetail[0].exf1_sts;
        this.remarks1 = this.indentDetail[0].remark1;
        this.priorityType = this.indentDetail[0].priority_type;
        this.priorityPosition = this.indentDetail[0].priority_position;
        this.prod_date = this.indentDetail[0].prod_date;
        this.prod_sts = this.indentDetail[0].prod_sts;
        this.del_sts = this.indentDetail[0].del_sts;
        this.pmt_sts = this.indentDetail[0].pmt_sts;
        this.for_info = this.indentDetail[0].for_info;
        this.region = this.indentDetail[0].region;
        this.linked_indents = this.indentDetail[0].linked_indents;
        this.frieght_trms = this.indentDetail[0].frieght_trms;
        this.dispatch_location = this.indentDetail[0].dispatch_location;
        this.pmt_trms = this.indentDetail[0].pmt_trms;
        this.customer_etd = this.indentDetail[0].customer_etd;
        this.customer_po_num = this.indentDetail[0].customer_po_num;

        if (this.region == null || this.region == "") {
          this.region = "";
        }
      }))
      .subscribe();

    this.isFormChanged = false;
  }


  // updating the form inputs into database
  async Update() {

    if (this.indentPriorityForm.valid) {
      this.remarks = this.indentPriorityForm.get('remarks').value;
      this.indentPriority = this.indentPriorityForm.get('indentPriority').value;
      this.indentPosition = this.indentPriorityForm.get('indentPosition').value;
      this.indentRegion = this.indentPriorityForm.get('indentRegion').value;
      this.indentFrieghtTrms = this.indentPriorityForm.get('frieght_trms').value;
      this.indentDispatchLocation = this.indentPriorityForm.get('dispatch_location').value;
      this.indentsLinked = this.indentPriorityForm.get('linked_indents').value;

      const urllink = GlobalConstants.apiSelectedIndentPosition + this.indentPosition;

      this.httpcon.get<any>(urllink)
        .pipe(map(async Response => {

          this.responseIndentnum = Response;
          if (this.responseIndentnum == "") {
            var selectedIndent = this.selectedIndent['indent_sheet_num'].toString();

            (await this.displayBoardService.savePriorityList(selectedIndent, this.remarks, this.indentPriority, this.indentPosition, this.indentRegion, this.indentFrieghtTrms, this.indentDispatchLocation, this.indentsLinked)).subscribe(
              () => {
                if (this.indentType == "High Priority") {
                  this.getAllIndents();
                  this.getHighPrIndents();
                } else if (this.indentType == "Medium Priority") {
                  this.getAllIndents();
                  this.getMedPrIndents();
                } else if (this.indentType == "Low Priority") {
                  this.getAllIndents();
                  this.getLowPrIndents();
                } else if (this.indentType == "All Priorities") {
                  this.getAllIndents();
                  this.getAllPrIndents();
                }
              },
              (error) => { }
            );
          }
          else {
            this.responseIndentnumber = this.responseIndentnum[0].indent_sheet_num;

            if (this.indentPosition == '999') {
              var selectedIndentNumber = this.selectedIndent['indent_sheet_num'].toString();
              this.indentPosition = this.indentPriorityForm.get('indentPosition').value;
              this.remarks = this.indentPriorityForm.get('remarks').value;
              this.indentPriority = this.indentPriorityForm.get('indentPriority').value;
              this.indentRegion = this.indentPriorityForm.get('indentRegion').value;
              this.indentFrieghtTrms = this.indentPriorityForm.get('frieght_trms').value;
              this.indentDispatchLocation = this.indentPriorityForm.get('dispatch_location').value;
              this.indentsLinked = this.indentPriorityForm.get('linked_indents').value;

              (await this.displayBoardService.savePriorityList(selectedIndentNumber, this.remarks, this.indentPriority, this.indentPosition, this.indentRegion, this.indentFrieghtTrms, this.indentDispatchLocation, this.indentsLinked)).subscribe(
                () => {
                  if (this.indentType == "High Priority") {
                    this.getAllIndents();
                    this.getHighPrIndents();
                  } else if (this.indentType == "Medium Priority") {
                    this.getAllIndents();
                    this.getMedPrIndents();
                  } else if (this.indentType == "Low Priority") {
                    this.getAllIndents();
                    this.getLowPrIndents();
                  } else if (this.indentType == "All Priorities") {
                    this.getAllIndents();
                    this.getAllPrIndents();
                  }
                },
                (error) => { }
              );
            }
            else {
              var selectedIndentNumber = this.selectedIndent['indent_sheet_num'].toString();
              if (this.responseIndentnumber === selectedIndentNumber) {

                (await this.displayBoardService.savePriorityList(selectedIndentNumber, this.remarks, this.indentPriority, this.indentPosition, this.indentRegion, this.indentFrieghtTrms, this.indentDispatchLocation, this.indentsLinked)).subscribe(
                  () => {
                    if (this.indentType == "High Priority") {
                      this.getAllIndents();
                      this.getHighPrIndents();
                    } else if (this.indentType == "Medium Priority") {
                      this.getAllIndents();
                      this.getMedPrIndents();
                    } else if (this.indentType == "Low Priority") {
                      this.getAllIndents();
                      this.getLowPrIndents();
                    } else if (this.indentType == "All Priorities") {
                      this.getAllIndents();
                      this.getAllPrIndents();
                    }
                  },
                  (error) => { }
                );

              } else {

                Swal.fire({
                  title: 'ATTENTION!!',
                  html: `<p>This position is already assigned to <br> <b>${this.responseIndentnumber} </b><br> (It will auto reset to default)  <br> Do you still want to change the position? </p> `,
                  showDenyButton: true,
                  confirmButtonText: `YES`,
                  denyButtonText: `NO`,
                  confirmButtonColor: '#282E89',
                  allowOutsideClick: false
                }).then(async (result) => {
                  if (result.isConfirmed) {

                    var selectedIndentNumber = this.selectedIndent['indent_sheet_num'].toString();
                    this.indentPosition = this.indentPriorityForm.get('indentPosition').value;
                    this.remarks = this.indentPriorityForm.get('remarks').value;
                    this.indentPriority = this.indentPriorityForm.get('indentPriority').value;
                    this.indentRegion = this.indentPriorityForm.get('indentRegion').value;
                    this.indentFrieghtTrms = this.indentPriorityForm.get('frieght_trms').value;
                    this.indentDispatchLocation = this.indentPriorityForm.get('dispatch_location').value;
                    this.indentsLinked = this.indentPriorityForm.get('linked_indents').value;

                    (await this.displayBoardService.changeIndentPriorityPosition(selectedIndentNumber, this.indentPosition, this.responseIndentnumber, this.remarks, this.indentPriority, this.indentRegion, this.indentFrieghtTrms, this.indentDispatchLocation, this.indentsLinked)).subscribe(
                      () => {
                        if (this.indentType == "High Priority") {
                          this.getAllIndents();
                          this.getHighPrIndents();
                        } else if (this.indentType == "Medium Priority") {
                          this.getAllIndents();
                          this.getMedPrIndents();
                        } else if (this.indentType == "Low Priority") {
                          this.getAllIndents();
                          this.getLowPrIndents();
                        } else if (this.indentType == "All Priorities") {
                          this.getAllIndents();
                          this.getAllPrIndents();
                        }
                      },
                      (error) => { }
                    );
                  }
                })
              }
            }
          }
        }))
        .subscribe();
    }

    this.isFormChanged = false;
  }


  // Compare current form values to the original values
  onInputChange(value) {
    this.isFormChanged = (
      this.priorityPosition !== value ||
      this.remarks1 !== value ||
      this.region !== value ||
      this.linked_indents !== value ||
      this.frieght_trms !== value ||
      this.dispatch_location !== value
    );
  }

  // routing to display board component
  iboardPlanningInit() {
    this.router.navigate(['ii/iboard-planning']);
  }

  // routing to home component
  homeRouterInit() {
    this.router.navigate(['ii/home']);
  }

}
