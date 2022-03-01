import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve } from '@angular/router'
import { Observable } from 'rxjs/Rx'
import { AdvertiserService } from 'advertiser/advertiser.service'
import { Media } from 'models/taxonomy-medium.model'

@Injectable()
export class MediaResolver implements Resolve<Media> {
  constructor (private advertiserService: AdvertiserService) {
  }

  resolve (route: ActivatedRouteSnapshot): Observable<Media> {
    return this.advertiserService.getMedia()
  }
}
