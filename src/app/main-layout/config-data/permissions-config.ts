/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export enum PermissionsLibrary {
  MODULE_TRANSACTIONS = 'menu-transactions',
  MODULE_HISTORIC_REGISTRATION = 'menu-historic-registration',
  MODULE_SEARCH_RECORDABLE_SUBJECTS = 'menu-search-recordable-subjects',

  ROUTE_TRANSACTIONS = 'route-transactions',
  ROUTE_HISTORIC_REGISTRATION = 'route-historic-registration',

  FEATURE_TRANSACTIONS_ADD = 'feature-transactions-add',
}


export const ROUTES_LIBRARY = {

  // #region app-routing module

  transactions: {
    permission: PermissionsLibrary.MODULE_TRANSACTIONS,
    parent: '',
    path: 'transactions',
    fullpath: '/transactions',
  },
  historic_registration: {
    permission: PermissionsLibrary.MODULE_HISTORIC_REGISTRATION,
    parent: '',
    path: 'historic-registration',
    fullpath: '/historic-registration',
  },
  security: {
    parent: '',
    path: 'security',
    fullpath: '/security',
  },
  unauthorized: {
    parent: '',
    path: 'unauthorized',
    fullpath: '/unauthorized',
  },

  // #endregion

  // #region transactions-routing module

  transactions_my_inbox: {
    permission: PermissionsLibrary.ROUTE_TRANSACTIONS,
    parent: 'transactions',
    path: 'my-inbox',
    fullpath: '/transactions/my-inbox',
  },
  transactions_control_desk: {
    permission: PermissionsLibrary.ROUTE_TRANSACTIONS,
    parent: 'transactions',
    path: 'control-desk',
    fullpath: '/transactions/control-desk',
  },
  transactions_finished: {
    permission: PermissionsLibrary.ROUTE_TRANSACTIONS,
    parent: 'transactions',
    path: 'finished',
    fullpath: '/transactions/finished',
  },
  transactions_pending: {
    permission: PermissionsLibrary.ROUTE_TRANSACTIONS,
    parent: 'transactions',
    path: 'pending',
    fullpath: '/transactions/pending',
  },
  transactions_all: {
    permission: PermissionsLibrary.ROUTE_TRANSACTIONS,
    parent: 'transactions',
    path: 'all',
    fullpath: '/transactions/all',
  },

  // #endregion

  // #region historic_registration-routing module

  historic_registration_by_book: {
    permission: PermissionsLibrary.ROUTE_HISTORIC_REGISTRATION,
    parent: 'historic-registration',
    path: 'by-book',
    fullpath: '/historic-registration/by-book',
  },

  historic_registration_book_entry: {
    permission: PermissionsLibrary.ROUTE_HISTORIC_REGISTRATION,
    parent: 'historic-registration',
    path: 'book-entry',
    fullpath: '/historic-registration/book-entry',
  },

  // #endregion

  // #region security-routing module

  security_login: {
    parent: 'security',
    path: 'login',
    fullpath: '/security/login'
  },

  // #endregion

};


export const DEFAULT_ROUTE = ROUTES_LIBRARY.transactions_my_inbox;


export const DEFAULT_URL = ( DEFAULT_ROUTE.parent ? DEFAULT_ROUTE.parent + '/' : '' ) + DEFAULT_ROUTE.path;


export const UNAUTHORIZED_ROUTE = ROUTES_LIBRARY.unauthorized.path;


export const ROUTES_LIST = Object.keys(ROUTES_LIBRARY)
                                 .map(key => ROUTES_LIBRARY[key])
                                 .filter(x => x.parent && x.permission);

export function getAllPermissions() {
    return Object.keys(PermissionsLibrary)
                 .map(key => PermissionsLibrary[key]);
}
