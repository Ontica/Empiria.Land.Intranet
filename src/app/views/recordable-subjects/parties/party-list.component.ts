/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EventInfo } from '@app/core';
import { RecordingActParty } from '@app/models';
import { MessageBoxService } from '@app/shared/containers/message-box';

export enum PartyListEventType {
  REMOVE_PARTY = 'PartyListComponent.Event.RemoveParty',
}


@Component({
  selector: 'emp-land-party-list',
  templateUrl: './party-list.component.html',
})
export class PartyListComponent implements OnInit, OnChanges {

  @Input() partiesList: RecordingActParty[] = [];

  @Output() partyListEvent = new EventEmitter<EventInfo>();

  dataSource: MatTableDataSource<RecordingActParty>;
  displayedColumns = ['name', 'typeIdentification', 'role', 'participationAmount', 'action'];

  constructor(private messageBox: MessageBoxService) { }


  ngOnInit(): void { }


  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.partiesList);
  }


  removeParty(party: RecordingActParty){
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


  private getConfirmMessage(party: RecordingActParty): string {
    return `
      <table style='margin: 0;'>
        <tr><td>Nombre: </td><td><strong> ${party.party} </strong></td></tr>

        <tr><td class='nowrap'>Participa como: </td><td><strong>
          ${party.role.name ?? '-'}
        </strong></td></tr>

        <tr><td>Titularidad: </td><td><strong>
          ${party.type ?? '-'}
        </strong></td></tr>

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
