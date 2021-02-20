import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EventInfo } from '@app/core';
import { PhysicalRecording } from '@app/models';
import { MessageBoxService } from '@app/shared/containers/message-box';
import { FilePrintPreviewComponent } from '@app/shared/form-controls/file-print-preview/file-print-preview.component';

export enum PhysicalRecordingListEventType {
  DELETE_PHYSICAL_RECORDING_CLICKED = 'PhysicalRecordingListComponent.Event.DeletePhysicalRecordingClicked',
}

@Component({
  selector: 'emp-land-physical-recording-list',
  templateUrl: './physical-recording-list.component.html',
})
export class PhysicalRecordingListComponent implements OnInit, OnChanges {

  @ViewChild('filePrintPreview', {static: true}) filePrintPreview: FilePrintPreviewComponent;

  @Input() physicalRecordings: PhysicalRecording[] = [];

  @Input() showRegistrationStamps: boolean = true;

  @Input() canDelete: boolean = true;

  @Output() physicalRecordingListEvent = new EventEmitter<EventInfo>();

  dataSource: MatTableDataSource<PhysicalRecording>;
  private displayedColumnsDefault = ['recordingTime', 'recorderOfficeName', 'recordingSectionName',
                                     'volumeNo', 'recordingNo', 'recordedBy'];
  displayedColumns = [...this.displayedColumnsDefault];

  constructor(private messageBox: MessageBoxService) { }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges){
    if (changes.physicalRecordings){
      this.dataSource = new MatTableDataSource(this.physicalRecordings);
    }

    this.resetColumns();
  }

  resetColumns(){
    this.displayedColumns = [];

    if (this.showRegistrationStamps) {
      this.displayedColumns.push('stampMedia');
    }

    this.displayedColumns = [...this.displayedColumns, ...this.displayedColumnsDefault];

    if (this.canDelete) {
      this.displayedColumns.push('action');
    }
  }

  removePhysicalRecording(recording: PhysicalRecording){
    const message = this.getConfirmMessage(recording);

    this.messageBox.confirm(message, 'Eliminar registro', 'DeleteCancel')
        .toPromise()
        .then(x => {
          if (x) {
            this.sendEvent(PhysicalRecordingListEventType.DELETE_PHYSICAL_RECORDING_CLICKED,
                           recording.uid);
          }
        });
  }

  printStampMedia(recording: PhysicalRecording){
    this.filePrintPreview.open(recording.stampMedia.url, recording.stampMedia.mediaType);
  }

  private getConfirmMessage(recording: PhysicalRecording): string{
    return `
      <table style="margin: 0;">
        <tr><td>Distrito: </td><td><strong> ${recording.recorderOfficeName} </strong></td></tr>

        <tr><td>Sección: </td><td><strong> ${recording.recordingSectionName} </strong></td></tr>

        <tr><td>Volumen: </td><td><strong> ${recording.volumeNo} </strong></td></tr>

        <tr><td>Inscripción: </td><td><strong> ${recording.recordingNo} </strong></td></tr>

      </table>

      <br>¿Elimino el registro?`;
  }

  private sendEvent(eventType: PhysicalRecordingListEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.physicalRecordingListEvent.emit(event);
  }

}
