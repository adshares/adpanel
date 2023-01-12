import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { BannersConfig } from 'models/campaign.model';

@Injectable()
export class BannersConfigResolver implements Resolve<BannersConfig> {
  constructor(private advertiserService: AdvertiserService) {}

  resolve(): Observable<BannersConfig> {
    return this.advertiserService.getBannersConfig();
  }
}
