import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-campaign-additional-targeting',
  templateUrl: './edit-campaign-additional-targeting.component.html',
  styleUrls: ['./edit-campaign-additional-targeting.component.scss'],
})
export class EditCampaignAdditionalTargetingComponent implements OnInit {
  aditionalTargetingOptions;

  constructor(private route: ActivatedRoute) {
    this.aditionalTargetingOptions = this.route.snapshot.data.targetingOptions.criteria;
  }

  ngOnInit() {
    console.log(this.aditionalTargetingOptions);
  }
}
