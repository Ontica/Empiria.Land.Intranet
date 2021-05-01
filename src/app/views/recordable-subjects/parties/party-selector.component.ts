/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { isEmpty } from '@app/core';

import { concat, Observable, of, Subject } from 'rxjs';

import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

import { EmptyParty, Party, PartyFilter, PartyTypeItem, PartyTypeList } from '@app/models';

import { RecordingDataService } from '@app/data-services';

@Component({
  selector: 'emp-land-party-selector',
  templateUrl: './party-selector.component.html',
})
export class PartySelectorComponent implements OnInit {

  @Input() instrumentRecordingUID: string;

  @Input() recordingActUID: string;

  @Input() partySelected: Party;

  @Output() partySelectedChange = new EventEmitter<Party>();

  partyList$: Observable<Party[]>;

  partyInput$ = new Subject<string>();

  partyLoading = false;

  partyMinTermLength = 5;

  typesList: PartyTypeItem[] = PartyTypeList;

  typeSelected: PartyTypeItem = null;


  constructor(private recordingData: RecordingDataService) { }


  ngOnInit(): void {
    this.suscribePartyList();
  }


  isNewParty(party: Party) {
    return isEmpty(party);
  }


  onPartySelectedChange(party: Party){
    this.partySelectedChange.emit(party);
  }


  onNewPartySelectedChange(newParty: Party){
    const party: Party = Object.assign({}, EmptyParty, newParty);
    party.fullName = newParty?.fullName ?? '';
    party.type = this.typeSelected?.type ?? 'Person';
    this.partySelectedChange.emit(party);
  }


  onTypeSelectedChanged(typeSelected: PartyTypeItem){
    if (isEmpty(this.partySelected)) {
      const party: Party = Object.assign({}, EmptyParty);
      party.type = this.typeSelected?.type ?? 'Person';
      this.partySelectedChange.emit(party);
    }
  }


  private suscribePartyList() {
    this.partyList$ = concat(
      of([]),
      this.partyInput$.pipe(
        filter(keyword => keyword !== null && keyword.length >= this.partyMinTermLength),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.partyLoading = true),
        switchMap(keyword => this.recordingData.searchParties(this.buildPartyFilter(keyword))
          .pipe(
            catchError(() => of([])),
            tap(() => this.partyLoading = false)
        ))
      )
    );
  }


  private buildPartyFilter(keywords: string): PartyFilter {
    const partyFilter: PartyFilter = {
      instrumentRecordingUID: this.instrumentRecordingUID,
      recordingActUID: this.recordingActUID,
      keywords
    };

    return partyFilter;
  }

}
