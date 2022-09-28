import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import {
  faCheck,
  faEnvelope,
  faUserSecret,
} from '@fortawesome/free-solid-svg-icons'
import { UserInfo } from 'models/settings.model'
import { AdminService } from 'admin/admin.service'
import { AppState } from 'models/app-state.model'
import { ImpersonationService } from '../../../../impersonation/impersonation.service'
import { SessionService } from '../../../../session.service'
import { HandleSubscription } from 'common/handle-subscription'
import { CODE, CRYPTO } from 'common/utilities/consts'
import { User } from 'models/user.model'
import { ShowDialogOnError } from 'store/common/common.actions'
import { MatDialog } from '@angular/material/dialog'
import { BanUserDialogComponent } from 'admin/dialog/ban-user-dialog/ban-user-dialog.component'
import { DeleteUserDialogComponent } from 'admin/dialog/delete-user-dialog/delete-user-dialog.component'
import {
  UserConfirmResponseDialogComponent
} from 'common/dialog/user-confirm-response-dialog/user-confirm-response-dialog.component'
import { BanUser, DeleteUser, UnbanUser } from 'store/admin/admin.actions'
import { ServerOptionsService } from 'common/server-options.service'


@Component({
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.scss'],
})
export class UserListItemComponent extends HandleSubscription implements OnInit {
  @Input() user: UserInfo
  loggedUser: User
  faIconEmailConfirmed = faEnvelope
  faIconAdminConfirmed = faCheck
  crypto: string = CRYPTO
  code: string = CODE
  calculateFunds: boolean
  faIconImpersonation = faUserSecret
  isSaving: boolean = false;

  constructor (
    private adminService: AdminService,
    private serverOptionsService: ServerOptionsService,
    private store: Store<AppState>,
    private impersonationService: ImpersonationService,
    private sessionService: SessionService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    super()
  }

  ngOnInit(): void {
    this.loggedUser = this.sessionService.getUser()
    const options = this.serverOptionsService.getOptions()
    this.calculateFunds = options.displayCurrency !== options.appCurrency
  }

  handleConfirmation (): void {
    this.isSaving = true;
    this.adminService.confirmUser(this.user.id).subscribe(
      (user) => {
        this.user = {
          ...this.user,
          ...user,
        }
        this.isSaving = false;
      },
      () => {
        this.isSaving = false;
        this.store.dispatch(new ShowDialogOnError(''));
      }
    )
  }

  handleSwitchingToModerator (): void {
    this.isSaving = true;
    this.adminService.switchToModerator(this.user.id).subscribe(
      (user) => {
        this.user = {
          ...this.user,
          ...user,
        }
        this.isSaving = false;
      },
      () => {
        this.isSaving = false;
        this.store.dispatch(new ShowDialogOnError(''));
      }
    )
  }

  handleSwitchingToAgency (): void {
    this.isSaving = true;
    this.adminService.switchToAgency(this.user.id).subscribe(
      (user) => {
        this.user = {
          ...this.user,
          ...user,
        }
        this.isSaving = false;
      },
      () => {
        this.isSaving = false;
        this.store.dispatch(new ShowDialogOnError(''));
      }
    )
  }

  handleSwitchingToRegular (): void {
    this.isSaving = true;
    this.adminService.switchToRegular(this.user.id).subscribe(
      (user) => {
        this.user = {
          ...this.user,
          ...user,
        }
        this.isSaving = false;
      },
      () => {
        this.isSaving = false;
        this.store.dispatch(new ShowDialogOnError(''));
      }
    )
  }

  handleImpersonating (): void {
    this.adminService.impersonateUser(this.user.id).subscribe(
      (token) => {
        this.impersonationService.setImpersonationToken(token)
        if (this.user.isPublisher) {
          this.router.navigate(['/publisher', 'dashboard'])
          this.sessionService.setAccountTypeChoice('publisher')
        }
        else {
          this.router.navigate(['/advertiser', 'dashboard'])
          this.sessionService.setAccountTypeChoice('advertiser')
        }
      },
    )
  }

  handleUserRightsChange(operation: string): void {
    this.isSaving = true;
    this.adminService.changeUserRights(this.user.id, operation).subscribe(
      (user) => {
        this.user = {
          ...this.user,
          ...user,
        }
        this.isSaving = false;
      },
      () => {
        this.isSaving = false;
        this.store.dispatch(new ShowDialogOnError(''));
      }
    )
  }

  get canImpersonate (): boolean {
    return !this.user.isAdmin && !this.user.isModerator
      && this.user.id !== this.loggedUser.id
  }

  get userRole (): string {
    if (this.user.isAdmin) {
      return 'Admin'
    }
    else if (this.user.isBanned) {
      return 'Banned'
    }
    else if (this.user.isModerator) {
      return 'Moderator'
    }
    else if (this.user.isAgency) {
      return 'Agency'
    }
    else if (this.user.isAdvertiser) {
      return this.user.isPublisher ? 'Adv / Pub' : 'Advertiser'
    }
    else if (this.user.isPublisher) {
      return 'Publisher'
    }
    else {
      return 'No role'
    }
  }

  get userRoleTitle (): string {
    if (this.user.isAdmin) {
      return 'Administrator'
    }
    else if (this.user.isBanned) {
      return 'Banned'
    }
    else if (this.user.isModerator) {
      return 'Moderator'
    }
    else if (this.user.isAgency) {
      return 'Agency'
    }
    else if (this.user.isAdvertiser) {
      return this.user.isPublisher ? 'Advertiser and Publisher' : 'Advertiser'
    }
    else if (this.user.isPublisher) {
      return 'Publisher'
    }
    else {
      return 'User has no advertiser nor publisher role'
    }
  }

  showBanConfirmationDialog(){
    this.dialog.open(BanUserDialogComponent, {
      autoFocus: false,
      data: this.user
    })
      .afterClosed()
      .subscribe(result => {
        if(result) {
          this.store.dispatch(new BanUser({ id: this.user.id, reason: result }))
        }
      })
  }

  showUnbanConfirmationDialog(){
    this.dialog.open(UserConfirmResponseDialogComponent, {
      data: {
        message: `Do you want unban user ${this.user.email}?`
      }
    })
      .afterClosed()
      .subscribe(result => {
        if(result){
          this.store.dispatch(new UnbanUser(this.user.id))
        }
      })
  }

  showDeleteConfirmationDialog(){
    this.dialog.open(DeleteUserDialogComponent, {
      data: this.user.email
    })
      .afterClosed()
      .subscribe(result => {
        if(result){
          this.store.dispatch(new DeleteUser(this.user.id))
        }
      })
  }
}
