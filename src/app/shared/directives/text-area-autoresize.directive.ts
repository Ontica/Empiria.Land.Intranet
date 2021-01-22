import { Directive, HostListener, ElementRef, OnInit, Renderer2, Input } from '@angular/core';
import { FormatLibrary } from '../utils';

@Directive({
  selector: '[empNgTextareaAutoresize]'
})
export class EmpTextareaAutoresizeDirective implements OnInit {

  @Input() maxHeightTextarea: number = 75;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  @HostListener(':input')
  onInput() {
    this.resize();
  }

  ngOnInit() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'max-height', this.maxHeightTextarea + 'px');

    if (this.elementRef.nativeElement.scrollHeight) {
      setTimeout(() => this.resize());
    }
  }

  resize() {
    const currentHeight = FormatLibrary.stringToNumber(this.elementRef.nativeElement.style.height);
    if (currentHeight >= this.maxHeightTextarea) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'overflow', 'auto');
      this.elementRef.nativeElement.style.height = this.maxHeightTextarea + 'px';
    } else {
      this.renderer.setStyle(this.elementRef.nativeElement, 'overflow', 'hidden');
      this.elementRef.nativeElement.style.height = 'auto';
      this.elementRef.nativeElement.style.height = this.elementRef.nativeElement.scrollHeight + 'px';
    }
  }

}
