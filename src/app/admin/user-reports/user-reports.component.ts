import { Component, OnInit } from '@angular/core';
import { HandleSubscription } from 'common/handle-subscription';
import * as moment from 'moment';
import { AdminService } from 'admin/admin.service';
import { downloadCSVFile } from 'common/utilities/helpers';

@Component({
  selector: 'app-user-reports',
  templateUrl: './user-reports.component.html',
  styleUrls: ['./user-reports.component.scss'],
})
export class UserReportsComponent extends HandleSubscription implements OnInit {
  from: string;
  to: string;

  constructor(private adminService: AdminService) {
    super();
  }

  ngOnInit() {
    this.from = moment().subtract(30, 'days').startOf('day').format();
    this.to = moment().endOf('day').format();
  }

  load(timespan) {
    this.from = moment(timespan.from).startOf('day').format();
    this.to = moment(timespan.to).endOf('day').format();
  }

  getReportAdvertisers() {
    this.adminService.getReportAdvertisers(this.from, this.to)
      .subscribe((data) => {
        downloadCSVFile(data, this.from, this.to);
      });
  }

  getReportPublishers() {
    this.adminService.getReportPublishers(this.from, this.to)
      .subscribe((data) => {
        downloadCSVFile(data, this.from, this.to);
      });
  }
}
