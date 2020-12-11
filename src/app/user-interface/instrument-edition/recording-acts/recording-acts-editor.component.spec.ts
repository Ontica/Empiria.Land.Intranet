import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordingActsEditorComponent } from './recording-acts-editor.component';

describe('RecordingActsEditorComponent', () => {
  let component: RecordingActsEditorComponent;
  let fixture: ComponentFixture<RecordingActsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingActsEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingActsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
