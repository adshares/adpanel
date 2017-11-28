import { Component } from '@angular/core';

export interface Campaign {
  status: string;
  name: string;
  budgetPerDay: number;
  clicks: number;
  impressions: number;
  ctr: number;
  averageCpc: number;
  totalCost: number;
}

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss'],
})

export class CampaignListComponent {
  campaigns: Campaign[] = [
    {
      status: 'Active',
      name: 'August 2014 Global Remarketing',
      budgetPerDay: 20.48,
      clicks: 275,
      impressions: 81534,
      ctr: 0.003,
      averageCpc: 2.10,
      totalCost: 238.21
    },
    {
      status: 'Active',
      name: 'August 2015 Global Remarketing',
      budgetPerDay: 20.48,
      clicks: 275,
      impressions: 81534,
      ctr: 0.003,
      averageCpc: 2.10,
      totalCost: 238.21
    },
    {
      status: 'Active',
      name: 'August 2016 Global Remarketing',
      budgetPerDay: 20.48,
      clicks: 275,
      impressions: 81534,
      ctr: 0.003,
      averageCpc: 2.10,
      totalCost: 238.21
    },
    {
      status: 'Active',
      name: 'August 2017 Global Remarketing',
      budgetPerDay: 20.48,
      clicks: 275,
      impressions: 81534,
      ctr: 0.003,
      averageCpc: 2.10,
      totalCost: 238.21
    },
  ];

  constructor() { }

}

