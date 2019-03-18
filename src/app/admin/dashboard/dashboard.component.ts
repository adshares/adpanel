import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { LoadAdminSettings, LoadAdminSettingsSuccess } from 'store/admin/admin.actions.ts'
import { AppState } from 'models/app-state.model';
import { ChartService } from 'common/chart.service';
import { ChartComponent } from 'common/components/chart/chart.component';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';
import { ChartData } from 'models/chart/chart-data.model';
import { HandleSubscription } from 'common/handle-subscription';
import { createInitialArray } from 'common/utilities/helpers';
import { fadeAnimation } from "common/animations/fade.animation";
import { AdminSettings } from "models/settings.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [fadeAnimation]
})
export class DashboardComponent extends HandleSubscription implements OnInit {
  @ViewChild(ChartComponent) appChartRef: ChartComponent;

  barChartValue: number;
  barChartDifference: number;
  barChartDifferenceInPercentage: number;
  barChartLabels: any = createInitialArray({labels: []}, 3);
  barChartData: ChartData[][] = createInitialArray([{data: []}], 3);
  currentChartFilterSettings: ChartFilterSettings;

  settings = [ // FIXME move to separate constants file
    {
      title: 'General Settings',
      description: '',
      link: '/admin/dashboard/general',
      values: [
        // {name: 'Branding', icon: 'assets/images/preferences.svg'},
        {name: 'Business name', icon: 'assets/images/preferences.svg'},
        {name: 'Technical e-mail', icon: 'assets/images/preferences.svg'},
        {name: 'Support e-mail', icon: 'assets/images/preferences.svg'},
      ],
    },
    {
      title: 'Finances Settings',
      description: '',
      link: '/admin/dashboard/finances',
      values: [
        {name: 'Earnings', icon: 'assets/images/wallet--gray.svg'},
        {name: 'Transfers thresholds', icon: 'assets/images/wallet--gray.svg'},
      ],
    },
    // {
    //   title: 'Policies Settings',
    //   description: '',
    //   link: '/admin/dashboard/policies',
    //   values: [
    //     {name: 'Privacy policy', icon: 'assets/images/preferences.svg'},
    //     {name: 'Regulations', icon: 'assets/images/preferences.svg'},
    //   ],
    // }, {
    //   title: 'Reports',
    //   description: '',
    //   link: '/admin/dashboard/reports',
    //   values: [
    //     {name: 'Reports and charts', icon: 'assets/images/preferences.svg'},
    //   ],
    // },
    {
      title: 'Account Settings',
      description: '',
      link: '/admin/dashboard/account',
      values: [
        {name: 'Email & Password', icon: 'assets/images/preferences.svg'},
      ],
    },
  ];

  constructor(
    private chartService: ChartService,
    private store: Store<AppState>,
  ) {
    super();
  }

  getRouterOutletState = (outlet) => outlet.isActivated ? outlet.activatedRoute : '';

  ngOnInit() {
    this.store.dispatch(new LoadAdminSettings());
  }

}
