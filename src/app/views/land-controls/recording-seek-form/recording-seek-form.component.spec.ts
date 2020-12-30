import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecordingSeekFormComponent } from './recording-seek-form.component';

describe('RecordingSeekFormComponent', () => {
  let component: RecordingSeekFormComponent;
  let fixture: ComponentFixture<RecordingSeekFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordingSeekFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingSeekFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
