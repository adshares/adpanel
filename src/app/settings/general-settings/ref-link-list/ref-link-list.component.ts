import { Component, OnInit } from '@angular/core';
import { SessionService } from 'app/session.service';
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {RefLink} from "models/settings.model";
import {Store} from "@ngrx/store";
import {AppState} from "models/app-state.model";
import {HandleSubscription} from "common/handle-subscription";
import {GetRefLinks} from "store/settings/settings.actions";

@Component({
  selector: 'app-ref-link-list',
  templateUrl: './ref-link-list.component.html',
  styleUrls: ['./ref-link-list.component.scss']
})
export class RefLinkListComponent extends HandleSubscription implements OnInit {
  refundEnabled: boolean;
  defaultRefundCommission: number;
  refLinks: RefLink[] = [];
  showLoader: boolean = true;
  createIcon = faPlus;

  constructor(private session: SessionService, private store: Store<AppState>) {
    super();
  }

  ngOnInit() {
    const user = this.session.getUser();
    this.refundEnabled = user.referralRefundEnabled;
    this.defaultRefundCommission = user.referralRefundCommission;
    const dataSubscription = this.store.select('state', 'user', 'settings', 'refLinks')
      .subscribe((refLinks) => {
        this.refLinks = refLinks;
        this.showLoader = false;
      });
    this.subscriptions.push(dataSubscription);
    this.getRefLinks();
  }

  getRefLinks(): void {
    this.showLoader = true;
    this.store.dispatch(new GetRefLinks());
  }

  create(): void {
  }
}
