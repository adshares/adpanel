import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { CampaignsMediaResponse } from 'models/campaign.model';

@Injectable()
export class CampaignsMediaResolver implements Resolve<CampaignsMediaResponse> {
  constructor(private advertiserService: AdvertiserService) {}

  resolve(): Observable<CampaignsMediaResponse> {
    return this.advertiserService.getCampaignsMedia();
  }
}
