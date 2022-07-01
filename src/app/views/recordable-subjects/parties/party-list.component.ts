/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo, Identifiable } from '@app/core';

import { RecordingActParty } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ArrayLibrary } from '@app/shared/utils';

export enum PartyListEventType {
  REMOVE_PARTY = 'PartyListComponent.Event.RemoveParty',
}


@Component({
  selector: 'emp-land-party-list',
  templateUrl: './party-list.component.html',
})
export class PartyListComponent implements OnChanges {

  @Input() partiesList: RecordingActParty[] = [];

  @Input() readonly = false;

  @Output() partyListEvent = new EventEmitter<EventInfo>();

  dataSource: MatTableDataSource<RecordingActParty>;

  private displayedColumnsDefault = ['name', 'identification', 'role', 'partAmount'];

  displayedColumns = [...this.displayedColumnsDefault];

  secondaryPartiesGroupedByRoleList: any[] = [];

  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.partiesList.filter(x => x.type === 'Primary'));
    this.resetColumns();
    this.setSecondaryPartyGroupedList();
  }


  showRoleGroupByParty(roleGroup, primaryParty) {
    return roleGroup.parties
      .filter(secondaryParty => primaryParty.party.uid === secondaryParty.associatedWith.uid).length > 0;
  }


  getPartAmountText(party: RecordingActParty) {
    switch (party.partUnit.uid) {
      case 'Unit.Percentage':
        return party.partAmount + '%';

      case 'AreaUnit.SquareMeters':
        return party.partAmount + ' m²';

      case 'AreaUnit.Hectarea':
        return party.partAmount + ' ' + party.partUnit.name;

      default:
        return party.partUnit.name;
    }
  }


  removeParty(party: RecordingActParty) {
    if (this.readonly) {
      return;
    }

    const message = this.getConfirmMessage(party);

    this.messageBox.confirm(message, 'Eliminar registro', 'DeleteCancel')
      .toPromise()
      .then(x => {
        if (x) {
          const payload = {
            partyUID: party.uid
          };

          this.sendEvent(PartyListEventType.REMOVE_PARTY, payload);
        }
      });
  }


  private setSecondaryPartyGroupedList() {
    const secondaryRoles = new Set(this.partiesList.filter(party => party.type === 'Secondary')
                                                   .map(party => party.role));

    let secondaryRolesGrouped: Identifiable[] = [];
    secondaryRoles.forEach(rol => {
      secondaryRolesGrouped = [...ArrayLibrary.insertIfNotExist(secondaryRolesGrouped, rol, 'uid')];
    });

    this.secondaryPartiesGroupedByRoleList = [];

    secondaryRolesGrouped.forEach(rol =>
      this.secondaryPartiesGroupedByRoleList.push({
        uid: rol.uid,
        name: rol.name,
        parties: this.partiesList.filter(party => rol.uid === party.role.uid),
      }
      ));
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault]

    if (!this.readonly) {
      this.displayedColumns.push('action');
    }
  }


  private getConfirmMessage(party: RecordingActParty): string {
    return `
      <table style='margin: 0;'>
        <tr><td>Nombre: </td><td><strong> ${party.party.fullName} </strong></td></tr>

        <tr><td class='nowrap'>Participa como: </td><td><strong>${party.role.name ?? '-'}</strong></td></tr>
        ` + (

        party.type === 'Primary' ?
          `<tr><td>Titularidad: </td><td><strong> ${this.getPartAmountText(party)}</strong></td></tr>` :
          ''

      ) + `
      </table>

     <br>¿Elimino el registro?`;
  }


  private sendEvent(eventType: PartyListEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.partyListEvent.emit(event);
  }

}
