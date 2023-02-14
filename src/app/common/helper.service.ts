import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ShowSuccessSnackbar } from 'store/common/common.actions';
import { AppState } from 'models/app-state.model';

@Injectable()
export class HelperService {
  constructor(private store: Store<AppState>) {}

  copyToClipboard(content: string): void {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        this.store.dispatch(new ShowSuccessSnackbar('Copied!'));
      })
      .catch(error => console.error(error));
  }
}
