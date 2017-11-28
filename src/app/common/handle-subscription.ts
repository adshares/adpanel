import { OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs/Subscription';

export class HandleSubscription implements OnDestroy {
   constructor(public subscriptions: Subscription[]) {
     this.subscriptions = [];
   }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
