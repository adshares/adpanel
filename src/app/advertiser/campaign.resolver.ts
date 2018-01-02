import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AdvertiserService } from './advertiser.service';
import { Observable } from 'rxjs/Observable';
import { Campaign } from '../models/campaign.model';

@Injectable()
export class CampaignResolver implements Resolve<Campaign> {
  constructor(
    private advertiserService: AdvertiserService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Campaign> {
    return this.advertiserService.getCampaign(route.params.id);
  }
}
