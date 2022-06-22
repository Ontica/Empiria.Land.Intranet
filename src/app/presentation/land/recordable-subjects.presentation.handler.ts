/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, Cache, toObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { EmptyRecordableSubjectData, EmptyTractIndex, IssuersFilter, RecordableSubjectFilter } from '@app/models';

import { RecordableSubjectsDataService } from '@app/data-services';


export enum ActionType {
  SET_RECORDABLE_SUBJECTS_EXPLORER_DATA = 'Land.RecordableSubjects.Action.SetRecordableSubjectsExplorerData',
}


export enum SelectorType {
  AMENDABLE_RECORDING_ACTS          = 'Land.RecordableSubjects.Selector.AmendableRecordingActs.List',
  ASSOCIATION_KIND_LIST             = 'Land.RecordableSubjects.Selector.AssociationKind.List',
  INSTRUMENT_KIND_LIST              = 'Land.RecordableSubjects.Selector.InstrumentKind.List',
  INSTRUMENT_TYPE_ISSUERS_LIST      = 'Land.RecordableSubjects.Selector.InstrumentTypeIssuers.List',
  NO_PROPERTY_KIND_LIST             = 'Land.RecordableSubjects.Selector.NoPropertyKind.List',
  RECORDER_OFFICE_LIST              = 'Land.RecordableSubjects.Selector.RecorderOffice.List',
  REAL_ESTATE_KIND_LIST             = 'Land.RecordableSubjects.Selector.RealEstateKind.List',
  REAL_ESTATE_PARTITION_KIND_LIST   = 'Land.RecordableSubjects.Selector.RealEstatePartitionKind.List',
  REAL_ESTATE_LOT_SIZE_UNIT_LIST    = 'Land.RecordableSubjects.Selector.RealEstateLoteSizeUnit.List',
  RECORDING_BOOKS_LIST              = 'Land.RecordableSubjects.Selector.RecordingBooks.List',
  RECORDING_BOOK_ENTRIES_LIST       = 'Land.RecordableSubjects.Selector.RecordingBookEntries.List',
  RECORDABLE_SUBJECTS_LIST          = 'Land.RecordableSubjects.Selector.RecordableSubjects.List',
  RECORDABLE_SUBJECTS_EXPLORER_DATA = 'Land.RecordableSubjects.Selector.RecordableSubjectsExplorerData.Data',
}


const initialState: StateValues = [
  { key: SelectorType.AMENDABLE_RECORDING_ACTS, value: EmptyTractIndex },
  { key: SelectorType.ASSOCIATION_KIND_LIST, value: [] },
  { key: SelectorType.INSTRUMENT_KIND_LIST, value: new Cache<string[]>() },
  { key: SelectorType.NO_PROPERTY_KIND_LIST, value: [] },
  { key: SelectorType.REAL_ESTATE_KIND_LIST, value: [] },
  { key: SelectorType.REAL_ESTATE_PARTITION_KIND_LIST, value: [] },
  { key: SelectorType.REAL_ESTATE_LOT_SIZE_UNIT_LIST, value: [] },
  { key: SelectorType.RECORDER_OFFICE_LIST, value: [] },
  { key: SelectorType.RECORDABLE_SUBJECTS_EXPLORER_DATA, value: EmptyRecordableSubjectData },
];


@Injectable()
export class RecordableSubjectsPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: RecordableSubjectsDataService) {
    super({
      initialState,
      selectors: SelectorType,
      actions: ActionType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): Observable<U> {
    let provider: () => any;

    switch (selectorType) {

      case SelectorType.AMENDABLE_RECORDING_ACTS:
        Assertion.assertValue(params.recordableSubject, 'params.recordableSubject');
        Assertion.assertValue(params.instrumentRecordingUID, 'params.instrumentRecordingUID');
        Assertion.assertValue(params.amendmentRecordingActTypeUID, 'params.amendmentRecordingActTypeUID');

        return toObservable<U>(this.data.getAmendableRecordingActs(params.recordableSubject,
                                                                  params.instrumentRecordingUID,
                                                                  params.amendmentRecordingActTypeUID));


      case SelectorType.ASSOCIATION_KIND_LIST:
        provider = () => this.data.getAssociationKinds();

        return super.selectFirst<U>(selectorType, provider);


      case SelectorType.INSTRUMENT_KIND_LIST:
        Assertion.assertValue(params, 'params');

        const instrumentType = params;

        const dataProvider = () => this.data.getInstrumentKinds(instrumentType);

        return super.selectMemoized(selectorType, dataProvider, instrumentType, []);


      case SelectorType.INSTRUMENT_TYPE_ISSUERS_LIST:
        Assertion.assertValue(params.instrumentType, 'params.instrumentType');

        return toObservable<U>(this.data.findInstrumentTypeIssuers(params as IssuersFilter));


      case SelectorType.NO_PROPERTY_KIND_LIST:
        provider = () => this.data.getNoPropertyKinds();

        return super.selectFirst<U>(selectorType, provider);


      case SelectorType.REAL_ESTATE_KIND_LIST:
        provider = () => this.data.getRealEstateKinds();

        return super.selectFirst<U>(selectorType, provider);


      case SelectorType.REAL_ESTATE_PARTITION_KIND_LIST:
        provider = () => this.data.getRealEstatePartitionKinds();

        return super.selectFirst<U>(selectorType, provider);


      case SelectorType.REAL_ESTATE_LOT_SIZE_UNIT_LIST:
        provider = () => this.data.getRealEstateLotSizeUnits();

        return super.selectFirst<U>(selectorType, provider);


      case SelectorType.RECORDER_OFFICE_LIST:
        provider = () => this.data.getRecorderOffices();

        return super.selectFirst<U>(selectorType, provider);

      case SelectorType.RECORDING_BOOKS_LIST:
        Assertion.assertValue(params.recorderOfficeUID, 'params.recorderOfficeUID');
        Assertion.assertValue(params.recordingSectionUID, 'params.recordingSectionUID');
        Assertion.assertValue(params.keywords, 'params.keywords');

        return toObservable<U>(this.data.getRecordingBooks(params.recorderOfficeUID,
                                                           params.recordingSectionUID,
                                                           params.keywords));

      case SelectorType.RECORDING_BOOK_ENTRIES_LIST:
        Assertion.assertValue(params.recordingBookUID, 'params.recordingBookUID');

        return toObservable<U>(this.data.getRecordingBookEntries(params.recordingBookUID));

      case SelectorType.RECORDABLE_SUBJECTS_LIST:
        return toObservable<U>(this.data.searchRecordableSubject(params as RecordableSubjectFilter));

      default:
        return super.select<U>(selectorType, params);

    }
  }


  dispatch(actionType: ActionType, params?: any): void {
    switch (actionType) {

      case ActionType.SET_RECORDABLE_SUBJECTS_EXPLORER_DATA:
        Assertion.assertValue(params.recordableSubjectData, 'payload.recordableSubjectData');

        const recordableSubjectData = params.recordableSubjectData ||
          this.getValue(SelectorType.RECORDABLE_SUBJECTS_EXPLORER_DATA);

        this.setValue(SelectorType.RECORDABLE_SUBJECTS_EXPLORER_DATA, recordableSubjectData);

        return;

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }

}
