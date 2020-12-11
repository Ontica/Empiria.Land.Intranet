import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartyEditorComponent } from './party-editor.component';

describe('PartyEditorComponent', () => {
  let component: PartyEditorComponent;
  let fixture: ComponentFixture<PartyEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
