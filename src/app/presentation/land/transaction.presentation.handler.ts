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

import { ArrayLibrary } from '@app/shared/utils';

import { TransactionQuery, TransactionDescriptor, EmptyTransaction, EmptyTransactionQuery,
         mapTransactionDescriptorFromTransaction } from '@app/models';

import { EmptyFileViewerData } from '@app/shared/form-controls/file-control/file-control-data';


export enum ActionType {
  SET_LIST_FILTER = 'Land.Transactions.Action.SetListFilter',
  SELECT_TRANSACTION = 'Land.Transactions.Action.SelectTransaction',
  UNSELECT_TRANSACTION = 'Land.Transactions.Action.UnselectTransaction',
  SELECT_FILE_LIST = 'Land.Transactions.Action.SelectFileList',
  UNSELECT_FILE_LIST = 'Land.Transactions.Action.UnselectFileList',
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
  UPLOAD_TRANSACTION_FILE = 'Land.Transactions.Command.UploadTransactionFile',
  REMOVE_TRANSACTION_FILE = 'Land.Transactions.Command.RemoveTransactionFile',
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
  UPLOAD_TRANSACTION_FILE = CommandType.UPLOAD_TRANSACTION_FILE,
  REMOVE_TRANSACTION_FILE = CommandType.REMOVE_TRANSACTION_FILE,
  EXECUTE_WORKFLOW_COMMAND = CommandType.EXECUTE_WORKFLOW_COMMAND,
}


export enum SelectorType {
  LIST_FILTER = 'Land.Transactions.Selectors.TransactionListFilter',
  SELECTED_TRANSACTION = 'Land.Transactions.Selectors.SelectedTransaction',
  TRANSACTION_LIST = 'Land.Transactions.Selectors.TransactionList',
  TRANSACTION_TYPE_LIST = 'Land.Transactions.Selectors.TransactionTypeList',
  AGENCY_LIST = 'Land.Transactions.Selectors.AgencyList',
  PROVIDED_SERVICE_LIST = 'Land.Transactions.Selectors.ProvidedServiceList',
  SELECTED_FILE_LIST = 'Land.Transactions.Selectors.SelectedFileList',
  SELECTED_WORKFLOW_HISTORY = 'Land.Transactions.Selectors.WorkflowHistory',
  APPLICABLE_COMMANDS = 'Land.Transactions.Selectors.ApplicableCommands',
  ALL_AVAILABLE_COMMANDS = 'Land.Transactions.Selectors.AllAvailableCommands',
  TRANSACTION_FROM_COMMAND_EXECUTION = 'Land.Transactions.Selectors.TransactionFromCommandExecution',
}


const initialState: StateValues = [
  { key: SelectorType.LIST_FILTER, value: EmptyTransactionQuery },
  { key: SelectorType.SELECTED_TRANSACTION, value: EmptyTransaction },
  { key: SelectorType.TRANSACTION_LIST, value: [] },
  { key: SelectorType.TRANSACTION_TYPE_LIST, value: [] },
  { key: SelectorType.AGENCY_LIST, value: [] },
  { key: SelectorType.PROVIDED_SERVICE_LIST, value: [] },
  { key: SelectorType.SELECTED_FILE_LIST, value: EmptyFileViewerData },
  { key: SelectorType.SELECTED_WORKFLOW_HISTORY, value: [] },
];


@Injectable()
export class TransactionPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: TransactionDataService) {
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

      case SelectorType.APPLICABLE_COMMANDS:
        return toObservable<U>(this.data.getApplicableCommands(params));

      case SelectorType.ALL_AVAILABLE_COMMANDS:
        return toObservable<U>(this.data.getAllAvailableCommandTypes());

      case SelectorType.TRANSACTION_FROM_COMMAND_EXECUTION:
        return toObservable<U>(this.data.searchAndAssertCommandExecution(params));

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

        transactionList = this.getValue<TransactionDescriptor[]>(SelectorType.TRANSACTION_LIST);

        const transactionToInsert = mapTransactionDescriptorFromTransaction(params.result);

        const transactionListNew = ArrayLibrary.insertItemTop(transactionList, transactionToInsert, 'uid');

        this.setValue(SelectorType.TRANSACTION_LIST, transactionListNew);

        this.setValue(SelectorType.SELECTED_TRANSACTION, params.result);

        this.getWorkflowHistoryForTransaction(params.result.uid);

        return;

      case EffectType.DELETE_TRANSACTION:

        transactionList = this.getValue<TransactionDescriptor[]>(SelectorType.TRANSACTION_LIST);

        this.setValue(SelectorType.TRANSACTION_LIST,
          transactionList.filter(x => x.uid !== params.payload.transactionUID));

        this.dispatch(ActionType.UNSELECT_TRANSACTION);

        return;


      case EffectType.SET_LIST_FILTER:
      case EffectType.EXECUTE_WORKFLOW_COMMAND:

        let filter = this.getValue<TransactionQuery>(SelectorType.LIST_FILTER);

        if (effectType === EffectType.EXECUTE_WORKFLOW_COMMAND) {
          filter = { ...filter, ...{ keywords: '' } };

          this.setValue(SelectorType.LIST_FILTER, filter);
        }

        transactionList = this.data.getTransactionList(filter);

        this.setValue(SelectorType.TRANSACTION_LIST, transactionList);

        this.dispatch(ActionType.UNSELECT_TRANSACTION);

        return;


      case EffectType.UPLOAD_TRANSACTION_FILE:
      case EffectType.REMOVE_TRANSACTION_FILE:
        this.dispatch(ActionType.UNSELECT_FILE_LIST);
        this.dispatch(ActionType.SELECT_TRANSACTION, {transactionUID: params.payload.transactionUID});

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

      case CommandType.UPLOAD_TRANSACTION_FILE:
        return toPromise<T>(
          this.data.uploadTransactionMediaFile(command.payload.transactionUID,
            command.payload.file,
            command.payload.mediaContent)
        );

      case CommandType.REMOVE_TRANSACTION_FILE:
        return toPromise<T>(
          this.data.removeTransactionMediaFile(command.payload.transactionUID,
            command.payload.mediaFileUID)
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
        Assertion.assertValue(params.transactionUID, 'params.transactionUID');

        const transaction = this.data.getTransaction(params.transactionUID)
          .pipe(tap(t => this.getWorkflowHistoryForTransaction(t.uid)));

        this.setValue(SelectorType.SELECTED_TRANSACTION, transaction);

        return;

      case ActionType.UNSELECT_TRANSACTION:
        this.setValue(SelectorType.SELECTED_TRANSACTION, EmptyTransaction);

        this.setValue(SelectorType.SELECTED_FILE_LIST, EmptyFileViewerData);

        this.setValue(SelectorType.SELECTED_WORKFLOW_HISTORY, []);

        return;

      case ActionType.SET_LIST_FILTER:
        Assertion.assertValue(params.filter, 'payload.filter');

        const filter = params?.filter || this.getValue(SelectorType.LIST_FILTER);

        this.setValue(SelectorType.LIST_FILTER, filter);

        return;

      case ActionType.SELECT_FILE_LIST:
        Assertion.assertValue(params.fileViewerData, 'payload.fileViewerData');
        Assertion.assertValue(params.fileViewerData.fileList, 'payload.fileViewerData.fileList');

        this.setValue(SelectorType.SELECTED_FILE_LIST, params.fileViewerData);

        return;

      case ActionType.UNSELECT_FILE_LIST:
        this.setValue(SelectorType.SELECTED_FILE_LIST, EmptyFileViewerData);

        return;

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }


  private getWorkflowHistoryForTransaction(transactionUID: string) {
    const workflowHistory = this.data.getWorkflowHistoryForTransaction(transactionUID);

    this.setValue(SelectorType.SELECTED_WORKFLOW_HISTORY, workflowHistory);
  }

}
