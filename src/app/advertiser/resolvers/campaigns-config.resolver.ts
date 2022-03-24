import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { CampaignsConfig } from "models/campaign.model";

@Injectable()
export class CampaignsConfigResolver implements Resolve<CampaignsConfig> {
  constructor(private advertiserService: AdvertiserService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CampaignsConfig> {
    return this.advertiserService.getCampaignsConfig();
  }
}
