import {Component, Input, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';

import { SiteCodeDialogComponent } from 'publisher/dialogs/site-code-dialog/site-code-dialog.component';
import { adSizesEnum } from 'models/enum/ad.enum';

@Component({
  selector: 'app-ad-units',
  templateUrl: './ad-units.component.html',
  styleUrls: ['./ad-units.component.scss'],
})
export class AdUnitsComponent implements OnInit{
  @Input() adUnit;
  @Input() siteCode;
  tags: string[];

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(){
    this.tags = Array.isArray(this.adUnit.size.tags) ? this.adUnit.size.tags : this.adUnit.size.tags.tags;
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
