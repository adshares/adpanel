import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { BidStrategyService } from 'common/bid-strategy.service';

@Injectable()
export class BidStrategyDefaultResolver implements Resolve<string> {
  constructor(private bidStrategyService: BidStrategyService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<string> {
    return this.bidStrategyService.getBidStrategyUuidDefault().map((response) => response.uuid);
  }
}
