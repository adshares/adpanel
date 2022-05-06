import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ImpersonationService } from '../impersonation.service'
import { HandleSubscription } from 'common/handle-subscription'
import { SessionService } from '../../session.service'
import { Store } from '@ngrx/store'
import { AppState } from 'models/app-state.model'
import { User } from 'models/user.model'
import { MatDialog } from '@angular/material/dialog'
import { DeleteUserDialogComponent } from 'admin/dialog/delete-user-dialog/delete-user-dialog.component'
import { BanUserDialogComponent } from 'admin/dialog/ban-user-dialog/ban-user-dialog.component'

@Component({
  selector: 'app-impersonation',
  templateUrl: './impersonation.component.html',
  styleUrls: ['./impersonation.component.scss'],
})
export class ImpersonationComponent extends HandleSubscription implements OnInit {
  impersonationToken: boolean = false
  userLabel: string
  userEmail: string
  userUuid: string

  constructor (
    private router: Router,
    private impersonationService: ImpersonationService,
    private sessionService: SessionService,
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {
    super()
  }

  ngOnInit () {
    const subscription = this.impersonationService.getImpersonationToken().subscribe(
      token => this.impersonationToken = !!token,
    )
    this.subscriptions.push(subscription)
    this.impersonationService.getTokenFromStorage()
    this.store.select('state', 'user', 'data').subscribe((user: User) => {
      this.userLabel = user.email || user.adserverWallet.walletAddress
      this.userEmail = user.email
      this.userUuid = user.uuid
    })
  }

  dropImpersonation (): void {
    this.router.navigate(['/admin', 'dashboard', 'users'])
    this.impersonationService.dropImpersonationToken()
    const user = this.sessionService.getUser()
    let accountType
    if (user.isAdmin) {
      accountType = SessionService.ACCOUNT_TYPE_ADMIN
    }
    else if (user.isModerator) {
      accountType = SessionService.ACCOUNT_TYPE_MODERATOR
    }
    else if (user.isAgency) {
      accountType = SessionService.ACCOUNT_TYPE_AGENCY
    }
    this.sessionService.setAccountTypeChoice(accountType)
  }

  showBanConfirmationDialog(){
    this.dialog.open(BanUserDialogComponent, {
      data: {email: this.userEmail, uuid: this.userUuid}

    })
  }

  showDeleteConfirmationDialog(){
    this.dialog.open(DeleteUserDialogComponent, {
      data: {email: this.userEmail, uuid: this.userUuid}
    })
  }
}
