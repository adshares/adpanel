import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PublisherService } from 'publisher/publisher.service';
import { AdminSiteOptions } from 'models/settings.model'

@Injectable()
export class SiteOptionsResolver implements Resolve<AdminSiteOptions> {
  constructor(private publisherService: PublisherService) {
  }

  resolve(): Observable<AdminSiteOptions> {
    return this.publisherService.getSiteOptions();
  }
}
