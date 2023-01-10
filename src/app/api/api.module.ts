import { NgModule } from '@angular/core';

import { ApiService } from './api.service';
import { ApiAuthService } from './auth.service';
import { ApiConfigService } from './config.service';
import { ApiUsersService } from './users.service';

@NgModule({
  imports: [],
  declarations: [],
  providers: [ApiService, ApiAuthService, ApiConfigService, ApiUsersService],
})
export class ApiModule {}
