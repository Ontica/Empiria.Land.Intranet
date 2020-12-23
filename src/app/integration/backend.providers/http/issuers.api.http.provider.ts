/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DateStringLibrary, HttpService } from '@app/core';

import { IssuersApiProvider } from '@app/domain/providers/issuers.api.provider';
import { InstrumentType, Issuer } from '@app/domain/models';


@Injectable()
export class IssuersApiHttpProvider extends IssuersApiProvider {

  constructor(private http: HttpService) {
    super();
  }


  getIssuerList(instrumentType: InstrumentType,
                instrumentKind?: string,
                onDate?: string,
                keywords?: string): Observable<Issuer[]> {
    let path = `v5/land/instrument-issuers/?instrumentType=${instrumentType}`;

    if (instrumentKind) {
      path += `&instrumentKind="${instrumentKind}"`;
    }

    if (onDate && DateStringLibrary.isDate(onDate)) {
      path += `&onDate=${onDate}`;
    }

    if (keywords) {
      path += `&keywords=${keywords}`;
    }

    return this.http.get<Issuer[]>(path);
  }

}
