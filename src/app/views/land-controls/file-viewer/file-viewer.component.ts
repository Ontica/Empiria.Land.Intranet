import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileData, EmptyFileData } from '@app/shared/form-controls/file-control/file-control';

@Component({
  selector: 'emp-land-file-viewer',
  templateUrl: './file-viewer.component.html',
  styles: ['.object { width: 100%; height: calc(100% - 4px); padding: 0 16px; }'],
})
export class FileViewerComponent implements OnInit {

  @Input() selectedFile: FileData = EmptyFileData;

  @Output() closeEvent = new EventEmitter<void>();

  isLoading = false;

  constructor() { }

  ngOnInit(): void {
    this.isLoading = true;
  }

  onClose() {
    this.closeEvent.emit();
  }

  onLoad(x){
    this.isLoading = false;
  }

}
