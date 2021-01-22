import { CurrencyPipe } from '@angular/common';
import { Directive, ElementRef, HostListener, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[empNgCurrency]'
})
export class EmpCurrencyDirective {

  constructor(private _el: ElementRef,
              private currencyPipe: CurrencyPipe,
              @Optional() private control: NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    const formattedValue = initalValue.replace(/[^0-9.,$]*/g, '');

    this.setValue(formattedValue);

    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

  @HostListener('focusout', ['$event']) onBlur() {
    this.format();
  }

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    if (event.keyCode === 13) {
      this.format();
    }
  }

  format() {
    const initalValue = this._el.nativeElement.value;

    const numberValue = parseFloat(String(initalValue).replace(/[,$]*/g, ''));

    const formattedValue = this.currencyPipe.transform(numberValue);

    this.setValue(formattedValue);
  }

  setValue(value){
    if (this.control?.control) {
      this.control.control.setValue(value);
    } else {
      this._el.nativeElement.value = value;
    }
  }
}
