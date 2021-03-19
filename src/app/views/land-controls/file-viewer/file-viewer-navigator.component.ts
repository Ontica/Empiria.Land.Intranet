import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'emp-land-file-viewer-navigator',
  templateUrl: './file-viewer-navigator.component.html',
  styleUrls: ['./file-viewer.component.scss']
})
export class FileViewerNavigatorComponent implements OnInit {

  @Input() selectedIndex;

  @Input() showZoom;

  @Input() showFileTool;

  @Input() pagesTotal;

  @Input() zoom: number;

  @Output() selectedIndexChange = new EventEmitter<any>();

  @Output() zoomChange = new EventEmitter<number>();

  zoomMin = 50;

  zoomMax = 300;

  zoomStep = 10;

  pagesList: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.pagesList = [];

    if (this.pagesTotal > 0) {
      this.pagesList = [...Array(this.pagesTotal).keys()].map(i => Object.create({ value: i + 1 }));
    }
  }

  nextFile() {
    this.selectedIndex++;
    if (this.selectedIndex > this.pagesTotal) {
      this.selectedIndex = 1;
    }
    this.emitIndexChanged();
  }


  previousFile() {
    this.selectedIndex--;
    if (this.selectedIndex < 1) {
      this.selectedIndex = this.pagesTotal;
    }
    this.emitIndexChanged();
  }


  firstFile() {
    this.selectedIndex = 1;
    this.emitIndexChanged();
  }


  lastFile() {
    this.selectedIndex = this.pagesTotal;
    this.emitIndexChanged();
  }


  selectFileByIndex(index) {
    this.emitIndexChanged();
  }

  onZoomChange(event) {
    this.zoomChange.emit(this.zoom);
  }

  emitIndexChanged() {
    this.selectedIndexChange.emit(this.selectedIndex);
  }

}
