import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PublisherService } from 'publisher/publisher.service';

@Injectable()
export class MatchingBannerSizesResolver implements Resolve<Array<string>> {
  constructor(private publisherService: PublisherService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Array<string>> {
    if (route.params) {
      return this.publisherService.getPossibleSizeOptionForBannerClassification(route.params.id);
    }
    return this.publisherService.getPossibleSizeOptionForBannerClassification();
  }
}
