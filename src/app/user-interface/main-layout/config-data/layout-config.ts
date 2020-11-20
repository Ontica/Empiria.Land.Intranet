/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { View, Layout } from '../common-models/common';

import {
  RequestsViews,
  SearchViews
} from './views.config';


export type LayoutType = 'Requests' | 'Transactions' | 'Search';


export const APP_VIEWS: View[] = RequestsViews.concat(SearchViews);

export const APP_LAYOUTS: Layout[] = [
  {
    name: 'Requests',
    views: RequestsViews,
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
