import { Component, OnInit } from '@angular/core';
import { AppState } from 'models/app-state.model';
import { GetLicense, LoadAdminSettings, RequestGetIndex } from 'store/admin/admin.actions';
import { Store } from '@ngrx/store';
import { HandleSubscription } from 'common/handle-subscription';
import { License } from 'models/settings.model';
import { AdminService } from 'admin/admin.service';
import { DATE_AND_TIME_FORMAT } from 'common/utilities/consts';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { timer } from 'rxjs/observable/timer';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends HandleSubscription implements OnInit {
  readonly PREVIEW_URL: string = `${window.location.protocol}//${window.location.host}/preview`;
  private readonly DAYS_TO_DISPLAY_MESSAGE_AFTER_INDEX_UPDATE = 3;
  private readonly PREVIEW_GENERATING_DELAY_MINUTES = 6;
  showIndexUpdateMessage: boolean = false;
  showIndexUpdateError: boolean = false;
  showPreviewLink: boolean = false;
  indexUpdateTime: string | null = null;
  checkIfPreviewReady: Subscription | null = null;
  isPanelBlocked: boolean = false;
  licenseDetailUrl: string = null;
  settings = [
    {
      title: 'Users',
      description: '',
      link: '/admin/dashboard/users',
      values: [
        {name: 'Users List', icon: 'assets/images/user-gray.svg'},
        {name: 'Publishers', icon: 'assets/images/user-gray.svg'},
        {name: 'Reports', icon: 'assets/images/user-gray.svg'},
      ],
    },
    {
      title: 'General settings',
      description: '',
      link: '/admin/dashboard/general',
      values: [
        {name: 'License', icon: 'assets/images/preferences.svg'},
        {name: 'Set business name', icon: 'assets/images/preferences.svg'},
        {name: 'Set technical email', icon: 'assets/images/preferences.svg'},
        {name: 'Set support email', icon: 'assets/images/preferences.svg'},
        {name: 'Rejected domains', icon: 'assets/images/preferences.svg'},
        {name: 'Bid strategy', icon: 'assets/images/preferences.svg'},
      ],
    },
    {
      title: 'Finance settings',
      description: '',
      link: '/admin/dashboard/finance',
      values: [
        {name: 'Set your commissions', icon: 'assets/images/wallet--gray.svg'},
        {name: 'Wallet status', icon: 'assets/images/wallet--gray.svg'},
        {name: 'Referral settings', icon: 'assets/images/wallet--gray.svg'},
        {name: 'Set your thresholds', icon: 'assets/images/wallet--gray.svg'},
      ],
    },
    {
      title: 'Privacy settings',
      description: '',
      link: '/admin/dashboard/privacy',
      values: [
        {name: 'Privacy', icon: 'assets/images/preferences.svg'},
        {name: 'Terms and conditions', icon: 'assets/images/preferences.svg'},
      ],
    },
    {
      title: 'Panel placeholders',
      description: '',
      link: '/admin/dashboard/placeholders',
      values: [
        {name: 'index.html', icon: 'assets/images/preferences.svg'},
        {name: 'robots.txt', icon: 'assets/images/preferences.svg'},
      ],
    },
    {
      title: 'Rebranding',
      description: '',
      link: '/admin/dashboard/rebranding',
      values: [
        {name: 'Image assets', icon: 'assets/images/preferences.svg'},
      ],
    },
    {
      title: 'Account settings',
      description: '',
      link: '/admin/dashboard/account',
      values: [
        {name: 'Email & password', icon: 'assets/images/preferences.svg'},
        {name: 'Referral links', icon: 'assets/images/preferences.svg'},
      ],
    },
  ];

  constructor(
    private adminService: AdminService,
    private store: Store<AppState>,
  ) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(new LoadAdminSettings());
    this.store.dispatch(new GetLicense());
    this.store.dispatch(new RequestGetIndex());
    const adminStoreSettingsSubscription = this.store.select('state', 'admin', 'panelBlockade')
      .subscribe((isBlocked: boolean) => {
        this.isPanelBlocked = isBlocked;
      });

    if (this.isPanelBlocked) {
      const licenseSubscription = this.store.select('state', 'admin', 'license')
        .subscribe((license: License) => {
          this.licenseDetailUrl = license.detailsUrl;
        });
      this.subscriptions.push(licenseSubscription);
    }

    const adminStoreIndexSubscription = this.store.select('state', 'admin', 'index')
      .subscribe((index) => {
        if (null === index) {
          return;
        }

        if (index.error) {
          this.showIndexUpdateError = true;
          return;
        }

        const date = moment(index.updateTime);
        this.indexUpdateTime = date.format(DATE_AND_TIME_FORMAT);
        this.showIndexUpdateMessage = moment().diff(date, 'days', true) < this.DAYS_TO_DISPLAY_MESSAGE_AFTER_INDEX_UPDATE;
        if (null !== this.checkIfPreviewReady) {
          this.checkIfPreviewReady.unsubscribe();
        }
        if (this.showIndexUpdateMessage) {
          this.showPreviewLink = moment().diff(date, 'minutes', true) >= this.PREVIEW_GENERATING_DELAY_MINUTES;
          if (!this.showPreviewLink) {
            this.checkIfPreviewReady = timer(60000, 60000)
              .pipe(takeWhile(() => !this.showPreviewLink))
              .subscribe(() => {
                this.showPreviewLink = moment().diff(date, 'minutes', true) >= this.PREVIEW_GENERATING_DELAY_MINUTES;
              });
          }
        }
        this.showIndexUpdateError = false;
      });

    this.subscriptions.push(adminStoreSettingsSubscription, adminStoreIndexSubscription);
  }

  ngOnDestroy() {
    if (null !== this.checkIfPreviewReady) {
      this.checkIfPreviewReady.unsubscribe();
    }
    super.ngOnDestroy();
  }
}

