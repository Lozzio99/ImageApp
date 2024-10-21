import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
  ],
})
export class ResultPage implements OnInit {
  splitImages!: string[];
  numColumns!: number;
  numRows!: number;

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.splitImages = this.dataService.getSplitImages();
    const { numColumns, numRows } = this.dataService.getSplitSettings();

    if (this.splitImages && this.splitImages.length > 0 && numColumns > 0 && numRows > 0) {
      this.numColumns = numColumns;
      this.numRows = numRows;
      this.generatePDF();
    } else {
      this.router.navigate(['/upload']);
    }
  }

  generatePDF() {
    console.log(`Generating PDF with ${this.splitImages.length} images`);

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    this.splitImages.forEach((imgData, index) => {
      if (index > 0) {
        doc.addPage();
      }
      doc.addImage(
        imgData,
        'PNG',
        0,
        0,
        pageWidth,
        pageHeight
      );
      console.log(`Added image ${index + 1} to PDF`);
    });

    // Save the PDF
    doc.save('split-images.pdf');
  }

}
