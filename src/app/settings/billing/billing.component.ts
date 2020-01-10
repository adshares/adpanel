import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-payment',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent {

  private route;
  nowPaymentsSuccess: boolean = false;

  constructor(route: ActivatedRoute) {
    this.route = route;
  }

  ngOnInit() {
    const route = this.route.snapshot.firstChild;
    this.nowPaymentsSuccess =
      route &&
      route.routeConfig.path.includes('now-payments') &&
      route.params.status == 'success';
  }
}
