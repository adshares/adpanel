import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SettingsService } from "settings/settings.service";
import { HandleSubscription } from 'common/handle-subscription';
import { Store } from "@ngrx/store";
import { AppState } from "models/app-state.model";

@Component({
  selector: 'app-site-code-dialog',
  templateUrl: './site-code-dialog.component.html',
  styleUrls: ['./site-code-dialog.component.scss']
})
export class SiteCodeDialogComponent extends HandleSubscription implements OnInit {
  isEmailConfirmed:boolean;

  constructor(
    public dialogRef: MatDialogRef<SiteCodeDialogComponent>,
    private settingsService: SettingsService,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    const confirmationSubscription = this.store.select('state', 'user', 'data', 'isEmailConfirmed')
      .subscribe(isConfirmed => this.isEmailConfirmed = isConfirmed);
    this.subscriptions.push(confirmationSubscription)
  }
}
