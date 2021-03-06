import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateEditorComponent } from './real-estate-editor.component';

describe('RealEstateEditorComponent', () => {
  let component: RealEstateEditorComponent;
  let fixture: ComponentFixture<RealEstateEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealEstateEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealEstateEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
