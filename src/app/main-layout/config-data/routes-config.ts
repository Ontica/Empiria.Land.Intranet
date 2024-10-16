/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { PERMISSIONS } from "./permissions-config";


export const ROUTES = {

  // #region app-routing module

  transactions: {
    permission: PERMISSIONS.MODULE_TRANSACTIONS,
    parent: '',
    path: 'transactions',
    fullpath: '/transactions',
  },
  historic_registration: {
    permission: PERMISSIONS.MODULE_HISTORIC_REGISTRATION,
    parent: '',
    path: 'historic-registration',
    fullpath: '/historic-registration',
  },
  administration: {
    permission: PERMISSIONS.MODULE_SYSTEM_ADMINISTRATION,
    parent: '',
    path: 'administration',
    fullpath: '/administration',
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
    permission: PERMISSIONS.ROUTE_TRANSACTIONS,
    parent: 'transactions',
    path: 'my-inbox',
    fullpath: '/transactions/my-inbox',
  },
  transactions_e_sign: {
    permission: PERMISSIONS.ROUTE_E_SIGN,
    parent: 'transactions',
    path: 'e-sign',
    fullpath: '/transactions/e-sign',
  },
  transactions_control_desk: {
    permission: PERMISSIONS.ROUTE_TRANSACTIONS,
    parent: 'transactions',
    path: 'control-desk',
    fullpath: '/transactions/control-desk',
  },
  transactions_finished: {
    permission: PERMISSIONS.ROUTE_TRANSACTIONS,
    parent: 'transactions',
    path: 'finished',
    fullpath: '/transactions/finished',
  },
  transactions_pending: {
    permission: PERMISSIONS.ROUTE_TRANSACTIONS,
    parent: 'transactions',
    path: 'pending',
    fullpath: '/transactions/pending',
  },
  transactions_all: {
    permission: PERMISSIONS.ROUTE_TRANSACTIONS,
    parent: 'transactions',
    path: 'all',
    fullpath: '/transactions/all',
  },

  // #endregion

  // #region historic_registration-routing module

  historic_registration_by_book: {
    permission: PERMISSIONS.ROUTE_HISTORIC_REGISTRATION,
    parent: 'historic-registration',
    path: 'by-book',
    fullpath: '/historic-registration/by-book',
  },

  historic_registration_book_entry: {
    permission: PERMISSIONS.ROUTE_HISTORIC_REGISTRATION,
    parent: 'historic-registration',
    path: 'book-entry',
    fullpath: '/historic-registration/book-entry',
  },

  // #endregion

  // #region system-management-routing module

  administration_control_panel: {
    permission: PERMISSIONS.ROUTE_CONTROL_PANEL,
    parent: 'administration',
    path: 'control-panel',
    fullpath: '/administration/control-panel',
  },
  administration_access_control : {
    permission: PERMISSIONS.ROUTE_ACCESS_CONTROL,
    parent: 'administration',
    path: 'access-control',
    fullpath: '/administration/access-control',
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


export const DEFAULT_ROUTE = ROUTES.transactions_my_inbox;


export const DEFAULT_PATH = DEFAULT_ROUTE.fullpath;


export const LOGIN_PATH = ROUTES.security_login.fullpath;


export const OLD_LOGIN_PATH = 'security';


export const UNAUTHORIZED_PATH = ROUTES.unauthorized.path;


export const ROUTES_LIST = Object.keys(ROUTES)
                                 .map(key => ROUTES[key])
                                 .filter(x => x.parent && x.permission);
