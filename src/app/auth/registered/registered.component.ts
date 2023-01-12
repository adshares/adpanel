import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { Info } from 'models/info.model';

@Component({
  selector: 'app-registered',
  templateUrl: './registered.component.html',
  styleUrls: ['./registered.component.scss'],
})
export class RegisteredComponent extends HandleSubscription implements OnInit {
  supportEmail: string;

  constructor(private store: Store<AppState>) {
    super();
  }

  ngOnInit(): void {
    const infoSubscription = this.store
      .select('state', 'common', 'info')
      .subscribe((info: Info) => {
        this.supportEmail = info.supportEmail;
      });
    this.subscriptions.push(infoSubscription);
  }
}
