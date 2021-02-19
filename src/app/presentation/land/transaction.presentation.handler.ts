/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { tap } from 'rxjs/operators';

import { Assertion, Command, toObservable, toPromise } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { TransactionDataService } from '@app/data-services';

import { FileDownloadService } from '@app/data-services/file-services/file-download.service';

import { ArrayLibrary } from '@app/shared/utils';

import { PreprocessingData, Transaction, TransactionFilter, TransactionShortModel,
         EmptyPreprocessingData, EmptyTransaction, EmptyTransactionFilter,
         mapTransactionShortModelFromTransaction } from '@app/models';

import { EmptyFileData } from '@app/shared/form-controls/file-control/file-control';


export enum ActionType {
  SELECT_TRANSACTION = 'Land.Transactions.Action.SelectTransaction',
  SET_LIST_FILTER = 'Land.Transactions.Action.SetListFilter',
  UNSELECT_TRANSACTION = 'Land.Transactions.Action.UnselectTransaction',
  SELECT_FILE = 'Land.Transactions.Action.SelectFile',
  UNSELECT_FILE = 'Land.Transactions.Action.UnselectFile',
}


export enum CommandType {
  CREATE_TRANSACTION = 'Land.Transactions.Command.CreateTransaction',
  UPDATE_TRANSACTION = 'Land.Transactions.Command.UpdateTransaction',
  CLONE_TRANSACTION = 'Land.Transactions.Command.CloneTransaction',
  DELETE_TRANSACTION = 'Land.Transactions.Command.DeleteTransaction',
  SUBMIT_TRANSACTION = 'Land.Transactions.Command.SubmitTransaction',
  ADD_TRANSACTION_SERVICE = 'Land.Transactions.Command.AddTransactionService',
  DELETE_TRANSACTION_SERVICE = 'Land.Transactions.Command.DeleteTransactionService',
  GENERATE_PAYMENT_ORDER = 'Land.Transactions.Command.GeneratePaymentOrder',
  CANCEL_PAYMENT_ORDER = 'Land.Transactions.Command.CancelPaymentOrder',
  SET_PAYMENT = 'Land.Transactions.Command.SetPayment',
  CANCEL_PAYMENT = 'Land.Transactions.Command.CancelPayment',
  UPLOAD_INSTRUMENT_FILE = 'Land.Transactions.Command.UploadInstrumentFile',
  REMOVE_INSTRUMENT_FILE = 'Land.Transactions.Command.RemoveInstrumentFile',
  DOWNLOAD_INSTRUMENT_FILE = 'Land.Transactions.Command.DownloadInstrumentFile',
  EXECUTE_WORKFLOW_COMMAND = 'Land.Transactions.Command.ExecuteWorkflowCommand',
}


export enum EffectType {
  SET_LIST_FILTER = ActionType.SET_LIST_FILTER,
  CREATE_TRANSACTION = CommandType.CREATE_TRANSACTION,
  UPDATE_TRANSACTION = CommandType.UPDATE_TRANSACTION,
  CLONE_TRANSACTION = CommandType.CLONE_TRANSACTION,
  DELETE_TRANSACTION = CommandType.DELETE_TRANSACTION,
  SUBMIT_TRANSACTION = CommandType.SUBMIT_TRANSACTION,
  ADD_TRANSACTION_SERVICE = CommandType.ADD_TRANSACTION_SERVICE,
  DELETE_TRANSACTION_SERVICE = CommandType.DELETE_TRANSACTION_SERVICE,
  GENERATE_PAYMENT_ORDER = CommandType.GENERATE_PAYMENT_ORDER,
  CANCEL_PAYMENT_ORDER = CommandType.CANCEL_PAYMENT_ORDER,
  SET_PAYMENT = CommandType.SET_PAYMENT,
  CANCEL_PAYMENT = CommandType.CANCEL_PAYMENT,
  UPLOAD_INSTRUMENT_FILE = CommandType.UPLOAD_INSTRUMENT_FILE,
  REMOVE_INSTRUMENT_FILE = CommandType.REMOVE_INSTRUMENT_FILE,
  EXECUTE_WORKFLOW_COMMAND = CommandType.EXECUTE_WORKFLOW_COMMAND,
}


export enum SelectorType {
  LIST_FILTER = 'Land.Transactions.Selectors.TransactionListFilter',
  SELECTED_TRANSACTION = 'Land.Transactions.Selectors.SelectedTransaction',
  TRANSACTION_LIST = 'Land.Transactions.Selectors.TransactionList',
  TRANSACTION_TYPE_LIST = 'Land.Transactions.Selectors.TransactionTypeList',
  AGENCY_LIST = 'Land.Transactions.Selectors.AgencyList',
  PROVIDED_SERVICE_LIST = 'Land.Transactions.Selectors.ProvidedServiceList',
  RECORDER_OFFICE_LIST = 'Land.Transactions.Selectors.RecorderOfficeList',
  RECORDING_SECTION_LIST = 'Land.Transactions.Selectors.RecordingSectionList',
  SELECTED_FILE = 'Land.Transactions.Selectors.SelectedFile',
  SELECTED_PREPROCESSING_DATA = 'Land.Transactions.Selectors.PreprocessingData',
  SELECTED_WORKFLOW_HISTORY = 'Land.Transactions.Selectors.WorkflowHistory',
  APPLICABLE_OPERATIONS = 'Land.Transactions.Selectors.ApplicableOperations',
}


const initialState: StateValues = [
  { key: SelectorType.LIST_FILTER, value: EmptyTransactionFilter },
  { key: SelectorType.SELECTED_TRANSACTION, value: EmptyTransaction },
  { key: SelectorType.TRANSACTION_LIST, value: [] },
  { key: SelectorType.TRANSACTION_TYPE_LIST, value: [] },
  { key: SelectorType.AGENCY_LIST, value: [] },
  { key: SelectorType.PROVIDED_SERVICE_LIST, value: [] },
  { key: SelectorType.RECORDER_OFFICE_LIST, value: [] },
  { key: SelectorType.RECORDING_SECTION_LIST, value: [] },
  { key: SelectorType.SELECTED_FILE, value: EmptyFileData },
  { key: SelectorType.SELECTED_PREPROCESSING_DATA, value: EmptyPreprocessingData },
  { key: SelectorType.SELECTED_WORKFLOW_HISTORY, value: [] },
];


@Injectable()
export class TransactionPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: TransactionDataService,
              private fileDownload: FileDownloadService) {
    super({
      initialState,
      selectors: SelectorType,
      effects: EffectType,
      commands: CommandType,
      actions: ActionType
    });
  }


  select<U>(selectorType: SelectorType, params?: any): Observable<U> {
    let provider: () => any;

    switch (selectorType) {

      case SelectorType.TRANSACTION_LIST:
        return super.select<U>(selectorType);

      case SelectorType.LIST_FILTER:
        return super.select<U>(selectorType);

      case SelectorType.TRANSACTION_TYPE_LIST:
        provider = () => this.data.getTransactionTypes();

        return super.selectFirst<U>(selectorType, provider);

      case SelectorType.AGENCY_LIST:
        provider = () => this.data.getAgencies();

        return super.selectFirst<U>(selectorType, provider);

      case SelectorType.PROVIDED_SERVICE_LIST:
        provider = () => this.data.getProvidedServices();

        return super.selectFirst<U>(selectorType, provider);

      case SelectorType.RECORDER_OFFICE_LIST:
        provider = () => this.data.getRecorderOffices();

        return super.selectFirst<U>(selectorType, provider);

      case SelectorType.RECORDING_SECTION_LIST:
        provider = () => this.data.getRecordingSections();

        return super.selectFirst<U>(selectorType, provider);

      case SelectorType.APPLICABLE_OPERATIONS:
        return toObservable<U>(this.data.getApplicableOperations(params));

      default:
        return super.select<U>(selectorType, params);

    }
  }


  applyEffects(effectType: EffectType, params?: any): void {

    let transactionList = null;

    switch (effectType) {

      case EffectType.CREATE_TRANSACTION:
      case EffectType.UPDATE_TRANSACTION:
      case EffectType.CLONE_TRANSACTION:
      case EffectType.SUBMIT_TRANSACTION:
      case EffectType.ADD_TRANSACTION_SERVICE:
      case EffectType.DELETE_TRANSACTION_SERVICE:
      case EffectType.GENERATE_PAYMENT_ORDER:
      case EffectType.CANCEL_PAYMENT_ORDER:
      case EffectType.SET_PAYMENT:
      case EffectType.CANCEL_PAYMENT:

        transactionList = this.getValue<TransactionShortModel[]>(SelectorType.TRANSACTION_LIST);

        const transactionToInsert = mapTransactionShortModelFromTransaction(params.result);

        const transactionListNew = ArrayLibrary.insertItemTop(transactionList, transactionToInsert, 'uid');

        this.setValue(SelectorType.TRANSACTION_LIST, transactionListNew);

        this.setValue(SelectorType.SELECTED_TRANSACTION, params.result);

        this.getPreprocessingDataInstrument(params.result);

        this.getWorkflowHistoryForTransaction(params.result.uid);

        return;

      case EffectType.DELETE_TRANSACTION:

        transactionList = this.getValue<TransactionShortModel[]>(SelectorType.TRANSACTION_LIST);

        this.setValue(SelectorType.TRANSACTION_LIST,
                      transactionList.filter(x => x.uid !== params.payload.transactionUID));

        this.dispatch(ActionType.UNSELECT_TRANSACTION);

        return;

      case EffectType.SET_LIST_FILTER:
      case EffectType.EXECUTE_WORKFLOW_COMMAND:

        const filter = this.getValue<TransactionFilter>(SelectorType.LIST_FILTER);

        transactionList = this.data.getTransactionList(filter);

        this.setValue(SelectorType.TRANSACTION_LIST, transactionList);

        this.dispatch(ActionType.UNSELECT_TRANSACTION);

        return;

      case EffectType.UPLOAD_INSTRUMENT_FILE:

        if (params.result.data){
          this.setPreprocessingDataInstrument(params.result.data);

          this.setValue(SelectorType.SELECTED_FILE, EmptyFileData);
        }

        return;

      case EffectType.REMOVE_INSTRUMENT_FILE:

        this.setPreprocessingDataInstrument(params.result);

        this.setValue(SelectorType.SELECTED_FILE, EmptyFileData);

        return;

      default:
        throw this.unhandledCommandOrActionType(effectType);
    }
  }


  execute<T>(command: Command): Promise<T> {

    switch (command.type as CommandType) {

      case CommandType.CREATE_TRANSACTION:
        return toPromise<T>(
          this.data.createTransaction(command.payload.transaction)
        );

      case CommandType.UPDATE_TRANSACTION:
        return toPromise<T>(
          this.data.updateTransaction(command.payload.transactionUID,
                                      command.payload.transaction)
        );

      case CommandType.CLONE_TRANSACTION:
        return toPromise<T>(
          this.data.cloneTransaction(command.payload.transactionUID)
        );

      case CommandType.DELETE_TRANSACTION:
        return toPromise<T>(
          this.data.deleteTransaction(command.payload.transactionUID)
        );

      case CommandType.SUBMIT_TRANSACTION:
        return toPromise<T>(
          this.data.submitTransaction(command.payload.transactionUID)
        );

      case CommandType.ADD_TRANSACTION_SERVICE:
        return toPromise<T>(
          this.data.addTransactionService(command.payload.transactionUID,
                                          command.payload.requestedService)
        );

      case CommandType.DELETE_TRANSACTION_SERVICE:
        return toPromise<T>(
          this.data.deleteTransactionService(command.payload.transactionUID,
                                             command.payload.requestedServiceUID)
        );

      case CommandType.GENERATE_PAYMENT_ORDER:
        return toPromise<T>(
          this.data.generatePaymentOrder(command.payload.transactionUID)
        );

      case CommandType.CANCEL_PAYMENT_ORDER:
        return toPromise<T>(
          this.data.cancelPaymentOrder(command.payload.transactionUID)
        );

      case CommandType.SET_PAYMENT:
        return toPromise<T>(
          this.data.setPayment(command.payload.transactionUID,
                               command.payload.payment)
        );

      case CommandType.CANCEL_PAYMENT:
        return toPromise<T>(
          this.data.cancelPayment(command.payload.transactionUID)
        );

      case CommandType.UPLOAD_INSTRUMENT_FILE:
        return toPromise<T>(
          this.data.uploadInstrumentFile(command.payload.instrumentUID,
                                         command.payload.file,
                                         command.payload.mediaContent,
                                         command.payload.fileName)
        );

      case CommandType.REMOVE_INSTRUMENT_FILE:
        return toPromise<T>(
          this.data.removeInstrumentFile(command.payload.instrumentUID,
                                         command.payload.mediaFileUID)
        );

      case CommandType.DOWNLOAD_INSTRUMENT_FILE:
        return toPromise<T>(
          this.fileDownload.download(command.payload.file.url, command.payload.file.name)
        );

      case CommandType.EXECUTE_WORKFLOW_COMMAND:
        return toPromise<T>(
          this.data.executeWorkflowCommand(command.payload)
        );

      default:
        throw this.unhandledCommand(command);
    }
  }


  dispatch(actionType: ActionType, params?: any): void {
    switch (actionType) {

      case ActionType.SELECT_TRANSACTION:
        Assertion.assertValue(params.transactionUID, 'payload.transactionUID');

        const transaction = this.data.getTransaction(params.transactionUID)
                              .pipe(tap( t => {
                                this.getPreprocessingDataInstrument(t);
                                this.getWorkflowHistoryForTransaction(t.uid);
                              }));

        this.setValue(SelectorType.SELECTED_TRANSACTION, transaction);

        return;

      case ActionType.UNSELECT_TRANSACTION:
        this.setValue(SelectorType.SELECTED_TRANSACTION, EmptyTransaction);

        this.setValue(SelectorType.SELECTED_FILE, EmptyFileData);

        this.setValue(SelectorType.SELECTED_PREPROCESSING_DATA, EmptyPreprocessingData);

        this.setValue(SelectorType.SELECTED_WORKFLOW_HISTORY, []);

        return;

      case ActionType.SET_LIST_FILTER:
        Assertion.assertValue(params.filter, 'payload.filter');

        const filter = params?.filter || this.getValue(SelectorType.LIST_FILTER);

        this.setValue(SelectorType.LIST_FILTER, filter);

        return;

      case ActionType.SELECT_FILE:
        Assertion.assertValue(params.file, 'payload.file');

        this.setValue(SelectorType.SELECTED_FILE, params.file);

        return;

      case ActionType.UNSELECT_FILE:
        this.setValue(SelectorType.SELECTED_FILE, EmptyFileData);

        return;

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }


  getPreprocessingDataInstrument(transaction: Transaction){
    if (transaction.actions.show.preprocessingTab){
      const preprocessingData = this.data.getTransactionPreprocessingData(transaction.uid);
      this.setValue(SelectorType.SELECTED_PREPROCESSING_DATA, preprocessingData);
    }
  }


  setPreprocessingDataInstrument(instrument){
    const preprocessingData = this.getValue<PreprocessingData>(SelectorType.SELECTED_PREPROCESSING_DATA);
    preprocessingData.instrument = instrument;
    this.setValue(SelectorType.SELECTED_PREPROCESSING_DATA, preprocessingData);
  }


  getWorkflowHistoryForTransaction(transactionUID: string){
    const workflowHistory = this.data.getWorkflowHistoryForTransaction(transactionUID);
    this.setValue(SelectorType.SELECTED_WORKFLOW_HISTORY, workflowHistory);
  }

}
