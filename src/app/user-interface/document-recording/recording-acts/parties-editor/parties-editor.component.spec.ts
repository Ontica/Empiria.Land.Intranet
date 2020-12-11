import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartiesEditorComponent } from './parties-editor.component';

describe('PartiesEditorComponent', () => {
  let component: PartiesEditorComponent;
  let fixture: ComponentFixture<PartiesEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartiesEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartiesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
