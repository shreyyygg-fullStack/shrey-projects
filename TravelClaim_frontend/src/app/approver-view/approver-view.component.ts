import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, effect, Injector } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SharedService } from '../services/shared.service';
import { PDFDocument } from 'pdf-lib';
import { GlobalConstants } from '../shared/common/global-constants';

@Component({
  selector: 'app-approver-view',
  standalone: true,
  imports: [PdfViewerModule, NgIf],
  templateUrl: './approver-view.component.html',
  styleUrl: './approver-view.component.scss'
})
export class ApproverViewComponent {

  showPolicy: boolean = false;

  constructor(private httpcli: HttpClient, private sharedService: SharedService,private injector: Injector) {

       effect(() => {
        console.log(`The state in approver view is: ${this.sharedService.booleanState()}`);

        this.showPolicy = this.sharedService.booleanState();

        if (this.showPolicy == true) {
          this.getFiles();
        }
      }, {injector: this.injector});

   
  }

  ngOnInit() {
    // this.sharedService.currentBooleanState.subscribe((state: boolean) => {
    //   this.showPolicy = state;

    //   if (this.showPolicy == true) {
    //     this.getFiles();
    //   }
    //   console.log(this.showPolicy )
    // });
   
  }
  filesData: any[] | undefined = [];

  fileURL: string = "";

  async getFiles() {

  
    var url =  GlobalConstants.apiGetFiles;

    let asyncResult = await this.httpcli.get<any[]>(url, { withCredentials: true }).toPromise();
    this.filesData = asyncResult;

    console.log(asyncResult);

    if (this.filesData && this.filesData.length > 0) {
      const file = this.filesData[60];

      // Check if FILE_DATA is a valid base64 string
      if (!file.FILE_DATA || typeof file.FILE_DATA !== 'string') {
        console.error('Invalid file data');
        return;
      }

      try {
        const byteCharacters = atob(file.FILE_DATA);
        const byteArrays = new Uint8Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteArrays[i] = byteCharacters.charCodeAt(i);
        }

        // Use PDF-lib to load the document
        const pdfDoc = await PDFDocument.load(byteArrays);
        pdfDoc.setTitle(file.FILE_NAME); // Set the file name in Title
        const modifiedPdfBytes = await pdfDoc.save();
        const fileBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

        // Create a temporary link to the file
        this.fileURL = URL.createObjectURL(fileBlob);
        // window.open(this.fileURL, '_blank');
      } catch (error) {
        console.error('Failed to process PDF document', error);
      }
    }
  }
  

}
