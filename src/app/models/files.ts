/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { FileData, FileTypeAccepted } from "@app/shared/form-controls/file-control/file-control-data";

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
  Text = 'Text',
}


export interface MediaFile {
  uid: string;
  type: FileType;
  name: string;
  content: string;
  url: string;
  size: number;
}


export function mapToFileDataFromMediaFile(data: MediaFile): FileData {
  const fileData: FileData = {
    uid: data.uid,
    file: null,
    name: data.name,
    size: data.size ?? 0,
    type: getFileTypeFromMediaType(data.type),
    url: data.url,
  };

  return fileData;
}


export function getFileTypeFromMediaType(fileType: FileType) {
  switch (fileType) {
    case FileType.PDF:
      return FileTypeAccepted.pdf;
    case FileType.Csv:
      return FileTypeAccepted.csv;
    case FileType.Excel:
      return FileTypeAccepted.excel;
    default:
      return FileTypeAccepted.all;
  }
}
