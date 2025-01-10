/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { AppConfig } from '../common-models/common';


export const APP_CONFIG: AppConfig = {
  data: {
    name: 'Registro Público de la Propiedad',
    nameShort: 'RPP',
    hint: 'Secretaría de Finanzas',
    organization: 'Gobierno del Estado de Zacatecas',
    organizationShort: 'Zacatecas',
    description: '',
  },
  security: {
    fakeLogin: false,
    enablePermissions: true,
    encriptLocalStorageData: true,
    protectUserWork: false,
  },
  layout: {
    displayLoginRight: true,
    displayLogo: true,
    displayNavbarHeader: false,
    displayNavbarHint: false,
    displayMenuUser: false,
    displayChangeLanguage: false,
    displayChangePassword: false,
    displaySubMenu: true,
    displayHeader: false,
    displayFooter: false,
  }
};
