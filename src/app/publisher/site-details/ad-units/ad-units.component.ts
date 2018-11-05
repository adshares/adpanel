import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

import { SiteCodeDialogComponent } from 'publisher/dialogs/site-code-dialog/site-code-dialog.component';
import { adSizesEnum } from 'models/enum/ad.enum';

@Component({
  selector: 'app-ad-units',
  templateUrl: './ad-units.component.html',
  styleUrls: ['./ad-units.component.scss'],
})
export class AdUnitsComponent {
  @Input() adUnit;
  @Input() siteCode;
  adSizesEnum = adSizesEnum;

  constructor(private dialog: MatDialog) { }

  openGetCodeDialog() {
    this.dialog.open(SiteCodeDialogComponent, {
      data: {
        code: this.adUnit.code,
        siteCode: this.siteCode,
      }
    });
  }
}
