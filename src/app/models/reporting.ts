/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableEntry, DataTableQuery } from './_data-table';


export const DefaultEndDate: DateString = '2049-12-31';


export enum ReportGroup {
  Reportes = 'Reportes',
}


export enum ReportController {
  Reporting = 'Reporting',
}


export interface ReportType<T> extends Identifiable {
  uid: string;
  name: string;
  group: ReportGroup;
  controller: ReportController;
  show?: T;
  accountsCharts?: string[];
  outputType?: Identifiable[];
  exportTo?: ExportationType[];
}


export interface FileReport {
  url: string;
  type?: FileType;
}


export enum FileType {
  Excel = 'Excel',
  Csv = 'Csv',
  Pdf = 'Pdf',
  Xml = 'Xml',
  HTML = 'HTML',
}


export interface ExportationType extends Identifiable {
  uid: string;
  name: string;
  fileType: FileType;
  dataset?: string;
  startDate?: DateString;
  endDate?: DateString;
}


export interface ReportTypeFlags {

}


export interface ReportQuery extends DataTableQuery {
  reportType?: string;
  fromDate?: DateString;
  toDate?: DateString;
  exportTo?: string;
}


export interface ReportData extends DataTable {
  query: ReportQuery;
  columns: DataTableColumn[];
  entries: ReportEntry[];
}


export interface ReportEntry extends DataTableEntry {
  uid: string;
}


export interface DateRange {
  fromDate: DateString;
  toDate: DateString;
}


export const EmptyDateRange: DateRange = {
  fromDate: '',
  toDate: '',
};


export const DefaultExportationType: ExportationType = {
  uid: FileType.Excel,
  name: FileType.Excel,
  fileType: FileType.Excel,
};


export const EmptyReportTypeFlags: ReportTypeFlags = {

};


export const EmptyReportType: ReportType<ReportTypeFlags> = {
  uid: '',
  name: '',
  group: null,
  controller: null,
};


export const EmptyReportQuery: ReportQuery = {
  reportType: '',
};


export const EmptyReportData: ReportData = {
  query: EmptyReportQuery,
  columns: [],
  entries: [],
};


import { FileData, FileTypeAccepted } from "@app/shared/form-controls/file-control/file-control-data";


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
    case FileType.Pdf:
      return FileTypeAccepted.pdf;
    case FileType.Csv:
      return FileTypeAccepted.csv;
    case FileType.Excel:
      return FileTypeAccepted.excel;
    default:
      return FileTypeAccepted.all;
  }
}
