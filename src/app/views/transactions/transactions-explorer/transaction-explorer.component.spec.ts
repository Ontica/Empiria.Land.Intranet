/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionExplorerComponent } from './transaction-explorer.component';

describe('TransactionExplorerComponent', () => {
  let component: TransactionExplorerComponent;
  let fixture: ComponentFixture<TransactionExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionExplorerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
