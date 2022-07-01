/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { EmptyTractIndex, TractIndex } from '@app/models';

import { RecordableSubjectsStateSelector } from '@app/presentation/exported.presentation.types';

import {
  RecordableSubjectsViewerEventType
} from './recordable-subjects-viewer.component';


@Component({
  selector: 'emp-land-recordable-subjects-explorer',
  templateUrl: './recordable-subjects-explorer.component.html',
})
export class RecordableSubjectsExplorerComponent implements OnDestroy {

  isLoading = false;

  displayTractIndex = false;

  selectedTractIndex: TractIndex = EmptyTractIndex;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onRecordableSubjectsViewerEvent(event: EventInfo) {
    switch (event.type as RecordableSubjectsViewerEventType) {
      case RecordableSubjectsViewerEventType.SELECT_RECORDABLE_SUBJECT:
        Assertion.assertValue(event.payload.recordableSubject.uid, 'event.payload.recordableSubject.uid');
        this.getTrackIndex(event.payload.recordableSubject.uid);
        return;

      case RecordableSubjectsViewerEventType.UNSELECT_RECORDABLE_SUBJECT:
        this.onCloseTractIndexExplorer();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCloseTractIndexExplorer() {
    this.setSelectedTractIndex(EmptyTractIndex);
  }


  private getTrackIndex(recordableSubjectUID: string) {
    this.isLoading = true;

    this.helper.select<TractIndex>(RecordableSubjectsStateSelector.TRACT_INDEX, {recordableSubjectUID})
      .toPromise()
      .then(x => this.setSelectedTractIndex(x))
      .finally(() => this.isLoading = false);
  }


  private setSelectedTractIndex(tractIndex: TractIndex) {
    this.selectedTractIndex = tractIndex;
    this.displayTractIndex = !isEmpty(tractIndex.recordableSubject);
  }

}
