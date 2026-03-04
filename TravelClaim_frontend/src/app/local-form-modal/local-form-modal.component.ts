import { NgIf, NgFor, NgClass, NgStyle } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormArray, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { PDFDocumentProxy, PdfViewerModule } from 'ng2-pdf-viewer';
import * as pdfjsLib from 'pdfjs-dist';
import { FormValidationService } from '../services/form-validation.service';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdfjs/pdf.worker.min.mjs';

@Component({
  selector: 'app-local-form-modal',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, NgFor, FormsModule, NgClass, PdfViewerModule, NgStyle],
  templateUrl: './local-form-modal.component.html',
  styleUrl: './local-form-modal.component.scss'
})
export class LocalFormModalComponent {

  @Input() showModal: boolean = false;
  @Input() modalTitle: string = 'Modal Title';
  @Output() modalClosed = new EventEmitter<void>();
  @ViewChild('myInput')
  myInputVariable: ElementRef | any;

  selectedOption: string = 'public';
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

  conveyanceHeadings: string[] = ['Date', 'From (Time)', 'To (Time)', 'Starting Place', 'Destination', 'Visit Site Name', 'Convey Mode', 'Distance KM', 'Total Amount'];

  vehicleHeadings: string[] = ['Date', 'Visit Site Name', 'Vehicle Type', 'Rate/KM', 'Opening KM', 'Closing KM', 'Total KM', 'Toll/Fastag/Parking', 'Total Amount'];

  publicForm!: FormGroup;
  vehicleForm!: FormGroup;

  maxDate: string = "";
  userGrade: string = 'lm-1';
  department: string = 'Service';
  dateValidationFlag: boolean[] = [];
  dateValidationMsg: string[] = [''];

  distanceValidationFlag: boolean[] = [];

  totalDistanceInvalid: boolean[] = [];
  vehicleTypeInvalid: boolean[] = [];
  openingKmInvalid: boolean[] = [];

  selectedRowIndex1: number | null = null;
  selectedRowIndex2: number | null = null;

  grandTotal: number = 0;

  policy:string= "As per the policy, ";

  constructor(private fb: FormBuilder, private validationService: FormValidationService) { }

  ngOnInit(): void {

    const currentDate = new Date();
    this.maxDate = currentDate.toISOString().split('T')[0]; // Set once during initialization


    this.publicForm = this.fb.group({
      publicRows: this.fb.array([])
    });

    this.vehicleForm = this.fb.group({
      vehicleRows: this.fb.array([])
    });

    this.addRow();

  }

  get publicRows(): FormArray {
    return this.publicForm.get('publicRows') as FormArray;
  }

  get vehicleRows(): FormArray {
    return this.vehicleForm.get('vehicleRows') as FormArray;
  }

  addRow() {

    if (this.selectedOption === "public") {

      const row = this.fb.group({
        date: new FormControl('', [Validators.required]),
        fromTime: new FormControl('', [Validators.required]),
        toTime: new FormControl('', [Validators.required]),
        startingPlace: new FormControl('', [Validators.required]),
        destination: new FormControl('', [Validators.required]),
        visitSiteName: new FormControl('', [Validators.required]),
        conveyMode: new FormControl('', [Validators.required]),
        distanceKm: new FormControl('', [Validators.required]),
        totalAmount: new FormControl('', [Validators.required])
      });

      this.publicRows.push(row);

    } else if (this.selectedOption === "vehicle") {

      const row = this.fb.group({
        date: new FormControl('', [Validators.required]),
        visitSiteName: new FormControl('', [Validators.required]),
        vehicleType: new FormControl('', [Validators.required]),
        rateKm: new FormControl('', [Validators.required]),
        openingKm: new FormControl('', [Validators.required]),
        closingKm: new FormControl('', [Validators.required]),
        totalKm: new FormControl('', [Validators.required]),
        tollNother: new FormControl('', [Validators.required]),
        totalAmount: new FormControl('', [Validators.required])
      });

      this.vehicleRows.push(row);
    }
  }

  selectRow1(index: number) {
    this.selectedRowIndex1 = index;
  }

  selectRow2(index: number) {
    this.selectedRowIndex2 = index;
  }

  deleteSelectedRow() {
    if (this.selectedOption === "public") {

      if (this.selectedRowIndex1 !== null) {

        if (this.publicRows.length == 1) {

          this.publicRows.removeAt(this.selectedRowIndex1);

          this.dateValidationMsg.splice(this.selectedRowIndex1, 1);
          this.dateValidationFlag.splice(this.selectedRowIndex1, 1);

          this.distanceValidationFlag.splice(this.selectedRowIndex1, 1);

          this.totalDistanceInvalid.splice(this.selectedRowIndex1, 1);
          this.vehicleTypeInvalid.splice(this.selectedRowIndex1, 1);
          this.openingKmInvalid.splice(this.selectedRowIndex1, 1);

          this.selectedRowIndex1 = null; // Reset after deletion

          this.addRow();
          this.calculateGrandTotal();

        } else {
          this.publicRows.removeAt(this.selectedRowIndex1);

          this.dateValidationMsg.splice(this.selectedRowIndex1, 1);
          this.dateValidationFlag.splice(this.selectedRowIndex1, 1);

          this.distanceValidationFlag.splice(this.selectedRowIndex1, 1);

          this.totalDistanceInvalid.splice(this.selectedRowIndex1, 1);
          this.vehicleTypeInvalid.splice(this.selectedRowIndex1, 1);
          this.openingKmInvalid.splice(this.selectedRowIndex1, 1);

          this.selectedRowIndex1 = null; // Reset after deletion
          this.calculateGrandTotal();
          
        }
      }
      // if (this.publicRows.length > 1) {
      //   this.publicRows.removeAt(this.publicRows.length - 1);
      // }
    }
    else if (this.selectedOption === "vehicle") {

      if (this.selectedRowIndex2 !== null) {

        if (this.vehicleRows.length == 1) {

          this.vehicleRows.removeAt(this.selectedRowIndex2);

          this.dateValidationMsg.splice(this.selectedRowIndex2, 1);
          this.dateValidationFlag.splice(this.selectedRowIndex2, 1);

          this.distanceValidationFlag.splice(this.selectedRowIndex2, 1);

          this.totalDistanceInvalid.splice(this.selectedRowIndex2, 1);
          this.vehicleTypeInvalid.splice(this.selectedRowIndex2, 1);
          this.openingKmInvalid.splice(this.selectedRowIndex2, 1);

          this.selectedRowIndex2 = null; // Reset after deletion

          this.addRow();
          this.calculateGrandTotal();
        } else {
          this.vehicleRows.removeAt(this.selectedRowIndex2);

          this.dateValidationMsg.splice(this.selectedRowIndex2, 1);
          this.dateValidationFlag.splice(this.selectedRowIndex2, 1);

          this.distanceValidationFlag.splice(this.selectedRowIndex2, 1);

          this.totalDistanceInvalid.splice(this.selectedRowIndex2, 1);
          this.vehicleTypeInvalid.splice(this.selectedRowIndex2, 1);
          this.openingKmInvalid.splice(this.selectedRowIndex2, 1);
          
          this.selectedRowIndex2 = null; // Reset after deletion
          this.calculateGrandTotal();
        }
      }
      // if (this.vehicleRows.length > 1) {
      //   this.vehicleRows.removeAt(this.vehicleRows.length - 1);
      // }
    }
  }


  closeModal(): void {
    this.showModal = false;
    this.modalClosed.emit();
  }

  onSubmit(): void {
    if (this.selectedOption === "public") {
      if (this.publicForm.valid) {
        console.log('Form Data:', this.publicForm.value.publicRows);
      } else {
        alert('Form is invalid');
      }
    }
    else if (this.selectedOption === "vehicle") {
      if (this.vehicleForm.valid) {
        console.log('Form Data:', this.vehicleForm.value.vehicleRows);
      } else {
        alert('Form is invalid');
      }
    }
  }


  selectOption(option: string): void {
    this.selectedOption = option;
    this.selectedFilesArray = [];
    this.myInputVariable.nativeElement.value = "";

    this.selectedRowIndex1 = null;
    this.selectedRowIndex2 = null;

    this.dateValidationFlag = [];
    this.dateValidationMsg = [];

    this.distanceValidationFlag = [];

    this.totalDistanceInvalid = [];
    this.vehicleTypeInvalid = [];
    this.openingKmInvalid = [];

    this.grandTotal = 0;
    this.publicRows.clear();
    this.vehicleRows.clear();
    this.addRow();
  }

  // clearSelection() {
  //   this.selectedFiles = undefined;
  //   const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  //   if (fileInput) {
  //     fileInput.value = ''
  //   };
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
    this.selectedFilesArray.splice(index, 1); // Remove the file from the array
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




  isDistanceInvalid(index: number) {
    const row: AbstractControl = this.publicRows.controls[index];

    if (row) { // Ensure row is not null before using it
      const dateResult = this.validationService.isDistanceInvalid(row);
      this.distanceValidationFlag[index] = dateResult;
    }
  }


  isDateInvalid(index: number) {

    let row: AbstractControl<any, any> | null = null;

    if (this.selectedOption === "public") {

      row = this.publicRows.controls[index];

    } else if (this.selectedOption === "vehicle") {

      row = this.vehicleRows.controls[index];
    }

    if (row) { // Ensure row is not null before using it
      const dateResult = this.validationService.validateDate(row, this.department.toLocaleLowerCase());
      this.dateValidationFlag[index] = dateResult.flag;
      this.dateValidationMsg[index] = dateResult.message;
    }

    // const date = (row as FormGroup).get('date')?.value;
    // if (!date) return false;

    // const currentDate = new Date();
    // const givenDate = new Date(date); // Convert string to Date object
    // this.maxDate = currentDate.toISOString().split('T')[0];

    // // Calculate the difference in days
    // const differenceInTime = currentDate.getTime() - givenDate.getTime();
    // const differenceInDays = differenceInTime / (1000 * 3600 * 24); // Convert ms to days

    // // Check based on department value
    // const allowedDays = this.department === 'Service' ? 30 : 7;

    // return differenceInDays > allowedDays;
  }


  // isVehicleTypeInvalid(row: AbstractControl): boolean {
  //   const userGradeLower = this.userGrade.toLowerCase();
  //   const vehicleType = (row as FormGroup).get('vehicleType')?.value;

  //   // If user is LM0, they can only use Two Wheeler
  //   if (userGradeLower === 'lm0' && vehicleType != 'Two Wheeler' && vehicleType != '') {
  //     return true; // Invalid selection
  //   } else {
  //     return false;
  //   }
  // }


  validateOwnVehicleRow(index: number) {
    const row = this.vehicleRows.controls[index];

    const dateResult = this.validationService.validateOwnVehicleRow(row);

    (row as FormGroup).get('rateKm')?.setValue(dateResult.ratePerKm);
    (row as FormGroup).get('openingKm')?.setValue(dateResult.openingKm);
    (row as FormGroup).get('closingKm')?.setValue(dateResult.closingKm);
    (row as FormGroup).get('totalKm')?.setValue(dateResult.totalKm);
    (row as FormGroup).get('tollNother')?.setValue(dateResult.tollNother);
    (row as FormGroup).get('totalAmount')?.setValue(dateResult.totalAmount);

    // Store the results in variables for use in HTML
    this.totalDistanceInvalid[index] = this.validationService.isTotalDistanceInvalid(row);
    this.vehicleTypeInvalid[index] = this.validationService.isVehicleTypeInvalid(row, this.userGrade.toLowerCase());
    this.openingKmInvalid[index] = this.validationService.isOpeningKmInvalid(row);

    this.calculateGrandTotal();
  }

  calculateGrandTotal() {

    if (this.selectedOption === "public") {
      this.grandTotal = this.publicRows.controls.reduce((sum, row) => {
        const totalAmount = (row as FormGroup).get('totalAmount')?.value || 0;
        return sum + totalAmount;
      }, 0);

    } else if (this.selectedOption === "vehicle") {
      this.grandTotal = this.vehicleRows.controls.reduce((sum, row) => {
        const totalAmount = (row as FormGroup).get('totalAmount')?.value || 0;
        return sum + totalAmount;
      }, 0);
    }
  }

  // validateOwnVehicleRow1(index: number) {
  //   const row: AbstractControl = this.vehicleRows.controls[index];

  //   const vehicleType = (row as FormGroup).get('vehicleType')?.value;
  //   let ratePerKm = (row as FormGroup).get('rateKm')?.value;
  //   let openingKm = (row as FormGroup).get('openingKm')?.value;
  //   let closingKm = (row as FormGroup).get('closingKm')?.value;
  //   let totalKm = (row as FormGroup).get('totalKm')?.value;
  //   let tollNother = (row as FormGroup).get('tollNother')?.value;
  //   let totalAmount = (row as FormGroup).get('totalAmount')?.value;

  //   // Automatically set ratePerKm based on vehicle type
  //   // Ensure `ratePerKm` is always defined
  //   if (vehicleType) {
  //     ratePerKm = vehicleType === 'Two Wheeler' ? 6 : 12;

  //     (row as FormGroup).get('rateKm')?.setValue(ratePerKm);
  //   } else {
  //     ratePerKm = 0;
  //     (row as FormGroup).get('rateKm')?.setValue(ratePerKm);
  //   }

  //   // Calculate totalKm 
  //   openingKm = Number(openingKm) || 0;
  //   closingKm = Number(closingKm) || 0;

  //   (row as FormGroup).get('openingKm')?.setValue(openingKm);
  //   (row as FormGroup).get('closingKm')?.setValue(closingKm);

  //   totalKm = closingKm > openingKm ? closingKm - openingKm : 0;

  //   (row as FormGroup).get('totalKm')?.setValue(totalKm);

  //   // Ensure toolFastagParking is a valid number
  //   tollNother = Number(tollNother) || 0;
  //   (row as FormGroup).get('tollNother')?.setValue(tollNother);

  //   // calculate the amount
  //   totalAmount = (totalKm * (ratePerKm)) + tollNother;

  //   (row as FormGroup).get('totalAmount')?.setValue(totalAmount);

  // }


  // isOpeningKmInvalid(row: AbstractControl): boolean {
  //   const openingKm = (row as FormGroup).get('openingKm')?.value;
  //   const closingKm = (row as FormGroup).get('closingKm')?.value;

  //   if (openingKm == null || closingKm == null) {
  //     return false; // If either value is undefined or null, do not mark as invalid
  //   }
  //   return openingKm > closingKm; // Invalid if openingKm is equal to or greater than closingKm
  // }


  // isTotalDistanceInvalid(row: AbstractControl): boolean {
  //   const totalDistance = (row as FormGroup).get('totalKm')?.value;

  //   if (!totalDistance) return false; // If empty, no error
  //   const distance = Number(totalDistance);
  //   return !isNaN(distance) && distance > 200;
  // }

}
