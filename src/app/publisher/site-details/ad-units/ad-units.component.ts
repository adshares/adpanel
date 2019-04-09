import {Component, Input, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import {faCode} from '@fortawesome/free-solid-svg-icons';

import { SiteCodeDialogComponent } from 'publisher/dialogs/site-code-dialog/site-code-dialog.component';

@Component({
  selector: 'app-poster-units',
  templateUrl: './ad-units.component.html',
  styleUrls: ['./ad-units.component.scss'],
})
export class AdUnitsComponent implements OnInit {
  @Input() adUnit;
  @Input() siteCode;
  tags: string[];
  codeIcon = faCode;

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
