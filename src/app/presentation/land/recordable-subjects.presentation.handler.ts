/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, Cache, EmpObservable } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { EmptyRecordSearchData, EmptyTractIndex, IssuersFilter } from '@app/models';

import { RecordableSubjectsDataService } from '@app/data-services';


export enum ActionType {
  SET_RECORD_SEARCH_DATA = 'Land.RecordableSubjects.Action.SetRecordSearchData',
}


export enum SelectorType {
  AMENDABLE_RECORDING_ACTS        = 'Land.RecordableSubjects.Selector.AmendableRecordingActs.List',
  ASSOCIATION_KIND_LIST           = 'Land.RecordableSubjects.Selector.AssociationKind.List',
  INSTRUMENT_KIND_LIST            = 'Land.RecordableSubjects.Selector.InstrumentKind.List',
  INSTRUMENT_TYPE_ISSUERS_LIST    = 'Land.RecordableSubjects.Selector.InstrumentTypeIssuers.List',
  NO_PROPERTY_KIND_LIST           = 'Land.RecordableSubjects.Selector.NoPropertyKind.List',
  RECORDER_OFFICE_LIST            = 'Land.RecordableSubjects.Selector.RecorderOffice.List',
  REAL_ESTATE_KIND_LIST           = 'Land.RecordableSubjects.Selector.RealEstateKind.List',
  REAL_ESTATE_PARTITION_KIND_LIST = 'Land.RecordableSubjects.Selector.RealEstatePartitionKind.List',
  REAL_ESTATE_LOT_SIZE_UNIT_LIST  = 'Land.RecordableSubjects.Selector.RealEstateLoteSizeUnit.List',
  RECORDING_BOOKS_LIST            = 'Land.RecordableSubjects.Selector.RecordingBooks.List',
  RECORDING_BOOK_ENTRIES_LIST     = 'Land.RecordableSubjects.Selector.RecordingBookEntries.List',
  RECORD_SEARCH_DATA              = 'Land.RecordableSubjects.Selector.RecordSearch.Data',
  TRACT_INDEX                     = 'Land.RecordableSubjects.Selector.TractIndex',
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
  { key: SelectorType.RECORD_SEARCH_DATA, value: EmptyRecordSearchData },
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


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {
    let provider: () => any;

    switch (selectorType) {

      case SelectorType.AMENDABLE_RECORDING_ACTS:
        Assertion.assertValue(params.query, 'params.query');

        return this.data.getAmendableRecordingActs(params.query) as EmpObservable<U>;


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

        return this.data.findInstrumentTypeIssuers(params as IssuersFilter) as EmpObservable<U>;


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

        return this.data.getRecordingBooks(params.recorderOfficeUID,
                                           params.recordingSectionUID,
                                           params.keywords) as EmpObservable<U>;

      case SelectorType.RECORDING_BOOK_ENTRIES_LIST:
        Assertion.assertValue(params.recordingBookUID, 'params.recordingBookUID');

        return this.data.getRecordingBookEntries(params.recordingBookUID) as EmpObservable<U>;

      case SelectorType.TRACT_INDEX:
        Assertion.assertValue(params.recordableSubjectUID, 'params.recordableSubjectUID');

        return this.data.getFullTractIndex(params.recordableSubjectUID) as EmpObservable<U>;

      default:
        return super.select<U>(selectorType, params);

    }
  }


  dispatch(actionType: ActionType, params?: any): void {
    switch (actionType) {

      case ActionType.SET_RECORD_SEARCH_DATA:
        Assertion.assertValue(params.recordSearchData, 'payload.recordSearchData');

        const recordSearchData = params.recordSearchData || this.getValue(SelectorType.RECORD_SEARCH_DATA);

        this.setValue(SelectorType.RECORD_SEARCH_DATA, recordSearchData);

        return;

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }

}
