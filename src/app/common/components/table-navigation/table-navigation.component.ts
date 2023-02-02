import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { TableColumnMetaData, TableSortEvent } from 'models/table.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';

@Component({
  selector: 'app-table-navigation',
  templateUrl: './table-navigation.component.html',
  styleUrls: ['./table-navigation.component.scss'],
})
export class TableNavigationComponent extends HandleSubscriptionComponent implements OnInit {
  @Output() sortTable: EventEmitter<TableSortEvent> = new EventEmitter();
  @Input() navigationName: string;
  navigationItems: TableColumnMetaData[] = [];
  params: Params;

  adListNavigationItems = [
    { title: 'Status', columnWidth: 'col-xs-1', keys: ['status'] },
    { title: 'Name', columnWidth: 'col-xs-1', keys: ['name'] },
    { title: 'Preview', columnWidth: 'col-xs-3', keys: ['type'] },
    {
      title: 'Cost',
      columnWidth: 'col-xs-1',
      keys: ['cost'],
      defaultDesc: true,
    },
    {
      title: 'Clicks',
      columnWidth: 'col-xs-1',
      keys: ['clicks'],
      defaultDesc: true,
    },
    {
      title: 'Views',
      columnWidth: 'col-xs-1',
      keys: ['impressions'],
      defaultDesc: true,
    },
    { title: 'CTR', columnWidth: 'col-xs-1', keys: ['ctr'], defaultDesc: true },
    {
      title: 'Avg. CPM',
      columnWidth: 'col-xs-1',
      keys: ['averageCpm'],
      defaultDesc: true,
    },
    {
      title: 'Avg. CPC',
      columnWidth: 'col-xs-1',
      keys: ['averageCpc'],
      defaultDesc: true,
    },
    { title: 'Edit', columnWidth: 'col-xs-1 justify-center', hideArrows: true },
  ];

  campaignListNavigationItems = [
    {
      title: 'Status',
      columnWidth: 'status-cell-width',
      keys: ['basicInformation', 'status'],
    },
    {
      title: 'Campaign title',
      columnWidth: 'col-xs-2',
      keys: ['basicInformation', 'name'],
    },
    {
      title: 'Budget',
      columnWidth: 'col-xs-1',
      keys: ['basicInformation', 'budget'],
      defaultDesc: true,
    },
    {
      title: 'Cost',
      columnWidth: 'col-xs-1',
      keys: ['cost'],
      defaultDesc: true,
    },
    {
      title: 'Clicks',
      columnWidth: 'col-xs-1',
      keys: ['clicks'],
      defaultDesc: true,
    },
    {
      title: 'Views',
      columnWidth: 'col-xs-1',
      keys: ['impressions'],
      defaultDesc: true,
    },
    { title: 'CTR', columnWidth: 'col-xs-1', keys: ['ctr'], defaultDesc: true },
    {
      title: 'Avg. CPM',
      columnWidth: 'col-xs-1',
      keys: ['averageCpm'],
      defaultDesc: true,
    },
    {
      title: 'Avg. CPC',
      columnWidth: 'col-xs-1',
      keys: ['averageCpc'],
      defaultDesc: true,
    },
    {
      title: 'Details',
      columnWidth: 'col-xs-1 justify-center',
      hideArrows: true,
    },
  ];

  siteListNavigationItems = [
    { title: 'Status', columnWidth: 'status-cell-width', keys: ['status'] },
    { title: 'Website name', columnWidth: 'col-xs-3', keys: ['name'] },
    {
      title: 'Est. revenue',
      columnWidth: 'col-xs-1',
      keys: ['revenue'],
      defaultDesc: true,
    },
    {
      title: 'Clicks',
      columnWidth: 'col-xs-1',
      keys: ['clicks'],
      defaultDesc: true,
    },
    {
      title: 'Views',
      columnWidth: 'col-xs-1',
      keys: ['impressions'],
      defaultDesc: true,
    },
    { title: 'CTR', columnWidth: 'col-xs-1', keys: ['ctr'], defaultDesc: true },
    {
      title: 'Avg. RPM',
      columnWidth: 'col-xs-1',
      keys: ['averageRpm'],
      defaultDesc: true,
    },
    {
      title: 'Details',
      columnWidth: 'col-xs-1 justify-center',
      hideArrows: true,
    },
  ];

  userListNavigationItems = [
    { title: 'Email', columnWidth: 'col-xs-6', keys: ['email'] },
    {
      title: 'Wallet balance',
      columnWidth: 'col-xs-2 justify-center',
      hideArrows: true,
    },
    {
      title: 'Bonus balance',
      columnWidth: 'col-xs-2 justify-center',
      hideArrows: true,
    },
    { title: 'Role', columnWidth: 'col-xs-2 justify-center', hideArrows: true },
  ];

  advertiserListNavigationItems = [
    { title: 'Domain', columnWidth: 'col-xs-2', keys: ['domain'] },
    { title: 'Email', columnWidth: 'col-xs-3', keys: ['email'] },

    { title: 'Views', columnWidth: 'col-xs-1-2', keys: ['views'] },
    { title: 'D1', columnWidth: 'col-xs-1-4', keys: ['viewsDiff'] },
    { title: 'C1', columnWidth: 'col-xs-1-4', keys: ['viewsChange'] },

    { title: 'Views Unique', columnWidth: 'col-xs-1-2', keys: ['viewsUnique'] },
    { title: 'D2', columnWidth: 'col-xs-1-4', keys: ['viewsUniqueDiff'] },
    { title: 'C2', columnWidth: 'col-xs-1-4', keys: ['viewsUniqueChange'] },

    { title: 'Clicks', columnWidth: 'col-xs-1-2', keys: ['clicks'] },
    { title: 'D3', columnWidth: 'col-xs-1-4', keys: ['clicksDiff'] },
    { title: 'C3', columnWidth: 'col-xs-1-4', keys: ['clicksChange'] },

    { title: 'CTR', columnWidth: 'col-xs-1-2', keys: ['ctr'] },
    { title: 'D4', columnWidth: 'col-xs-1-4', keys: ['ctrDiff'] },
    { title: 'C4', columnWidth: 'col-xs-1-4', keys: ['ctrChange'] },

    { title: 'Cost', columnWidth: 'col-xs-1-2', keys: ['cost'] },
    { title: 'D5', columnWidth: 'col-xs-1-4', keys: ['costDiff'] },
    { title: 'C5', columnWidth: 'col-xs-1-4', keys: ['costChange'] },

    { title: 'CPM', columnWidth: 'col-xs-1-2', keys: ['cpm'] },
    { title: 'D6', columnWidth: 'col-xs-1-4', keys: ['cpmDiff'] },
    { title: 'C6', columnWidth: 'col-xs-1-4', keys: ['cpmChange'] },

    { title: 'CPC', columnWidth: 'col-xs-1-2', keys: ['cpc'] },
    { title: 'D7', columnWidth: 'col-xs-1-4', keys: ['cpcDiff'] },
    { title: 'C7', columnWidth: 'col-xs-1-4', keys: ['cpcChange'] },
  ];

  publisherListNavigationItems = [
    { title: 'Domain', columnWidth: 'col-xs-3', keys: ['domain'] },
    { title: 'Email', columnWidth: 'col-xs-3', keys: ['email'] },

    { title: 'Views', columnWidth: 'col-xs-1-2', keys: ['views'] },
    { title: 'D1', columnWidth: 'col-xs-1-4', keys: ['viewsDiff'] },
    { title: 'C1', columnWidth: 'col-xs-1-4', keys: ['viewsChange'] },

    { title: 'IVR', columnWidth: 'col-xs-1-2', keys: ['ivr'] },
    { title: 'D2', columnWidth: 'col-xs-1-4', keys: ['ivrDiff'] },
    { title: 'C2', columnWidth: 'col-xs-1-4', keys: ['ivrChange'] },

    { title: 'Clicks', columnWidth: 'col-xs-1-2', keys: ['clicks'] },
    { title: 'D3', columnWidth: 'col-xs-1-4', keys: ['clicksDiff'] },
    { title: 'C3', columnWidth: 'col-xs-1-4', keys: ['clicksChange'] },

    { title: 'CTR', columnWidth: 'col-xs-1-2', keys: ['ctr'] },
    { title: 'D4', columnWidth: 'col-xs-1-4', keys: ['ctrDiff'] },
    { title: 'C4', columnWidth: 'col-xs-1-4', keys: ['ctrChange'] },

    { title: 'Revenue', columnWidth: 'col-xs-1-2', keys: ['revenue'] },
    { title: 'D5', columnWidth: 'col-xs-1-4', keys: ['revenueDiff'] },
    { title: 'C5', columnWidth: 'col-xs-1-4', keys: ['revenueChange'] },

    { title: 'RPM', columnWidth: 'col-xs-1-2', keys: ['rpm'] },
    { title: 'D6', columnWidth: 'col-xs-1-4', keys: ['rpmDiff'] },
    { title: 'C6', columnWidth: 'col-xs-1-4', keys: ['rpmChange'] },
  ];

  adUnitsNavigation = [
    { title: 'Name', columnWidth: 'col-xs-2', keys: ['name'] },
    { title: 'Scope', columnWidth: 'col-xs-2', hideArrows: true },
    {
      title: 'Est. revenue',
      columnWidth: 'col-xs-1',
      keys: ['revenue'],
      defaultDesc: true,
    },
    {
      title: 'Clicks',
      columnWidth: 'col-xs-1',
      keys: ['clicks'],
      defaultDesc: true,
    },
    {
      title: 'Views',
      columnWidth: 'col-xs-1',
      keys: ['impressions'],
      defaultDesc: true,
    },
    { title: 'CTR', columnWidth: 'col-xs-1', keys: ['ctr'], defaultDesc: true },
    {
      title: 'Avg. RPM',
      columnWidth: 'col-xs-1',
      keys: ['averageRpm'],
      defaultDesc: true,
    },
  ];

  classifierListNavigationItems = [
    { title: 'Ad', columnWidth: 'col-xs-7', hideArrows: true },
    { title: 'Ad data', columnWidth: 'col-xs-1', hideArrows: true },
    { title: 'Ad landing url', columnWidth: 'col-xs-2', hideArrows: true },
    { title: 'Action', columnWidth: 'col-xs-2', hideArrows: true },
  ];

  accessTokenItems = [
    { title: 'Name', columnWidth: 'col-xs-3', hideArrows: true },
    { title: 'Scopes', columnWidth: 'col-xs-6', hideArrows: true },
    { title: 'Expires at', columnWidth: 'col-xs-2', hideArrows: true },
    { title: 'Action', columnWidth: 'col-xs-1', hideArrows: true },
  ];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
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
      case 'advertiserListNavigationItems':
        this.navigationItems = [...this.advertiserListNavigationItems];
        break;
      case 'publisherListNavigationItems':
        this.navigationItems = [...this.publisherListNavigationItems];
        break;
      case 'adUnitsNavigation':
        this.navigationItems = [...this.adUnitsNavigation];
        break;
      case 'classifierListNavigation':
        this.navigationItems = [...this.classifierListNavigationItems];
        break;
      case 'accessTokenItems':
        this.navigationItems = [...this.accessTokenItems];
        break;
      default:
        throw new Error('Unsupported table navigation name');
    }

    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe(params => {
        this.params = params;
        if (!params.order) {
          this.navigationItems.forEach(item => {
            if (item.isSortedBy) {
              item.isSortedBy = false;
            }
          });
        }
        this.refresh();
      })
    );
  }

  refresh() {
    if (!this.params || !this.params.sort) {
      return;
    }
    this.sort(this.params.sort, this.params.order != 'asc');
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
    this.sortTable.emit({ keys: column.keys, sortDesc: column.sortedDesc });
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
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        sort: this.normalize(column.title),
        order: column.sortedDesc ? 'desc' : 'asc',
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  normalize(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/, '-');
  }
}
