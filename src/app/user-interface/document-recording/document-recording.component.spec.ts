import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRecordingComponent } from './document-recording.component';

describe('DocumentRecordingComponent', () => {
  let component: DocumentRecordingComponent;
  let fixture: ComponentFixture<DocumentRecordingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentRecordingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
