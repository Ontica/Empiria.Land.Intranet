/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Validate } from '@app/core';

import { EmptyFeeConcept, EmptyProvidedService, FeeConcept, ProvidedService, ProvidedServiceType,
         RequestedServiceFields } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FormatLibrary, FormHandler, sendEvent } from '@app/shared/utils';

export enum RequestedServiceEditorEventType {
  SUBMIT_REQUESTED_SERVICE_CLICKED = 'RequestedServiceEditorComponent.Event.SubmitRequestedServiceClicked',
}

enum RequestedServiceEditorFormControls {
  serviceType = 'serviceType',
  service = 'service',
  feeConcept = 'feeConcept',
  taxableBase = 'taxableBase',
  quantity = 'quantity',
  unit = 'unit',
  notes = 'notes',
}

@Component({
  selector: 'emp-land-requested-service-editor',
  templateUrl: './requested-service-editor.component.html',
})
export class RequestedServiceEditorComponent implements OnInit {

  @Input() providedServiceTypeList: ProvidedServiceType[] = [];

  @Output() requestedServiceEditorEvent = new EventEmitter<EventInfo>();

  providedServiceList: ProvidedService[] = [];

  serviceSelected: ProvidedService = EmptyProvidedService;

  feeConceptSelected: FeeConcept = EmptyFeeConcept;

  formHandler: FormHandler;

  controls = RequestedServiceEditorFormControls;


  constructor(private messageBox: MessageBoxService) {
    this.initForm();
  }


  ngOnInit(): void {
    this.formHandler.form.reset();
  }


  submit() {
    if (!this.formHandler.validateReadyForSubmit()) {
      return;
    }

    const message = `<strong>${this.serviceSelected.name}</strong> <br>
      ${!this.feeConceptSelected.requiresTaxableBase ? '' : `
      <pre>Base gravable:     ${this.formHandler.getControl(this.controls.taxableBase).value}</pre>`}
      <pre>Cantidad:                ${this.formHandler.getControl(this.controls.quantity).value}</pre>
      <pre>Fundamento:         ${this.feeConceptSelected.legalBasis}</pre>
      <br>¿Agrego este concepto al trámite?`;

    this.messageBox.confirm(message, 'Agregar un concepto al trámite')
      .toPromise()
      .then(x => {
        if (x) {
          sendEvent(this.requestedServiceEditorEvent,
            RequestedServiceEditorEventType.SUBMIT_REQUESTED_SERVICE_CLICKED, this.getFormData());
        }
      });
  }


  serviceTypeChange(change: ProvidedServiceType) {
    this.providedServiceList = change.services;
    this.formHandler.getControl(this.controls.service).reset();
    this.serviceChange(EmptyProvidedService);
  }


  serviceChange(change: ProvidedService) {
    this.serviceSelected = change;
    this.formHandler.getControl(this.controls.feeConcept).reset();
    this.formHandler.getControl(this.controls.unit).reset(this.serviceSelected.unit.name);
    this.feeConceptChange(EmptyFeeConcept);
  }


  feeConceptChange(change: FeeConcept) {
    this.feeConceptSelected = change;
    this.resetValidatorsTaxableBase();
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new UntypedFormGroup({
        serviceType: new UntypedFormControl('', Validators.required),
        service: new UntypedFormControl('', Validators.required),
        feeConcept: new UntypedFormControl('', Validators.required),
        taxableBase: new UntypedFormControl('', Validate.isPositive),
        quantity: new UntypedFormControl('', [Validators.required, Validators.min(1)]),
        unit: new UntypedFormControl({ value: '', disabled: true }),
        notes: new UntypedFormControl(''),
      })
    );
  }


  private resetValidatorsTaxableBase() {
    this.formHandler.getControl(this.controls.taxableBase).reset();

    if (this.feeConceptSelected.requiresTaxableBase) {
      this.formHandler.setControlValidators(this.controls.taxableBase,
        [Validators.required, Validate.isPositive]);
    } else {
      this.formHandler.clearControlValidators(this.controls.taxableBase);
    }
  }


  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: RequestedServiceFields = {
      serviceUID: formModel.service,
      feeConceptUID: formModel.feeConcept,
      unitUID: this.serviceSelected.unit.uid,
      taxableBase: this.feeConceptSelected.requiresTaxableBase ?
        FormatLibrary.stringToNumber(formModel.taxableBase) : 0,
      quantity: parseFloat(formModel.quantity),
      notes: formModel.notes ?? ''
    };

    return data;
  }

}
