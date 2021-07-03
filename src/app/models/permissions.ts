/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export enum PermissionsLibrary {
  ROUTE_TRANSACTIONS = 'route-transactions',
  ROUTE_SEARCH_SERVICES = 'route-search-services',
  ROUTE_HISTORIC_REGISTRATION = 'route-historic-registration',
  MENU_TRANSACTIONS = 'menu-transactions',
  MENU_SEARCH_SERVICES = 'menu-search-services',
  MENU_HISTORIC_REGISTRATION = 'menu-historic-registration',
  FEATURE_TRANSACTIONS_ADD = 'feature-transactions-add',
}


export const RoutesLibrary = {

  // #region app-routing module

  transactions: {
    permission: PermissionsLibrary.ROUTE_TRANSACTIONS,
    path: 'transactions'
  },
  search_services: {
    permission: PermissionsLibrary.ROUTE_SEARCH_SERVICES,
    path: 'search-services',
  },
  historic_registration: {
    permission: PermissionsLibrary.ROUTE_HISTORIC_REGISTRATION,
    path: 'historic-registration',
  },
  security: {
    path: 'security',
  },

  // #endregion

  // #region transactions-routing module

  transactions_my_inbox: {
    permission: PermissionsLibrary.ROUTE_TRANSACTIONS,
    path: 'my-inbox',
    parent: 'transactions',
  },
  transactions_control_desk: {
    permission: PermissionsLibrary.ROUTE_TRANSACTIONS,
    path: 'control-desk',
    parent: 'transactions',
  },
  transactions_finished: {
    permission: PermissionsLibrary.ROUTE_TRANSACTIONS,
    path: 'finished',
    parent: 'transactions',
  },
  transactions_pending: {
    permission: PermissionsLibrary.ROUTE_TRANSACTIONS,
    path: 'pending',
    parent: 'transactions',
  },
  transactions_all: {
    permission: PermissionsLibrary.ROUTE_TRANSACTIONS,
    path: 'all',
    parent: 'transactions',
  },

  // #endregion

  // #region search-services-routing module

  search_services_all: {
    permission: PermissionsLibrary.ROUTE_SEARCH_SERVICES,
    path: 'all',
    parent: 'search-services',
  },
  search_services_real_estate: {
    permission: PermissionsLibrary.ROUTE_SEARCH_SERVICES,
    path: 'real-estate',
    parent: 'search-services',
  },
  search_services_associations: {
    permission: PermissionsLibrary.ROUTE_SEARCH_SERVICES,
    path: 'associations',
    parent: 'search-services',
  },
  search_services_persons: {
    permission: PermissionsLibrary.ROUTE_SEARCH_SERVICES,
    path: 'persons',
    parent: 'search-services',
  },
  search_services_documents: {
    permission: PermissionsLibrary.ROUTE_SEARCH_SERVICES,
    path: 'documents',
    parent: 'search-services',
  },
  search_services_certificates: {
    permission: PermissionsLibrary.ROUTE_SEARCH_SERVICES,
    path: 'certificates',
    parent: 'search-services',
  },
  search_services_transactions: {
    permission: PermissionsLibrary.ROUTE_SEARCH_SERVICES,
    path: 'transactions',
    parent: 'search-services',
  },
  search_services_books: {
    permission: PermissionsLibrary.ROUTE_SEARCH_SERVICES,
    path: 'books',
    parent: 'search-services',
  },

  // #endregion

  // #region historic_registration-routing module

  historic_registration_by_book: {
    permission: PermissionsLibrary.ROUTE_HISTORIC_REGISTRATION,
    path: 'by-book',
    parent: 'historic-registration',
  },

  // #endregion

  // #region security-routing module

  security_login: {
    path: 'login',
    parent: 'security',
  },

  // #endregion

};
