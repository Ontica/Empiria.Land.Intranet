/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { EmptyRecordableSubject, EmptyRecordableSubjectFilter, EmptyTractIndex, RecordableSubject,
         RecordableSubjectData, RecordableSubjectFilter, RecordableSubjectShortModel,
         TractIndex } from '@app/models';

import { RecordableSubjectsFilterEventType } from './recordable-subjects-filter.component';

import { RecordableSubjectsAction,
         RecordableSubjectsStateSelector } from '@app/presentation/exported.presentation.types';

import { RecordableSubjectsTableEventType } from './recordable-subjects-table.component';


@Component({
  selector: 'emp-land-recordable-subjects-searcher',
  templateUrl: './recordable-subjects-searcher.component.html',
})
export class RecordableSubjectsSearcherComponent implements OnInit, OnDestroy {

  @Input() selectedRecordableSubject: RecordableSubject = EmptyRecordableSubject;

  cardHint = 'Seleccionar los filtros';

  isLoading = false;

  submitted = false;

  queryExecuted = false;

  filter: RecordableSubjectFilter = EmptyRecordableSubjectFilter;

  recordableSubjectsList: RecordableSubjectShortModel[] = [];

  displayTractIndex = false;

  selectedTractIndex: TractIndex = EmptyTractIndex;

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
        this.getRecordableSubjects();

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRecordableSubjectsTableEvent(event: EventInfo) {
    switch (event.type as RecordableSubjectsTableEventType) {

      case RecordableSubjectsTableEventType.SELECT_RECORDABLE_SUBJECT:
        Assertion.assertValue(event.payload.recordableSubject.uid, 'event.payload.recordableSubject.uid');
        this.getTrackIndex(event.payload.recordableSubject.uid);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCloseTractIndexExplorer() {
    this.setSelectedTractIndex(EmptyTractIndex);
  }


  private getRecordableSubjects() {
    if (!this.filter.keywords) {
      return;
    }

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


  private setRecordableSubjectsList(recordableSubjectsList: RecordableSubjectShortModel[]) {
    this.recordableSubjectsList = recordableSubjectsList;
    this.saveDataInState();
    this.setText();
  }


  private resetData() {
    this.queryExecuted = false;
    this.setRecordableSubjectsList([]);
    this.onCloseTractIndexExplorer();
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

}
