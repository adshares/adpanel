import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-list-item',
  templateUrl: './site-list-item.component.html',
  styleUrls: ['./site-list-item.component.scss']
})
export class SiteListItemComponent {
  @Input() site;

  constructor(private router: Router) { }

  navigateToCampaignDetails(siteId: number) {
    this.router.navigate(['/publisher', 'site', siteId]);
  }
}
