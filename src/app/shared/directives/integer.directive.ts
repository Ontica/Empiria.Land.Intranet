import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[empNgInteger]'
})
export class EmpIntegerDirective {

  constructor(private _el: ElementRef,
              private control?: NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    const formattedValue = initalValue.replace(/[^0-9]*/g, '');

    if (this.control?.control) {
      this.control.control.setValue(formattedValue);
    } else {
      this._el.nativeElement.value = formattedValue;
    }

    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
