/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
  selector: 'emp-ng-check-box-all',
  template: `
    <mat-checkbox
      [checked]="isChecked()"
      [indeterminate]="isIndeterminate()"
      (change)="toggleSelection($event)"
      (click)="$event.stopPropagation()">
      {{text}}
    </mat-checkbox>
  `
})
export class CheckboxAllComponent implements OnInit {

  @Input() selection: SelectionModel<any>;
  @Input() values = [];
  @Input() text = '';
  @Output() selectionChange = new EventEmitter<SelectionModel<any>>();

  constructor() { }

  ngOnInit() {
  }

  isChecked(): boolean {
    return this.selection.hasValue() && this.selection.selected.length === this.values.length;
  }

  isIndeterminate(): boolean {
    return this.selection.hasValue() && this.selection.selected.length !== this.values.length;
  }

  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {

      this.values.forEach(value => {
        this.selection.select(value);
      });

    } else {

      this.selection.clear();

    }

    this.selectionChange.emit(this.selection);
  }

}
