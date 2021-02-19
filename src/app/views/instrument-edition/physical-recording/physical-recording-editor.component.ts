import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Assertion, EventInfo, Identifiable } from '@app/core';
import { PhysicalRecordingFields } from '@app/models';
import { FormHandler } from '@app/shared/utils';


export enum PhysicalRecordingEditorEventType {
  CREATE_PHYSICAL_RECORDING_CLICKED = 'PhysicalRecordingEditorComponent.Event.CreatePhysicalRecordingClicked',
}

enum PhysicalRecordingEditorFormControls  {
  recorderOffice = 'recorderOffice',
  recordingSection = 'recordingSection',
}

@Component({
  selector: 'emp-land-physical-recording-editor',
  templateUrl: './physical-recording-editor.component.html',
})
export class PhysicalRecordingEditorComponent implements OnInit {

  @Input() canEdit: boolean = true;

  @Input() recorderOfficeList: Identifiable[] = [];
  @Input() recordingSectionList: Identifiable[] = [];

  @Output() physicalRecordingEditorEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;
  controls = PhysicalRecordingEditorFormControls;

  constructor() { }

  ngOnInit(): void {
    this.initForm();
  }

  submitPhysicalRecording(){
    if (!this.formHandler.validateReadyForSubmit()) {
      return;
    }

    this.sendEvent(PhysicalRecordingEditorEventType.CREATE_PHYSICAL_RECORDING_CLICKED, this.getFormData());
  }

  private initForm(){
    this.formHandler = new FormHandler(
      new FormGroup({
        recorderOffice: new FormControl('', Validators.required),
        recordingSection: new FormControl('', Validators.required),
      })
    );
  }

  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: PhysicalRecordingFields = {
      recorderOfficeUID: formModel.recorderOffice ?? '',
      sectionUID: formModel.recordingSection ?? '',
    };

    return data;
  }

  private sendEvent(eventType: PhysicalRecordingEditorEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.physicalRecordingEditorEvent.emit(event);
  }

}
