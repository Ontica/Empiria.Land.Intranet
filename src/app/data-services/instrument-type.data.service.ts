/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { InstrumentType } from '@app/domain/models';


@Injectable()
export class InstrumentTypeDataService {

  constructor(private http: HttpService) { }

  getInstrumentKindsList(instrumentType: InstrumentType): Observable<string[]> {
    Assertion.assertValue(instrumentType, 'instrumentType');

    const path = `v5/land/instrument-types/${instrumentType}/instrument-kinds`;

    return this.http.get<string[]>(path);
  }

}
