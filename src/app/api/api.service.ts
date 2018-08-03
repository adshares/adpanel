import { Injectable } from '@angular/core';
import { ApiAuthService } from './auth.service';
import { ApiUsersService } from './users.service';

@Injectable()
export class ApiService {

  constructor(
    public auth: ApiAuthService,
    public users: ApiUsersService,
  ) {}
}
