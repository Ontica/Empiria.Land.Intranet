/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[empNgResizable]'
})

export class ResizableDirective {

  @Input() empNgResizableGrabWidth = 8;

  @Input() empNgResizableMinWidth = 400;

  dragging = false;


  constructor(private el: ElementRef) {

    function preventGlobalMouseEvents() {
      document.body.style['pointer-events'] = 'none';
    }


    function restoreGlobalMouseEvents() {
      document.body.style['pointer-events'] = 'auto';
    }

    function disableGlobalSelectEvents(event) {
      event.preventDefault();
    }

    const newWidth = (wid) => {
      const newWidthSize = Math.max(this.empNgResizableMinWidth, wid);
      el.nativeElement.style.width = (newWidthSize) + 'px';
    };


    const mouseMoveG = (evt) => {
      if (!this.dragging) {
        return;
      }
      newWidth(evt.clientX - el.nativeElement.offsetLeft);
      evt.stopPropagation();
    };


    const mouseUpG = (evt) => {
      if (!this.dragging) {
        return;
      }
      restoreGlobalMouseEvents();
      this.dragging = false;
      evt.stopPropagation();
      document.removeEventListener('selectstart', disableGlobalSelectEvents);
    };


    const mouseDown = (evt) => {
      if (this.inDragRegion(evt)) {
        this.dragging = true;
        preventGlobalMouseEvents();
        evt.stopPropagation();
        document.addEventListener('selectstart', disableGlobalSelectEvents);
      }
    };


    const mouseMove = (evt) => {
      if (this.inDragRegion(evt) || this.dragging) {
        el.nativeElement.style.cursor = 'ew-resize';
      } else {
        el.nativeElement.style.cursor = 'default';
      }
    };

    document.addEventListener('mousemove', mouseMoveG, true);
    document.addEventListener('mouseup', mouseUpG, true);
    el.nativeElement.addEventListener('mousedown', mouseDown, true);
    el.nativeElement.addEventListener('mousemove', mouseMove, true);
  }


  inDragRegion(evt) {
    return this.el.nativeElement.clientWidth - evt.clientX + this.el.nativeElement.offsetLeft
      < this.empNgResizableGrabWidth;
  }

}
