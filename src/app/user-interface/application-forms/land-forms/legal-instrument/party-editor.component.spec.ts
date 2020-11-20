import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartyEditorComponent } from './party-editor.component';

describe('PartyEditorComponent', () => {
  let component: PartyEditorComponent;
  let fixture: ComponentFixture<PartyEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
