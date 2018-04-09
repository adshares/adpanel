import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

import { TableColumnMetaData } from 'models/table.model';

@Component({
  selector: 'app-table-navigation',
  templateUrl: './table-navigation.component.html',
  styleUrls: ['./table-navigation.component.scss']
})
export class TableNavigationComponent implements OnInit {
  @Output() sortTable: EventEmitter<TableColumnMetaData> = new EventEmitter();
  @Input() navigationName: string;

  navigationItems: TableColumnMetaData[] = [];

  adListNavigationItems = [
    { title: 'Status', columnWidth: 'col-xs-2', keys: ['status'], sortAsc: true },
    { title: 'Campaign Title', columnWidth: 'col-xs-3', keys: ['shortHeadline'], sortAsc: true },
    { title: 'Budget', columnWidth: 'col-xs-1', keys: ['budget'], sortAsc: true },
    { title: 'Clicks', columnWidth: 'col-xs-1', keys: ['clicks'], sortAsc: true },
    { title: 'Impressions', columnWidth: 'col-xs-1', keys: ['impressions'], sortAsc: true },
    { title: 'CTR', columnWidth: 'col-xs-1', keys: ['ctr'], sortAsc: true },
    { title: 'Average CPC', columnWidth: 'col-xs-1', keys: ['averageCPC'], sortAsc: true },
    { title: 'Cost', columnWidth: 'col-xs-1', keys: ['cost'], sortAsc: true }
  ];

  campaignListNavigationItems = [
    { title: 'Status', columnWidth: 'col-xs-1', keys: ['basicInformation', 'status'], sortAsc: true },
    { title: 'Campaign Title', columnWidth: 'col-xs-4', keys: ['basicInformation', 'name'], sortAsc: true },
    { title: 'Budget', columnWidth: 'col-xs-1', keys: ['basicInformation', 'budget'], sortAsc: true },
    { title: 'Clicks', columnWidth: 'col-xs-1', keys: ['clicks'], sortAsc: true },
    { title: 'Impressions', columnWidth: 'col-xs-1', keys: ['impressions'], sortAsc: true },
    { title: 'CTR', columnWidth: 'col-xs-1', keys: ['ctr'], sortAsc: true },
    { title: 'Average CPC', columnWidth: 'col-xs-1', keys: ['averageCPC'], sortAsc: true },
    { title: 'Cost', columnWidth: 'col-xs-1', keys: ['cost'], sortAsc: true }
  ];

  siteListNavigationItems = [
    { title: 'Website Name', columnWidth: 'col-xs-5', keys: ['websiteUrl'], sortAsc: true },
    { title: 'Estimated Earnings', columnWidth: 'col-xs-2', keys: ['estimatedEarnings'], sortAsc: true },
    { title: 'Clicks', columnWidth: 'col-xs-1', keys: ['clicks'], sortAsc: true },
    { title: 'Impressions', columnWidth: 'col-xs-1', keys: ['impressions'], sortAsc: true },
    { title: 'Page RPM', columnWidth: 'col-xs-1', keys: ['rpm'], sortAsc: true },
    { title: 'Average CPC', columnWidth: 'col-xs-1', keys: ['averageCPC'], sortAsc: true }
  ];

  userListNavigationItems = [
    { title: '', columnWidth: 'col-xs-4' },
    { title: '', columnWidth: 'col-xs-2' },
    { title: 'Profit', columnWidth: 'col-xs-2', keys: ['profit'], sortAsc: true },
    { title: 'Top used keywords', columnWidth: 'col-xs-4' }
  ];

  ngOnInit() {
    switch (this.navigationName) {
      case 'adListNavigation':
        this.navigationItems = [...this.adListNavigationItems];
        break;
      case 'campaignListNavigation':
        this.navigationItems = [...this.campaignListNavigationItems];
        break;
      case 'siteListNavigation':
        this.navigationItems = [...this.siteListNavigationItems];
        break;
      case 'userListNavigation':
        this.navigationItems = [...this.userListNavigationItems];
        break;
    }
  }

  sortTableByKey(columnMetaData: TableColumnMetaData) {
    this.sortTable.emit(columnMetaData);

    this.navigationItems.map((item) => {
      item.isSortedBy = false;
    });

    columnMetaData.isSortedBy = true;
  }
}
