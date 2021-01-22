import { Directive, ElementRef, HostListener, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[empNgInteger]'
})
export class EmpIntegerDirective {

  constructor(private _el: ElementRef,
              @Optional() private control: NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    const formattedValue = initalValue.replace(/[^0-9]*/g, '');

    this.setValue(formattedValue);

    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

  setValue(value){
    if (this.control?.control) {
      this.control.control.setValue(value);
    } else {
      this._el.nativeElement.value = value;
    }
  }

}
