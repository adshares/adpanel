import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.scss'],
})
export class InfoPageComponent implements OnInit {
  source: string;
  version: string;
  landingPageUrl: string = null;
  name: string = null;

  constructor(private store: Store<AppState>) {
    this.source = environment.name.toLowerCase().replace(/\s+/, '-');
    this.version = environment.version;
  }

  ngOnInit() {
    this.store
      .select('state', 'common', 'info')
      .pipe(take(1))
      .subscribe(info => {
        this.landingPageUrl = info.landingUrl;
        this.name = info.name;
      });
  }
}
