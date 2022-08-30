/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { PermissionsLibrary as Permissions, ROUTES_LIBRARY } from './permissions-config';

import { View } from '../common-models/common';


export const TransactionViews: View[] = [
  {
    name: 'Transactions.MyInbox',
    title: 'Mis trámites pendientes',
    menuTitle: 'Mis trámites pendientes',
    url: ROUTES_LIBRARY.transactions_my_inbox.fullpath,
    permission: ROUTES_LIBRARY.transactions_my_inbox.permission,
    actions: [
      {action: 'ActionChangeStatus', name:'Paquetes', permission: Permissions.FEATURE_TRANSACTIONS_ADD},
      {action: 'ActionCreate', name: 'Nuevo', permission: Permissions.FEATURE_TRANSACTIONS_ADD}
    ]
  },
  {
    name: 'Transactions.ControlDesk',
    title: 'Mesa de control',
    menuTitle: 'Mesa de control',
    url: ROUTES_LIBRARY.transactions_control_desk.fullpath,
    permission: ROUTES_LIBRARY.transactions_control_desk.permission,
    actions: [
      {action: 'ActionChangeStatus', name:'Paquetes', permission: Permissions.FEATURE_TRANSACTIONS_ADD},
      {action: 'ActionCreate', name: 'Nuevo', permission: Permissions.FEATURE_TRANSACTIONS_ADD}
    ]
  },
  {
    name: 'Transactions.Finished',
    title: 'Trámites terminados',
    menuTitle: 'Terminados',
    url: ROUTES_LIBRARY.transactions_finished.fullpath,
    permission: ROUTES_LIBRARY.transactions_finished.permission,
    actions: [
      {action: 'ActionChangeStatus', name:'Paquetes', permission: Permissions.FEATURE_TRANSACTIONS_ADD},
      {action: 'ActionCreate', name: 'Nuevo', permission: Permissions.FEATURE_TRANSACTIONS_ADD}
    ]
  },
  {
    name: 'Transactions.Pending',
    title: 'Trámites por ingresar',
    menuTitle: 'Por ingresar',
    url: ROUTES_LIBRARY.transactions_pending.fullpath,
    permission: ROUTES_LIBRARY.transactions_pending.permission,
    actions: [
      {action: 'ActionChangeStatus', name:'Paquetes', permission: Permissions.FEATURE_TRANSACTIONS_ADD},
      {action: 'ActionCreate', name: 'Nuevo', permission: Permissions.FEATURE_TRANSACTIONS_ADD}
    ]
  },
  {
    name: 'Transactions.All',
    title: 'Todos los trámites',
    menuTitle: 'Todos',
    url: ROUTES_LIBRARY.transactions_all.fullpath,
    permission: ROUTES_LIBRARY.transactions_all.permission,
    actions: [
      {action: 'ActionChangeStatus', name:'Paquetes', permission: Permissions.FEATURE_TRANSACTIONS_ADD},
      {action: 'ActionCreate', name: 'Nuevo', permission: Permissions.FEATURE_TRANSACTIONS_ADD}
    ]
  }
];


export const HistoricRegistrationViews: View[] = [
  {
    name: 'HistoricRegistration.ByBook',
    title: 'Registro por volumen',
    menuTitle: 'Registro por volumen',
    url: ROUTES_LIBRARY.historic_registration_by_book.fullpath,
    permission: ROUTES_LIBRARY.historic_registration_by_book.permission,
  },
];


export const UnauthorizedViews: View[] = [
  {
    name: 'Unauthorized',
    title: '',
    url: ROUTES_LIBRARY.unauthorized.fullpath,
  },
];
