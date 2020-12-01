import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { AngularFlexLayoutModule } from '@app/shared/angular-flex-layout.module';
import { SharedContainersModule } from '@app/shared/containers/shared-containers.module';
import { SharedFormControlsModule } from '@app/shared/form-controls/shared-form-controls.module';
import { SharedIndicatorsModule } from '@app/shared/indicators/shared-indicators.module';
import { RecordingActsComponent } from './recording-acts/recording-acts.component'
import { PartiesListComponent } from './recording-acts/parties-list/parties-list.component';
import { PartyEditorComponent } from './recording-acts/party-editor/party-editor.component';



@NgModule({
  declarations: [
    RecordingActsComponent,
    PartiesListComponent,
    PartyEditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,

    SharedContainersModule,
    SharedFormControlsModule,
    SharedIndicatorsModule,
  ],

  exports: [
    RecordingActsComponent
  ]
})
export class DocumentRecordingModule { }
