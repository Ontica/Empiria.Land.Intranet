import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotarialInstrumentHeaderComponent } from './notarial-instrument-header.component';

describe('NotarialInstrumentHeaderComponent', () => {
  let component: NotarialInstrumentHeaderComponent;
  let fixture: ComponentFixture<NotarialInstrumentHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotarialInstrumentHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotarialInstrumentHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
