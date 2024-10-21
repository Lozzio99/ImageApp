import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private imageFile: File | null = null;
  private imageWidth: number = 0;
  private imageHeight: number = 0;
  private numColumns: number = 0;
  private numRows: number = 0;
  private splitImages: string[] = [];
  public DPI: number = 300;

  // Methods to set and get image data
  setImageData(file: File, width: number, height: number) {
    this.imageFile = file;
    this.imageWidth = width;
    this.imageHeight = height;
  }

  getImageData() {
    return {
      imageFile: this.imageFile,
      imageWidth: this.imageWidth,
      imageHeight: this.imageHeight,
    };
  }

  // Methods to set and get split settings
  setSplitSettings(numColumns: number, numRows: number) {
    this.numColumns = numColumns;
    this.numRows = numRows;
  }

  getSplitSettings() {
    return {
      numColumns: this.numColumns,
      numRows: this.numRows,
    };
  }

  // Methods to set and get split images
  setSplitImages(images: string[]) {
    this.splitImages = images;
  }

  getSplitImages() {
    return this.splitImages;
  }
}
