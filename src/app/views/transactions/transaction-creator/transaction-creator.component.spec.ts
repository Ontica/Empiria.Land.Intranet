import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionCreatorComponent } from './transaction-creator.component';

describe('TransactionCreatorComponent', () => {
  let component: TransactionCreatorComponent;
  let fixture: ComponentFixture<TransactionCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
