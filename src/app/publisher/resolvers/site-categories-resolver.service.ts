import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve } from '@angular/router'
import { Observable } from 'rxjs/Rx'

import { processTargeting } from 'common/components/targeting/targeting.helpers'
import { AdvertiserService } from 'advertiser/advertiser.service'
import { TargetingOptionValue } from 'models/targeting-option.model'

@Injectable()
export class SiteCategoriesResolver implements Resolve<TargetingOptionValue[]> {
  constructor (private advertiserService: AdvertiserService) {
  }

  resolve (route: ActivatedRouteSnapshot): Observable<TargetingOptionValue[]> {
    return this.advertiserService.getMedium('web', true)
      .map((medium) => {
        const targetingOptions = processTargeting(medium)

        const siteOption = targetingOptions.find(option => 'site' === option.key)
        if (!siteOption) {
          return []
        }

        const categoryOption = siteOption.children.find(option => 'category' === option.key)
        if (!categoryOption) {
          return []
        }

        return categoryOption.values
      })
  }
}
