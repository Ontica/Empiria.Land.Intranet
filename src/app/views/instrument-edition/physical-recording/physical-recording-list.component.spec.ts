import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalRecordingListComponent } from './physical-recording-list.component';

describe('PhysicalRecordingListComponent', () => {
  let component: PhysicalRecordingListComponent;
  let fixture: ComponentFixture<PhysicalRecordingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalRecordingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalRecordingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
