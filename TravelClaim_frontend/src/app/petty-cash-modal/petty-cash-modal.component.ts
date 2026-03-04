import { DOCUMENT, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { PDFDocumentProxy, PdfViewerModule } from 'ng2-pdf-viewer';
import * as pdfjsLib from 'pdfjs-dist';


pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdfjs/pdf.worker.min.mjs';

@Component({
  selector: 'app-petty-cash-modal',
  standalone: true,
  imports: [NgIf, NgFor, NgStyle, PdfViewerModule, NgClass],
  templateUrl: './petty-cash-modal.component.html',
  styleUrl: './petty-cash-modal.component.scss'
})
export class PettyCashModalComponent {

  activeTab: string = 'recent';


  constructor(
    @Inject(DOCUMENT)
    private document: Document,
    private renderer: Renderer2
  ) { }

  onSubmit() {
    throw new Error('Method not implemented.');
  }


  @Input() showModal: boolean = false;
  @Input() modalTitle: string = 'Modal Title';
  @Output() modalClosed = new EventEmitter<void>();




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


  closeModal(): void {
    this.showModal = false;
    this.modalClosed.emit();
  }

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
      console.log(this.selectedFileUrl);

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



  listenScroll(): void {
    const scrollableEl = this.document.querySelector<HTMLDivElement>('.ng2-pdf-viewer-container');

    if (!scrollableEl) { return; }

    this.renderer.listen(scrollableEl, 'scroll', (event: Event) => {
      const isScrollEnd = scrollableEl.scrollHeight - scrollableEl.scrollTop <= scrollableEl.clientHeight;
      if (isScrollEnd) { console.log('scroll end') }
    });
  }


}
