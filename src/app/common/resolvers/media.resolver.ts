import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve } from '@angular/router'
import { Observable } from 'rxjs'
import { CommonService } from 'common/common.service'
import { Media } from 'models/taxonomy-medium.model'

@Injectable()
export class MediaResolver implements Resolve<Media> {
  constructor (private service: CommonService) {
  }

  resolve (route: ActivatedRouteSnapshot): Observable<Media> {
    return this.service.getMedia()
  }
}
