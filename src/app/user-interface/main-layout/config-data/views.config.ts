/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { View } from '../common-models/common';


export const RequestsViews: View[] = [
  {
    name: 'Requests.Pending',
    title: 'Trámites en elaboración',
    menuTitle: 'En elaboración',
    url: '/electronic-filing/requests/pending'
  },
  {
    name: 'Requests.OnSign',
    title: 'Trámites pendientes de firma',
    menuTitle: 'En firma',
    url: '/electronic-filing/requests/on-sign'
  },
  {
    name: 'Requests.Finished',
    title: 'Trámites finalizados',
    menuTitle: 'Finalizados',
    url: '/electronic-filing/requests/finished'
  },
  {
    name: 'Requests.Rejected',
    title: 'Trámites devueltos',
    menuTitle: 'Devueltos',
    url: '/electronic-filing/requests/rejected'
  },
  {
    name: 'Requests.OnPayment',
    title: 'Trámites por ingresar',
    menuTitle: 'Por ingresar',
    url: '/electronic-filing/requests/on-payment'
  },
  {
    name: 'Requests.All',
    title: 'Todos los trámites',
    menuTitle: 'Todos',
    url: '/electronic-filing/requests/all'
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
