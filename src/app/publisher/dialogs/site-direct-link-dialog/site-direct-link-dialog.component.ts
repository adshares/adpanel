import { Component, Inject } from '@angular/core';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { HelperService } from 'common/helper.service';

@Component({
  selector: 'app-site-direct-link-dialog',
  templateUrl: './site-direct-link-dialog.component.html',
  styleUrls: ['./site-direct-link-dialog.component.scss'],
})
export class SiteDirectLinkDialogComponent extends HandleSubscriptionComponent {
  directLink: string;
  faCopy = faCopy;

  constructor(
    public dialogRef: MatDialogRef<SiteDirectLinkDialogComponent>,
    private helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();

    this.directLink = data.directLink;
  }

  copyCode(elementId: string): void {
    const input = <HTMLInputElement>document.getElementById(elementId);
    this.helperService.copyToClipboard(input.value);
  }
}
