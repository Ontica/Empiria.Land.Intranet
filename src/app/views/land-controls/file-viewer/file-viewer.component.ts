/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component,
         EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { EmptyFileViewerData, FileData,
         FileViewerData } from '@app/shared/form-controls/file-control/file-control-data';

@Component({
  selector: 'emp-land-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileViewerComponent implements OnChanges {

  @Input() fileViewerData: FileViewerData = EmptyFileViewerData;

  @Output() closeEvent = new EventEmitter<void>();

  selectedFile: FileData = null;

  selectedFileIndex;

  showFileContainer = false;

  isLoading = false;

  multiple = false;

  showZoom = false;

  imageZoom = 100;

  constructor(private cdr: ChangeDetectorRef) { }


  ngOnChanges() {
    if (this.fileViewerData.fileList.length > 0) {
      this.setInitialValues();
      setTimeout(() => {
        this.multiple = this.fileViewerData.fileList.length > 1;
        this.showFileContainer = true;
        this.validateInitialIndex();
      });
    }
  }


  get showNavigatorTool() {
    return this.multiple || this.showZoom;
  }


  setInitialValues(){
    this.showFileContainer = false;
    this.isLoading = false;
    this.multiple = false;
    this.selectedFileIndex = 0;
    this.selectedFile = null;
  }


  onClose() {
    this.closeEvent.emit();
  }


  onSelectedIndexChanged(index) {
    if (index !== this.selectedFileIndex) {
      this.isLoading = true;
      this.setSelectedFile(index);
      this.resetImageZoom();
      this.cdr.detectChanges();
    }
  }


  onLoad(){
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }


  onZoomChanged(zoom){
    this.imageZoom = zoom;
  }


  private validateInitialIndex(){
    const index = this.fileViewerData.selectedFile ?
      this.fileViewerData.fileList.indexOf(this.fileViewerData.selectedFile) : 0;
    this.onSelectedIndexChanged(index + 1);
  }


  private setSelectedFile(index){
    this.selectedFileIndex = index;
    this.selectedFile = this.fileViewerData.fileList[this.selectedFileIndex - 1];
  }


  private resetImageZoom(){
    this.imageZoom = 100;
    this.showZoom = this.selectedFile.type.includes('image');
  }

}
