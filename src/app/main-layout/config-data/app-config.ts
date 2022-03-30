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
    hint: 'Secretaría de Finanzas',
    organization: 'Gobierno del Estado de Zacatecas',
    description: '',
  },
  layout: {
    enablePermissions: true,
    displayNavbarHeader: true,
    displayMenuUser: false,
    displayChangeLanguage: false,
    displayChangePassword: false,
    displayAsideLeft: false,
    displaySubMenu: true,
    displayHeader: false,
    displayFooter: false,
  }
};
