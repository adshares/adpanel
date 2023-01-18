import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CommonService } from 'common/common.service';
import { Options } from 'models/options.model';
import { map } from 'rxjs/operators';
import { ServerOptionsService } from 'common/server-options.service';

@Injectable()
export class ServerOptionsResolver implements Resolve<Options> {
  private options: Options | null = null;

  constructor(private commonService: CommonService, private serverOptionsService: ServerOptionsService) {}

  resolve(): Observable<Options> {
    if (null !== this.options) {
      return of(this.options);
    }

    return this.commonService.getOptions().pipe(
      map(options => {
        this.options = options;
        this.serverOptionsService.setOptions(options);
        return options;
      })
    );
  }
}
