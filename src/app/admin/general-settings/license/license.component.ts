import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { HandleSubscription } from 'common/handle-subscription';
import { fadeAnimation } from "common/animations/fade.animation";
import { License } from "models/settings.model";
import * as moment from "moment";
import { DATE_AND_TIME_FORMAT } from "common/utilities/consts";

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
  host: {'class': 'license'},
  animations: [fadeAnimation]
})
export class LicenseComponent extends HandleSubscription implements OnInit {
  license: License | null = null;

  constructor(
    private store: Store<AppState>,
  ) {
    super();
  }

  ngOnInit() {
    const adminStoreSettingsSubscription = this.store.select('state', 'admin', 'license')
      .subscribe((license: License | null) => {
        if (license !== null) {
          this.license = {
            ...license,
            dateStart: moment(license.dateStart).format(DATE_AND_TIME_FORMAT),
            dateEnd: moment(license.dateEnd).format(DATE_AND_TIME_FORMAT),
          };
        }
      });

    this.subscriptions.push(adminStoreSettingsSubscription);
  }
}
