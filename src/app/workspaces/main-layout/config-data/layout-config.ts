/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { View, Layout } from '../common-models/common';

import {
  TransactionViews,
  SearchViews
} from './views.config';


export type LayoutType = 'Transactions' | 'Search';


export const APP_VIEWS: View[] = TransactionViews.concat(SearchViews);

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
  }
];
