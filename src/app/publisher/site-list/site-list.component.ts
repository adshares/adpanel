import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.scss']
})
export class SiteListComponent implements OnInit {
  menuItems = [
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
  }

}
