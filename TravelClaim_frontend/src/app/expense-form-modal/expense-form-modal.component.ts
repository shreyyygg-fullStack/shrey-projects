import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';
import { PDFDocumentProxy, PdfViewerModule } from 'ng2-pdf-viewer';
import * as pdfjsLib from 'pdfjs-dist';
import { FormValidationService } from '../services/form-validation.service';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdfjs/pdf.worker.min.mjs';

@Component({
  selector: 'app-expense-form-modal',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, NgFor, FormsModule, NgClass, PdfViewerModule, NgStyle],
  templateUrl: './expense-form-modal.component.html',
  styleUrl: './expense-form-modal.component.scss'
})
export class ExpenseFormModalComponent {

  @Input() showModal: boolean = false;
  @Input() modalTitle: string = 'Modal Title';
  @Output() modalClosed = new EventEmitter<void>();

  tripType: string = 'oneWay'; // Default selection

  selectedOption: string = 'domestic';
  files: any;
  selectedFiles: FileList | undefined;
  selectedFilesArray: Array<{ name: string, type: string, thumbnail: string | null, snippet?: string }> = [];

  selectedFile: any = null;
  selectedFileUrl: string | Uint8Array | undefined = undefined;

  selectedImageUrl: string | null = null;
  selectedVideoUrl: string | null = null;

  selectedFileName: string | null = null;
  selectedFileSize: number = 0;
  selectedFileSizeKB: number = 0;

  selectedLastModified: Date | null = null;
  selectedFileIndex = 0;

  zoomLevel: number = 1; // For images (scaling factor)
  pdfZoomLevel: number = 1; // For PDFs (percentage zoom)

  domesticExpense: string[] = ['Date', 'Start Time', 'End Time', 'Starting Place', 'Destination City', 'Visit Site Name', 'Lodging', 'DA', 'FA', 'Other', 'Total'];

  domesticConveyance: string[] = ['Date', 'Start Time', 'End Time', 'Starting Place', 'Destination', 'Convey Mode', 'Distance KM', 'Conv. Amt.', 'Toll/Fastag/Parking', 'Train Exp.', 'Air Exp.', 'Total Amount'];

  overseasExpense: string[] = ['Date', 'Start Time', 'End Time', 'Starting Place', 'Departure City', 'Visit Site Name', 'Exch. Rate', 'Lodging (FC)', 'Lodging (INR)', 'FA (FC)', 'FA (INR)', 'DA (INR)', 'Total (INR)'];

  overseasConveyance: string[] = ['Date', 'Start Time', 'End Time', 'Starting Place', 'Destination', 'Exch. Rate', 'Convey Mode', 'Conv. Amt (FC)', 'Conv. Amt (INR)', 'Air Exp (FC)', 'Air Exp (INR)', 'Total (INR)'];

  domesticExpenseForm!: FormGroup;
  domesticConveyanceForm!: FormGroup;

  overseasExpenseForm!: FormGroup;
  overseasConveyanceForm!: FormGroup;

  selectedRowIndex1: number | null = null;
  selectedRowIndex2: number | null = null;
  selectedRowIndex3: number | null = null;
  selectedRowIndex4: number | null = null;

  maxDate: string = "";
  userGrade: string = 'lm-1';
  department: string = 'Service';
  dateValidationFlag: boolean[] = [];
  dateValidationMsg: string[] = [];

  dateValidationFlag2: boolean[] = [];
  dateValidationMsg2: string[] = [];

  domesticConveyanceTotalRow = 0;
  domesticConveyanceTotal = 0;
  domesticExpenseTotal = 0;
  grandTotalAmount: number = 0;
  lodgingDisabled: boolean = true;
  cityLevels: string[] = ["A+", "A", "B"];
  groupedCities: { level: string; cities: { city: string; area: string }[] }[] = [];
  cityColors: { [key: string]: string } = {};

  daValidationMsg: string[] = [];
  daValidationFlag: boolean[] = [];
  faValidationMsg: string[] = [];
  faValidationFlag: boolean[] = [];
  lodgingValidationFlag: boolean[] = [];
  lodgingValidationMsg: string[] = [];
  othersFlag: boolean[] = [];
  othersMsg: string[] = [];

  conveyModeFlag: boolean[] = [];
  conveyModeMsg: string[] = [];

  isAPlusCity: boolean = false;
  isACity: boolean = false;
  isBCity: boolean = false;

  redAreaDetination: boolean = false;
  orangeAreaDetination: boolean = false;
  greenAreaDetination: boolean = false;

  policy: string = "As per the policy, ";

  cityData: { cityLevel: string; city: string; area: string }[] = [
    { cityLevel: "A+", city: "Ahmedabad", area: "red" },
    { cityLevel: "A+", city: "Bangalore", area: "orange" },
    { cityLevel: "A+", city: "Chennai", area: "red" },
    { cityLevel: "A+", city: "Delhi", area: "red" },
    { cityLevel: "A+", city: "Hyderabad", area: "green" },
    { cityLevel: "A+", city: "Kolkata", area: "green" },
    { cityLevel: "A+", city: "Mumbai", area: "orange" },
    { cityLevel: "A+", city: "Pune", area: "red" },

    { cityLevel: "A", city: "Jaipur", area: "red" },
    { cityLevel: "A", city: "Lucknow", area: "green" },
    { cityLevel: "A", city: "Surat", area: "orange" },
    { cityLevel: "A", city: "Bhopal", area: "orange" },
    { cityLevel: "A", city: "Indore", area: "orange" },
    { cityLevel: "A", city: "Nagpur", area: "red" },
    { cityLevel: "A", city: "Patna", area: "orange" },
    { cityLevel: "A", city: "Vadodara", area: "green" },

    { cityLevel: "B", city: "Agra", area: "red" },
    { cityLevel: "B", city: "Amritsar", area: "green" },
    { cityLevel: "B", city: "Kanpur", area: "orange" },
    { cityLevel: "B", city: "Ludhiana", area: "green" },
    { cityLevel: "B", city: "Nashik", area: "green" },
    { cityLevel: "B", city: "Varanasi", area: "green" },
    { cityLevel: "B", city: "Meerut", area: "red" },
    { cityLevel: "B", city: "Ranchi", area: "green" }
  ];

  constructor(private fb: FormBuilder, private validationService: FormValidationService) { }

  ngOnInit(): void {

    const currentDate = new Date();
    this.maxDate = currentDate.toISOString().split('T')[0]; // Set once during initialization

    this.domesticExpenseForm = this.fb.group({
      domesticExpenseRows: this.fb.array([])
    });

    this.domesticConveyanceForm = this.fb.group({
      domesticConveyanceRows: this.fb.array([])
    });

    this.overseasExpenseForm = this.fb.group({
      overseasExpenseRows: this.fb.array([])
    });

    this.overseasConveyanceForm = this.fb.group({
      overseasConveyanceRows: this.fb.array([])
    });

    this.addRow('domestic', 'domesticExpense');
    this.addRow('domestic', 'domesticConveyance');

    this.processCityData();
  }

  get domesticExpenseRows(): FormArray {
    return this.domesticExpenseForm.get('domesticExpenseRows') as FormArray;
  }

  get domesticConveyanceRows(): FormArray {
    return this.domesticConveyanceForm.get('domesticConveyanceRows') as FormArray;
  }

  get overseasExpenseRows(): FormArray {
    return this.overseasExpenseForm.get('overseasExpenseRows') as FormArray;
  }

  get overseasConveyanceRows(): FormArray {
    return this.overseasConveyanceForm.get('overseasConveyanceRows') as FormArray;
  }

  addRow(selectedTab: any, selectedform: any) {

    if (selectedTab === "domestic") {

      if (selectedform === "domesticExpense") {

        const row = this.fb.group({
          date: new FormControl('', [Validators.required]),
          startTime: new FormControl('', [Validators.required]),
          endTime: new FormControl('', [Validators.required]),
          startingPlace: new FormControl('', [Validators.required]),
          destinationCity: new FormControl('', [Validators.required]),
          visitSiteName: new FormControl('', [Validators.required]),
          lodging: new FormControl({ value: '', disabled: this.lodgingDisabled }, Validators.required),
          da: new FormControl('', [Validators.required]),
          fa: new FormControl('', [Validators.required]),
          other: new FormControl('', [Validators.required]),
          total: new FormControl('', [Validators.required])
        });

        this.domesticExpenseRows.push(row);

      } else if (selectedform === "domesticConveyance") {

        const row = this.fb.group({
          date: new FormControl('', [Validators.required]),
          startTime: new FormControl('', [Validators.required]),
          endTime: new FormControl('', [Validators.required]),
          startingPlace: new FormControl('', [Validators.required]),
          destination: new FormControl('', [Validators.required]),
          conveyMode: new FormControl('', [Validators.required]),
          distanceKm: new FormControl('', [Validators.required]),
          convAmt: new FormControl('', [Validators.required]),
          tollNother: new FormControl('', [Validators.required]),
          trainExp: new FormControl('', [Validators.required]),
          airExp: new FormControl('', [Validators.required]),
          total: new FormControl('', [Validators.required])
        });

        this.domesticConveyanceRows.push(row);
      }

    } else if (selectedTab === "overseas") {

      if (selectedform === "overseasExpense") {

        const row = this.fb.group({
          date: new FormControl('', [Validators.required]),
          startTime: new FormControl('', [Validators.required]),
          endTime: new FormControl('', [Validators.required]),
          startingPlace: new FormControl('', [Validators.required]),
          cityTravelledTo: new FormControl('', [Validators.required]),
          visitSiteName: new FormControl('', [Validators.required]),
          exchangeRate: new FormControl('', [Validators.required]),
          lodgingFC: new FormControl('', [Validators.required]),
          lodgingINR: new FormControl('', [Validators.required]),
          faFC: new FormControl('', [Validators.required]),
          faINR: new FormControl('', [Validators.required]),
          daINR: new FormControl('', [Validators.required]),
          totalINR: new FormControl('', [Validators.required])
        });

        this.overseasExpenseRows.push(row);

      } else if (selectedform === "overseasConveyance") {

        const row = this.fb.group({
          date: new FormControl('', [Validators.required]),
          startTime: new FormControl('', [Validators.required]),
          endTime: new FormControl('', [Validators.required]),
          startingPlace: new FormControl('', [Validators.required]),
          destination: new FormControl('', [Validators.required]),
          exchangeRate: new FormControl('', [Validators.required]),
          conveyMode: new FormControl('', [Validators.required]),
          convAmtFC: new FormControl('', [Validators.required]),
          convAmtINR: new FormControl('', [Validators.required]),
          airExpFC: new FormControl('', [Validators.required]),
          airExpINR: new FormControl('', [Validators.required]),
          totalINR: new FormControl('', [Validators.required])
        });

        this.overseasConveyanceRows.push(row);
      }
    }
  }

  selectRow1(index: number) {
    this.selectedRowIndex1 = index;
  }

  selectRow2(index: number) {
    this.selectedRowIndex2 = index;
  }

  selectRow3(index: number) {
    this.selectedRowIndex3 = index;
  }

  selectRow4(index: number) {
    this.selectedRowIndex4 = index;
  }

  deleteSelectedRow(selectedTab: any, selectedform: any) {

    if (selectedTab === "domestic") {
      if (selectedform === "domesticExpense") {

        // if (this.domesticExpenseRows.length > 1) {
        //   this.domesticExpenseRows.removeAt(this.domesticExpenseRows.length - 1);
        // }
        if (this.selectedRowIndex1 !== null) {

          if (this.domesticExpenseRows.length == 1) {

            this.domesticExpenseRows.removeAt(this.selectedRowIndex1);

            this.dateValidationMsg.splice(this.selectedRowIndex1, 1);
            this.dateValidationFlag.splice(this.selectedRowIndex1, 1);

            this.daValidationMsg.splice(this.selectedRowIndex1, 1);
            this.daValidationFlag.splice(this.selectedRowIndex1, 1);
            this.faValidationMsg.splice(this.selectedRowIndex1, 1);
            this.faValidationFlag.splice(this.selectedRowIndex1, 1);
            this.lodgingValidationFlag.splice(this.selectedRowIndex1, 1);
            this.lodgingValidationMsg.splice(this.selectedRowIndex1, 1);
            this.othersFlag.splice(this.selectedRowIndex1, 1);
            this.othersMsg.splice(this.selectedRowIndex1, 1);

            this.selectedRowIndex1 = null; // Reset after deletion

            this.addRow('domestic', 'domesticExpense');
          } else {

            this.domesticExpenseRows.removeAt(this.selectedRowIndex1);

            this.dateValidationMsg.splice(this.selectedRowIndex1, 1);
            this.dateValidationFlag.splice(this.selectedRowIndex1, 1);

            this.daValidationMsg.splice(this.selectedRowIndex1, 1);
            this.daValidationFlag.splice(this.selectedRowIndex1, 1);
            this.faValidationMsg.splice(this.selectedRowIndex1, 1);
            this.faValidationFlag.splice(this.selectedRowIndex1, 1);
            this.lodgingValidationFlag.splice(this.selectedRowIndex1, 1);
            this.lodgingValidationMsg.splice(this.selectedRowIndex1, 1);
            this.othersFlag.splice(this.selectedRowIndex1, 1);
            this.othersMsg.splice(this.selectedRowIndex1, 1);

            this.selectedRowIndex1 = null; // Reset after deletion
          }
        }
      } else if (selectedform === "domesticConveyance") {

        // if (this.domesticConveyanceRows.length > 1) {
        //   this.domesticConveyanceRows.removeAt(this.domesticConveyanceRows.length - 1);
        // }

        if (this.selectedRowIndex2 !== null) {

          if (this.domesticConveyanceRows.length == 1) {

            this.domesticConveyanceRows.removeAt(this.selectedRowIndex2);

            this.dateValidationMsg2.splice(this.selectedRowIndex2, 1);
            this.dateValidationFlag2.splice(this.selectedRowIndex2, 1);

            this.conveyModeFlag.splice(this.selectedRowIndex2, 1);
            this.conveyModeMsg.splice(this.selectedRowIndex2, 1);

            this.selectedRowIndex2 = null; // Reset after deletion

            this.addRow('domestic', 'domesticConveyance');

          } else {
            this.domesticConveyanceRows.removeAt(this.selectedRowIndex2);

            this.dateValidationMsg2.splice(this.selectedRowIndex2, 1);
            this.dateValidationFlag2.splice(this.selectedRowIndex2, 1);

            this.conveyModeFlag.splice(this.selectedRowIndex2, 1);
            this.conveyModeMsg.splice(this.selectedRowIndex2, 1);

            this.selectedRowIndex2 = null; // Reset after deletion
          }
        }
      }
    } else if (selectedTab === "overseas") {
      if (selectedform === "overseasExpense") {

        // if (this.overseasExpenseRows.length > 1) {
        //   this.overseasExpenseRows.removeAt(this.overseasExpenseRows.length - 1);
        // }
        if (this.selectedRowIndex3 !== null) {

          if (this.overseasExpenseRows.length == 1) {

            this.overseasExpenseRows.removeAt(this.selectedRowIndex3);

            this.dateValidationMsg.splice(this.selectedRowIndex3, 1);
            this.dateValidationFlag.splice(this.selectedRowIndex3, 1);


            this.selectedRowIndex3 = null; // Reset after deletion

            this.addRow('overseas', 'overseasExpense');

          } else {
            this.overseasExpenseRows.removeAt(this.selectedRowIndex3);

            this.dateValidationMsg.splice(this.selectedRowIndex3, 1);
            this.dateValidationFlag.splice(this.selectedRowIndex3, 1);

            this.selectedRowIndex3 = null; // Reset after deletion
          }
        }
      } else if (selectedform === "overseasConveyance") {

        // if (this.overseasConveyanceRows.length > 1) {
        //   this.overseasConveyanceRows.removeAt(this.overseasConveyanceRows.length - 1);
        // }
        if (this.selectedRowIndex4 !== null) {

          if (this.overseasConveyanceRows.length == 1) {

            this.overseasConveyanceRows.removeAt(this.selectedRowIndex4);

            this.dateValidationMsg2.splice(this.selectedRowIndex4, 1);
            this.dateValidationFlag2.splice(this.selectedRowIndex4, 1);

            this.selectedRowIndex4 = null; // Reset after deletion

            this.addRow('overseas', 'overseasConveyance');

          } else {
            this.overseasConveyanceRows.removeAt(this.selectedRowIndex4);

            this.dateValidationMsg2.splice(this.selectedRowIndex4, 1);
            this.dateValidationFlag2.splice(this.selectedRowIndex4, 1);

            this.selectedRowIndex4 = null; // Reset after deletion
          }
        }
      }
    }

    this.updateDomesticExpenseTotal();
    this.updateDomesticConveyanceTotal();
  }

  printTableValues() {

    if (this.selectedOption === "domestic") {

      const isDomesticExpenseFormFilled = this.isFormFilled(this.domesticExpenseForm);
      const isDomesticConveyanceFormFilled = this.isFormFilled(this.domesticConveyanceForm);

      let isAnyFormSubmitted = false;

      if (isDomesticExpenseFormFilled) {
        if (this.domesticExpenseForm.valid) {
          console.log('Domestic Expense Form Data:', this.domesticExpenseForm.value.domesticExpenseRows);
          isAnyFormSubmitted = true;
        } else {
          alert('Domestic Expense Form is invalid');
        }
      }

      if (isDomesticConveyanceFormFilled) {
        if (this.domesticConveyanceForm.valid) {
          console.log('Domestic Conveyance Form Data:', this.domesticConveyanceForm.value.domesticConveyanceRows);
          isAnyFormSubmitted = true;
        } else {
          alert('Domestic Conveyance Form is invalid');
        }
      }

      if (!isDomesticExpenseFormFilled && !isDomesticConveyanceFormFilled) {
        alert('Please fill at least one form before submitting.');
      } else if (!isAnyFormSubmitted) {
        // alert('Form is invalid. Please check the details and try again.');
      }

    } else if (this.selectedOption === "overseas") {

      const isOverseasExpenseFormFilled = this.isFormFilled(this.overseasExpenseForm);
      const isOverseasConveyanceFormFilled = this.isFormFilled(this.overseasConveyanceForm);

      let isAnyFormSubmitted1 = false;

      if (isOverseasExpenseFormFilled) {
        if (this.overseasExpenseForm.valid) {
          console.log('Overseas Expense Form Data:', this.overseasExpenseForm.value.overseasExpenseRows);
          isAnyFormSubmitted1 = true;
        } else {
          alert('Overseas Expense Form is invalid');
        }
      }

      if (isOverseasConveyanceFormFilled) {
        if (this.overseasConveyanceForm.valid) {
          console.log('Overseas Conveyance Form Data:', this.overseasConveyanceForm.value.overseasConveyanceRows);
          isAnyFormSubmitted1 = true;
        } else {
          alert('Overseas Conveyance Form is invalid');
        }
      }

      if (!isOverseasExpenseFormFilled && !isOverseasConveyanceFormFilled) {
        alert('Please fill at least one form before submitting.');
      } else if (!isAnyFormSubmitted1) {
        // alert('Form is invalid. Please check the details and try again.');
      }

    }

  }

  private isFormFilled(form: FormGroup): boolean {
    if (!form) return false;

    for (const key of Object.keys(form.controls)) {
      const control = form.get(key);

      if (control instanceof FormControl) {
        if (control.value !== null && control.value !== '' && control.value !== undefined) {
          return true;
        }
      }

      if (control instanceof FormArray) {
        // Check if any FormGroup inside FormArray has a non-empty value
        return control.controls.some(group =>
          Object.values(group.value).some(value => value !== null && value !== '')
        );
      }
    }

    return false;
  }

  closeModal(): void {
    this.showModal = false;
    this.modalClosed.emit();
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.selectedFilesArray = [];

    if (this.selectedOption === "domestic") {

      this.domesticExpenseRows.clear();
      this.domesticConveyanceRows.clear();

      this.selectedRowIndex1 = null;
      this.selectedRowIndex2 = null;
      this.selectedRowIndex3 = null;
      this.selectedRowIndex4 = null;

      this.dateValidationFlag = [];
      this.dateValidationMsg = [];

      this.dateValidationFlag2 = [];
      this.dateValidationMsg2 = [];

      this.daValidationMsg = [];
      this.daValidationFlag = [];
      this.faValidationMsg = [];
      this.faValidationFlag = [];
      this.lodgingValidationFlag = [];
      this.lodgingValidationMsg = [];
      this.othersFlag = [];
      this.othersMsg = [];
      this.conveyModeFlag = [];
      this.conveyModeMsg = [];

      this.addRow('domestic', 'domesticExpense');
      this.addRow('domestic', 'domesticConveyance');

    } else if (this.selectedOption === "overseas") {

      this.overseasExpenseRows.clear();
      this.overseasConveyanceRows.clear();

      this.selectedRowIndex1 = null;
      this.selectedRowIndex2 = null;
      this.selectedRowIndex3 = null;
      this.selectedRowIndex4 = null;

      this.dateValidationFlag = [];
      this.dateValidationMsg = [];

      this.dateValidationFlag2 = [];
      this.dateValidationMsg2 = [];

      this.daValidationMsg = [];
      this.daValidationFlag = [];
      this.faValidationMsg = [];
      this.faValidationFlag = [];
      this.lodgingValidationFlag = [];
      this.lodgingValidationMsg = [];
      this.othersFlag = [];
      this.othersMsg = [];
      this.conveyModeFlag = [];
      this.conveyModeMsg = [];

      this.addRow('overseas', 'overseasExpense');
      this.addRow('overseas', 'overseasConveyance');
    }
  }

  // clearSelection() {
  //   this.selectedFiles = undefined;
  //   const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  //   if (fileInput) fileInput.value = '';
  // }

  async getFile(event: any) {

    // this.selectedFilesArray = [];
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles[i];

        console.log("file details--", file);

        const fileObj: any = {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          thumbnail: null,
          snippet: null,
        };

        // Handle image files
        if (file.type.startsWith('image/')) {
          const imageDataUrl = await this.readFileAsDataURL(file);
          fileObj.thumbnail = imageDataUrl;
        }

        // Handle text files
        else if (file.type.startsWith('text/')) {
          const textContent = await this.readFileAsText(file);
          fileObj.snippet = textContent.substring(0, 100); // First 100 chars
        }

        // Handle video files
        else if (file.type.startsWith('video/')) {
          const videoDataUrl = await this.readFileAsDataURL(file);
          fileObj.thumbnail = videoDataUrl;

        } else if (file.type === 'application/pdf') {
          const pdfThumbnail = await this.generatePdfThumbnail(file);
          fileObj.thumbnail = pdfThumbnail;
          const arrayBuffer = await this.readFileAsArrayBuffer(file);
          fileObj.data = new Uint8Array(arrayBuffer);
        }
        this.selectedFilesArray.push(fileObj);
      }

      console.log("Selected Files with thumbnails:", this.selectedFilesArray);
    }
  }

  private readFileAsDataURL(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(file);
    });
  }


  private async generatePdfThumbnail(file: File): Promise<string | null> {
    const pdfData = await file.arrayBuffer();
    const pdfDoc: PDFDocumentProxy = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const page = await pdfDoc.getPage(1);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    // Create a canvas to render the thumbnail
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext('2d');

    // Render the page into the canvas
    await page.render({ canvasContext: context as CanvasRenderingContext2D, viewport }).promise;

    // Convert the canvas to a DataURL
    return canvas.toDataURL('image/png');
  }


  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.readAsArrayBuffer(file);
    });
  }


  // Set the selected file when clicked
  async selectFile(index: number, file: any) {
    this.selectedFile = file;
    this.selectedFileIndex = index + 1;

    if (file.type === 'application/pdf') {
      this.selectedFileUrl = new Uint8Array(file.data);

      this.selectedFileName = file.name;
      this.selectedFileSize = file.size;
      this.selectedFileSizeKB = this.bytesToKilobytes(this.selectedFileSize);

      var date = file.lastModified;
      this.selectedLastModified = new Date(date);


      // console.log('PDF URL set to:', this.selectedFileUrl);

    } else if (file.type.startsWith('image/')) {

      this.selectedFileName = file.name;
      this.selectedFileSize = file.size;
      this.selectedFileSizeKB = this.bytesToKilobytes(this.selectedFileSize);
      this.selectedImageUrl = file.thumbnail;

      var date = file.lastModified;
      this.selectedLastModified = new Date(date);

    }
    else if (file.type.startsWith('video/')) {

      this.selectedFileName = file.name;
      this.selectedFileSize = file.size;
      this.selectedFileSizeKB = this.bytesToKilobytes(this.selectedFileSize);
      this.selectedVideoUrl = file.thumbnail;

      var date = file.lastModified;
      this.selectedLastModified = new Date(date);

    } else if (file.type === 'text/') {

    }
    else {
      this.selectedFileUrl = undefined;
    }
  }

  bytesToKilobytes(bytes: number): number {
    return bytes / 1024;
  }

  deleteFile(index: number, event: Event): void {
    event.stopPropagation(); // Prevent triggering the `selectFile` event
    this.selectedFilesArray.splice(index, 1);
    if (this.selectedFile === this.selectedFilesArray[index]) {
      this.selectedFile = null; // Deselect if the deleted file was selected
    }
  }


  zoomIn() {
    if (this.selectedFile.type.startsWith('image/')) {
      this.zoomLevel += 0.1;
    } else if (this.selectedFile.type === 'application/pdf') {
      this.pdfZoomLevel += 0.1;

    }
  }

  zoomOut() {
    if (this.selectedFile.type.startsWith('image/') && this.zoomLevel > 0.2) {
      this.zoomLevel -= 0.1;
    } else if (this.selectedFile.type === 'application/pdf' && this.pdfZoomLevel > 0.2) {
      this.pdfZoomLevel -= 0.1;
    }
  }

  resetZoom() {
    this.zoomLevel = 1;
    this.pdfZoomLevel = 1;
  }

  closePreviewModal() {
    this.selectedFile = false;
    this.resetZoom();
  }






  isDateInvalid(index: number, formName: string) {

    let row: AbstractControl<any, any> | null = null;

    switch (formName) {

      case 'domesticExpense':
        row = this.domesticExpenseRows.controls[index];
        break;

      case 'domesticConveyance':
        row = this.domesticConveyanceRows.controls[index];
        break;

      case 'overseasExpense':
        row = this.overseasExpenseRows.controls[index];
        break;

      case 'overseasConveyance':
        row = this.overseasConveyanceRows.controls[index];
        break;
    }

    // if (formName === "domesticExpense") {

    //   row = this.domesticExpenseRows.controls[index];

    // } else if (formName === "domesticConveyance") {

    //   row = this.domesticConveyanceRows.controls[index];

    // } else if (formName === "overseasExpense") {

    //   row = this.overseasExpenseRows.controls[index];
    // }
    // else if (formName === "overseasConveyance") {

    //   row = this.overseasConveyanceRows.controls[index];
    // }

    if (row) { // Ensure row is not null before using it
      const dateResult = this.validationService.validateDate(row, this.department.toLocaleLowerCase());

      if (formName === "domesticExpense" || formName === "overseasExpense") {

        this.dateValidationFlag[index] = dateResult.flag;
        this.dateValidationMsg[index] = dateResult.message;

      } else if (formName === "domesticConveyance" || formName === "overseasConveyance") {

        this.dateValidationFlag2[index] = dateResult.flag;
        this.dateValidationMsg2[index] = dateResult.message;

      }
    }
  }



  validateDomesticExpenseRow(index: number, controlName: string) {
    const row: AbstractControl = this.domesticExpenseRows.controls[index];

    switch (controlName) {
      // case 'date':

      //   const dateResult = this.validationService.validateDate(row, this.department.toLocaleLowerCase());
      //   this.dateValidationFlag[index] = dateResult.flag;
      //   this.dateValidationMsg[index] = dateResult.message;

      //   break;

      case 'startTime':
        this.checkStartAndEndTime(row, index);

        break;

      case 'endTime':
        this.checkStartAndEndTime(row, index);
        break;

      case 'destination':
        const cityFlags = this.validationService.validateDestination(row, this.cityData, this.isAPlusCity, this.isACity, this.isBCity,
          this.redAreaDetination, this.orangeAreaDetination, this.greenAreaDetination);

        this.isAPlusCity = cityFlags.isAPlusCity;
        this.isACity = cityFlags.isACity;
        this.isBCity = cityFlags.isBCity;

        this.redAreaDetination = cityFlags.redArea;
        this.orangeAreaDetination = cityFlags.orangeArea;
        this.greenAreaDetination = cityFlags.greenArea;


        const lodgingResultInDetination = this.validationService.validateLodging(row, this.isAPlusCity, this.isACity, this.isBCity, this.userGrade.toLowerCase());
        this.lodgingValidationFlag[index] = lodgingResultInDetination.flag;
        this.lodgingValidationMsg[index] = lodgingResultInDetination.message;

        const daResultInDest = this.validationService.validateDA(row, this.userGrade.toLowerCase(), this.redAreaDetination, this.orangeAreaDetination, this.greenAreaDetination);
        this.daValidationFlag[index] = daResultInDest.flag;
        this.daValidationMsg[index] = daResultInDest.message;

        break;

      case 'lodging':
        const lodgingResult = this.validationService.validateLodging(row, this.isAPlusCity, this.isACity, this.isBCity, this.userGrade.toLowerCase());
        this.lodgingValidationFlag[index] = lodgingResult.flag;
        this.lodgingValidationMsg[index] = lodgingResult.message;
        this.calDomesticExpenseTotalAmt(index);
        break;

      case 'daPrice':
        const daResult = this.validationService.validateDA(row, this.userGrade.toLowerCase(), this.redAreaDetination, this.orangeAreaDetination, this.greenAreaDetination);
        this.daValidationFlag[index] = daResult.flag;
        this.daValidationMsg[index] = daResult.message;
        this.calDomesticExpenseTotalAmt(index);
        break;

      case 'faPrice':
        const faResult = this.validationService.validateFA(row, this.userGrade.toLowerCase());
        this.faValidationFlag[index] = faResult.flag;
        this.faValidationMsg[index] = faResult.message;
        this.calDomesticExpenseTotalAmt(index);
        break;


      case 'others':
        const OtherResult = this.validationService.validateOthers(row);
        this.othersFlag[index] = OtherResult.flag;
        this.othersMsg[index] = OtherResult.message;
        this.calDomesticExpenseTotalAmt(index);
        break;
    }
  }


  validateConveyMode(index: number) {
    const row: AbstractControl = this.domesticConveyanceRows.controls[index];
    const conveyResult = this.validationService.validateConveyMode(row, this.userGrade.toLowerCase());
    this.conveyModeFlag[index] = conveyResult.flag;
    this.conveyModeMsg[index] = conveyResult.message;
  }


  checkStartAndEndTime(row: AbstractControl, index: number) {
    let halfTimeFlag = this.validationService.validateTime(row);

    if (halfTimeFlag == true) {
      row.get('lodging')?.disable(); // Disable lodging field
      row.get('lodging')?.setValue(''); // Reset lodging value

      this.lodgingValidationMsg[index] = '';
      this.lodgingValidationFlag[index] = false;

    } else {
      row.get('lodging')?.enable(); // Enable lodging field
      this.lodgingValidationMsg[index] = '';
      this.lodgingValidationFlag[index] = false;
    }

    const daResultInStartTime = this.validationService.validateDA(row, this.userGrade.toLowerCase(), this.redAreaDetination, this.orangeAreaDetination, this.greenAreaDetination);
    this.daValidationFlag[index] = daResultInStartTime.flag;
    this.daValidationMsg[index] = daResultInStartTime.message;

  }


  calDomesticExpenseTotalAmt(index: number) {
    const row: AbstractControl = this.domesticExpenseRows.controls[index];
    const lodging = Number(row.get('lodging')?.value) || 0;
    const daPrice = Number(row.get('da')?.value) || 0;
    const faPrice = Number(row.get('fa')?.value) || 0;
    const others = Number(row.get('other')?.value) || 0;

    const total = lodging + daPrice + faPrice + others;
    row.get('total')?.setValue(total, { emitEvent: false });
    this.updateDomesticExpenseTotal();
  }

  updateDomesticExpenseTotal() {
    this.domesticExpenseTotal = this.domesticExpenseRows.controls.reduce((sum, row) => {
      return sum + (Number(row.get('total')?.value) || 0);
    }, 0);

    this.grandTotalAmount = this.domesticExpenseTotal + this.domesticConveyanceTotal;
  }

  processCityData() {
    // Group cities by level
    this.groupedCities = this.cityLevels.map(level => ({
      level,
      cities: this.cityData.filter(data => data.cityLevel === level)
    }));

    this.cityColors = {
      red: '#EE4B2B',
      orange: '#FFA500',
      green: '#39ff8d'

    };
  }

  calcDomesticConveyanceTotalAmt(index: number) {
    const row: AbstractControl = this.domesticConveyanceRows.controls[index];
    this.domesticConveyanceTotalRow = this.validationService.calcDomstConvTotalAmt(row);
    row.get('total')?.setValue(this.domesticConveyanceTotalRow);

    this.updateDomesticConveyanceTotal();
  }


  updateDomesticConveyanceTotal() {

    this.domesticConveyanceTotal = this.domesticConveyanceRows.controls.reduce((sum, row) => {
      return sum + (Number(row.get('total')?.value) || 0);
    }, 0);

    this.grandTotalAmount = this.domesticExpenseTotal + this.domesticConveyanceTotal;
  }


}
