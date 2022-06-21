/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

export interface FileReport {
  url: string;
  type?: FileType;
}


export enum FileType {
  Excel = 'Excel',
  Csv = 'Csv',
  PDF = 'PDF',
  Xml = 'Xml',
  HTML = 'HTML',
}
