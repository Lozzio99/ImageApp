import { Component } from '@angular/core';
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
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
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
export class UploadPage {
  imageFile: File | null = null;
  imageWidth: number = 0;
  imageHeight: number = 0;

  constructor(private router: Router, private dataService: DataService) {}

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }

  goToSplitSettings() {
    if (this.imageFile && this.imageWidth > 0 && this.imageHeight > 0) {
      this.dataService.setImageData(this.imageFile, this.imageWidth, this.imageHeight);
      this.router.navigate(['/split-settings']);
    } else {
      alert('Please select an image and enter valid dimensions.');
    }
  }
}
