import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { AngularFlexLayoutModule } from '@app/shared/angular-flex-layout.module';
import { SharedModule } from '@app/shared/shared.module';
import { InstrumentEditionComponent } from './instrument-edition.component';
import { RecordingActsEditorComponent } from './recording-acts/recording-acts-editor.component';
import { InstrumentHeaderComponent } from './instrument/instrument-header.component';
import { PartyListComponent } from './parties/party-list.component';
import { PartyEditorComponent } from './parties/party-editor.component';


@NgModule({
  declarations: [
    InstrumentEditionComponent,
    InstrumentHeaderComponent,
    RecordingActsEditorComponent,
    PartyListComponent,
    PartyEditorComponent,
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
    InstrumentEditionComponent,
    RecordingActsEditorComponent,
  ]
})
export class InstrumentEditionModule { }
