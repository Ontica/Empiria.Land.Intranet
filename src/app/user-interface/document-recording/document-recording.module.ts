import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { AngularFlexLayoutModule } from '@app/shared/angular-flex-layout.module';
import { SharedModule } from '@app/shared/shared.module';
import { PartiesEditorComponent } from './recording-acts/parties-editor/parties-editor.component';
import { PartiesListComponent } from './recording-acts/parties-editor/parties-list/parties-list.component';
import { PartyEditorComponent } from './recording-acts/parties-editor/party-editor/party-editor.component';
import { RecordingActsComponent } from './recording-acts/recording-acts.component';


@NgModule({
  declarations: [
    RecordingActsComponent,
    PartiesEditorComponent,
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
    SharedModule
  ],
  exports: [
    RecordingActsComponent
  ]
})
export class DocumentRecordingModule { }
