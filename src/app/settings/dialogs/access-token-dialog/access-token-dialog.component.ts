import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { HelperService } from 'common/helper.service';

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
    private helperService: HelperService
  ) {
    super();
  }

  copyCode(token: string): void {
    this.helperService.copyToClipboard(token);
  }
}
