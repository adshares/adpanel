import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { RequestReport } from 'store/common/common.actions';
import { reportType } from 'models/enum/user.enum';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-reports',
  templateUrl: './user-reports.component.html',
  styleUrls: ['./user-reports.component.scss'],
})
export class UserReportsComponent implements OnInit {
  from: FormControl = new FormControl();
  to: FormControl = new FormControl();
  today = new Date();
  faDownload = faDownload;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.from.setValue(moment().subtract(30, 'days').startOf('day').format());
    this.to.setValue(moment().endOf('day').format());
  }

  getReportAdvertisers() {
    this.store.dispatch(
      new RequestReport({
        type: reportType.CAMPAIGNS,
        dateStart: moment(this.from.value).format(),
        dateEnd: moment(this.to.value).format(),
      })
    );
  }

  getReportPublishers() {
    this.store.dispatch(
      new RequestReport({
        type: reportType.SITES,
        dateStart: moment(this.from.value).format(),
        dateEnd: moment(this.to.value).format(),
      })
    );
  }
}
