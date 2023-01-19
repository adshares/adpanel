import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PublisherService } from 'publisher/publisher.service';
import { SiteOptions } from 'models/settings.model';

@Injectable()
export class SiteOptionsResolver implements Resolve<SiteOptions> {
  constructor(private publisherService: PublisherService) {}

  resolve(): Observable<SiteOptions> {
    return this.publisherService.getSiteOptions();
  }
}
