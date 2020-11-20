import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PartySearcherComponent } from './party-searcher.component';

describe('PartySearcherComponent', () => {
  let component: PartySearcherComponent;
  let fixture: ComponentFixture<PartySearcherComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartySearcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartySearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
