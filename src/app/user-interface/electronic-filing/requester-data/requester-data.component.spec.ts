import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequesterDataComponent } from './requester-data.component';

describe('RequesterDataComponent', () => {
  let component: RequesterDataComponent;
  let fixture: ComponentFixture<RequesterDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequesterDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequesterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
