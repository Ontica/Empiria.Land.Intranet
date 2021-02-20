import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Assertion, Command } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { InstrumentsCommandType, TransactionStateSelector } from '@app/core/presentation/presentation-types';
import { Instrument, PhysicalRecordingFields, RecorderOffice, RecordingSection } from '@app/models';
import { FormHandler } from '@app/shared/utils';


enum PhysicalRecordingEditorFormControls  {
  recorderOffice = 'recorderOffice',
  recordingSection = 'recordingSection',
}


@Component({
  selector: 'emp-land-physical-recording-editor',
  templateUrl: './physical-recording-editor.component.html',
})
export class PhysicalRecordingEditorComponent implements OnInit, OnDestroy {

  @Input() transactionUID: string;

  @Input() instrumentUID: string;

  recorderOfficeList: RecorderOffice[] = [];

  recordingSectionList: RecordingSection[] = [];

  helper: SubscriptionHelper;

  formHandler: FormHandler;

  controls = PhysicalRecordingEditorFormControls;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  ngOnDestroy() {
    this.helper.destroy();
  }

  submitPhysicalRecording(){
    if (!this.formHandler.validateReadyForSubmit()) {
      return;
    }

    this.formHandler.submitted = true;

    const payload = {
      transactionUID: this.transactionUID,
      instrumentUID: this.instrumentUID,
      physicalRecording: this.getFormData()
    };

    this.executeCommand<Instrument>(InstrumentsCommandType.CREATE_PHYSICAL_RECORDING, payload)
        .then(() => this.formHandler.submitted = false );
  }

  private initForm(){
    this.formHandler = new FormHandler(
      new FormGroup({
        recorderOffice: new FormControl('', Validators.required),
        recordingSection: new FormControl('', Validators.required),
      })
    );
  }

  private loadData(){
    this.helper.select<RecorderOffice[]>(TransactionStateSelector.RECORDER_OFFICE_LIST, {})
      .subscribe(x => {
        this.recorderOfficeList = x;
      });

    this.helper.select<RecordingSection[]>(TransactionStateSelector.RECORDING_SECTION_LIST, {})
      .subscribe(x => {
        this.recordingSectionList = x;
      });
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

  private executeCommand<T>(commandType: InstrumentsCommandType, payload?: any): Promise<T>{
    const command: Command = {
      type: commandType,
      payload
    };

    return this.uiLayer.execute<T>(command);
  }

}
