/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ROUTES_LIBRARY } from '../config-data';

import { View, Layout } from '../common-models/common';

import {
  TransactionViews,
  SearchViews,
  HistoricRegistrationViews,
  UnauthorizedViews
} from './views-config';


export const APP_VIEWS: View[] = TransactionViews.concat(HistoricRegistrationViews,
                                                         SearchViews,
                                                         UnauthorizedViews);

export const APP_LAYOUTS: Layout[] = [
  {
    name: 'Transactions',
    views: TransactionViews,
    hint: 'Registro de trámites',
    defaultTitle: 'Trámites',
    url: ROUTES_LIBRARY.transactions.fullpath,
    permission: ROUTES_LIBRARY.transactions.permission,
  },
  {
    name: 'Search',
    views: SearchViews,
    hint: 'Servicios de consulta en línea',
    defaultTitle: 'Consultas',
    url: ROUTES_LIBRARY.search_services.fullpath,
    permission: ROUTES_LIBRARY.search_services.permission,
  },
  {
    name: 'HistoricRegistration',
    views: HistoricRegistrationViews,
    hint: 'Registro histórico de información',
    defaultTitle: 'Captura Histórica',
    url: ROUTES_LIBRARY.historic_registration.fullpath,
    permission: ROUTES_LIBRARY.historic_registration.permission,
  },
  {
    name: 'Unauthorized',
    views: UnauthorizedViews,
    hint: '',
    defaultTitle: '401: Unauthorized',
    url: ROUTES_LIBRARY.unauthorized.fullpath,
  },
];
