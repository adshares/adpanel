import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { siteStatusEnum } from 'models/enum/site.enum.ts';

@Component({
  selector: 'app-site-list-item',
  templateUrl: './site-list-item.component.html',
  styleUrls: ['./site-list-item.component.scss']
})
export class SiteListItemComponent {
  @Input() site;

  constructor(private router: Router) {
  }

  siteStatusEnum = siteStatusEnum;

  navigateToCampaignDetails(siteId: number) {
    this.router.navigate(['/publisher', 'site', siteId]);
  }
}
