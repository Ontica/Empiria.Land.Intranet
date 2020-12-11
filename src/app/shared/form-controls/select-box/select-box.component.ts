import { Component, ContentChild, TemplateRef, ViewChild, EventEmitter, forwardRef,
         Input, Output, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Subject } from 'rxjs';

export interface SelectBoxConfig {
  addTag?: boolean;
  addTagText?: string;
  bindLabel?: string;
  bindValue?: string;
  clearable?: boolean;
  closeOnSelect?: boolean;
  groupBy?: string;
  hideSelected?: boolean;
  minTermLength?: number;
  multiple?: boolean;
  notFoundText?: string;
  placeholder?: string;
  searchable?: boolean;
  typeToSearchText?: string;
  virtualScroll?: boolean;
}

const DefaultSelectBoxConfig: SelectBoxConfig = {
  addTag: false,
  addTagText: 'Agregar Item',
  bindLabel: 'name',
  bindValue: 'uid',
  clearable: true,
  closeOnSelect: true,
  groupBy: null,
  hideSelected: false,
  minTermLength: 5,
  multiple: false,
  notFoundText: 'No se encontraron registros',
  placeholder: 'Seleccione',
  searchable: true,
  typeToSearchText: 'Por favor ingrese 5 o mas caracteres',
  virtualScroll: false
};

@Component({
  selector: 'emp-ng-select',
  templateUrl: './select-box.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectBoxComponent),
      multi: true
    }
  ]
})

export class SelectBoxComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild(NgSelectComponent) select: NgSelectComponent;

  @ContentChild('groupTemplate', { read: TemplateRef }) labelTemplate: TemplateRef<any>;
  @ContentChild('optionTemplate', { read: TemplateRef }) optionTemplate: TemplateRef<any>;

  @Input() items: any[];
  @Input() loading = false;
  @Input() typeahead: Subject<string>;

  @Input()
  get config() {
    return this.selectBoxConfig;
  }
  set config(value: SelectBoxConfig) {
    this.selectBoxConfig = Object.assign({}, DefaultSelectBoxConfig, value);
  }

  @Output() clear = new EventEmitter<boolean>();
  @Output() changes = new EventEmitter<any>();

  selectBoxConfig = DefaultSelectBoxConfig;

  onChange: (value: any) => void;
  onTouched: (event: any) => void;
  disabled: boolean;
  value: any = null;

  private onScroll = (event: any) => {
    if (this.select && this.select.isOpen) {
      this.select.close();
    }
  }

  private onResize = (event: any) => {
    if (this.select && this.select.isOpen) {
      this.select.close();
    }
  }

  constructor() { }

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll, true);
    window.addEventListener('resize', this.onResize, true);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll, true);
    window.removeEventListener('resize', this.onResize, true);
  }

  writeValue(value: any): void {
    this.value = value ? value : null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChangedEvent(event){
    this.onChange(event);
    this.changes.emit(this.value);
  }

  onClear() {
    this.clear.emit(true);
  }

  clearModel(){
    this.select.clearModel();
  }
}
