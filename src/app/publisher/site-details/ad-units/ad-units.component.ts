import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { SiteCodeDialogComponent } from 'publisher/dialogs/site-code-dialog/site-code-dialog.component';
import { AdUnit } from 'models/site.model';

@Component({
  selector: 'app-poster-units',
  templateUrl: './ad-units.component.html',
  styleUrls: ['./ad-units.component.scss'],
})
export class AdUnitsComponent {
  @Input() adUnit: AdUnit;
  @Input() siteCode: string;
  codeIcon = faCode;

  constructor(private dialog: MatDialog) {
  }

  openGetCodeDialog() {
    this.dialog.open(SiteCodeDialogComponent, {
      data: {
        code: this.adUnit.code,
        siteCode: this.siteCode,
      }
    });
  }
}
