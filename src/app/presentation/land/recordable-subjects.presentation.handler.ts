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

import { IssuersFilter } from '@app/models';

import { RecordableSubjectsDataService } from '@app/data-services';


export enum SelectorType {
  ASSOCIATION_KIND_LIST          = 'Land.RecordableSubjects.AssociationKind.List',
  INSTRUMENT_KIND_LIST           = 'Land.RecordableSubjects.InstrumentKind.List',
  INSTRUMENT_TYPE_ISSUERS_LIST   = 'Land.RecordableSubjects.InstrumentTypeIssuers.List',
  NO_PROPERTY_KIND_LIST          = 'Land.RecordableSubjects.NoPropertyKind.List',
  RECORDER_OFFICE_LIST           = 'Land.RecordableSubjects.RecorderOffice.List',
  REAL_ESTATE_KIND_LIST          = 'Land.RecordableSubjects.RealEstateKind.List',
  REAL_ESTATE_LOT_SIZE_UNIT_LIST = 'Land.RecordableSubjects.RealEstateLoteSizeUnit.List',
}


const initialState: StateValues = [
  { key: SelectorType.ASSOCIATION_KIND_LIST, value: [] },
  { key: SelectorType.INSTRUMENT_KIND_LIST, value: new Cache<string[]>() },
  { key: SelectorType.INSTRUMENT_TYPE_ISSUERS_LIST, value: [] },
  { key: SelectorType.NO_PROPERTY_KIND_LIST, value: [] },
  { key: SelectorType.REAL_ESTATE_KIND_LIST, value: [] },
  { key: SelectorType.REAL_ESTATE_LOT_SIZE_UNIT_LIST, value: [] },
  { key: SelectorType.RECORDER_OFFICE_LIST, value: [] }
];


@Injectable()
export class RecordableSubjectsPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: RecordableSubjectsDataService) {
    super({
      initialState,
      selectors: SelectorType
    });
  }


  select<U>(selectorType: SelectorType, params?: any): Observable<U> {
    let provider: () => any;

    switch (selectorType) {

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


      case SelectorType.REAL_ESTATE_LOT_SIZE_UNIT_LIST:
        provider = () => this.data.getRealEstateLotSizeUnits();

        return super.selectFirst<U>(selectorType, provider);


      case SelectorType.RECORDER_OFFICE_LIST:
        provider = () => this.data.getRecorderOffices();

        return super.selectFirst<U>(selectorType, provider);


      default:
        return super.select<U>(selectorType, params);

    }
  }

}
