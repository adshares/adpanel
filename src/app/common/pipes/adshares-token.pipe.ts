import { Pipe } from '@angular/core';

@Pipe({
  name: 'adsharesTokenValue'
})

export class AdsharesTokenPipe {
  transform(value) {
    return value + ' Adst'
  }
}
