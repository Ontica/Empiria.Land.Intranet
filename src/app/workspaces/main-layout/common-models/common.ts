/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

export type LayoutType = 'Transactions' | 'Search' | 'HistoricRegistration' | 'Unauthorized';


export interface Layout {
  name: LayoutType;
  views: View[];
  hint: string;
  defaultTitle: string;
  url: string;
  permission?: string;
}


export type ViewActionType = 'None' | 'ActionFilter' | 'ActionCreate' | 'ActionExport';


export interface View {
  name: string;
  title: string;
  url: string;
  menuTitle?: string;
  disabled?: boolean;
  permission?: string;
  actions?: ViewAction[];
}


export interface ViewAction {
  action: ViewActionType;
  name: string;
  icon?: string;
}


export const DefaultView: View = {
  name: 'Default view',
  title: 'Default view',
  url: '/',
};
