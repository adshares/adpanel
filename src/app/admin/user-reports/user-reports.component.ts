import { Component, OnInit } from '@angular/core';
import { HandleSubscription } from 'common/handle-subscription';
import * as moment from 'moment';
import { AdminService } from 'admin/admin.service';
import { downloadCSVFile } from 'common/utilities/helpers';
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-user-reports',
  templateUrl: './user-reports.component.html',
  styleUrls: ['./user-reports.component.scss'],
})
export class UserReportsComponent extends HandleSubscription implements OnInit {
  from: FormControl = new FormControl();
  to: FormControl = new FormControl();
  today = new Date();

  constructor(private adminService: AdminService) {
    super();
  }

  ngOnInit() {
    this.from.setValue(moment().subtract(30, 'days').startOf('day').format());
    this.to.setValue(moment().endOf('day').format());
  }

  load(timespan) {
  }



  getReportAdvertisers() {
    const from =  moment(this.from.value).format();
    const to =  moment(this.to.value).format();
    this.adminService.getReportAdvertisers(from, to)
      .subscribe((data) => {
        downloadCSVFile(data, from, to);
      });
  }

  getReportPublishers() {
    const from =  moment(this.from.value).format();
    const to =  moment(this.to.value).format();
    this.adminService.getReportPublishers(from, to)
      .subscribe((data) => {
        downloadCSVFile(data, from, to);
      });
  }
}
