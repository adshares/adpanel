import { OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs';

export class HandleSubscription implements OnDestroy {
  subscriptions: Subscription[] = [];

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
