import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-settings-menu-item',
  templateUrl: './settings-menu-item.component.html',
  styleUrls: ['./settings-menu-item.component.scss'],
})
export class SettingsMenuItemComponent {
  @Input() menuItem;
}
