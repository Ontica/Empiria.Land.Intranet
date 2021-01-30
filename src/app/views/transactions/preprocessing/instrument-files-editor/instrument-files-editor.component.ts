import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'emp-land-instrument-files-editor',
  templateUrl: './instrument-files-editor.component.html',
  styles: [
  ]
})
export class InstrumentFilesEditorComponent implements OnInit, OnChanges {

  @Input() instrumentDescriptor: string = null;

  instrumentFile: File = null;
  instrumentAnnexFile: File = null;

  constructor() { }

  ngOnInit(): void {}

  ngOnChanges(){}

  setInstrumentFile(file){
    this.instrumentFile = file;
  }

  setInstrumentAnnexFile(file){
    this.instrumentAnnexFile = file;
  }

  submitInstrumentFileEvent(event){
    console.log('Instrument File: ', this.instrumentFile);
    console.log('EVENTO INSTRUMENTO EMITIDO: ', event);
  }

  submitInstrumentAnnexFileEvent(event){
    console.log('Annex File: ', this.instrumentAnnexFile);
    console.log('EVENTO ANEXO EMITIDO: ', event);
  }

  firstLetterToLowerCase = (s) => {
    if (typeof s !== 'string'){
      return '';
    }
    return s.charAt(0).toLowerCase() + s.slice(1);
  }

}
