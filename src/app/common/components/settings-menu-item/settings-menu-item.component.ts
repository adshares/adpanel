import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-settings-menu-item',
  templateUrl: './settings-menu-item.component.html',
  styleUrls: ['./settings-menu-item.component.scss'],
})
export class SettingsMenuItemComponent implements OnInit {
  @Input() menuItem;

  isPanelExpanded: boolean;

  constructor(public router: Router, public route: ActivatedRoute) {}

  ngOnInit() {
    this.isPanelExpanded = this.router.url.includes(this.menuItem.link);
  }
}
