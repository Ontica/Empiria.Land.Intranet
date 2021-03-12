/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { RecordingAct } from '@app/models';


@Component({
  selector: 'emp-land-recordable-subject-tabbed-view',
  templateUrl: './recordable-subject-tabbed-view.component.html',
})
export class RecordableSubjectTabbedViewComponent implements OnInit {

  @Input() recordingAct: RecordingAct;

  @Output() closeEvent = new EventEmitter<void>();

  cardTitle = 'Visor y editor';

  cardHint: string;

  tabEditorLabel: string = 'Datos del predio';

  constructor() {
  }


  ngOnInit(): void {
    this.initTexts();
  }


  onClose() {
    this.closeEvent.emit();
  }


  get isRealEstate() {
    return true;
  }


  get isAssociation() {
    return false;
  }


  get isNoProperty() {
    return false;
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
    this.cardHint = `<strong>${this.recordingAct.property.electronicID}</strong>`;
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
