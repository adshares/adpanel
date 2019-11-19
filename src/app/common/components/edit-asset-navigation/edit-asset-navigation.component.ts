import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-edit-asset-navigation',
  templateUrl: './edit-asset-navigation.component.html',
  styleUrls: ['./edit-asset-navigation.component.scss'],
})
export class EditAssetNavigationComponent implements OnInit {
  steps = [
    {id: 1, name: 'Basic information'},
    {id: 2, name: 'Filtering'},
    {id: 3, name: 'Upload ads'},
    {id: 4, name: 'Summary'},
  ];

  currentStep: number;
  subscription: Subscription;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.currentStep = parseInt(params.step);
    });
  }
}
