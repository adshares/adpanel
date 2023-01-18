import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { SiteLanguage } from 'models/site.model';
import { GetLanguagesList } from 'store/publisher/publisher.actions';
import { AppState } from 'models/app-state.model';
import { Store } from '@ngrx/store';

@Injectable()
export class LanguagesListResolver implements Resolve<SiteLanguage[]> {
  constructor(private store: Store<AppState>) {}

  resolve(): Observable<SiteLanguage[]> {
    this.initLanguagesList();
    return this.waitForListToLoad();
  }

  initLanguagesList(): void {
    this.store.pipe(take(1)).subscribe(store => {
      const list = store.state.publisher.languagesList;

      if (list.length <= 0) {
        this.store.dispatch(new GetLanguagesList());
      }
    });
  }

  waitForListToLoad(): Observable<SiteLanguage[]> {
    return this.store.select('state', 'publisher', 'languagesList').pipe(
      filter(el => el.length > 0),
      take(1)
    );
  }
}
