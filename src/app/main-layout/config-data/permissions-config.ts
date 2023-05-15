/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export enum PERMISSIONS {

  //
  // DEFAULT
  //

  NOT_REQUIRED = 'permission-not-required',

  //
  // HERRAMIENTA DE BUSQUEDA UNIVERSAL
  //

  MODULE_SEARCH_RECORDABLE_SUBJECTS = 'menu-search-recordable-subjects',

  //
  // TRAMITES
  //

  MODULE_TRANSACTIONS = 'menu-transactions',

  ROUTE_TRANSACTIONS = 'route-transactions',

  FEATURE_TRANSACTIONS_ADD = 'feature-transactions-add',

  //
  // CAPTURA HISTORICA
  //
  MODULE_HISTORIC_REGISTRATION = 'menu-historic-registration',

  ROUTE_HISTORIC_REGISTRATION = 'route-historic-registration',

  //
  // ADMINISTRACION
  //

  MODULE_SYSTEM_ADMINISTRATION = 'menu-system-administration',

  // PANEL DE CONTROL
  ROUTE_CONTROL_PANEL = 'route-control-panel',

  FEATURE_CHANGE_PASSWORD = 'feature-change-password',

  // CONTROL DE ACCESOS
  ROUTE_ACCESS_CONTROL = 'route-access-control',

  FEATURE_ACCESS_CONTROL_EDITION = 'feature-access-control-edition',

}


export const PERMISSION_NOT_REQUIRED = PERMISSIONS.NOT_REQUIRED;


export function getAllPermissions() {
  return Object.keys(PERMISSIONS)
    .map(key => PERMISSIONS[key]);
}
