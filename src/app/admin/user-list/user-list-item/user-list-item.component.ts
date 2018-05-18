import { Component, Input } from '@angular/core';

import { UserInfoStats } from 'models/settings.model';

@Component({
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.scss']
})
export class UserListItemComponent {
  @Input() userInfoStats: UserInfoStats;
}
