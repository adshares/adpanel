import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { AppState } from 'models/app-state.model';
import { ReportsListItem } from 'models/settings.model';
import { CommonService } from 'common/common.service';
import { downloadReport } from 'common/utilities/helpers';
import { ShowDialogOnError } from 'store/common/common.actions';
import { reportState } from 'models/enum/user.enum';
import { faCheck, faHistory, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reports-list-item',
  templateUrl: './reports-list-item.component.html',
  styleUrls: ['./reports-list-item.component.scss'],
})
export class ReportsListItemComponent implements OnInit {
  @Input() item: ReportsListItem;

  readonly REPORT_STATE_READY = reportState.READY;
  icon;

  constructor(private service: CommonService, private store: Store<AppState>) {}

  ngOnInit(): void {
    switch (this.item.state) {
      case reportState.READY:
        this.icon = faCheck;
        break;
      case reportState.PREPARING:
        this.icon = faHistory;
        break;
      case reportState.DELETED:
      default:
        this.icon = faTimes;
    }
  }

  download(): void {
    this.service
      .getReport(this.item.id)
      .pipe(take(1))
      .subscribe(
        response => downloadReport(response),
        () =>
          this.store.dispatch(
            new ShowDialogOnError('Report cannot be downloaded at this moment. Please try again later.')
          )
      );
  }
}
