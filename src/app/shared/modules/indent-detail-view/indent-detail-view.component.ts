import { Component, OnInit, Inject, Optional, Input, OnChanges } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DetailDialogDataSet } from '../../services/indentdb.type';
import { CommonServiceService } from '../../services/common-service.service';

@Component({
  selector: 'app-indent-detail-view',
  templateUrl: './indent-detail-view.component.html',
  styleUrls: ['./indent-detail-view.component.css']
})
export class IndentDetailViewComponent implements OnInit, OnChanges {
  currentValue: any;
  @Input() name: string;
  text: string;
  constructor( private httpConView: HttpClient, private getServiceData: CommonServiceService ) {

  }

  ngOnInit() {
    this.getServiceData.currentData.subscribe(currentData => this.currentValue = currentData);
  }

  ngOnChanges() {
    this.text = 'Hi ' + this.name;
  }
}
