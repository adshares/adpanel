import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Site } from '../../models/site.model';

@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
  styleUrls: ['./site-details.component.scss'],
})
export class SiteDetailsComponent {
  site: Site;

  constructor(private route: ActivatedRoute) {
    this.site = this.route.snapshot.data.site;
  }
}
