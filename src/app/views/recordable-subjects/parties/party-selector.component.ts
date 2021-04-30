/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { isEmpty } from '@app/core';

import { concat, Observable, of, Subject } from 'rxjs';

import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

import { EmptyRecordingActParty, PartyTypeItem, PartyTypeList, RecordingActParty } from '@app/models';

@Component({
  selector: 'emp-land-party-selector',
  templateUrl: './party-selector.component.html',
})
export class PartySelectorComponent implements OnInit {

  @Input() partySelected: RecordingActParty;

  @Output() partySelectedChange = new EventEmitter<RecordingActParty>();

  partyList$: Observable<RecordingActParty[]>;
  partyInput$ = new Subject<string>();
  partyLoading = false;

  typesList: PartyTypeItem[] = PartyTypeList;
  typeSelected: PartyTypeItem = null;


  constructor() { }


  ngOnInit(): void {
    this.suscribePartyList();
  }


  isNewParty(party: RecordingActParty) {
    return isEmpty(party);
  }


  onPartySelectedChange(party: RecordingActParty){
    this.partySelectedChange.emit(party);
  }


  onNewPartySelectedChange(name: string){
    const party: RecordingActParty = EmptyRecordingActParty;
    party.party.fullName = name;
    party.party.type = this.typeSelected?.type ?? party.party.type;
    this.partySelectedChange.emit(party);
  }


  private suscribePartyList() {
    this.partyList$ = concat(
      of([]),
      this.partyInput$.pipe(
          distinctUntilChanged(),
          tap(() => this.partyLoading = true),
          switchMap(term =>
            // TODO: call to web api
            of([])
          .pipe(
              catchError(() => of([])),
              tap(() => this.partyLoading = false)
          ))
      )
    );
  }

}
