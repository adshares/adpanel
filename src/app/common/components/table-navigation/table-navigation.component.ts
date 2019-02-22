import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {TableColumnMetaData} from 'models/table.model';

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
    {title: 'Status', columnWidth: 'col-xs-1', keys: ['status'], sortAsc: true},
    {title: 'Name', columnWidth: 'col-xs-1', keys: ['name'], sortAsc: true},
    {title: 'Type', columnWidth: 'col-xs-4', keys: ['type'], sortAsc: true},
    {title: 'Clicks', columnWidth: 'col-xs-1', keys: ['clicks'], sortAsc: true},
    {title: 'Views', columnWidth: 'col-xs-1', keys: ['impressions'], sortAsc: true},
    {title: 'CTR', columnWidth: 'col-xs-1', keys: ['ctr'], sortAsc: true},
    {title: 'Avg. CPC', columnWidth: 'col-xs-1', keys: ['averageCpc'], sortAsc: true},
    {title: 'Cost', columnWidth: 'col-xs-1', keys: ['cost'], sortAsc: true},
    {columnWidth: 'col-xs-1', hideArrows: true}
  ];

  campaignListNavigationItems = [
    {title: 'Status', columnWidth: 'col-xs-1', keys: ['basicInformation', 'status'], sortAsc: true},
    {title: 'Campaign Title', columnWidth: 'col-xs-4', keys: ['basicInformation', 'name'], sortAsc: true},
    {title: 'Budget', columnWidth: 'col-xs-1', keys: ['basicInformation', 'budget'], sortAsc: true},
    {title: 'Clicks', columnWidth: 'col-xs-1', keys: ['clicks'], sortAsc: true},
    {title: 'Views', columnWidth: 'col-xs-1', keys: ['impressions'], sortAsc: true},
    {title: 'CTR', columnWidth: 'col-xs-1', keys: ['ctr'], sortAsc: true},
    {title: 'Avg. CPC', columnWidth: 'col-xs-1', keys: ['averageCpc'], sortAsc: true},
    {title: 'Cost', columnWidth: 'col-xs-1', keys: ['cost'], sortAsc: true},
    {title: 'Edit', columnWidth: 'col-xs-1 justify-center', hideArrows: true}
  ];

  siteListNavigationItems = [
    {title: 'Status', columnWidth: 'col-xs-1', keys: ['status'], sortAsc: true},
    {title: 'Website Name', columnWidth: 'col-xs-5', keys: ['name'], sortAsc: true},
    {title: 'Est. Revenue', columnWidth: 'col-xs-1', keys: ['cost'], sortAsc: true},
    {title: 'Clicks', columnWidth: 'col-xs-1', keys: ['clicks'], sortAsc: true},
    {title: 'Views', columnWidth: 'col-xs-1', keys: ['impressions'], sortAsc: true},
    {title: 'Page RPM', columnWidth: 'col-xs-1', keys: ['rpm'], sortAsc: true},
    {title: 'Avg. Rpc', columnWidth: 'col-xs-1', keys: ['averageRpc'], sortAsc: true},
    {columnWidth: 'col-xs-1', hideArrows: true}
  ];

  userListNavigationItems = [
    {title: '', columnWidth: 'col-xs-4'},
    {title: '', columnWidth: 'col-xs-2'},
    {title: 'Profit', columnWidth: 'col-xs-2', keys: ['profit'], sortAsc: true},
    {title: 'Top used keywords', columnWidth: 'col-xs-4'}
  ];

  adUnitsNavigation = [
    {title: 'Miniature', columnWidth: 'col-xs-1', hideArrows: true},
    {title: 'Name', columnWidth: 'col-xs-1', keys: ['name'], sortAsc: true},
    {title: 'Size', columnWidth: 'col-xs-1', hideArrows: true},
    {title: 'Tags', columnWidth: 'col-xs-2', hideArrows: true},

    {title: 'Est. Revenue', columnWidth: 'col-xs-1', keys: ['revenue'], sortAsc: true},
    {title: 'Clicks', columnWidth: 'col-xs-1', keys: ['clicks'], sortAsc: true},
    {title: 'Views', columnWidth: 'col-xs-1', keys: ['impressions'], sortAsc: true},
    {title: 'Avg. Rpm', columnWidth: 'col-xs-1', keys: ['averageRpm'], sortAsc: true},
    {title: 'Avg. Rpc', columnWidth: 'col-xs-1', keys: ['averageRpc'], sortAsc: true},
    {title: 'Code', columnWidth: 'col-xs-1', hideArrows: true}
  ];

  classifierListNavigationItems = [
    {title: 'Ad', columnWidth: 'col-xs-7', hideArrows: true},
    {title: 'Ad data', columnWidth: 'col-xs-1', hideArrows: true},
    {title: 'Campaign', columnWidth: 'col-xs-2', hideArrows: true},
    {title: 'Action', columnWidth: 'col-xs-2', hideArrows: true}
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
      case 'adUnitsNavigation':
        this.navigationItems = [...this.adUnitsNavigation];
        break;
      case 'classifierListNavigation':
        this.navigationItems = [...this.classifierListNavigationItems];
        break;
    }
  }

  sortTableByKey(columnMetaData: TableColumnMetaData) {
    this.sortTable.emit(columnMetaData);

    this.navigationItems.forEach(item => item.isSortedBy = false);

    columnMetaData.isSortedBy = true;
  }
}
