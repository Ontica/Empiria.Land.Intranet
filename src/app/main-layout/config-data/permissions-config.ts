/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export enum PERMISSIONS {
  NOT_REQUIRED = 'permission-not-required',

  MODULE_TRANSACTIONS = 'menu-transactions',
  MODULE_HISTORIC_REGISTRATION = 'menu-historic-registration',
  MODULE_SEARCH_RECORDABLE_SUBJECTS = 'menu-search-recordable-subjects',

  ROUTE_TRANSACTIONS = 'route-transactions',
  ROUTE_HISTORIC_REGISTRATION = 'route-historic-registration',

  FEATURE_TRANSACTIONS_ADD = 'feature-transactions-add',
}


export const PERMISSION_NOT_REQUIRED = PERMISSIONS.NOT_REQUIRED;


export function getAllPermissions() {
  return Object.keys(PERMISSIONS)
    .map(key => PERMISSIONS[key]);
}
