import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalRecordingEditorComponent } from './physical-recording-editor.component';

describe('PhysicalRecordingEditorComponent', () => {
  let component: PhysicalRecordingEditorComponent;
  let fixture: ComponentFixture<PhysicalRecordingEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalRecordingEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalRecordingEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
