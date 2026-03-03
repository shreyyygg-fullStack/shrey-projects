import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from '../shared/common/global-constants';
import { map } from 'rxjs/operators';
import { HighPriorityIndents } from '../shared/services/indentdb.type';
import Swal from 'sweetalert2';
import { DisplayBoardService } from '../shared/services/display-board.service';

@Component({
  selector: 'app-daily-planning',
  templateUrl: './daily-planning.component.html',
  styleUrls: ['./daily-planning.component.css']
})
export class DailyPlanningComponent implements OnInit {

  indents: HighPriorityIndents[] = [];
  originalIndents: HighPriorityIndents[] = [];
  indentsLength = 0;
  searchMaxLength: number = 50;
  searchText: string = "";

  highNmedindents: HighPriorityIndents[] = [];
  highNmedindents2: HighPriorityIndents[] = [];
  highNmedindentsLength = 0;
  highPriorityData: HighPriorityIndents[] = [];
  filteredHighPriorityData: HighPriorityIndents[] = [];
  filteredHighPriorityDataLength = 0;
  dailyIndents: HighPriorityIndents[] = [];
  dailyIndentsLength = 0;
  selectedIndentNum;
  selectedPositions = new Set<number>();
  highlightedIndent: HighPriorityIndents | null = null;

  numOfIndents = 500;

  constructor(private router: Router, private httpcon: HttpClient, private displayBoardService: DisplayBoardService) {

  }

  ngOnInit(): void {
    this.getAllIndents();
  }

  //to highlight the moved indent
  highlightRow(indent: HighPriorityIndents) {
    this.highlightedIndent = indent;

  }

  // to move up the indent in dailylist
  moveUp(index: number) {
    if (index > 0) {
      const temp = this.dailyIndents[index];
      this.dailyIndents[index] = this.dailyIndents[index - 1];
      this.dailyIndents[index - 1] = temp;
      this.updatePositions();
      this.highlightRow(this.dailyIndents[index - 1]);
    }
  }

  // to move down the indent in dailylist
  moveDown(index: number) {
    if (index < this.dailyIndents.length - 1) {
      const temp = this.dailyIndents[index];
      this.dailyIndents[index] = this.dailyIndents[index + 1];
      this.dailyIndents[index + 1] = temp;
      this.updatePositions();
      this.highlightRow(this.dailyIndents[index + 1]);
    }
  }

  //to update positions on every moved indent
  updatePositions() {
    this.dailyIndents.forEach((indent, index) => {
      indent.updatePosition = index + 1;
    });
  }

  //to get all indents from database
  getAllIndents() {
    return this.httpcon.get<any>(GlobalConstants.apiAllPriorityIndents).pipe(map(Response => {

      this.indents = Response;
      this.indentsLength = this.indents.length;
      this.originalIndents = Response;

      this.highNmedindents = this.indents.filter(item => item.priority_type == 1 || item.priority_type == 2);
      this.highNmedindentsLength = this.highNmedindents.length;

      this.highNmedindents2 =  this.highNmedindents

      this.highPriorityData = this.indents.filter(item => item.priority_type == 1);
      this.filteredHighPriorityData = this.indents.filter(item =>
        item.priority_position >= 1 && item.priority_position <= this.numOfIndents
      );
      this.filteredHighPriorityDataLength = this.filteredHighPriorityData.length;
      
      return this.indents;
    }))
      .subscribe();
  }


  // to search any indent in list
  globalSearchKeyUp() {

    if (this.searchText.length === 0) {
      this.highNmedindents = this.highNmedindents2;
      return;
    }
    this.highNmedindents = this.highNmedindents2.filter(indent => {
      return Object.values(indent).some(value =>
        value && value.toString().toLowerCase().includes(this.searchText.toString().trim().toLowerCase())
      );
    });

  }

  // to add indents in daily indent list
  onSelect(indentlist: any) {

    if (this.dailyIndents.length < this.numOfIndents) {
      if (!indentlist.isAdded) {
        indentlist.isAdded = true;
        this.dailyIndents.push(indentlist);
        this.updatePositions();
      }
    } else {

      Swal.fire({
        icon: 'warning',
        title: 'Cannot add more Indents! ',
        html: `<p>The limit of ${this.numOfIndents} Indents has been reached.</p>`,
        showConfirmButton: true,
        confirmButtonColor: '#282E89',
        allowOutsideClick: false,
        customClass: {
          confirmButton: 'rounded-0',
        },
      });

    }
    this.dailyIndentsLength = this.dailyIndents.length;
  }

  //to remove the added indent from daily indent list
  deleteDailyIndents(indent: any) {
    indent.isAdded = false;
    const index = this.dailyIndents.indexOf(indent);
    if (index > -1) {
      if (indent.selectedPosition) {
        this.selectedPositions.delete(indent.selectedPosition);
      }
      this.dailyIndents.splice(index, 1);
    }
    this.dailyIndents = this.dailyIndents.filter(i => i !== indent);
    this.updatePositions();
    this.dailyIndentsLength = this.dailyIndents.length;
    this.highlightedIndent = null;
  }

  //to update the positions in daily indent list
  Update() {
    const indentsToSend = this.dailyIndents.filter(indent => indent.updatePosition !== null);
    this.displayBoardService.updateIndentPositions(indentsToSend)
      .subscribe(
        () => {}
      );
  }

  //route to daily planning component
  dailyPlanningInit() {
    this.router.navigate(['ii/daily-planning']);
  }

  //route to home component
  homeRouterInit() {
    this.router.navigate(['ii/home']);
  }


  selectIndent(indentlist: any) {
    if (this.selectedIndentNum === indentlist) {
        this.selectedIndentNum = null;
    } else {
        this.selectedIndentNum = indentlist;
    }
}

//To set the indent to default position
setDefaultPosition(indentlist: any) {
  this.selectedIndentNum = indentlist;
  var selectedIndentNumber = this.selectedIndentNum['indent_sheet_num'].toString();
  const urllink = GlobalConstants.apiSetDefaultIndent;

  return this.httpcon.post<any[]>(`${urllink}`, {selectedIndentNumber : selectedIndentNumber} ).pipe(map(Response => {

    var formUpdateStatus;
    formUpdateStatus = Response;
    let affectedRows = formUpdateStatus["affectedRows"];

    if (affectedRows == 1) {
      Swal.fire({
        icon: 'success',
        title: 'Default Position set successfully.',
        showConfirmButton: true,
        confirmButtonColor: '#282E89',
        allowOutsideClick: false,
        customClass: {
          confirmButton: 'rounded-0',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.getAllIndents();
        }
      });
    } else {
      Swal.fire({
        title: "Error in setting the Default Position!",
        icon: 'warning',
        text: '',
        confirmButtonColor: '#282E89',
        allowOutsideClick: false,
        customClass: {
          confirmButton: 'rounded-0',
        },
      });
    }
  })) .subscribe();
}

}
