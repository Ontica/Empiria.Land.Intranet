/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ROUTES_LIBRARY } from './permissions-config';

import { View } from '../common-models/common';


export const TransactionViews: View[] = [
  {
    name: 'Transactions.MyInbox',
    title: 'Mis trámites pendientes',
    menuTitle: 'Mis trámites pendientes',
    url: ROUTES_LIBRARY.transactions_my_inbox.fullpath,
    permission: ROUTES_LIBRARY.transactions_my_inbox.permission,
  },
  {
    name: 'Transactions.ControlDesk',
    title: 'Mesa de control',
    menuTitle: 'Mesa de control',
    url: ROUTES_LIBRARY.transactions_control_desk.fullpath,
    permission: ROUTES_LIBRARY.transactions_control_desk.permission,
  },
  {
    name: 'Transactions.Finished',
    title: 'Trámites terminados',
    menuTitle: 'Terminados',
    url: ROUTES_LIBRARY.transactions_finished.fullpath,
    permission: ROUTES_LIBRARY.transactions_finished.permission,
  },
  {
    name: 'Transactions.Pending',
    title: 'Trámites por ingresar',
    menuTitle: 'Por ingresar',
    url: ROUTES_LIBRARY.transactions_pending.fullpath,
    permission: ROUTES_LIBRARY.transactions_pending.permission,
  },
  {
    name: 'Transactions.All',
    title: 'Todos los trámites',
    menuTitle: 'Todos',
    url: ROUTES_LIBRARY.transactions_all.fullpath,
    permission: ROUTES_LIBRARY.transactions_all.permission,
  }
];


export const SearchViews: View[] = [
  {
    name: 'Search.All',
    title: 'Búsqueda general',
    menuTitle: 'Todo',
    url: ROUTES_LIBRARY.search_services_all.fullpath,
    permission: ROUTES_LIBRARY.search_services_all.permission,
  },
  {
    name: 'Search.RealEstate',
    title: 'Índice de propiedades',
    menuTitle: 'Propiedades',
    url: ROUTES_LIBRARY.search_services_real_estate.fullpath,
    permission: ROUTES_LIBRARY.search_services_real_estate.permission,
  },
  {
    name: 'Search.Persons',
    title: 'Índice de personas',
    menuTitle: 'Personas',
    url: ROUTES_LIBRARY.search_services_persons.fullpath,
    permission: ROUTES_LIBRARY.search_services_persons.permission,
  },
  {
    name: 'Search.Associations',
    title: 'Asociaciones y sociedades civiles',
    menuTitle: 'Asociaciones',
    url: ROUTES_LIBRARY.search_services_associations.fullpath,
    permission: ROUTES_LIBRARY.search_services_associations.permission,
  },
  {
    name: 'Search.Documents',
    title: 'Documentos',
    menuTitle: 'Documentos',
    url: ROUTES_LIBRARY.search_services_documents.fullpath,
    permission: ROUTES_LIBRARY.search_services_documents.permission,
  },
  {
    name: 'Search.Certificates',
    title: 'Certificados',
    menuTitle: 'Certificados',
    url: ROUTES_LIBRARY.search_services_certificates.fullpath,
    permission: ROUTES_LIBRARY.search_services_certificates.permission,
  },
  {
    name: 'Search.Transactions',
    title: 'Trámites',
    menuTitle: 'Trámites',
    url: ROUTES_LIBRARY.search_services_transactions.fullpath,
    permission: ROUTES_LIBRARY.search_services_transactions.permission,
  },
  {
    name: 'Search.Books',
    title: 'Libros',
    menuTitle: 'Libros',
    url: ROUTES_LIBRARY.search_services_books.fullpath,
    permission: ROUTES_LIBRARY.search_services_books.permission,
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
