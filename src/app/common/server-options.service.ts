import { Injectable } from '@angular/core'
import { CommonService } from 'common/common.service'
import { Options } from 'models/options.model'
import { Observable, of, timer } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

@Injectable()
export class ServerOptionsService {
  private lastCallTimestamp: number = 0
  private options: Options | null = null

  constructor (
    private commonService: CommonService,
  ) {
  }

  getOptions (): Observable<Options> {
    if (null !== this.options) {
      return of(this.options)
    }

    if (Date.now() - this.lastCallTimestamp < 1000) {
      return timer(200).pipe(switchMap(() => this.getOptions()))
    }
    this.lastCallTimestamp = Date.now()

    return this.commonService.getOptions()
      .pipe(
        map(options => {
          this.options = options
          return options
        })
      )
  }
}
