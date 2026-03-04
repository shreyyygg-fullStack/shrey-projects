import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdfjs/pdf.worker.min.mjs';

@Component({
  selector: 'app-my-view-analytics',
  standalone: true,
  imports: [NgIf, PdfViewerModule, NgFor],
  templateUrl: './my-view-analytics.component.html',
  styleUrl: './my-view-analytics.component.scss'
})
export class MyViewAnalyticsComponent {

  analytics: boolean = true;
  expenseDetails: boolean = false;
  expenseCategory: boolean = false;
  expenseAttendee: boolean = false;
  expenseCustomer: boolean = false;
  expenseProject: boolean = false;
  expenseMerchant: boolean = false;
  expenseCurrency: boolean = false;
  expenseReportsDetails: boolean = false;
  policyViolations: boolean = false;
  tripDetails: boolean = false;
  tripStageSummary: boolean = false;
  tripSummaryReportStatus: boolean = false;

  selectedFile: any = null;
  zoomLevel: number = 1; // For images (scaling factor)
  pdfZoomLevel: number = 1; // For PDFs (percentage zoom)

  selectedFileUrl: string | null = null;
  pdfBlobUrls: string[] = [];
  pdfFileNames: string[] = ['myfile.pdf', 'myfile2.pdf', 'myfile3.pdf'];
  pdfByteArrays: Uint8Array[] = [];
  currentFileIndex: number = 0;

  pageWindowSize = 5; // Show 5 page buttons at a time
  pageStartIndex = 0; // Start of visible page range

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // this.loadStaticPdf();
  }

  fileThumbnail: string[] = [];
  pdffiles: Blob[] = [];

  loadStaticPdf(): void {
    this.pdfFileNames.forEach((fileName, index) => {
      const filePath = `assets/brand/${fileName}`;

      this.http.get(filePath, { responseType: 'arraybuffer' }).subscribe((data: ArrayBuffer) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const objectUrl = URL.createObjectURL(blob);

        this.pdfBlobUrls[index] = objectUrl;

        console.log(this.pdfBlobUrls)

        this.pdffiles[index] = blob;

        this.generatePdfThumbnail(this.pdffiles[index])
          .then((pdfThumbnail) => {
            this.fileThumbnail[index] = pdfThumbnail!;
          })
          .catch((error) => {
            console.error('Error generating PDF thumbnail:', error);
          });

        // Set the first PDF by default
        if (index === 0) {
          this.setCurrentPdf(0);
        }
      });
    });
  }

  setCurrentPdf(index: number): void {
    if (index >= 0 && index < this.pdfBlobUrls.length) {
      this.selectedFileUrl = this.pdfBlobUrls[index];
      this.currentFileIndex = index;
    }

    const windowEnd = this.pageStartIndex + this.pageWindowSize;
    if (index < this.pageStartIndex) {
      this.pageStartIndex = index;
    } else if (index >= windowEnd) {
      this.pageStartIndex = index - this.pageWindowSize + 1;
    }

  }

  goToPrevious(): void {
    this.setCurrentPdf(this.currentFileIndex - 1);
  }

  goToNext(): void {
    this.setCurrentPdf(this.currentFileIndex + 1);
  }

  get visiblePageIndexes(): number[] {
    const end = Math.min(this.pageStartIndex + this.pageWindowSize, this.pdfBlobUrls.length);
    return Array.from({ length: end - this.pageStartIndex }, (_, i) => i + this.pageStartIndex);
  }

  goToPreviousPageGroup() {
    if (this.pageStartIndex - this.pageWindowSize >= 0) {
      this.pageStartIndex -= this.pageWindowSize;
    }
  }

  goToNextPageGroup() {
    if (this.pageStartIndex + this.pageWindowSize < this.pdfBlobUrls.length) {
      this.pageStartIndex += this.pageWindowSize;
    }
  }


  showFiles() {
    this.selectedFile = "sffd";
    this.loadStaticPdf();
  }
  expenseDetailsTab() {
    this.analytics = false;
    this.expenseDetails = true;
  }

  backToAnalytics() {
    this.analytics = true;
    this.expenseDetails = false;

  }


  closePreviewModal() {
    this.selectedFile = false;
    this.resetZoom();
  }

  resetZoom() {
    this.zoomLevel = 1;
    this.pdfZoomLevel = 1;
  }


  zoomIn() {
    this.pdfZoomLevel += 0.1;

    // if (this.selectedFile.type.startsWith('image/')) {
    //   this.zoomLevel += 0.1;
    // } else if (this.selectedFile.type === 'application/pdf') {
    //   this.pdfZoomLevel += 0.1;

    // }
  }

  zoomOut() {
    this.pdfZoomLevel -= 0.1;

    // if (this.selectedFile.type.startsWith('image/') && this.zoomLevel > 0.2) {
    //   this.zoomLevel -= 0.1;
    // } else if (this.selectedFile.type === 'application/pdf' && this.pdfZoomLevel > 0.2) {
    //   this.pdfZoomLevel -= 0.1;
    // }
  }

  private async generatePdfThumbnail(file: Blob): Promise<string | null> {
    try {
      const pdfData = await file.arrayBuffer();
      const pdfDoc: PDFDocumentProxy = await pdfjsLib.getDocument({ data: pdfData }).promise;
      const page = await pdfDoc.getPage(1);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext('2d');

      if (!context) {
        console.error('Canvas context not available');
        return null;
      }

      await page.render({ canvasContext: context, viewport }).promise;
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating PDF thumbnail:', error);
      return null;
    }
  }

}
