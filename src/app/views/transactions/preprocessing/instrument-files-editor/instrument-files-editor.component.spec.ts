import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentFilesEditorComponent } from './instrument-files-editor.component';

describe('InstrumentFilesEditorComponent', () => {
  let component: InstrumentFilesEditorComponent;
  let fixture: ComponentFixture<InstrumentFilesEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstrumentFilesEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentFilesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
