import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionListEditorComponent } from './transaction-list-editor.component';

describe('TransactionListEditorComponent', () => {
  let component: TransactionListEditorComponent;
  let fixture: ComponentFixture<TransactionListEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionListEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionListEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
