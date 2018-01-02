import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserModel } from '../../../models/user.model';
import { HandleSubscription } from '../../handle-subscription';
import { AppState } from '../../../models/app-state.model';

@Component({
  selector: 'app-funds-summary',
  templateUrl: './funds-summary.component.html',
  styleUrls: ['./funds-summary.component.scss'],
})
export class FundsSummaryComponent extends HandleSubscription implements OnInit {
  selectedRole: string;
  userDataState: Store<UserModel>;

  constructor(private store: Store<AppState>) {
    super(null);

    this.userDataState = this.store.select('state', 'auth', 'userData');
  }

  ngOnInit() {
    const getUserSubscription = this.userDataState
      .subscribe((userData: UserModel) => this.checkUserRole(userData));
    this.subscriptions.push(getUserSubscription);
  }

  checkUserRole(user: UserModel) {
    if (user.isAdmin) {
      return;
    }

    this.selectedRole = user.isAdvertiser ? 'Advertiser' : 'Publisher';
  }
}
