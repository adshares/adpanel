import { Component } from '@angular/core';

import { Campaign } from '../campaign.model'

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss'],
})
export class CampaignListComponent {
  abc: string = 'abc';
  campaigns: Campaign[] = [
    new Campaign(
      'Active',
      'August 2014 Global Remarketing',
      20.48,
      275,
      81534,
      0.003,
      2.10,
      238.21
    ),
    new Campaign(
      'Active',
      'August 2015 Global Remarketing',
      20.48,
      275,
      81534,
      0.003,
      2.10,
      238.21
    ),
    new Campaign(
      'Limited',
      'August 2016 Global Remarketing',
      20.48,
      275,
      81534,
      0.003,
      2.10,
      238.21
    ),
    new Campaign(
      'Archived',
      'August 2017 Global Remarketing',
      20.48,
      275,
      81534,
      0.003,
      2.10,
      238.21
    )
  ]

  constructor() { }

}
