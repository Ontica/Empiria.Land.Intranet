import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttachmentsEditorComponent } from './attachments-editor.component';

describe('AttachmentsEditorComponent', () => {
  let component: AttachmentsEditorComponent;
  let fixture: ComponentFixture<AttachmentsEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
