import { Component, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'HandleSubscription',
  template: '',
})
export abstract class HandleSubscription implements OnDestroy {
  subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
