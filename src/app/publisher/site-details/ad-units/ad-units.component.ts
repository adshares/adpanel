import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SiteCodeDialogComponent } from '../../dialogs/site-code-dialog/site-code-dialog.component';

@Component({
  selector: 'app-ad-units',
  templateUrl: './ad-units.component.html',
  styleUrls: ['./ad-units.component.scss'],
})
export class AdUnitsComponent {
  @Input() adUnit;

  constructor(private dialog: MatDialog) {
  }

  openGetCodeDialog() {
    this.dialog.open(SiteCodeDialogComponent, {
      data: {
        code: this.adUnit.code
      }
    });
  }

}
