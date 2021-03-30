import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Assertion, EventInfo, isEmpty } from '@app/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';
import { EmptyRecordingBookFields, InstrumentTypesList, RecordingBookFields } from '@app/models';
import { FormHandler } from '@app/shared/utils';

enum RecordingBookHeaderControls {
  type = 'type',
  recordingBookDate = 'recordingBookDate',
  recordingBook = 'recordingBook',
  notes = 'notes',
  status = 'status',
}

export enum RecordingBookHeaderEventType {
  ADD_RECORDING_BOOK = 'InstrumentEditorEventType.Event.AddRecordingBook',
  UPDATE_RECORDING_BOOK = 'InstrumentEditorEventType.Event.UpdateRecordingBook'
}

@Component({
  selector: 'emp-land-recording-book-header',
  templateUrl: './recording-book-header.component.html',
})
export class RecordingBookHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() recordingBook: RecordingBookFields = EmptyRecordingBookFields;

  @Output() recordingBookHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  formHandler: FormHandler;
  controls = RecordingBookHeaderControls;
  editorMode = false;
  readonly = false;
  isLoading = false;

  instrumentTypesList = [];
  statusList = [];

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnChanges(): void {
    this.editorMode = !isEmpty(this.recordingBook);
    this.readonly = this.editorMode;
  }

  ngOnInit(): void {
    this.initForm();
    this.loadDataLists();
    this.disableForm(this.readonly);

    if (this.editorMode) {
      this.setFormData();
    }
  }

  ngOnDestroy() {
    this.helper.destroy();
  }

  enableEditor(enable) {
    this.readonly = !enable;
    this.setFormData();
    this.disableForm(this.readonly);
  }


  onSubmitClicked(){
    if (!this.formHandler.isReadyForSubmit) {
      return this.formHandler.invalidateForm();
    }

    const payload = {
      recordignBookUID: this.recordingBook.uid,
      recordingBook: this.getFormData()
    };

    this.sendEvent(this.editorMode ?
                   RecordingBookHeaderEventType.UPDATE_RECORDING_BOOK :
                   RecordingBookHeaderEventType.ADD_RECORDING_BOOK,
                   payload);
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        type: new FormControl('', Validators.required),
        recordingBookDate: new FormControl('', Validators.required),
        recordingBook: new FormControl('', Validators.required),
        notes: new FormControl('', Validators.required),
        status: new FormControl(''),
      })
    );
  }

  private loadDataLists() {
    // TODO: define the WS to use
    this.instrumentTypesList = InstrumentTypesList;
    this.statusList = [{uid: 'completed', name: 'Completa'}];
  }


  private setFormData() {
    if (!this.recordingBook) {
      this.formHandler.form.reset();
      return;
    }

    this.formHandler.form.reset({
      type: this.recordingBook.type || '',
      recordingBookDate: this.recordingBook.recordingBookDate || '',
      recordingBook: this.recordingBook.recordingBook || '',
      notes: this.recordingBook.notes || '',
      status: this.recordingBook.status || '',
    });
  }


  private disableForm(disable) {
    this.formHandler.disableForm(disable);
  }


  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: any = {
      type: formModel.type ?? '',
      recordingBookDate: formModel.recordingBookDate ?? '',
      recordingBook: formModel.recordingBook ?? '',
      notes: formModel.notes ?? '',
      status: formModel.status ?? '',
    };

    return data;
  }


  private sendEvent(eventType: RecordingBookHeaderEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.recordingBookHeaderEvent.emit(event);
  }

}
