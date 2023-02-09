import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { PublisherService } from 'publisher/publisher.service';
import { ShowSuccessSnackbar } from 'store/common/common.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';

@Component({
  selector: 'app-site-code-cryptovoxels-dialog',
  templateUrl: './site-code-cryptovoxels-dialog.component.html',
  styleUrls: ['./site-code-cryptovoxels-dialog.component.scss'],
})
export class SiteCodeCryptovoxelsDialogComponent extends HandleSubscriptionComponent implements OnInit {
  readonly faCopy = faCopy;
  readonly faExclamation = faExclamation;
  code: string | null = null;
  loaded: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SiteCodeCryptovoxelsDialogComponent>,
    private publisherService: PublisherService,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit(): void {
    const codeSubscription = this.publisherService.getCryptovoxelsCode().subscribe(
      response => {
        this.code = response.code;
        this.loaded = true;
      },
      () => {
        this.loaded = true;
      }
    );
    this.subscriptions.push(codeSubscription);
  }

  copyCode(token: string): void {
    navigator.clipboard
      .writeText(token)
      .then(() => {
        this.store.dispatch(new ShowSuccessSnackbar('Copied!'));
      })
      .catch(error => console.log(error));
  }
}
