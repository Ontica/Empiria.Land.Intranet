import { Component, OnDestroy, OnInit } from '@angular/core';
import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

@Component({
  selector: 'emp-land-preprocessing',
  templateUrl: './preprocessing.component.html',
  styles: [
  ]
})
export class PreprocessingComponent implements OnInit, OnDestroy {

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.helper.destroy();
  }

}
