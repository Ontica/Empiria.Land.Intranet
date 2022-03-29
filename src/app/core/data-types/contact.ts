/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from './core-types';


// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Contact extends Identifiable {

}

export const EmptyContact: Contact = {
  uid: 'Empty',
  name: ''
};
