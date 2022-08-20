import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingViewsButtonsComponent } from './recording-views-buttons.component';

describe('RecordingViewsButtonsComponent', () => {
  let component: RecordingViewsButtonsComponent;
  let fixture: ComponentFixture<RecordingViewsButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingViewsButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingViewsButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
