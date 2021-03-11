/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { RecordingAct } from '@app/models';


@Component({
  selector: 'emp-land-recordable-subject-tabbed-view',
  templateUrl: './recordable-subject-tabbed-view.component.html',
})
export class RecordableSubjectTabbedViewComponent implements OnInit, OnDestroy {

  @Input() recordingAct: RecordingAct;

  @Output() closeEvent = new EventEmitter<void>();

  cardTitle = 'Visor y editor de predios';

  cardHint: string;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.initTextCard();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onClose() {
    this.closeEvent.emit();
  }


  private initTextCard(){
    this.cardTitle = 'Visor y editor de predios';
    this.setCardHint();
  }


  private setCardHint() {
    this.cardHint = `<strong>${this.recordingAct.property.electronicID}</strong>`;
      // &nbsp; &nbsp; | &nbsp; &nbsp; <strong> ${this.recordingAct.name} </strong> &nbsp; &nbsp;` +
      //     ` | ${this.recordingAct.type.name}`;
  }

}
