import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { ReportsListItem } from 'models/settings.model';
import { CommonService } from 'common/common.service';
import { downloadReport } from 'common/utilities/helpers';
import { RequestReportFailure } from 'store/common/common.actions';
import { reportState } from 'models/enum/user.enum';
import { faCheck, faHourglass, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reports-list-item',
  templateUrl: './reports-list-item.component.html',
  styleUrls: ['./reports-list-item.component.scss'],
})
export class ReportsListItemComponent implements OnInit {
  @Input() item: ReportsListItem;

  readonly REPORT_STATE_READY = reportState.READY;
  icon;

  constructor(
    private service: CommonService,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit(): void {
    switch (this.item.state) {
      case reportState.READY:
        this.icon = faCheck;
        break;
      case reportState.PREPARING:
        this.icon = faHourglass;
        break;
      case reportState.DELETED:
      default:
        this.icon = faTimes;
    }
  }

  download(): void {
    this.service.getReport(this.item.id)
      .take(1)
      .subscribe(
        response => downloadReport(response),
        () => this.store.dispatch(
          new RequestReportFailure('Report cannot be downloaded at this moment. Please try again later.')
        ),
      );
  }
}
