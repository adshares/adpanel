import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-table-navigation',
  templateUrl: './table-navigation.component.html',
  styleUrls: ['./table-navigation.component.scss']
})
export class TableNavigationComponent implements OnInit {
  @Input() navigationName: string;
  navigationItems = [];

  adListNavigationItems = [
    { title: 'Status', columnWidth: 'col-xs-1' },
    { title: 'Campaign Title', columnWidth: 'col-xs-4' },
    { title: 'Budget', columnWidth: 'col-xs-1' },
    { title: 'Clicks', columnWidth: 'col-xs-1' },
    { title: 'Impressions', columnWidth: 'col-xs-1' },
    { title: 'CTR', columnWidth: 'col-xs-1' },
    { title: 'Average CPC', columnWidth: 'col-xs-1' },
    { title: 'Cost', columnWidth: 'col-xs-1' },
  ];

  campaignListNavigationItems = [
    { title: 'Status', columnWidth: 'col-xs-1' },
    { title: 'Campaign Title', columnWidth: 'col-xs-4' },
    { title: 'Budget', columnWidth: 'col-xs-1' },
    { title: 'Clicks', columnWidth: 'col-xs-1' },
    { title: 'Impressions', columnWidth: 'col-xs-1' },
    { title: 'CTR', columnWidth: 'col-xs-1' },
    { title: 'Average CPC', columnWidth: 'col-xs-1' },
    { title: 'Cost', columnWidth: 'col-xs-1' },
  ];

  siteListNavigationItems = [
    { title: 'Website Name', columnWidth: 'col-xs-5' },
    { title: 'Estimated Earnings', columnWidth: 'col-xs-2' },
    { title: 'Clicks', columnWidth: 'col-xs-1' },
    { title: 'Impressions', columnWidth: 'col-xs-1' },
    { title: 'Page RPM', columnWidth: 'col-xs-1' },
    { title: 'Average CPC', columnWidth: 'col-xs-1' },
  ];

  userListNavigationItems = [
    { title: '', columnWidth: 'col-xs-3' },
    { title: '', columnWidth: 'col-xs-2' },
    { title: 'Profit', columnWidth: 'col-xs-2' },
    { title: 'Top used keywords', columnWidth: 'col-xs-4' },
    { title: '', columnWidth: 'col-xs-1' },
  ];

  ngOnInit() {
    switch (this.navigationName) {
      case 'adListNavigation':
        this.navigationItems = this.adListNavigationItems;
        break;
      case 'campaignListNavigation':
        this.navigationItems = this.campaignListNavigationItems;
        break;
      case 'siteListNavigation':
        this.navigationItems = this.siteListNavigationItems;
        break;
      case 'userListNavigation':
        this.navigationItems = this.userListNavigationItems;
        break;
    }
  }

}
