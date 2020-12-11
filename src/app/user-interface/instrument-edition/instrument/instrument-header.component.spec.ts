import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstrumentHeaderComponent } from './instrument-header.component';

describe('InstrumentHeaderComponent', () => {
  let component: InstrumentHeaderComponent;
  let fixture: ComponentFixture<InstrumentHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstrumentHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
