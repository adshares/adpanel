import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';

import { User } from 'models/user.model';
import { SettingsService } from "settings/settings.service";
import { HandleSubscription } from 'common/handle-subscription';

@Component({
  selector: 'app-site-code-dialog',
  templateUrl: './site-code-dialog.component.html',
  styleUrls: ['./site-code-dialog.component.scss']
})
export class SiteCodeDialogComponent extends HandleSubscription implements OnInit {
  isEmailConfirmed = false;

  constructor(
    public dialogRef: MatDialogRef<SiteCodeDialogComponent>,
    private settingsService: SettingsService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.settingsService.checkUserStatus()
      .subscribe((user: User) => {
        this.isEmailConfirmed = user.isEmailConfirmed;
      });
  }
}
