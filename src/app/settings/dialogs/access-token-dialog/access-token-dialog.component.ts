import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { ShowSuccessSnackbar } from 'store/common/common.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';

@Component({
  selector: 'app-site-code-dialog',
  templateUrl: './access-token-dialog.component.html',
  styleUrls: ['./access-token-dialog.component.scss'],
})
export class AccessTokenDialogComponent extends HandleSubscriptionComponent {
  faCopy = faCopy;

  constructor(
    public dialogRef: MatDialogRef<AccessTokenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private store: Store<AppState>
  ) {
    super();
  }

  copyCode(token: string): void {
    navigator.clipboard
      .writeText(token)
      .then(() => {
        this.store.dispatch(new ShowSuccessSnackbar('Copied!'));
      })
      .catch(error => console.log(error));
  }
}
