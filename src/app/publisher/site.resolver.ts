import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { PublisherService } from './publisher.service';
import { Observable } from 'rxjs/Observable';
import { Site } from '../models/site.model';

@Injectable()
export class SiteResolver implements Resolve<Site> {
  constructor(private publisherService: PublisherService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Site> {
    return this.publisherService.getSite(route.params.id);
  }
}
