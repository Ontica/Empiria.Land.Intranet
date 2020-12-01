import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordingActsComponent } from './recording-acts.component';

describe('RecordingActsComponent', () => {
  let component: RecordingActsComponent;
  let fixture: ComponentFixture<RecordingActsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingActsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingActsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
