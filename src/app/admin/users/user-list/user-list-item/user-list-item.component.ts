import { Component, Input } from '@angular/core'
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
import { CODE, CRYPTO } from 'common/utilities/consts'
import { User } from 'models/user.model'
import { ShowDialogOnError } from 'store/common/common.actions'

@Component({
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.scss'],
})
export class UserListItemComponent {
  @Input() user: UserInfo
  loggedUser: User
  faIconEmailConfirmed = faEnvelope
  faIconAdminConfirmed = faCheck
  crypto: string = CRYPTO
  code: string = CODE
  faIconImpersonation = faUserSecret
  isSaving: boolean = false;

  constructor (
    private adminService: AdminService,
    private store: Store<AppState>,
    private impersonationService: ImpersonationService,
    private sessionService: SessionService,
    private router: Router,
  ) {
    this.loggedUser = sessionService.getUser()
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

  get canImpersonate (): boolean {
    return !this.user.isAdmin && !this.user.isModerator
      && this.user.id !== this.loggedUser.id
  }

  get userRole (): string {
    if (this.user.isAdmin) {
      return 'Admin'
    }
    else if (this.user.isModerator) {
      return 'Moderator'
    }
    else if (this.user.isAgency) {
      return 'Agency'
    }
    else if (this.user.isAdvertiser && this.user.isPublisher) {
      return 'Adv / Pub'
    }
    else {
      return this.user.isAdvertiser ? 'Advertiser' : 'Publisher'
    }
  }

  get userRoleTitle (): string {
    if (this.user.isAdmin) {
      return 'Administrator'
    }
    else if (this.user.isModerator) {
      return 'Moderator'
    }
    else if (this.user.isAgency) {
      return 'Agency'
    }
    else if (this.user.isAdvertiser && this.user.isPublisher) {
      return 'Advertiser and Publisher'
    }
    else {
      return this.user.isAdvertiser ? 'Advertiser' : 'Publisher'
    }
  }
}
