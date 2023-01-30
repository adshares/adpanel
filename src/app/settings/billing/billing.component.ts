import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './billing.component.html',
})
export class BillingComponent implements OnInit {
  nowPaymentsSuccess: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const route = this.route.snapshot.firstChild;
    this.nowPaymentsSuccess =
      route && route.routeConfig.path.includes('now-payments') && route.params.status == 'success';
  }
}
