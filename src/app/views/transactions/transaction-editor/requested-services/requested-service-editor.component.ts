import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Assertion, EventInfo } from '@app/core';
import { EmptyFeeConcept, EmptyProvidedService, FeeConcept, ProvidedService, ProvidedServiceType } from '@app/models';
import { MessageBoxService } from '@app/shared/containers/message-box';

type RequestedServiceFormControls = 'providedServiceType' | 'providedService' | 'feeConcept' | 'taxableBase' |
                                    'quantity' | 'unit' | 'notes';

export enum RequestedServiceEditortEventType {
  SUBMIT_REQUESTED_SERVICE_CLICKED  = 'TransactionListComponent.Event.SubmitRequestedServiceClicked',
}

@Component({
  selector: 'emp-land-requested-service-editor',
  templateUrl: './requested-service-editor.component.html',
  styles: [
  ]
})
export class RequestedServiceEditorComponent implements OnInit {

  @Input() providedServiceTypeList: ProvidedServiceType[] = [];

  @Output() requestedServiceEditortEvent = new EventEmitter<EventInfo>();

  providedServiceList: ProvidedService[] = [];
  providedServiceSelected: ProvidedService = EmptyProvidedService;
  feeConceptSelected: FeeConcept = EmptyFeeConcept;

  submitted = false;

  form: FormGroup = new FormGroup({
    providedServiceType: new FormControl('', Validators.required),
    providedService: new FormControl('', Validators.required),
    feeConcept: new FormControl('', Validators.required),
    taxableBase: new FormControl(''),
    quantity: new FormControl('', Validators.required),
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

  submit(){
    if (this.submitted || !this.form.valid) {
      this.invalidateForm(this.form);
      return;
    }

    const message = `${'Nombre del Concepto'} <br>
      <pre>Base gravable:     ${this.getFormControl('taxableBase').value}</pre>
      <pre>Cantidad:                ${this.getFormControl('quantity').value}</pre>
      <pre>Fundamento:         ${this.getFormControl('feeConcept').value}</pre>
      <br>¿Agrego este concepto al trámite?`;

    this.messageBox.confirm(message, 'Agregar un concepto al trámite')
      .toPromise()
      .then(x => {
        if (x) {
          this.submitted = true;
          this.sendEvent(RequestedServiceEditortEventType.SUBMIT_REQUESTED_SERVICE_CLICKED,
                         this.getFormData());
        }
      });
  }

  providedServiceTypeChange(change: ProvidedServiceType) {
    this.providedServiceList = change.services;
    this.getFormControl('providedService').reset();
    this.providedServiceChange(EmptyProvidedService);
  }

  providedServiceChange(change: ProvidedService) {
    this.providedServiceSelected = change;
    this.getFormControl('feeConcept').reset();
    this.getFormControl('unit').reset(this.providedServiceSelected.unit.name);
    this.feeConceptChange(EmptyFeeConcept);
  }

  feeConceptChange(change: FeeConcept) {
    this.feeConceptSelected = change;
    this.getFormControl('taxableBase').reset();
    this.resetValidatorsTaxableBase();
  }

  resetValidatorsTaxableBase(){
    this.getFormControl('taxableBase').clearValidators();

    if (this.feeConceptSelected.requiresTaxableBase) {
      this.getFormControl('taxableBase').setValidators([Validators.required]);
    }

    this.getFormControl('taxableBase').updateValueAndValidity();
  }

  private getFormData(): any {
    Assertion.assert(this.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data = {
      providedServiceType: formModel.providedServiceType,
      providedService: formModel.providedService,
      feeConcept: formModel.feeConcept,
      taxableBase: formModel.taxableBase,
      quantity: formModel.quantity,
      unit: formModel.unit,
      notes: formModel.notes
    };

    return data;
  }

  private sendEvent(eventType: RequestedServiceEditortEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.requestedServiceEditortEvent.emit(event);
  }

  private resetForm() {
    this.form.reset();
    this.submitted = false;
  }

  private invalidateForm(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

}
