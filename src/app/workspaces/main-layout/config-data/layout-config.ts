/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { View, Layout } from '../common-models/common';

import {
  TransactionViews,
  SearchViews,
  HistoricRegistrationViews
} from './views.config';


export type LayoutType = 'Transactions' | 'Search' | 'HistoricRegistration';


export const APP_VIEWS: View[] = TransactionViews.concat(HistoricRegistrationViews, SearchViews);

export const APP_LAYOUTS: Layout[] = [
  {
    name: 'Transactions',
    views: TransactionViews,
    hint: 'Registro de trámites',
    defaultTitle: 'Trámites'
  },
  {
    name: 'Search',
    views: SearchViews,
    hint: 'Servicios de consulta en línea',
    defaultTitle: 'Consulta'
  },
  {
    name: 'HistoricRegistration',
    views: HistoricRegistrationViews,
    hint: 'Registro histórico',
    defaultTitle: 'Registro histórico de información'
  }
];
