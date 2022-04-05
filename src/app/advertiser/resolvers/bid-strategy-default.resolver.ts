import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BidStrategyService } from 'common/bid-strategy.service';

@Injectable()
export class BidStrategyDefaultResolver implements Resolve<string> {
  constructor(private bidStrategyService: BidStrategyService) {
  }

  resolve(): Observable<string> {
    return this.bidStrategyService.getBidStrategyUuidDefault().pipe(map(response => response.uuid));
  }
}
