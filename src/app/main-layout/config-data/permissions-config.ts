/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export enum PermissionsLibrary {
  MODULE_TRANSACTIONS = 'menu-transactions',
  MODULE_SEARCH_SERVICES = 'menu-search-services',
  MODULE_HISTORIC_REGISTRATION = 'menu-historic-registration',

  ROUTE_TRANSACTIONS = 'route-transactions',
  ROUTE_SEARCH_SERVICES = 'route-search-services',
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
  search_services: {
    permission: PermissionsLibrary.MODULE_SEARCH_SERVICES,
    parent: '',
    path: 'search-services',
    fullpath: '/search-services',
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

  // #region search-services-routing module

  search_services_all: {
    permission: PermissionsLibrary.ROUTE_SEARCH_SERVICES,
    parent: 'search-services',
    path: 'all',
    fullpath: '/search-services/all',
  },
  search_services_real_estate: {
    permission: PermissionsLibrary.ROUTE_SEARCH_SERVICES,
    parent: 'search-services',
    path: 'real-estate',
    fullpath: '/search-services/real-estate',
  },
  search_services_associations: {
    permission: PermissionsLibrary.ROUTE_SEARCH_SERVICES,
    parent: 'search-services',
    path: 'associations',
    fullpath: '/search-services/associations',
  },
  search_services_persons: {
    permission: PermissionsLibrary.ROUTE_SEARCH_SERVICES,
    parent: 'search-services',
    path: 'persons',
    fullpath: '/search-services/persons',
  },
  search_services_documents: {
    permission: PermissionsLibrary.ROUTE_SEARCH_SERVICES,
    parent: 'search-services',
    path: 'documents',
    fullpath: '/search-services/documents',
  },
  search_services_certificates: {
    permission: PermissionsLibrary.ROUTE_SEARCH_SERVICES,
    parent: 'search-services',
    path: 'certificates',
    fullpath: '/search-services/certificates',
  },
  search_services_transactions: {
    permission: PermissionsLibrary.ROUTE_SEARCH_SERVICES,
    parent: 'search-services',
    path: 'transactions',
    fullpath: '/search-services/transactions',
  },
  search_services_books: {
    permission: PermissionsLibrary.ROUTE_SEARCH_SERVICES,
    parent: 'search-services',
    path: 'books',
    fullpath: '/search-services/books',
  },

  // #endregion

  // #region historic_registration-routing module

  historic_registration_by_book: {
    permission: PermissionsLibrary.ROUTE_HISTORIC_REGISTRATION,
    parent: 'historic-registration',
    path: 'by-book',
    fullpath: '/historic-registration/by-book',
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
