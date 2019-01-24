import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { siteStatusEnum } from 'models/enum/site.enum.ts';

@Component({
  selector: 'app-site-list-item',
  templateUrl: './site-list-item.component.html',
  styleUrls: ['./site-list-item.component.scss']
})
export class SiteListItemComponent implements OnInit{
  @Input() site;

  constructor(private router: Router) {
  }
  siteStatusEnum = siteStatusEnum;

  ngOnInit() {
    console.log('abc', this.site)
  }
  navigateToCampaignDetails(siteId: number) {
    this.router.navigate(['/publisher', 'site', siteId]);
  }
}
