import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedServiceEditorComponent } from './requested-service-editor.component';

describe('RequestedServiceEditorComponent', () => {
  let component: RequestedServiceEditorComponent;
  let fixture: ComponentFixture<RequestedServiceEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestedServiceEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedServiceEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
