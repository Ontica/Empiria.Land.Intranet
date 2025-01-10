/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Validate } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { FormatLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { EmptyFeeConcept, EmptyProvidedService, FeeConcept, ProvidedService, ProvidedServiceType,
         RequestedServiceFields } from '@app/models';


export enum RequestedServiceEditorEventType {
  SUBMIT_REQUESTED_SERVICE_CLICKED = 'RequestedServiceEditorComponent.Event.SubmitRequestedServiceClicked',
}

interface RequestedServiceEditorFormModel extends FormGroup<{
  serviceType: FormControl<string>;
  service: FormControl<string>;
  feeConcept: FormControl<string>;
  taxableBase: FormControl<string>;
  quantity: FormControl<string>;
  unit: FormControl<string>;
  notes: FormControl<string>;
}> {}

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

  form: RequestedServiceEditorFormModel;

  formHelper = FormHelper;


  constructor(private messageBox: MessageBoxService) {
    this.initForm();
  }


  ngOnInit(): void {
    this.form.reset();
  }


  onServiceTypeChanges(change: ProvidedServiceType) {
    this.providedServiceList = change.services;
    this.form.controls.service.reset();
    this.onServiceChanges(EmptyProvidedService);
  }


  onServiceChanges(change: ProvidedService) {
    this.serviceSelected = change;
    this.form.controls.feeConcept.reset();
    this.form.controls.unit.reset(this.serviceSelected.unit.name);
    this.onFeeConceptChanges(EmptyFeeConcept);
  }


  onFeeConceptChanges(change: FeeConcept) {
    this.feeConceptSelected = change;
    this.setValidatorsTaxableBase();
  }


  onSubmitClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {

      const message = `<strong>${this.serviceSelected.name}</strong> <br>
        <table class='confirm-data' style="margin-left: -8px;">
          ${!this.feeConceptSelected.requiresTaxableBase ? '' :
          `<tr><td class="nowrap">Base gravable: </td><td><strong>${this.form.value.taxableBase}</strong></td></tr>`}
          <tr><td>Cantidad: </td><td><strong>${this.form.value.quantity}</strong></td></tr>
          <tr><td>Fundamento: </td><td><strong>${this.feeConceptSelected.legalBasis}</strong></td></tr>
        </table>
        <br>¿Agrego este concepto al trámite?`;

      this.messageBox.confirm(message, 'Agregar un concepto al trámite')
        .firstValue()
        .then(x => {
          if (x) {
            sendEvent(this.requestedServiceEditorEvent,
              RequestedServiceEditorEventType.SUBMIT_REQUESTED_SERVICE_CLICKED, this.getFormData());
          }
        });

    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      serviceType: ['', Validators.required],
      service: ['', Validators.required],
      feeConcept: ['', Validators.required],
      taxableBase: ['', Validate.isPositive],
      quantity: ['', [Validators.required, Validators.min(1)]],
      unit: [{ value: '', disabled: true }],
      notes: [''],
    });
  }


  private setValidatorsTaxableBase() {
    this.form.controls.taxableBase.reset();

    if (this.feeConceptSelected.requiresTaxableBase) {
      this.formHelper.setControlValidators(this.form.controls.taxableBase,
        [Validators.required, Validate.isPositive]);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.taxableBase);
    }
  }


  private getFormData(): RequestedServiceFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

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
