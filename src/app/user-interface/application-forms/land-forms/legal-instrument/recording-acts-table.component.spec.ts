import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecordingActsTableComponent } from './recording-acts-table.component';

describe('RecordingActsTableComponent', () => {
  let component: RecordingActsTableComponent;
  let fixture: ComponentFixture<RecordingActsTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordingActsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingActsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
