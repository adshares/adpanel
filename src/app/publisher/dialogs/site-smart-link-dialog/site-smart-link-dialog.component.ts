import { Component, Inject } from '@angular/core';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { HelperService } from 'common/helper.service';

@Component({
  selector: 'app-site-smart-link-dialog',
  templateUrl: './site-smart-link-dialog.component.html',
  styleUrls: ['./site-smart-link-dialog.component.scss'],
})
export class SiteSmartLinkDialogComponent extends HandleSubscriptionComponent {
  smartLink: string;
  faCopy = faCopy;

  constructor(
    public dialogRef: MatDialogRef<SiteSmartLinkDialogComponent>,
    private helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();

    this.smartLink = data.smartLink;
  }

  copyCode(elementId: string): void {
    const input = <HTMLInputElement>document.getElementById(elementId);
    this.helperService.copyToClipboard(input.value);
  }
}
