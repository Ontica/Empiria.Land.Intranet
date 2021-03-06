/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Validate } from '@app/core';

import {
  EmptyFeeConcept, EmptyProvidedService, FeeConcept,
  ProvidedService, ProvidedServiceType, RequestedServiceFields
} from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';
import { FormatLibrary } from '@app/shared/utils';


type RequestedServiceFormControls = 'serviceType' | 'service' | 'feeConcept' | 'taxableBase' |
  'quantity' | 'unit' | 'notes';


export enum RequestedServiceEditorEventType {
  SUBMIT_REQUESTED_SERVICE_CLICKED = 'RequestedServiceEditorComponent.Event.SubmitRequestedServiceClicked',
}


@Component({
  selector: 'emp-land-requested-service-editor',
  templateUrl: './requested-service-editor.component.html',
  styles: [
  ]
})
export class RequestedServiceEditorComponent implements OnInit {

  @Input() providedServiceTypeList: ProvidedServiceType[] = [];

  @Output() requestedServiceEditorEvent = new EventEmitter<EventInfo>();

  providedServiceList: ProvidedService[] = [];
  serviceSelected: ProvidedService = EmptyProvidedService;
  feeConceptSelected: FeeConcept = EmptyFeeConcept;

  form: FormGroup = new FormGroup({
    serviceType: new FormControl('', Validators.required),
    service: new FormControl('', Validators.required),
    feeConcept: new FormControl('', Validators.required),
    taxableBase: new FormControl('', Validate.isPositive),
    quantity: new FormControl('', [Validators.required, Validators.min(1)]),
    unit: new FormControl({ value: '', disabled: true }),
    notes: new FormControl('')
  });

  constructor(private messageBox: MessageBoxService) { }

  ngOnInit(): void {
    this.resetForm();
  }

  getFormControl(name: RequestedServiceFormControls) {
    return this.form.get(name);
  }

  submit() {
    if (!this.form.valid) {
      this.invalidateForm(this.form);
      return;
    }

    const message = `<strong>${this.serviceSelected.name}</strong> <br>
      ${!this.feeConceptSelected.requiresTaxableBase ? '' : `
      <pre>Base gravable:     ${this.getFormControl('taxableBase').value}</pre>`}
      <pre>Cantidad:                ${this.getFormControl('quantity').value}</pre>
      <pre>Fundamento:         ${this.feeConceptSelected.legalBasis}</pre>
      <br>¿Agrego este concepto al trámite?`;

    this.messageBox.confirm(message, 'Agregar un concepto al trámite')
      .toPromise()
      .then(x => {
        if (x) {
          this.sendEvent(RequestedServiceEditorEventType.SUBMIT_REQUESTED_SERVICE_CLICKED,
            this.getFormData());
        }
      });
  }

  serviceTypeChange(change: ProvidedServiceType) {
    this.providedServiceList = change.services;
    this.getFormControl('service').reset();
    this.serviceChange(EmptyProvidedService);
  }

  serviceChange(change: ProvidedService) {
    this.serviceSelected = change;
    this.getFormControl('feeConcept').reset();
    this.getFormControl('unit').reset(this.serviceSelected.unit.name);
    this.feeConceptChange(EmptyFeeConcept);
  }

  feeConceptChange(change: FeeConcept) {
    this.feeConceptSelected = change;
    this.resetValidatorsTaxableBase();
  }

  resetValidatorsTaxableBase() {
    this.getFormControl('taxableBase').reset();

    this.getFormControl('taxableBase').clearValidators();

    if (this.feeConceptSelected.requiresTaxableBase) {
      this.getFormControl('taxableBase').setValidators([Validators.required, Validate.isPositive]);
    }

    this.getFormControl('taxableBase').updateValueAndValidity();
  }

  private getFormData(): any {
    Assertion.assert(this.form.valid,
      'Programming error: form must be validated before command execution.');

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

  private sendEvent(eventType: RequestedServiceEditorEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.requestedServiceEditorEvent.emit(event);
  }

  private resetForm() {
    this.form.reset();
  }

  private invalidateForm(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

}
