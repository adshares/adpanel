import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HandleSubscription } from "common/handle-subscription";

@Component({
  selector: 'app-edit-site-navigation',
  templateUrl: './edit-site-navigation.component.html',
  styleUrls: ['./edit-site-navigation.component.scss'],
})
export class EditSiteNavigationComponent extends HandleSubscription implements OnInit {
  steps = [
    {id: 1, name: 'Basic information'},
    {id: 2, name: 'Filtering'},
    {id: 3, name: 'Upload ads'},
    {id: 4, name: 'Summary'}
  ];

  currentStep: number;

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    const subscription = this.route.queryParams.subscribe(params => {
      this.currentStep = parseInt(params.step);
    });
    this.subscriptions.push(subscription);
  }
}
