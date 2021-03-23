import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingActCreatorComponent } from './recording-act-creator.component';

describe('RecordingActCreatorComponent', () => {
  let component: RecordingActCreatorComponent;
  let fixture: ComponentFixture<RecordingActCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingActCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingActCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
