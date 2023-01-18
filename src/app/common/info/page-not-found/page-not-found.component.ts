import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { AppState } from 'models/app-state.model';
import { Info } from 'models/info.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent extends HandleSubscriptionComponent implements OnInit {
  supportEmail: string;

  constructor(private store: Store<AppState>) {
    super();
  }

  ngOnInit(): void {
    const infoSubscription = this.store.select('state', 'common', 'info').subscribe((info: Info) => {
      this.supportEmail = info.supportEmail;
    });
    this.subscriptions.push(infoSubscription);
  }
}
