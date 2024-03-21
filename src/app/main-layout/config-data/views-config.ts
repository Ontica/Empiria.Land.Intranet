/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ROUTES } from './routes-config';

import { View } from '../common-models/common';


export const TransactionViews: View[] = [
  {
    name: 'Transactions.MyInbox',
    title: 'Mis trámites pendientes',
    menuTitle: 'Mis trámites pendientes',
    url: ROUTES.transactions_my_inbox.fullpath,
    permission: ROUTES.transactions_my_inbox.permission,
  },
  {
    name: 'Transactions.ESign',
    title: 'Firma electrónica',
    menuTitle: 'Firma electrónica',
    url: ROUTES.transactions_e_sign.fullpath,
    permission: ROUTES.transactions_e_sign.permission,
  },
  {
    name: 'Transactions.ControlDesk',
    title: 'Mesa de control',
    menuTitle: 'Mesa de control',
    url: ROUTES.transactions_control_desk.fullpath,
    permission: ROUTES.transactions_control_desk.permission,
  },
  {
    name: 'Transactions.Finished',
    title: 'Trámites terminados',
    menuTitle: 'Terminados',
    url: ROUTES.transactions_finished.fullpath,
    permission: ROUTES.transactions_finished.permission,
  },
  {
    name: 'Transactions.Pending',
    title: 'Trámites por ingresar',
    menuTitle: 'Por ingresar',
    url: ROUTES.transactions_pending.fullpath,
    permission: ROUTES.transactions_pending.permission,
  },
  {
    name: 'Transactions.All',
    title: 'Todos los trámites',
    menuTitle: 'Todos',
    url: ROUTES.transactions_all.fullpath,
    permission: ROUTES.transactions_all.permission,
  }
];


export const HistoricRegistrationViews: View[] = [
  {
    name: 'HistoricRegistration.ByBook',
    title: 'Registro por volumen',
    menuTitle: 'Registro por volumen',
    url: ROUTES.historic_registration_by_book.fullpath,
    permission: ROUTES.historic_registration_by_book.permission,
  },
  {
    name: 'HistoricRegistration.BookEntry',
    title: 'Inscripción',
    menuTitle: 'Inscripción',
    url: ROUTES.historic_registration_book_entry.fullpath,
    permission: ROUTES.historic_registration_book_entry.permission,
    hidden: true,
  },
];


export const SystemManagementViews: View[] = [
  {
    name: 'SystemManagementViews.ControlPanel',
    title: 'Panel de control',
    url: ROUTES.administration_control_panel.fullpath,
    permission: ROUTES.administration_control_panel.permission,
  },
  {
    name: 'SystemManagementViews.AccessControl',
    title: 'Control de accesos',
    url: ROUTES.administration_access_control.fullpath,
    permission: ROUTES.administration_access_control.permission,
  },
];


export const UnauthorizedViews: View[] = [
  {
    name: 'Unauthorized',
    title: '',
    url: ROUTES.unauthorized.fullpath,
  },
];
