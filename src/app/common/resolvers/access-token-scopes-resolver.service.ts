import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CommonService } from 'common/common.service';
import { AccessTokenScope } from 'models/access-token.model';
import { Observable } from 'rxjs';

@Injectable()
export class AccessTokenScopesResolver implements Resolve<AccessTokenScope[]> {
  constructor(private service: CommonService) {}

  resolve(): Observable<AccessTokenScope[]> {
    return this.service.getAccessTokenScopes();
  }
}
