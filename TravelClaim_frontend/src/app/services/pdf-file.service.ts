import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GlobalConstants } from '../shared/common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class PdfFileService {

  constructor(private httpcli: HttpClient) { }

  generatePDF(expenses: any[] = [{ date: '', description: '', amount: '' }]) {
    const doc = new jsPDF('portrait', 'mm', 'a4');

    doc.setFontSize(16);
    doc.text('ISHIDA INIDA PVT. LTD.', 10, 10);
    doc.setFontSize(12);
    doc.text('Haryana, India', 10, 15);
    doc.text('nitesh0306@gmail.com', 10, 20);

    doc.setFontSize(16);
    doc.text('Expense Report', 200, 10, { align: 'right' });
    doc.setFontSize(12);
    doc.text('ER-00003', 200, 20, { align: 'right' });
    doc.setFontSize(14);
    doc.text('Amount to be Reimbursed', 200, 30, { align: 'right' });
    doc.setFontSize(18);
    doc.text('Rs.123,567.00', 200, 40, { align: 'right' });

    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(10, 45, 200, 45);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Trip To Local', 10, 50);

    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(10, 55, 200, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Submitted by', 10, 60);
    doc.text('Nitesh Singh', 10, 65);
    doc.text('nitesh0306@gmail.com', 10, 70);

    doc.setFontSize(10);
    doc.text('Report To', 160, 60, { align: 'right' });
    doc.text('Nitesh Singh', 160, 65, { align: 'right' });
    doc.text('nitesh0306@gmail.com', 160, 70, { align: 'right' });

    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(165, 55, 165, 85);

    doc.setFontSize(10);
    doc.text('Submitted On', 200, 60, { align: 'right' });
    doc.text('19 December 2024', 200, 65, { align: 'right' });

    doc.text('Report Duration', 200, 75, { align: 'right' });
    doc.text('26 November 2024', 200, 80, { align: 'right' });


    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(10, 85, 200, 85);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Expense Summary', 10, 90);

    doc.setFont('helvetica', 'normal');

    autoTable(doc, {
      head: [['S.No', 'Expense Details', 'Category', 'Amount (INR)']],
      body: expenses.map((expense, index) => [
        (index + 1).toString(),
        `${expense.date}\n${expense.description}`,
        'Automobile Expense',
        `Rs.${expense.amount}`
      ]),
      startY: 95,
      // margin: { top: 50 },  
      headStyles: { fillColor: [0, 123, 255] },
      styles: { halign: 'center', valign: 'middle', overflow: 'linebreak', fontSize: 10 },  // Cell styles
      theme: 'grid',  // Adds grid lines around each cell
      columnStyles: {
        0: { halign: 'center' },  // Center align for S.No
        1: { cellWidth: 50 },
        3: { halign: 'right' }    // Right align for Amount
      },
    });

    // Get the final Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY || 95;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const xMargin = 25; // left and right margin
    const yMargin = 20; // top and botton margin including the header/footer. In px since that's what hte jsPDF is set to use
    const lineHeight = doc.getLineHeight(); // default space between lines

    let yPos = finalY; // Start from your calculated `finalY`

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    yPos = this.addTextWithPagination(doc, 'Report Summary By Currency', 10, yPos + 10, xMargin, yMargin, lineHeight, pageWidth, pageHeight);

    if (yPos + 5 > pageHeight - yMargin) {
      doc.addPage();
      yPos = yMargin;
    }
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(10, yPos - 7, 200, yPos - 7);
    yPos += 0;

    yPos = this.addTextWithPagination(doc, 'Total', 10, yPos, xMargin, yMargin, lineHeight, pageWidth, pageHeight);
    // yPos = this.addTextWithPagination(doc, 'INR', 190, yPos -12, xMargin, yMargin, lineHeight, pageWidth, pageHeight);
    doc.text('INR', 200, yPos - 12, { align: 'right' });

    if (yPos + 5 > pageHeight - yMargin) {
      doc.addPage();
      yPos = yMargin;
    }
    doc.line(10, yPos - 7, 200, yPos - 7);
    yPos += 0;

    doc.setFont('helvetica', 'normal');
    yPos = this.addTextWithPagination(doc, 'Total Expense Amount', 10, yPos, xMargin, yMargin, lineHeight, pageWidth, pageHeight);
    doc.text('123,567.00', 200, yPos - 12, { align: 'right' });

    yPos = this.addTextWithPagination(doc, 'Non-Reimbursable Amount', 10, yPos, xMargin, yMargin, lineHeight, pageWidth, pageHeight);
    doc.text('(-) 0.00', 200, yPos - 12, { align: 'right' });

    yPos = this.addTextWithPagination(doc, 'Advance Amount Received', 10, yPos, xMargin, yMargin, lineHeight, pageWidth, pageHeight);
    doc.text('(-) 0.00', 200, yPos - 12, { align: 'right' });

    if (yPos > pageHeight - yMargin) {
      doc.addPage();
      yPos = yMargin;
    }
    doc.setFillColor(220, 220, 220);
    doc.rect(8, yPos - 5, 193, 8, 'F');
    yPos += 0;

    doc.setFont('helvetica', 'bold');
    yPos = this.addTextWithPagination(doc, 'Total Reimbursable Amount', 10, yPos, xMargin, yMargin, lineHeight, pageWidth, pageHeight);
    doc.text('Rs. 123,567.00', 200, yPos - 12, { align: 'right' });

    yPos = this.addTextWithPagination(doc, 'Report Summary', 10, yPos + 5, xMargin, yMargin, lineHeight, pageWidth, pageHeight);

    if (yPos + 5 > pageHeight - yMargin) {
      doc.addPage();
      yPos = yMargin;
    }
    doc.line(10, yPos - 7, 200, yPos - 7);
    yPos += 0;

    const headers = [['Total Expense (-)', 'Non Reimbursable (-)', 'Advance Received (=)', 'Total Reimbursable']];
    const data = [['Rs. 123,567.00', 'Rs. 0.00', 'Rs. 0.00', 'Rs. 123,567.00']];
    autoTable(doc, {
      head: headers,
      body: data,
      startY: yPos - 5,
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      columnStyles: {
        0: { fillColor: [255, 255, 255] },
        1: { fillColor: [255, 255, 255] },
        2: { fillColor: [255, 255, 255] },
        3: { fillColor: [255, 255, 255] },
      },
    });

    yPos = (doc as any).autoTable.previous.finalY + 10;

    if (yPos + 5 > pageHeight - yMargin) {
      doc.addPage();
      yPos = yMargin;
    }
    doc.line(10, yPos - 7, 200, yPos - 7);
    yPos += 10;


    doc.setFont('helvetica', 'bold');
    yPos = this.addTextWithPagination(doc, 'Submitted By', 10, yPos, xMargin, yMargin, lineHeight, pageWidth, pageHeight);
    yPos = this.addTextWithPagination(doc, 'Approved By', 80, yPos - 12, xMargin, yMargin, lineHeight, pageWidth, pageHeight);

    if (yPos + 25 > pageHeight - yMargin) {
      doc.addPage();
      yPos = yMargin;
    }
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(10, yPos + 5, 50, yPos + 5);
    doc.line(80, yPos + 5, 120, yPos + 5);
    yPos += 10;

    doc.setFont('helvetica', 'normal');
    yPos = this.addTextWithPagination(doc, 'Nitesh Singh', 10, yPos, xMargin, yMargin, lineHeight, pageWidth, pageHeight);
    yPos = this.addTextWithPagination(doc, 'Nitesh Singh', 80, yPos - 12, xMargin, yMargin, lineHeight, pageWidth, pageHeight);

    this.addPDFHeaderAndFooter(doc, pageWidth, pageHeight, (yMargin / 2), "message");

    const pdfBlob = doc.output('blob');
    const fileName = "expense_summary.pdf";

    const url = URL.createObjectURL(pdfBlob);

    var serverUrl = GlobalConstants.apiUploadFile;

    const formData: FormData = new FormData();
    formData.append('file', pdfBlob, fileName);
    formData.append('fileName', fileName);


    return this.httpcli.post<any>(serverUrl, formData, { withCredentials: true, responseType:  'text' as 'json' },)
      .subscribe(
        (data) => {
          if(data === "success"){
            alert("Uploaded");
            window.open(url);
            return;
          }
          else {
            alert("Response -- " + data);
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );

    // doc.save('Expense Report.pdf');
  }

  generateConveyancePDF(expenses: any[] = [{ date: '', description: '', amount: '' }]) {
    const doc = new jsPDF('portrait', 'mm', 'a4');


    doc.setFontSize(16);
    doc.text('ISHIDA INIDA PVT. LTD.', 10, 10);
    doc.setFontSize(12);
    doc.text('Haryana, India', 10, 15);
    doc.text('nitesh0306@gmail.com', 10, 20);

    doc.setFontSize(16);
    doc.text('Expense Report', 200, 10, { align: 'right' });
    doc.setFontSize(12);
    doc.text('ER-00003', 200, 20, { align: 'right' });
    doc.setFontSize(14);
    doc.text('Amount to be Reimbursed', 200, 30, { align: 'right' });
    doc.setFontSize(18);
    doc.text('Rs.123,567.00', 200, 40, { align: 'right' });

    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(10, 45, 200, 45);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Trip To Local', 10, 50);

    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(10, 55, 200, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Submitted by', 10, 60);
    doc.text('Nitesh Singh', 10, 65);
    doc.text('nitesh0306@gmail.com', 10, 70);

    doc.setFontSize(10);
    doc.text('Report To', 160, 60, { align: 'right' });
    doc.text('Nitesh Singh', 160, 65, { align: 'right' });
    doc.text('nitesh0306@gmail.com', 160, 70, { align: 'right' });

    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(165, 55, 165, 85);

    doc.setFontSize(10);
    doc.text('Submitted On', 200, 60, { align: 'right' });
    doc.text('19 December 2024', 200, 65, { align: 'right' });

    doc.text('Report Duration', 200, 75, { align: 'right' });
    doc.text('26 November 2024', 200, 80, { align: 'right' });


    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(10, 85, 200, 85);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Expense Summary', 10, 90);

    doc.setFont('helvetica', 'normal');

    autoTable(doc, {
      head: [['S.No', 'Expense Details', 'Category', 'Amount (INR)']],
      body: expenses.map((expense, index) => [
        (index + 1).toString(),
        `${expense.date}\n${expense.description}`,
        'Lodging Expense',
        `Rs.${expense.amount}`
      ]),
      startY: 95,
      // margin: { top: 50 },  
      headStyles: { fillColor: [0, 123, 255] },
      styles: { halign: 'center', valign: 'middle', overflow: 'linebreak', fontSize: 10 },  // Cell styles
      theme: 'grid',  // Adds grid lines around each cell
      columnStyles: {
        0: { halign: 'center' },  // Center align for S.No
        1: { cellWidth: 50 },
        3: { halign: 'right' }    // Right align for Amount
      },
    });

    // Get the final Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY || 95;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const xMargin = 25; // left and right margin
    const yMargin = 20; // top and botton margin including the header/footer. In px since that's what hte jsPDF is set to use
    const lineHeight = doc.getLineHeight(); // default space between lines

    let yPos = finalY; // Start from your calculated `finalY`

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    yPos = this.addTextWithPagination(doc, 'Coveyance Summary', 10, yPos + 10, xMargin, yMargin, lineHeight, pageWidth, pageHeight);

    autoTable(doc, {
      head: [['S.No', 'Conveyance Details', 'Vehicle Type', 'Amount (INR)']],
      body: expenses.map((expense, index) => [
        (index + 1).toString(),
        `${expense.date}\n${expense.description}`,
        'Automobile Expense',
        `Rs.${expense.amount}`
      ]),
      startY: yPos - 7,
      // margin: { top: 50 },  
      headStyles: { fillColor: [0, 123, 255] },
      styles: { halign: 'center', valign: 'middle', overflow: 'linebreak', fontSize: 10 },  // Cell styles
      theme: 'grid',  // Adds grid lines around each cell
      columnStyles: {
        0: { halign: 'center' },  // Center align for S.No
        1: { cellWidth: 50 },
        3: { halign: 'right' }    // Right align for Amount
      },
    });

    yPos = (doc as any).autoTable.previous.finalY + 10;



    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    yPos = this.addTextWithPagination(doc, 'Report Summary By Currency', 10, yPos , xMargin, yMargin, lineHeight, pageWidth, pageHeight);

    if (yPos + 5 > pageHeight - yMargin) {
      doc.addPage();
      yPos = yMargin;
    }
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(10, yPos - 7, 200, yPos - 7);
    yPos += 0;

    yPos = this.addTextWithPagination(doc, 'Total', 10, yPos, xMargin, yMargin, lineHeight, pageWidth, pageHeight);
    // yPos = this.addTextWithPagination(doc, 'INR', 190, yPos -12, xMargin, yMargin, lineHeight, pageWidth, pageHeight);
    doc.text('INR', 200, yPos - 12, { align: 'right' });

    if (yPos + 5 > pageHeight - yMargin) {
      doc.addPage();
      yPos = yMargin;
    }
    doc.line(10, yPos - 7, 200, yPos - 7);
    yPos += 0;

    doc.setFont('helvetica', 'normal');
    yPos = this.addTextWithPagination(doc, 'Total Expense Amount', 10, yPos, xMargin, yMargin, lineHeight, pageWidth, pageHeight);
    doc.text('123,567.00', 200, yPos - 12, { align: 'right' });

    yPos = this.addTextWithPagination(doc, 'Non-Reimbursable Amount', 10, yPos, xMargin, yMargin, lineHeight, pageWidth, pageHeight);
    doc.text('(-) 0.00', 200, yPos - 12, { align: 'right' });

    yPos = this.addTextWithPagination(doc, 'Advance Amount Received', 10, yPos, xMargin, yMargin, lineHeight, pageWidth, pageHeight);
    doc.text('(-) 0.00', 200, yPos - 12, { align: 'right' });

    if (yPos > pageHeight - yMargin) {
      doc.addPage();
      yPos = yMargin;
    }
    doc.setFillColor(220, 220, 220);
    doc.rect(8, yPos - 5, 193, 8, 'F');
    yPos += 0;

    doc.setFont('helvetica', 'bold');
    yPos = this.addTextWithPagination(doc, 'Total Reimbursable Amount', 10, yPos, xMargin, yMargin, lineHeight, pageWidth, pageHeight);
    doc.text('Rs. 123,567.00', 200, yPos - 12, { align: 'right' });

    yPos = this.addTextWithPagination(doc, 'Report Summary', 10, yPos + 5, xMargin, yMargin, lineHeight, pageWidth, pageHeight);

    if (yPos + 5 > pageHeight - yMargin) {
      doc.addPage();
      yPos = yMargin;
    }
    doc.line(10, yPos - 7, 200, yPos - 7);
    yPos += 0;

    const headers = [['Total Expense (-)', 'Non Reimbursable (-)', 'Advance Received (=)', 'Total Reimbursable']];
    const data = [['Rs. 123,567.00', 'Rs. 0.00', 'Rs. 0.00', 'Rs. 123,567.00']];
    autoTable(doc, {
      head: headers,
      body: data,
      startY: yPos - 5,
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      columnStyles: {
        0: { fillColor: [255, 255, 255] },
        1: { fillColor: [255, 255, 255] },
        2: { fillColor: [255, 255, 255] },
        3: { fillColor: [255, 255, 255] },
      },
    });

    yPos = (doc as any).autoTable.previous.finalY + 10;

    if (yPos + 5 > pageHeight - yMargin) {
      doc.addPage();
      yPos = yMargin;
    }
    doc.line(10, yPos - 7, 200, yPos - 7);
    yPos += 10;


    doc.setFont('helvetica', 'bold');
    yPos = this.addTextWithPagination(doc, 'Submitted By', 10, yPos, xMargin, yMargin, lineHeight, pageWidth, pageHeight);
    yPos = this.addTextWithPagination(doc, 'Approved By', 80, yPos - 12, xMargin, yMargin, lineHeight, pageWidth, pageHeight);

    if (yPos + 25 > pageHeight - yMargin) {
      doc.addPage();
      yPos = yMargin;
    }
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(10, yPos + 5, 50, yPos + 5);
    doc.line(80, yPos + 5, 120, yPos + 5);
    yPos += 10;

    doc.setFont('helvetica', 'normal');
    yPos = this.addTextWithPagination(doc, 'Nitesh Singh', 10, yPos, xMargin, yMargin, lineHeight, pageWidth, pageHeight);
    yPos = this.addTextWithPagination(doc, 'Nitesh Singh', 80, yPos - 12, xMargin, yMargin, lineHeight, pageWidth, pageHeight);

    this.addPDFHeaderAndFooter(doc, pageWidth, pageHeight, (yMargin / 2), "message");

    const pdfBlob = doc.output('blob');
    const fileName = "expense_summary.pdf";

    const url = URL.createObjectURL(pdfBlob);

    var serverUrl = GlobalConstants.apiUploadFile;

    const formData: FormData = new FormData();
    formData.append('file', pdfBlob, fileName);
    formData.append('fileName', fileName);


    return this.httpcli.post<any>(serverUrl, formData, { withCredentials: true, responseType:  'text' as 'json' },)
      .subscribe(
        (data) => {
          if(data === "success"){
            alert("Uploaded");
            window.open(url);
            return;
          }
          else {
            alert("Response -- " + data);
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );

    // doc.save('Expense Report.pdf');
  }

  addTextWithPagination(doc: jsPDF, text: string, x: number, y: number, xMargin: number, yMargin: number, lineHeight: number, pageWidth: number, pageHeight: number) {
    const wrappedText = doc.splitTextToSize(text, pageWidth - (2 * xMargin));
    let yPos = y;

    wrappedText.forEach((line: string | string[]) => {
      if (yPos > pageHeight - yMargin) {
        doc.addPage();
        yPos = yMargin;
      }
      doc.text(line, x, yPos);
      yPos += lineHeight;
    });

    return yPos;
  }


  addPDFHeaderAndFooter = (doc: jsPDF, pageWidth: number, pageHeight: number, margin: number, message: any) => {
    const pageCount = doc.getCurrentPageInfo().pageNumber;
    doc.setFont('Times');
    doc.setFontSize(10);
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      // add the header to the page
      //   doc.text(message, pageWidth / 2, margin, {
      //     align: 'center'
      //   }
      // );

      // add the footer to the page
      doc.text(`${i}`, pageWidth / 2, pageHeight - margin, {
        align: 'center'
      })
    }
  }
  
}
