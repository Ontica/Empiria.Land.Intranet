import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedServiceListComponent } from './requested-service-list.component';

describe('RequestedServiceListComponent', () => {
  let component: RequestedServiceListComponent;
  let fixture: ComponentFixture<RequestedServiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestedServiceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
