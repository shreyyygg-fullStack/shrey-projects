import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-my-view-expenses',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf, NgClass],
  templateUrl: './my-view-expenses.component.html',
  styleUrl: './my-view-expenses.component.scss'
})
export class MyViewExpensesComponent {

  expenseForm: FormGroup;
  searchTerm: string = '';
  showDropdown: boolean = false;
  selectedReport: any = null;
  selectedRowIndex: number | null = null;

  dateTimeRangePickerVisible = false;
  addTodate = false;
  hours: string[] = [];
  filteredToHours: { [key: number]: string[] } = {};
  activeRowIndex: number | null = null;


  reports = [
    {
      code: 'ER-00005',
      name: 'Trip to Goa',
      amount: 0,
      dateRange: '11/04/2025 - 11/04/2025'
    },
    {
      code: 'ER-00006',
      name: 'Client Visit',
      amount: 1000,
      dateRange: '10/04/2025 - 11/04/2025'
    },
    {
      code: 'ER-00007',
      name: 'Service Visit',
      amount: 2000,
      dateRange: '18/04/2025 - 20/04/2025'
    }
  ];

  filteredReports = [...this.reports];

  constructor(private fb: FormBuilder) {
    this.expenseForm = this.fb.group({
      expenses: this.fb.array([this.createExpenseRow()])
    });

    this.hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

  }

  get expenses(): FormArray {
    return this.expenseForm.get('expenses') as FormArray;
  }

  createExpenseRow(): FormGroup {
    return this.fb.group({
      expenseDate: [''],
      expenseSingleDate: [''],
      expenseSingleTime: [''],
      expenseFromDate: [''],
      expenseFromTime: [''],
      expenseToDate: [''],
      expenseToTime: [''],
      merchant: [''],
      category: [''],
      amount: [0],
      description: ['']
    });
  }

  addRow(): void {
    this.expenses.push(this.createExpenseRow());
  }

  selectRow(index: number): void {

    if (this.selectedRowIndex === index) {
      this.selectedRowIndex = null;
    } else {
      this.selectedRowIndex = index;
    }
  }

  deleteSelectedRow(): void {
    if (this.selectedRowIndex !== null) {
      this.expenses.removeAt(this.selectedRowIndex);
      this.selectedRowIndex = null;
      if (this.expenses.length == 0) {
        this.addRow();
      }
    }
  }


  addFromToDate() {
    this.addTodate = true;
  }

  backDate() {
    this.addTodate = false;
  }

  onFromChange(index: number) {
    this.filterToHours(index);
  }

  onToDateChange(index: number) {
    this.filterToHours(index);
  }

  getFromDate(index: number): string {
    const group = this.expenses.at(index) as FormGroup;
    return group.get('expenseFromDate')?.value || '';
  }

  filterToHours(index: number) {
    const group = this.expenses.at(index) as FormGroup;
    const fromDate = group.get('expenseFromDate')?.value;
    const toDate = group.get('expenseToDate')?.value;
    const fromHour = group.get('expenseFromTime')?.value;

    if (fromDate && toDate && fromDate === toDate) {
      const fromHourInt = parseInt(fromHour || '0', 10);
      this.filteredToHours[index] = this.hours.filter(h => parseInt(h, 10) > fromHourInt);

      const toHour = group.get('expenseToTime')?.value;
      if (toHour && parseInt(toHour, 10) <= fromHourInt) {
        group.get('expenseToTime')?.setValue('');
      }
    } else {
      this.filteredToHours[index] = [...this.hours];
    }
  }

  openDateTimeRangePicker(index: number) {
    this.activeRowIndex = index;
    this.dateTimeRangePickerVisible = !this.dateTimeRangePickerVisible;

    if (!this.dateTimeRangePickerVisible) {
      this.addTodate = false;

      const rowGroup = this.expenses.at(index) as FormGroup;
      rowGroup.patchValue({
        expenseSingleDate: '',
        expenseSingleTime: '',
        expenseFromDate: '',
        expenseFromTime: '',
        expenseToDate: '',
        expenseToTime: ''
      });

    }
    if (!(index in this.filteredToHours)) {
      this.filteredToHours[index] = [...this.hours];
    }

  }

  saveSelection(index: number) {
    const group = this.expenses.at(index) as FormGroup;

    if (this.addTodate) {
      const fromDate = group.get('expenseFromDate')?.value;
      const fromTime = group.get('expenseFromTime')?.value;
      const toDate = group.get('expenseToDate')?.value;
      const toTime = group.get('expenseToTime')?.value;

      if (fromDate && fromTime && toDate && toTime) {
        const fromDateTime = `${fromDate} ${fromTime}:00`;
        const toDateTime = `${toDate} ${toTime}:00`;
        const range = `${fromDateTime} - ${toDateTime}`;
        group.get('expenseDate')?.setValue(range);
      }
    } else {
      const singleDate = group.get('expenseSingleDate')?.value;
      const singleHour = group.get('expenseSingleTime')?.value;
      if (singleDate && singleHour) {
        const value = `${singleDate} ${singleHour}:00`;
        group.get('expenseDate')?.setValue(value);
      }
    }

    this.dateTimeRangePickerVisible = false;
    this.addTodate = false;
  }


  filterReports() {
    const term = this.searchTerm.toLowerCase();
    this.filteredReports = this.reports.filter(
      r =>
        r.name.toLowerCase().includes(term) ||
        r.code.toLowerCase().includes(term)
    );
  }

  selectReport(report: any) {
    this.selectedReport = report;
    this.searchTerm = `${report.code} | ${report.name}`;
    this.showDropdown = false;
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredReports = [...this.reports];
  }

  hideDropdown() {
    this.showDropdown = false;
  }




}
