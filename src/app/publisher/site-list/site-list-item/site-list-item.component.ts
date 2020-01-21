import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { siteStatusEnum } from 'models/enum/site.enum.ts';
import { UpdateSiteStatus } from 'store/publisher/publisher.actions';
import { AppState } from 'models/app-state.model';
import { Site } from 'models/site.model';

@Component({
  selector: 'app-site-list-item',
  templateUrl: './site-list-item.component.html',
  styleUrls: ['./site-list-item.component.scss']
})
export class SiteListItemComponent implements OnInit {
  @Input() site: Site;
  @Input() siteStatuses: any[];
  siteStatusEnum = siteStatusEnum;
  currentSiteStatus: string;

  constructor(private router: Router,
              private store: Store<AppState>) {
  }

  ngOnInit() {
    this.currentSiteStatus = typeof this.site.status === 'number' && this.siteStatusEnum[this.site.status].toLowerCase();
  }

  onSiteStatusChange(status) {
    this.site.status = this.siteStatuses.findIndex(el => el.value === status.value);
    this.currentSiteStatus = status.value;
    this.store.dispatch(new UpdateSiteStatus(this.site));
  }
}
