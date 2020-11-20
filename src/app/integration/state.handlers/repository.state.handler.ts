/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion, Cache, Identifiable } from '@app/core';

import { AbstractStateHandler, StateValues } from '@app/core/presentation/state-handler';

import { RepositoryUseCases } from '@app/domain/use-cases';
import { RealEstate } from '@app/domain/models';


export enum SelectorType {
  DISTRICT_LIST = 'Land.UI-Item.Repository.DistrictList',
  DISTRICT_MUNICIPALITY_LIST = 'Land.UI-Item.Repository.DistrictMuncipalityList',
  DISTRICT_OWNERSHIP_RECORDING_SECTIONS_LIST = 'Land.UI-Item.Repository.OwnershipRecordingSectionsList',
  DISTRICT_SECTION_RECORDING_BOOKS_LIST = 'Land.UI-Item.Repository.DistrictSectionRecordingBooksList',
  REAL_ESTATE = 'Land.UI-Action.Repository.RealEstate',
  REAL_ESTATE_TYPE_LIST = 'Land.UI-Item.Repository.RealEstateTypeList',
}


const initialState: StateValues = [
  { key: SelectorType.DISTRICT_LIST, value: [] },
  { key: SelectorType.DISTRICT_MUNICIPALITY_LIST, value: new Cache<Identifiable[]>() },
  { key: SelectorType.DISTRICT_OWNERSHIP_RECORDING_SECTIONS_LIST, value: new Cache<Identifiable[]>() },
  { key: SelectorType.DISTRICT_SECTION_RECORDING_BOOKS_LIST, value: new Cache<Identifiable[]>() },
  { key: SelectorType.REAL_ESTATE, value: new Cache<RealEstate>() },
  { key: SelectorType.REAL_ESTATE_TYPE_LIST, value: [] }
];


@Injectable()
export class RepositoryStateHandler extends AbstractStateHandler {

  constructor(private repository: RepositoryUseCases) {
    super({ initialState, selectors: SelectorType });
  }


  select<U>(selectorType: SelectorType, params?: any): Observable<U> {
    let dataProvider: () => any;

    switch (selectorType) {

      case SelectorType.DISTRICT_LIST:

        dataProvider = () => this.repository.getRecorderOfficeList();

        return super.selectFirst<U>(selectorType, dataProvider);


      case SelectorType.DISTRICT_MUNICIPALITY_LIST:
        Assertion.assertValue(params.districtUID, 'params.districtUID');

        dataProvider = () => this.repository.getRecorderOfficeMunicipalityList(params.districtUID);

        return super.selectMemoized<U>(selectorType, dataProvider, params.districtUID);


      case SelectorType.DISTRICT_SECTION_RECORDING_BOOKS_LIST:
        Assertion.assertValue(params.districtUID, 'params.districtUID');
        Assertion.assertValue(params.districtUID, 'params.sectionUID');

        dataProvider =
            () => this.repository.getRecorderOfficeSectionBookList(params.districtUID, params.sectionUID);

        return super.selectMemoized<U>(selectorType, dataProvider, params.districtUID + params.sectionUID);


      case SelectorType.DISTRICT_OWNERSHIP_RECORDING_SECTIONS_LIST:
        Assertion.assertValue(params.districtUID, 'params.districtUID');

        dataProvider = () => this.repository.getOwnershipRecordingSectionList(params.districtUID);

        return super.selectMemoized<U>(selectorType, dataProvider, params.districtUID);


      case SelectorType.REAL_ESTATE:
        Assertion.assertValue(params.uid, 'params.uid');

        dataProvider = () => this.repository.getRealEstate(params.uid);

        return super.selectMemoized<U>(selectorType, dataProvider, params.uid);


      case SelectorType.REAL_ESTATE_TYPE_LIST:
        dataProvider = () => this.repository.getRealEstateTypeList();

        return super.selectFirst<U>(selectorType, dataProvider);


      default:
        return super.select<U>(selectorType, params);

    }

  }

}
