import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';

@Component({
  selector: 'app-site-code-dialog',
  templateUrl: './access-token-dialog.component.html',
  styleUrls: ['./access-token-dialog.component.scss'],
})
export class AccessTokenDialogComponent extends HandleSubscriptionComponent {
  faCode = faCode;
  loadingInfo: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<AccessTokenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
    super();
  }

  copyCode(elementId: string): void {
    const input = <HTMLInputElement>document.getElementById(elementId);
    input.focus();
    input.select();
    document.execCommand('copy');
    input.setSelectionRange(0, 0);
  }
}
