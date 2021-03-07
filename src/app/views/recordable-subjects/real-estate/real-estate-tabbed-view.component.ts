/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RecordableSubjectFields } from '@app/models/recordable-subjects';


@Component({
  selector: 'emp-land-real-estate-tabbed-view',
  templateUrl: './real-estate-tabbed-view.component.html',
})
export class RealEstateTabbedViewComponent implements OnInit, OnDestroy {

  @Input() recording: RecordableSubjectFields;

  @Output() closeEvent = new EventEmitter<void>();

  cardTitle: string = 'Visor y editor de predios';

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
    this.cardHint = `<strong>${this.recording.electronicID}</strong>
      &nbsp; &nbsp; | &nbsp; &nbsp; <strong> ${this.recording.type} </strong> &nbsp; &nbsp;` +
          ` | ${this.recording.kind}` +
          ` | ${this.recording.notes}`;
  }

}
