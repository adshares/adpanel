import { Component, OnInit } from '@angular/core';
import { HandleSubscription } from '../../common/handle-subscription';
import { PublisherService } from '../publisher.service';

import { Site } from '../../models/site.model';

@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
  styleUrls: ['./site-details.component.scss'],
})
export class SiteDetailsComponent extends HandleSubscription implements OnInit {
  site: Site;

  constructor(
    private publisherService: PublisherService,
  ) {
    super(null);
  }

  ngOnInit() {
    const siteSubscription = this.publisherService.getSite().subscribe(site => this.site = site);

    this.subscriptions.push(siteSubscription);
  }
}
