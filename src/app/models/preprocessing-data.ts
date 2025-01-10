/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { EmptyInstrument, Instrument } from './instrument';

import { MediaFile } from './media-file';


export interface PreprocessingData {
  instrument: Instrument;
  antecedent: any;
  antecedentRecordingActs: any;
  media: MediaFile[];
  actions: PreprocessingActions;
}


export interface PreprocessingActions {
  can: {
    editInstrument?: boolean;
    uploadInstrumentFiles?: boolean;
    setAntecedent?: boolean;
    createAntecedent?: boolean;
    editAntecedentRecordingActs?: boolean;
  };
  show: {
    instrument?: boolean;
    instrumentFiles?: boolean;
    antecedent?: boolean;
    antecedentRecordingActs?: boolean;
  };
}


export const EmptyPreprocessingDataAction: PreprocessingActions = {
  can: {
    editInstrument: false,
    uploadInstrumentFiles: false,
    setAntecedent: false,
    createAntecedent: false,
    editAntecedentRecordingActs: false,
  },
  show: {
    instrument: false,
    instrumentFiles: false,
    antecedent: false,
    antecedentRecordingActs: false,
  }
};


export const EmptyPreprocessingData: PreprocessingData = {
  instrument: EmptyInstrument,
  antecedent: {},
  antecedentRecordingActs: {},
  media: [],
  actions: EmptyPreprocessingDataAction,
};
