import { Component } from '@angular/core'

import { fadeAnimation } from 'common/animations/fade.animation'
import { environment } from 'environments/environment'
import { ADVERTISER_INSTRUCTION_LINK, PUBLISHER_INSTRUCTION_LINK } from 'models/enum/link.enum'
import { take } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { AppState } from 'models/app-state.model'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations: [fadeAnimation]
})

export class AuthComponent {
  getRouterOutletState = (outlet) => outlet.isActivated ? outlet.activatedRoute : ''

  advertiserInstructionLink = ADVERTISER_INSTRUCTION_LINK
  publisherInstructionLink = PUBLISHER_INSTRUCTION_LINK
  privacyPolicyLink: string
  termsOfServiceLink: string
  source: string
  version: string

  constructor (
    private store: Store<AppState>,
  ) {
    this.source = environment.name.toLowerCase().replace(/\s+/, '-')
    this.version = environment.version
  }

  ngOnInit (): void {
    this.store.select('state', 'common', 'info')
      .pipe(take(1))
      .subscribe(info => {
          this.privacyPolicyLink = info.privacyUrl
          this.termsOfServiceLink = info.termsUrl
        },
      )
  }
}
