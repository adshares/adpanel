import { Component, Input } from '@angular/core';

import { UserInfoStats } from 'models/settings.model';
import { AdminService } from "admin/admin.service";
import { Store } from "@ngrx/store";
import { AppState } from "models/app-state.model";
import { ImpersonateUser } from "store/auth/auth.actions";
import { Router } from "@angular/router";

@Component({
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.scss']
})
export class UserListItemComponent {
  @Input() userInfoStats: UserInfoStats;

  constructor(
    private adminService: AdminService,
    private store: Store<AppState>,
    private router: Router,
  ) {
  }

  handleImpersonating() {
    this.adminService.impersonateUser(this.userInfoStats.id).subscribe(
      (token) => {
        this.store.dispatch(new ImpersonateUser(token))
        this.router.navigate([`/${'publisher'.toLowerCase()}`, 'dashboard'])

      }
    )
  }
}
