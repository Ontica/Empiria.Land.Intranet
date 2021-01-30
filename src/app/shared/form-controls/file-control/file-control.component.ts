/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';

export enum FileTypeAccepted {
    all = '*',
    pdf = 'application/pdf',
    excel = '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    image = 'image/*',
}

export type FileType = 'all' | 'pdf' | 'excel' | 'image';

export interface FileControlConfig {
  autoUpload?: boolean;
  fileName?: string;
  fileTypes?: FileType;
  maxFiles?: number;
  placeholder?: string;
  showFileInfo?: boolean;
  textAccion?: string;
  textSave?: string;
}

const DefaultFileControlConfig: FileControlConfig = {
  autoUpload: false,
  fileName: null,
  fileTypes: 'all',
  maxFiles: 1,
  placeholder: 'Elija un archivo o arrástrelo y suéltelo aquí.',
  showFileInfo: true,
  textAccion: 'Agregar Archivo',
  textSave: 'Guardar Archivo',
};

export type FileControlActions = 'SAVE' | 'DELETE' | 'SHOW' | 'DOWNLOAD';

export class FileControlMenuOptions {
 name: string;
 action: FileControlActions;
 disabled?: boolean;
}

const defaultMenuOptions: FileControlMenuOptions[] = [
  {name: 'Eliminar', action: 'DELETE'},
  {name: 'Ver', action: 'SHOW'},
  {name: 'Descargar', action: 'DOWNLOAD'}
];

@Component({
  selector: 'emp-ng-file-control',
  templateUrl: './file-control.component.html',
  styleUrls: ['./file-control.component.scss'],
})
export class FileControlComponent implements OnChanges {

  @Input() fileControl: File[] | File | null = null;

  @Output() fileControlChange = new EventEmitter<File[] | File | null>();

  @Output() fileControlEvent = new EventEmitter<any>();

  @Input() menuOptions: FileControlMenuOptions[] = defaultMenuOptions;

  @Input() fileSaved: boolean = false;

  @Input() disabled: boolean = false;

  @Input() progress; // TODO: implement

  @Input() readonly; // TODO: implement

  @Input()
  get config() {
    return this.fileControlConfig;
  }
  set config(value: FileControlConfig) {
    this.fileControlConfig = Object.assign({}, DefaultFileControlConfig, value);
  }

  fileControlConfig = DefaultFileControlConfig;

  filesToUpload: File[];

  acceptedFileTypes: FileTypeAccepted;

  idFileControl: string = 'idFile' + Math.random().toString(16).slice(2);

  constructor() { }

  ngOnChanges(){
    this.setAcceptedFileTypes();
  }

  setAcceptedFileTypes(){
    switch (this.fileControlConfig.fileTypes) {
      case 'pdf':
        this.acceptedFileTypes = FileTypeAccepted.pdf;
        break;
      case 'excel':
        this.acceptedFileTypes = FileTypeAccepted.excel;
        break;
      case 'image':
        this.acceptedFileTypes = FileTypeAccepted.image;
        break;
      default:
        this.acceptedFileTypes = FileTypeAccepted.all;
        break;
    }
  }

  handleFileInput(fileList: FileList) {
    if (!fileList || fileList.length === 0) {
      return;
    }

    const oldFiles = this.filesToUpload ?? [];

    const files = Array.from(fileList);

    const filesFilterType = files.filter(f => this.validateFileType(f));

    this.filesToUpload = [...oldFiles, ...filesFilterType];

    this.emitFiles();
  }

  emitFiles(){
    if (this.fileControlConfig.maxFiles === 1){
      const file = this.filesToUpload.length === 1 ? this.filesToUpload[0] : null;
      this.fileControlChange.emit(file);
      return;
    }
    this.fileControlChange.emit(this.filesToUpload);
  }

  onClickFileOptions(file, option: FileControlActions){
    if (option === 'DELETE'){
      this.removeFile(file);
    }
    this.fileControlEvent.emit({option, file});
  }

  removeFile(file) {
    this.filesToUpload = this.filesToUpload.filter(f => f !== file);
    this.emitFiles();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    event.stopPropagation();
  }

  onDropFile(event: DragEvent): void {
    event.preventDefault();

    this.handleFileInput(event.dataTransfer.files);
    event.stopPropagation();
  }

  validateFileType(file: File){
    switch (this.fileControlConfig.fileTypes) {
      case 'pdf':
        if (file.type === FileTypeAccepted.pdf){
          return true;
        }
        this.printInvalidFormat(file);
        return false;

      case 'excel':
        if (FileTypeAccepted.excel.includes(file.type)){
          return true;
        }
        this.printInvalidFormat(file);
        return false;

      case 'image':
        if (file.type.startsWith('image/')){
          return true;
        }
        this.printInvalidFormat(file);
        return false;

      default:
        return true;
    }
  }

  printInvalidFormat(file: File){
    console.log(`Invalid format: ${file.name}. Is required: ${this.acceptedFileTypes}`);
  }

  getFileName(file: File){
    return this.fileControlConfig.fileName ? this.fileControlConfig.fileName + '.pdf' : file.name;
  }

  getIcon(file: File){
    const path = 'assets/img/files/';
    if (file.type === FileTypeAccepted.pdf){
      return path + 'pdf.svg';
    }

    if (FileTypeAccepted.excel.includes(file.type)){
      return path + 'xls.svg';
    }

    if (file.type.startsWith('image/')){
      return path + 'image.svg';
    }

    if (file.type.startsWith('image/')){
      return path + 'image.svg';
    }

    return path + 'file.svg';
  }

  bytesToMegaBytes(bytes) {
    if (bytes > 1000000){
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
    return (bytes / (1024)).toFixed(0) + ' KB';
  }

}
