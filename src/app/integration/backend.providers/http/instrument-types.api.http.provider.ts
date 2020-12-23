/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '@app/core';

import { InstrumentTypesApiProvider } from '@app/domain/providers/instrument-types.api.provider';
import { InstrumentType } from '@app/domain/models';


@Injectable()
export class InstrumentTypesApiHttpProvider extends InstrumentTypesApiProvider {

  constructor(private http: HttpService) {
    super();
  }


  getInstrumentKindsList(instrumentType?: InstrumentType): Observable<string[]> {
    let path = `v5/land/instrument-types/${instrumentType}/instrument-kinds`;
    return this.http.get<string[]>(path);
  }

}
