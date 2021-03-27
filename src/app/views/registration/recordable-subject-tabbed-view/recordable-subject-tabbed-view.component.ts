/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { RecordingAct } from '@app/models';


@Component({
  selector: 'emp-land-recordable-subject-tabbed-view',
  templateUrl: './recordable-subject-tabbed-view.component.html',
})
export class RecordableSubjectTabbedViewComponent implements OnInit, OnChanges {

  @Input() recordingAct: RecordingAct;

  @Output() closeEvent = new EventEmitter<void>();

  cardTitle = 'Visor y editor';

  cardHint: string;

  tabEditorLabel = 'Datos del predio';

  constructor() {
  }


  ngOnInit(): void {
  }


  ngOnChanges() {
    this.initTexts();
  }


  onClose() {
    this.closeEvent.emit();
  }


  get isRealEstate() {
    return this.recordingAct.recordableSubject.type === 'RealEstate';
  }


  get isAssociation() {
    return this.recordingAct.recordableSubject.type === 'Association';
  }


  get isNoProperty() {
    return this.recordingAct.recordableSubject.type === 'NoProperty';
  }


  private initTexts(){
    this.cardTitle = 'Visor y editor de predios';
    this.setTitleText();
    this.setCardHint();
    this.setTextTabs();
  }


  private setTitleText(){
    this.cardTitle = 'Visor y editor de predios';

    if (this.isAssociation) {
      this.cardTitle = 'Visor y editor de asociaciones';
      return;
    }

    if (this.isNoProperty) {
      this.cardTitle = 'Visor y editor de documentos';
      return;
    }
  }


  private setCardHint() {
    this.cardHint = `<strong>${this.recordingAct.recordableSubject.electronicID}</strong>`;
      // &nbsp; &nbsp; | &nbsp; &nbsp; <strong> ${this.recordingAct.name} </strong> &nbsp; &nbsp;` +
      //     ` | ${this.recordingAct.type.name}`;
  }


  private setTextTabs(){
    if (this.isRealEstate) {
      this.tabEditorLabel = 'Datos del predio';
      return;
    }

    if (this.isAssociation) {
      this.tabEditorLabel = 'Información de la asociación';
      return;
    }

    this.tabEditorLabel = 'Información';
  }

}
