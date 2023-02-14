import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { AppState } from 'models/app-state.model';
import { Info } from 'models/info.model';
import { HTTP_FORBIDDEN, HTTP_NOT_FOUND } from 'common/utilities/codes';

@Component({
  selector: 'app-error-4xx',
  templateUrl: './error4xx.component.html',
})
export class Error4xxComponent extends HandleSubscriptionComponent implements OnInit {
  code: number;
  codeDescription: string;
  supportEmail: string;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {
    super();
  }

  ngOnInit(): void {
    const dataSubscription = this.route.data.subscribe(data => {
      if (HTTP_FORBIDDEN === data?.code) {
        this.code = HTTP_FORBIDDEN;
        this.codeDescription = 'Forbidden';
      } else {
        this.code = HTTP_NOT_FOUND;
        this.codeDescription = 'Page Not Found';
      }
    });
    const infoSubscription = this.store.select('state', 'common', 'info').subscribe((info: Info) => {
      this.supportEmail = info.supportEmail;
    });
    this.subscriptions.push(dataSubscription, infoSubscription);
  }
}
