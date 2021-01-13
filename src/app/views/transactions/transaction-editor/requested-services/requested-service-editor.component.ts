import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Assertion, EventInfo, Identifiable } from '@app/core';
import { MessageBoxService } from '@app/shared/containers/message-box';

type requestedServiceFormControls = 'type' | 'concepto' | 'fundamento' | 'baseGravable' | 'moneda' |
                                    'cantidad' | 'unidadMedida' | 'observaciones';

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

  @Input() RequestedServiceTypes: Identifiable[] = [];

  @Output() requestedServiceEditortEvent = new EventEmitter<EventInfo>();

  submitted = false;

  form: FormGroup = new FormGroup({
    type: new FormControl(''),
    concepto: new FormControl(''),
    baseGravable: new FormControl('', Validators.required),
    moneda: new FormControl(''),
    cantidad: new FormControl('', Validators.required),
    unidadMedida: new FormControl(''),
    fundamento: new FormControl(''),
    observaciones: new FormControl('')
  });

  constructor(private messageBox: MessageBoxService) { }

  ngOnInit(): void {
    this.form.reset();
    this.submitted = false;
  }

  getFormControl(name: requestedServiceFormControls) {
    return this.form.get(name);
  }

  submit(){
    if (this.submitted || !this.form.valid) {
      this.invalidateForm(this.form);
      return;
    }

    const message = `${'Nombre del Concepto'} <br>
      <pre>Base gravable:     ${this.getFormControl('baseGravable').value}</pre>
      <pre>Cantidad:                ${this.getFormControl('cantidad').value}</pre>
      <pre>Fundamento:         ${this.getFormControl('fundamento').value}</pre>
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

  private getFormData(): any {
    Assertion.assert(this.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.form.value;

    const data = {
      type: formModel.type,
      concepto: formModel.concepto,
      baseGravable: formModel.baseGravable,
      moneda: formModel.moneda,
      cantidad: formModel.cantidad,
      unidadMedida: formModel.unidadMedida,
      fundamento: formModel.fundamento,
      observaciones: formModel.observaciones
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

  private invalidateForm(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

}
