import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { siteStatusEnum } from 'models/enum/site.enum';
import { UpdateSiteStatus } from 'store/publisher/publisher.actions';
import { AppState } from 'models/app-state.model';
import { Site } from 'models/site.model';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-site-list-item',
  templateUrl: './site-list-item.component.html',
  styleUrls: ['./site-list-item.component.scss'],
})
export class SiteListItemComponent implements OnInit {
  @Input() site: Site;
  @Input() siteStatuses: any[];
  siteStatusEnum = siteStatusEnum;
  currentSiteStatus: string;
  faChevronRight = faChevronRight;

  constructor(private router: Router, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.setStatusLabel();
  }

  onSiteStatusChange(status: number): void {
    this.site = {
      ...this.site,
      status: siteStatusEnum.PENDING,
    };
    this.setStatusLabel();
    this.store.dispatch(new UpdateSiteStatus({ id: this.site.id, status: status }));
  }

  private setStatusLabel(): void {
    this.currentSiteStatus = siteStatusEnum[this.site.status].toLowerCase();
  }
}
