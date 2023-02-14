import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { AddFundsDialogComponent } from 'common/dialog/add-funds-dialog/add-funds-dialog.component';
import { userRolesEnum } from 'models/enum/user.enum';
import { AuthService } from 'app/auth.service';
import { SessionService } from 'app/session.service';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { User } from 'models/user.model';
import { environment } from 'environments/environment';
import { SetUser } from 'store/auth/auth.actions';
import { CODE, CRYPTO } from 'common/utilities/consts';
import { faChevronDown, faGears, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import {
  faComments,
  faCreditCard,
  faEnvelope,
  faLifeRing,
  faPaperPlane,
  faUser,
} from '@fortawesome/free-regular-svg-icons';
import { ServerOptionsService } from 'common/server-options.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends HandleSubscriptionComponent implements OnInit {
  supportEmail;
  supportTelegram;
  supportChat;
  crypto: string = CRYPTO;
  code: string = CODE;
  calculateFunds: boolean;
  totalFunds: number;
  isTotalFundsValid: boolean = false;
  userType: number;
  userLabel: string;
  activeUserType: number;
  userRolesEnum = userRolesEnum;
  userRole: string;
  settingsMenuOpen = false;
  helpMenuOpen = false;
  rolesMenuOpen = false;
  landingPageUrl: string = null;
  name: string = null;
  envContext: string | null = environment.context;
  adControllerUrl = environment.adControllerUrl;
  actAsAdvertiser: boolean;
  actAsPublisher: boolean;
  faGears = faGears;
  faLifeRing = faLifeRing;
  faEnvelope = faEnvelope;
  faPaperPlane = faPaperPlane;
  faComments = faComments;
  faUser = faUser;
  faPlusCircle = faPlusCircle;
  faChevronDown = faChevronDown;
  faCreditCard = faCreditCard;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    public auth: AuthService,
    private serverOptionsService: ServerOptionsService,
    public session: SessionService,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit(): void {
    const options = this.serverOptionsService.getOptions();
    this.calculateFunds = options.displayCurrency !== options.appCurrency;
    this.supportChat = options.supportChat;
    this.supportEmail = options.supportEmail;
    this.supportTelegram = options.supportTelegram;
    this.store.dispatch(new SetUser());

    this.userLabel = this.session.getUserLabel();

    if (this.session.isAdmin()) {
      this.userType = userRolesEnum.ADMIN;
    } else if (this.session.isModerator()) {
      this.userType = userRolesEnum.MODERATOR;
    } else if (this.session.isAgency()) {
      this.userType = userRolesEnum.AGENCY;
    } else if (this.session.isPublisher()) {
      this.userType = userRolesEnum.PUBLISHER;
    } else if (this.session.isAdvertiser()) {
      this.userType = userRolesEnum.ADVERTISER;
    }

    const accountType = this.session.getAccountTypeChoice();
    switch (accountType) {
      case SessionService.ACCOUNT_TYPE_ADMIN:
        this.activeUserType = userRolesEnum.ADMIN;
        break;
      case SessionService.ACCOUNT_TYPE_MODERATOR:
        this.activeUserType = userRolesEnum.MODERATOR;
        break;
      case SessionService.ACCOUNT_TYPE_AGENCY:
        this.activeUserType = userRolesEnum.AGENCY;
        break;
      case SessionService.ACCOUNT_TYPE_PUBLISHER:
        this.activeUserType = userRolesEnum.PUBLISHER;
        break;
      case SessionService.ACCOUNT_TYPE_ADVERTISER:
        this.activeUserType = userRolesEnum.ADVERTISER;
        break;
    }

    this.userRole = accountType;

    const userDataStateSubscription = this.store.select('state', 'user', 'data').subscribe((data: User) => {
      this.totalFunds = data.adserverWallet.totalFunds;
      this.isTotalFundsValid = data.isAdserverWalletValid;
      this.actAsAdvertiser = data.isAdvertiser;
      this.actAsPublisher = data.isPublisher;
    });

    this.store
      .select('state', 'common', 'info')
      .pipe(take(1))
      .subscribe(info => {
        this.landingPageUrl = info.landingUrl;
        this.name = info.name;
      });

    this.subscriptions.push(userDataStateSubscription);
  }

  setActiveUserType(userType) {
    this.session.setAccountTypeChoice(userRolesEnum[userType].toLowerCase());
    this.router.navigate([`/${userRolesEnum[userType].toLowerCase()}`, 'dashboard']);
  }

  toggleSettingsMenu(state) {
    this.settingsMenuOpen = state;
  }

  toggleHelpMenu(state) {
    this.helpMenuOpen = state;
  }

  toggleRolesMenu(state) {
    this.rolesMenuOpen = state;
  }

  openAddFundsDialog() {
    this.dialog.open(AddFundsDialogComponent);
  }

  logout() {
    this.auth.logout();
  }
}
