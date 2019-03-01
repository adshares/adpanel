import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from "@ngrx/store";
import {siteStatusEnum} from 'models/enum/site.enum.ts';
import {enumToArray} from "common/utilities/helpers";
import {MatDialog} from "@angular/material";
import {UpdateSiteStatus} from "store/publisher/publisher.actions";
import {AppState} from "models/app-state.model";

@Component({
  selector: 'app-site-list-item',
  templateUrl: './site-list-item.component.html',
  styleUrls: ['./site-list-item.component.scss']
})
export class SiteListItemComponent implements OnInit {
  @Input() site;
  siteStatusEnum = siteStatusEnum;
  siteStatusEnumArray = enumToArray(siteStatusEnum);
  currentSiteStatus: string;

  constructor(private router: Router,
              private dialog: MatDialog,
              private store: Store<AppState>) {
  }

  ngOnInit() {
    this.currentSiteStatus = siteStatusEnum[this.site.status].toLowerCase();
  }

  onSiteStatusChange(status) {
    this.site.status = this.siteStatusEnumArray.findIndex(el => el === status.value);
    this.currentSiteStatus = status.value;
    this.store.dispatch(new UpdateSiteStatus(this.site));
  }

  navigateToSiteDetails(siteId: number) {
    this.router.navigate(['/publisher', 'site', siteId]);
  }
}
