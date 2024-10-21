import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-split-settings',
  templateUrl: './split-settings.page.html',
  styleUrls: ['./split-settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
  ],
})

export class SplitSettingsPage implements OnInit{
  imageFile!: File;
  imageWidthCm!: number;
  imageHeightCm!: number;
  imageWidthPx!: number;
  imageHeightPx!: number;
  numColumns: number = 0;
  numRows: number = 0;

  constructor(private router: Router, private dataService: DataService) {}

  async ngOnInit() {
    const { imageFile, imageWidth, imageHeight } = this.dataService.getImageData();

    if (imageFile && imageWidth && imageHeight) {
      this.imageFile = imageFile;
      this.imageWidthCm = imageWidth; // Desired image width in cm
      this.imageHeightCm = imageHeight; // Desired image height in cm

      // Define DPI (dots per inch)
      const DPI = this.dataService.DPI;

      // Convert cm to inches
      const imageWidthInches = this.imageWidthCm / 2.54;
      const imageHeightInches = this.imageHeightCm / 2.54;

      // Convert inches to pixels
      this.imageWidthPx = Math.round(imageWidthInches * DPI);
      this.imageHeightPx = Math.round(imageHeightInches * DPI);

      // Resize the image to the desired pixel dimensions
      try {
        const resizedDataUrl = await this.resizeImage(this.imageFile, this.imageWidthPx, this.imageHeightPx);
        // Update the imageFile
        this.imageFile = this.dataURLtoFile(resizedDataUrl, this.imageFile.name);
        // Store the resized image in DataService
        this.dataService.setImageData(this.imageFile, this.imageWidthCm, this.imageHeightCm);
      } catch (error) {
        console.error('Error resizing image:', error);
      }

      // Define A4 page dimensions in cm
      const A4_WIDTH_CM = 21.0; // cm
      const A4_HEIGHT_CM = 29.7; // cm

      // Convert A4 dimensions to pixels
      const A4_WIDTH_INCHES = A4_WIDTH_CM / 2.54;
      const A4_HEIGHT_INCHES = A4_HEIGHT_CM / 2.54;

      const A4_WIDTH_PX = Math.round(A4_WIDTH_INCHES * DPI);
      const A4_HEIGHT_PX = Math.round(A4_HEIGHT_INCHES * DPI);

      // Calculate the number of columns and rows needed to split the image into A4 pages
      this.numColumns = Math.ceil(this.imageWidthPx / A4_WIDTH_PX);
      this.numRows = Math.ceil(this.imageHeightPx / A4_HEIGHT_PX);
    } else {
      this.router.navigate(['/upload']);
    }
  }

  resizeImage(file: File, width: number, height: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Optional: Fill the canvas with white background if needed
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw the image stretched to the desired size
            ctx.drawImage(img, 0, 0, width, height);
            const resizedDataUrl = canvas.toDataURL('image/png');
            resolve(resizedDataUrl);
          } else {
            reject('Could not get canvas context');
          }
        };
        img.onerror = () => {
          reject('Image load error');
        };
        img.src = event.target.result;
      };
      reader.onerror = () => {
        reject('File read error');
      };
      reader.readAsDataURL(file);
    });
  }

  dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }


  goToPreview() {
    if (this.numColumns > 0 && this.numRows > 0) {
      this.dataService.setSplitSettings(this.numColumns, this.numRows);
      this.router.navigate(['/preview']);
    } else {
      alert('Please enter valid numbers for columns and rows.');
    }
  }
}
