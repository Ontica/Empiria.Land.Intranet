/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { ControlPanelOption, ControlPanelOptionList } from './control-panel-config';


@Component({
  selector: 'emp-land-control-panel-main-page',
  templateUrl: './control-panel-main-page.component.html',
})
export class ControlPanelMainPageComponent {

  displayChangePasswordModal = false;

  controlPanelOptionList = ControlPanelOptionList;


  onClickControlPanelOption(option: ControlPanelOption) {
    switch (option.type) {
      case 'ChangePassword':
        this.displayChangePasswordModal = true;
        return;

      default:
        console.log(`Unhandled user interface event ${option.type}`);
        return;
    }
  }

}
