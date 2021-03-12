import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPropertyEditorComponent } from './no-property-editor.component';

describe('NoPropertyEditorComponent', () => {
  let component: NoPropertyEditorComponent;
  let fixture: ComponentFixture<NoPropertyEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoPropertyEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoPropertyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
