import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { TableColumnMetaData, TableSortEvent } from 'models/table.model';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { HandleSubscription } from "common/handle-subscription";

@Component({
  selector: 'app-table-navigation',
  templateUrl: './table-navigation.component.html',
  styleUrls: ['./table-navigation.component.scss']
})
export class TableNavigationComponent extends HandleSubscription implements OnInit {
  @Output() sortTable: EventEmitter<TableSortEvent> = new EventEmitter();
  @Input() navigationName: string;
  navigationItems: TableColumnMetaData[] = [];
  params: Params;

  adListNavigationItems = [
    {title: 'Status', columnWidth: 'col-xs-1', keys: ['status'], sortAsc: null},
    {title: 'Name', columnWidth: 'col-xs-1', keys: ['name'], sortAsc: null},
    {title: 'Preview', columnWidth: 'col-xs-3', keys: ['type'], sortAsc: null},
    {title: 'Cost', columnWidth: 'col-xs-1', keys: ['cost'], sortAsc: null},
    {title: 'Clicks', columnWidth: 'col-xs-1', keys: ['clicks'], sortAsc: null},
    {title: 'Views', columnWidth: 'col-xs-1', keys: ['impressions'], sortAsc: null},
    {title: 'CTR', columnWidth: 'col-xs-1', keys: ['ctr'], sortAsc: null},
    {title: 'Avg. CPM', columnWidth: 'col-xs-1', keys: ['averageCpm'], sortAsc: null},
    {title: 'Avg. CPC', columnWidth: 'col-xs-1', keys: ['averageCpc'], sortAsc: null},
    {title: 'Edit', columnWidth: 'col-xs-1 justify-center', hideArrows: true}
  ];

  campaignListNavigationItems = [
    {title: 'Status', columnWidth: 'status-cell-width', keys: ['basicInformation', 'status']},
    {title: 'Campaign title', columnWidth: 'col-xs-2', keys: ['basicInformation', 'name']},
    {title: 'Budget', columnWidth: 'col-xs-1', keys: ['basicInformation', 'budget'], defaultDesc: true},
    {title: 'Cost', columnWidth: 'col-xs-1', keys: ['cost'], defaultDesc: true},
    {title: 'Clicks', columnWidth: 'col-xs-1', keys: ['clicks'], defaultDesc: true},
    {title: 'Views', columnWidth: 'col-xs-1', keys: ['impressions'], defaultDesc: true},
    {title: 'CTR', columnWidth: 'col-xs-1', keys: ['ctr'], defaultDesc: true},
    {title: 'Avg. CPM', columnWidth: 'col-xs-1', keys: ['averageCpm'], defaultDesc: true},
    {title: 'Avg. CPC', columnWidth: 'col-xs-1', keys: ['averageCpc'], defaultDesc: true},
    {title: 'Details', columnWidth: 'col-xs-1 justify-center', hideArrows: true}
  ];

  siteListNavigationItems = [
    {title: 'Status', columnWidth: 'status-cell-width', keys: ['status'], sortAsc: null},
    {title: 'Website name', columnWidth: 'col-xs-3', keys: ['name'], sortAsc: null},
    {title: 'Est. revenue', columnWidth: 'col-xs-1', keys: ['revenue'], sortAsc: null},
    {title: 'Clicks', columnWidth: 'col-xs-1', keys: ['clicks'], sortAsc: null},
    {title: 'Views', columnWidth: 'col-xs-1', keys: ['impressions'], sortAsc: null},
    {title: 'CTR', columnWidth: 'col-xs-1', keys: ['ctr'], sortAsc: null},
    {title: 'Avg. RPM', columnWidth: 'col-xs-1', keys: ['averageRpm'], sortAsc: null},
    {title: 'Details', columnWidth: 'col-xs-1 justify-center', hideArrows: true}
  ];

  userListNavigationItems = [
    {title: 'email', columnWidth: 'col-xs-4', keys: ['email'], sortAsc: null},
    {title: 'role', columnWidth: 'col-xs-2', hideArrows: true},
    {title: 'Impersonate', columnWidth: 'col-xs-2', hideArrows: true}
  ];

  adUnitsNavigation = [
    {title: 'Name', columnWidth: 'col-xs-1', keys: ['name'], sortAsc: null},
    {title: 'Size', columnWidth: 'col-xs-1', hideArrows: true},
    {title: 'Tags', columnWidth: 'col-xs-2', hideArrows: true},
    {title: 'Est. revenue', columnWidth: 'col-xs-1', keys: ['revenue'], sortAsc: null},
    {title: 'Clicks', columnWidth: 'col-xs-1', keys: ['clicks'], sortAsc: null},
    {title: 'Views', columnWidth: 'col-xs-1', keys: ['impressions'], sortAsc: null},
    {title: 'CTR', columnWidth: 'col-xs-1', keys: ['ctr'], sortAsc: null},
    {title: 'Avg. RPM', columnWidth: 'col-xs-1', keys: ['averageRpm'], sortAsc: null},
    {title: 'Code', columnWidth: 'col-xs-1', hideArrows: true}
  ];

  classifierListNavigationItems = [
    {title: 'Ad', columnWidth: 'col-xs-7', hideArrows: true},
    {title: 'Ad data', columnWidth: 'col-xs-1', hideArrows: true},
    {title: 'Ad landing url', columnWidth: 'col-xs-2', hideArrows: true},
    {title: 'Action', columnWidth: 'col-xs-2', hideArrows: true}
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    super();
  }

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

    this.subscriptions.push(this.activatedRoute.queryParams.subscribe(params => {
      this.params = params;
      this.refresh()
    }));
  }

  refresh() {
    if (!this.params || !this.params.sort) {
      return;
    }
    this.sort(this.params.sort, this.params.order != 'asc')
  }

  sort(name: string, sortDesc: boolean = true) {

    const column = this.navigationItems.find(item => this.normalize(item.title) == name);
    if (!column || column.hideArrows) {
      return;
    }

    this.navigationItems.forEach(item => {
      item.isSortedBy = false;
      item.sortedDesc = null;
    });
    column.isSortedBy = true;
    column.sortedDesc = sortDesc;
    this.sortTable.emit({keys: column.keys, sortDesc: column.sortedDesc});
  }

  sortTableByColumn(column: TableColumnMetaData) {

    if (column.hideArrows) {
      return;
    }

    if (column.sortedDesc === null) {
      column.sortedDesc = !!column.defaultDesc;
    } else {
      column.sortedDesc = !column.sortedDesc;
    }
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {
          sort: this.normalize(column.title),
          order: column.sortedDesc ? 'desc' : 'asc'
        },
        queryParamsHandling: 'merge'
      });
  }

  normalize(name: string) {
    return name.toLowerCase().replace(/[^a-z]+/, '-');
  }
}
