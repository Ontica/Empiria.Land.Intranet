import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuPositionX, MenuPositionY } from '@angular/material/menu';

export interface MenuConfig {
  modeOnlyIcon?: boolean;
  textButton?: string;
  icon?: string;
  bindLabel?: string;
  bindIcon?: string;
  yPosition?: MenuPositionY;
  xPosition?: MenuPositionX;
}

const DefaultMenuConfig: MenuConfig = {
  modeOnlyIcon: true,
  textButton: 'Menu',
  icon: 'more_vert',
  bindLabel: 'name',
  bindIcon: null,
  yPosition: 'below',
  xPosition: 'after'
};

@Component({
  selector: 'emp-ng-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Input() items: any[] = [];
  @Output() selected = new EventEmitter<any>();

  @Input()
  get config() {
    return this.menuConfig;
  }
  set config(value: MenuConfig) {
    this.menuConfig = Object.assign({}, DefaultMenuConfig, value);
  }

  menuConfig = DefaultMenuConfig;

  constructor() { }

  ngOnInit(): void {
  }

  onSelectItem(item){
    this.selected.next(item);
  }

}
