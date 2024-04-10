/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { EmptyRecordSearchData, EmptyTractIndex, PartyRecordSearchQuery, RecordSearchData, RecordSearchQuery,
         RecordSearchResult, RecordSearchType, TractIndex } from '@app/models';

import { RecordSearchFilterEventType } from './record-search-filter.component';

import { RecordableSubjectsAction,
         RecordableSubjectsStateSelector } from '@app/presentation/exported.presentation.types';

import { RecordSearchListEventType } from './record-search-list.component';

import { SearchServicesDataService } from '@app/data-services';

@Component({
  selector: 'emp-land-record-search',
  templateUrl: './record-search.component.html',
})
export class RecordSearchComponent implements OnInit, OnDestroy {

  data: RecordSearchData = EmptyRecordSearchData;

  displayTractIndex = false;

  selectedTractIndex: TractIndex = EmptyTractIndex;

  cardHint = 'Seleccionar los filtros';

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private searchServicesData: SearchServicesDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.helper.select<RecordSearchData>(RecordableSubjectsStateSelector.RECORD_SEARCH_DATA)
      .subscribe(x => this.setInitData(x));
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onRecordSearchFilterEvent(event: EventInfo) {
    switch (event.type as RecordSearchFilterEventType) {

      case RecordSearchFilterEventType.FILTER_CHANGED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.resetData(event.payload.query as RecordSearchQuery);
        this.validateSearchType(event.payload.query as RecordSearchQuery);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRecordSearchListEvent(event: EventInfo) {
    switch (event.type as RecordSearchListEventType) {

      case RecordSearchListEventType.SELECT_RECORDABLE_SUBJECT:
        Assertion.assertValue(event.payload.record.recordableSubject.uid, 'event.payload.record.recordableSubject.uid');
        this.getTrackIndex(event.payload.record.recordableSubject.uid);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCloseTractIndexExplorer() {
    this.setSelectedTractIndex(EmptyTractIndex);
  }


  private resetData(query: RecordSearchQuery) {
    this.saveDataInState(query, [], false);
  }


  private validateSearchType(query: RecordSearchQuery) {
    if (!this.isValidRecordSearchQuery(query)) {
      return;
    }

    switch (query.type) {
      case RecordSearchType.RealEstate:
      case RecordSearchType.Association:
      case RecordSearchType.NoProperty:
        this.searchRecordableSubjects(query);
        return;

      case RecordSearchType.Party:
        this.searchParties(query);
        return;

      default:
        console.log(`Unhandled search type ${query.type}`);
        return;
    }
  }


  private isValidRecordSearchQuery(query: RecordSearchQuery): boolean {
    return !!query.recorderOfficeUID && !!query.type && !!query.keywords;
  }


  private searchRecordableSubjects(query: RecordSearchQuery) {
    this.isLoading = true;

    this.searchServicesData.searchRecordableSubject(query)
      .firstValue()
      .then(x => this.saveDataInState(query, x, true))
      .finally(() => this.isLoading = false);
  }


  private searchParties(query: RecordSearchQuery) {
    this.isLoading = true;

    const partyQuery: PartyRecordSearchQuery = {
      recorderOfficeUID: query.recorderOfficeUID,
      keywords: query.keywords
    };

    this.searchServicesData.searchParties(partyQuery)
      .firstValue()
      .then(x => this.saveDataInState(query, x, true))
      .finally(() => this.isLoading = false);
  }


  private saveDataInState(query: RecordSearchQuery, records: RecordSearchResult[], queryExecuted: boolean) {
    const recordSearchData: RecordSearchData = {
      recordSearchQuery: query,
      queryExecuted: queryExecuted,
      records: records,
    };

    this.uiLayer.dispatch(RecordableSubjectsAction.SET_RECORD_SEARCH_DATA, {recordSearchData});
  }


  private setInitData(data: RecordSearchData) {
    this.data = data;
    this.setText(data);
  }


  private getTrackIndex(recordableSubjectUID: string) {
    this.isLoading = true;

    this.helper.select<TractIndex>(RecordableSubjectsStateSelector.TRACT_INDEX, {recordableSubjectUID})
      .firstValue()
      .then(x => this.setSelectedTractIndex(x))
      .finally(() => this.isLoading = false);
  }


  private setSelectedTractIndex(tractIndex: TractIndex) {
    this.selectedTractIndex = tractIndex;
    this.displayTractIndex = !isEmpty(tractIndex.recordableSubject);
  }


  private setText(data: RecordSearchData) {
    if (!data.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    this.cardHint = `${data.records.length} registros encontrados`;
  }

}
