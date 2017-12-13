import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-table-navigation',
  templateUrl: './table-navigation.component.html',
  styleUrls: ['./table-navigation.component.scss']
})
export class TableNavigationComponent implements OnInit {
  @Input() navigationName;
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

  constructor() { }

  ngOnInit() {
    switch (this.navigationName) {
      case 'adListNavigation':
        this.navigationItems = this.adListNavigationItems;
        break;
      case 'campaignListNavigation':
        this.navigationItems = this.campaignListNavigationItems;
        break;
    }
  }

}
