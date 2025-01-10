/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ROUTES } from '../config-data';

import { View, Layout } from '../common-models/common';

import {
  TransactionViews,
  HistoricRegistrationViews,
  UnauthorizedViews,
  SystemManagementViews
} from './views-config';



export type LAYOUT_TYPE = 'Transactions' | 'Search' | 'HistoricRegistration' | 'SystemManagement' |
                          'Unauthorized';


export const APP_VIEWS: View[] = UnauthorizedViews.concat(TransactionViews,
                                                          HistoricRegistrationViews,
                                                          SystemManagementViews);

export const APP_LAYOUTS: Layout<LAYOUT_TYPE>[] = [
  {
    name: 'Transactions',
    views: TransactionViews,
    hint: 'Registro de trámites',
    defaultTitle: 'Trámites',
    url: ROUTES.transactions.fullpath,
    permission: ROUTES.transactions.permission,
  },
  {
    name: 'HistoricRegistration',
    views: HistoricRegistrationViews,
    hint: 'Registro histórico de información',
    defaultTitle: 'Captura Histórica',
    url: ROUTES.historic_registration.fullpath,
    permission: ROUTES.historic_registration.permission,
  },
  {
    name: 'SystemManagement',
    views: SystemManagementViews,
    hint: 'Herramientas de administración del sistema',
    defaultTitle: 'Administración',
    url: ROUTES.administration.fullpath,
    permission: ROUTES.administration.permission,
  },
  {
    name: 'Unauthorized',
    views: UnauthorizedViews,
    hint: '',
    defaultTitle: '401: Unauthorized',
    url: ROUTES.unauthorized.fullpath,
  },
];
