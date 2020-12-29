/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { View } from '../common-models/common';


export const TransactionViews: View[] = [
  {
    name: 'Transactions.Pending',
    title: 'Trámites en elaboración',
    menuTitle: 'En elaboración',
    url: '/transactions/pending'
  },
  {
    name: 'Transactions.OnSign',
    title: 'Trámites pendientes de firma',
    menuTitle: 'En firma',
    url: '/transactions/on-sign'
  },
  {
    name: 'Transactions.Finished',
    title: 'Trámites finalizados',
    menuTitle: 'Finalizados',
    url: '/transactions/finished'
  },
  {
    name: 'Transactions.Rejected',
    title: 'Trámites devueltos',
    menuTitle: 'Devueltos',
    url: '/transactions/rejected'
  },
  {
    name: 'Transactions.OnPayment',
    title: 'Trámites por ingresar',
    menuTitle: 'Por ingresar',
    url: '/transactions/on-payment'
  },
  {
    name: 'Transactions.All',
    title: 'Todos los trámites',
    menuTitle: 'Todos',
    url: '/transactions/all'
  }
];


export const SearchViews: View[] = [
  {
    name: 'Search.All',
    title: 'Búsqueda general',
    menuTitle: 'Todo',
    url: '/search-services/all'
  },
  {
    name: 'Search.RealEstate',
    title: 'Índice de propiedades',
    menuTitle: 'Propiedades',
    url: '/search-services/real-estate'
  },
  {
    name: 'Search.Persons',
    title: 'Índice de personas',
    menuTitle: 'Personas',
    url: '/search-services/persons'
  },
  {
    name: 'Search.Associations',
    title: 'Asociaciones y sociedades civiles',
    menuTitle: 'Asociaciones',
    url: '/search-services/associations'
  },
  {
    name: 'Search.Documents',
    title: 'Documentos',
    url: '/search-services/documents'
  },
  {
    name: 'Search.Certificates',
    title: 'Certificados',
    url: '/search-services/certificates'
  },
  {
    name: 'Search.Transactions',
    title: 'Trámites',
    url: '/search-services/transactions'
  },
  {
    name: 'Search.Books',
    title: 'Libros',
    url: '/search-services/books'
  }
];
