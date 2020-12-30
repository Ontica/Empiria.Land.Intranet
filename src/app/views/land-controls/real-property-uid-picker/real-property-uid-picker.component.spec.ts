import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RealPropertyUIDPickerComponent } from './real-property-uid-picker.component';

describe('RealPropertyUIDPickerComponent', () => {
  let component: RealPropertyUIDPickerComponent;
  let fixture: ComponentFixture<RealPropertyUIDPickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RealPropertyUIDPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealPropertyUIDPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
