/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { sendEvent } from '@app/shared/utils';

import { EmptyRecordableSubject, EmptyRecordableSubjectFilter, RecordableSubject, RecordableSubjectData,
         RecordableSubjectFilter, RecordableSubjectShortModel } from '@app/models';

import { RecordableSubjectsFilterEventType } from './recordable-subjects-filter.component';

import { RecordableSubjectsAction,
         RecordableSubjectsStateSelector } from '@app/presentation/exported.presentation.types';

import { RecordableSubjectsTableEventType } from './recordable-subjects-table.component';


export enum RecordableSubjectsViewerEventType {
  SELECT_RECORDABLE_SUBJECT   = 'RecordableSubjectsViewerComponent.Event.SelectRecordableSubject',
  UNSELECT_RECORDABLE_SUBJECT = 'RecordableSubjectsViewerComponent.Event.UnselectRecordableSubject',
}

@Component({
  selector: 'emp-land-recordable-subjects-viewer',
  templateUrl: './recordable-subjects-viewer.component.html',
})
export class RecordableSubjectsViewerComponent implements OnInit, OnDestroy {

  @Input() selectedRecordableSubject: RecordableSubject = EmptyRecordableSubject;

  @Output() recordableSubjectsViewerEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccionar los filtros';

  isLoading = false;

  submitted = false;

  queryExecuted = false;

  filter: RecordableSubjectFilter = EmptyRecordableSubjectFilter;

  recordableSubjectsList: RecordableSubjectShortModel[] = [];

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.helper.select<RecordableSubjectData>(RecordableSubjectsStateSelector.RECORDABLE_SUBJECTS_EXPLORER_DATA)
      .subscribe(x => this.setInitData(x));
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onRecordableSubjectsFilterEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as RecordableSubjectsFilterEventType) {
      case RecordableSubjectsFilterEventType.FILTER_CHANGED:
        Assertion.assertValue(event.payload.recordableSubjectFilter, 'event.payload.recordableSubjectFilter');
        this.filter = event.payload.recordableSubjectFilter as RecordableSubjectFilter;
        this.resetData();

        if (!!this.filter.keywords) {
          this.getRecordableSubjects();
        }

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRecordableSubjectsTableEvent(event: EventInfo) {
    switch (event.type as RecordableSubjectsTableEventType) {

      case RecordableSubjectsTableEventType.SELECT_RECORDABLE_SUBJECT:
        Assertion.assertValue(event.payload.recordableSubject, 'event.payload.recordableSubject');
        this.emitSelectRecordableSubject(event.payload.recordableSubject as RecordableSubjectShortModel);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getRecordableSubjects() {
    this.setSubmitted(true);

    this.helper.select<RecordableSubjectShortModel[]>(
      RecordableSubjectsStateSelector.RECORDABLE_SUBJECTS_LIST, this.filter)
      .toPromise()
      .then(x => {
        this.queryExecuted = true;
        this.setRecordableSubjectsList(x);
      })
      .finally(() => this.setSubmitted(false));
  }


  private setRecordableSubjectsList(recordableSubjectsList: RecordableSubjectShortModel[]) {
    this.recordableSubjectsList = recordableSubjectsList;
    this.saveDataInState();
    this.setText();
  }


  private resetData() {
    this.queryExecuted = false;
    this.setRecordableSubjectsList([]);
    sendEvent(this.recordableSubjectsViewerEvent,
      RecordableSubjectsViewerEventType.UNSELECT_RECORDABLE_SUBJECT);
  }


  private setInitData(recordableSubjectData: RecordableSubjectData) {
    this.recordableSubjectsList = recordableSubjectData.recordableSubjects;
    this.filter = recordableSubjectData.recordableSubjectFilter;
    this.queryExecuted = recordableSubjectData.queryExecuted;
    this.setText();
  }


  private saveDataInState() {
    const recordableSubjectData: RecordableSubjectData = {
      recordableSubjectFilter: this.filter,
      queryExecuted: this.queryExecuted,
      recordableSubjects: this.recordableSubjectsList,
    };

    this.uiLayer.dispatch(RecordableSubjectsAction.SET_RECORDABLE_SUBJECTS_EXPLORER_DATA,
      {recordableSubjectData});
  }


  private setText() {
    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    this.cardHint = `${this.recordableSubjectsList.length} registros encontrados`;
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }


  private emitSelectRecordableSubject(recordableSubject: RecordableSubjectShortModel) {
    sendEvent(this.recordableSubjectsViewerEvent,
      RecordableSubjectsViewerEventType.SELECT_RECORDABLE_SUBJECT, {recordableSubject});
  }

}
