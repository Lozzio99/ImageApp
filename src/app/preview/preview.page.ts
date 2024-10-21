import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.page.html',
  styleUrls: ['./preview.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon
  ],
})
export class PreviewPage implements OnInit{
  imageFile!: File;
  imageWidthCm!: number;
  imageHeightCm!: number;
  imageWidthPx!: number;
  imageHeightPx!: number;
  numColumns!: number;
  numRows!: number;
  splitImages: string[] = [];
  splitImagesGrid: string[][] = [];


  constructor(
    private router: Router,
    private dataService: DataService,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const { imageFile, imageWidth, imageHeight } = this.dataService.getImageData();
    const { numColumns, numRows } = this.dataService.getSplitSettings();

    if (imageFile && numColumns > 0 && numRows > 0) {
      this.imageFile = imageFile;
      this.imageWidthCm = imageWidth;
      this.imageHeightCm = imageHeight;
      this.numColumns = numColumns;
      this.numRows = numRows;

      // Convert image dimensions from cm to pixels
      const DPI = 300;
      const imageWidthInches = this.imageWidthCm / 2.54;
      const imageHeightInches = this.imageHeightCm / 2.54;
      this.imageWidthPx = Math.round(imageWidthInches * DPI);
      this.imageHeightPx = Math.round(imageHeightInches * DPI);

      this.splitImage();
    } else {
      this.router.navigate(['/upload']);
    }
  }

  async splitImage() {
    console.log('Starting splitImage function');
    const imageDataUrl = await this.readFileAsDataURL(this.imageFile);
    console.log('Image data URL obtained');

    const img = new Image();
    img.onload = () => {
      console.log('Image loaded');
      const canvas = document.createElement('canvas');
      canvas.width = this.imageWidthPx;
      canvas.height = this.imageHeightPx;

      const context = canvas.getContext('2d');
      if (!context) {
        console.error('Failed to get canvas context');
        return;
      }

      // Draw the resized image onto the canvas
      context.drawImage(img, 0, 0, this.imageWidthPx, this.imageHeightPx);
      console.log('Image drawn on canvas');

      // Define A4 page dimensions in pixels at 300 DPI
      const A4_WIDTH_CM = 21.0;
      const A4_HEIGHT_CM = 29.7;
      const DPI = this.dataService.DPI
      const A4_WIDTH_PX = Math.round((A4_WIDTH_CM / 2.54) * DPI);
      const A4_HEIGHT_PX = Math.round((A4_HEIGHT_CM / 2.54) * DPI);

      console.log(`A4 dimensions in pixels: ${A4_WIDTH_PX} x ${A4_HEIGHT_PX}`);

      let index = 0;

      for (let y = 0; y < this.numRows; y++) {
        let rowImages: string[] = [];
        for (let x = 0; x < this.numColumns; x++) {
          const partCanvas = document.createElement('canvas');
          partCanvas.width = A4_WIDTH_PX;
          partCanvas.height = A4_HEIGHT_PX;
          const partContext = partCanvas.getContext('2d');
          if (!partContext) {
            console.error('Failed to get part canvas context');
            continue;
          }

          // Calculate the dimensions of the part to be copied
          const sx = x * A4_WIDTH_PX;
          const sy = y * A4_HEIGHT_PX;
          const sWidth = Math.min(A4_WIDTH_PX, this.imageWidthPx - sx);
          const sHeight = Math.min(A4_HEIGHT_PX, this.imageHeightPx - sy);

          console.log(
            `Drawing part (${x}, ${y}) from source (${sx}, ${sy}, ${sWidth}, ${sHeight})`
          );

          // Fill the part canvas with white background
          partContext.fillStyle = 'white';
          partContext.fillRect(0, 0, A4_WIDTH_PX, A4_HEIGHT_PX);

          // Draw the image part onto the part canvas
          partContext.drawImage(
            canvas,
            sx,
            sy,
            sWidth,
            sHeight,
            0,
            0,
            sWidth,
            sHeight
          );

          const partDataUrl = partCanvas.toDataURL();
          rowImages.push(partDataUrl);
          index++;

          this.splitImages.push(partDataUrl);
        }
        this.splitImagesGrid.push(rowImages);
      }

      console.log('Image splitting completed');
      this.cd.detectChanges();
      // Store split images in DataService
      this.dataService.setSplitImages(this.splitImages);
    };

    img.onerror = (error) => {
      console.error('Error loading image', error);
    };

    img.src = imageDataUrl;
  }

  getImageIndex(row: string[], i: number): number {
    const rowIndex = this.splitImagesGrid.indexOf(row);
    return rowIndex * this.numColumns + i + 1;
  }

  readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  goToResult() {
    // Navigate to the Result Page, passing the split images
    this.router.navigate(['/result'], {
      state: {
        splitImages: this.splitImages,
        numColumns: this.numColumns,
        numRows: this.numRows,
      },
    });
  }

  downloadImage(imgDataUrl: string, index: number) {
    const link = document.createElement('a');
    link.href = imgDataUrl;
    link.download = `split-image-${index}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
