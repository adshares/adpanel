import { Injectable } from '@angular/core';
import { ApiAuthService } from './auth.service';
import { ApiConfigService } from './config.service';
import { ApiNotificationsService } from './notifications.service';
import { ApiUsersService } from './users.service';

@Injectable()
export class ApiService {

  constructor(
    public auth: ApiAuthService,
    public config: ApiConfigService,
    public notifications: ApiNotificationsService,
    public users: ApiUsersService,
  ) {}
}
