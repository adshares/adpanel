import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { take, debounceTime } from 'rxjs/operators';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { PublisherService } from 'publisher/publisher.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserConfirmResponseDialogComponent } from 'common/dialog/user-confirm-response-dialog/user-confirm-response-dialog.component';
import { SiteCodes } from 'models/site.model';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { User } from 'models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { ServerOptionsService } from 'common/server-options.service';
import {
  CIRCUMVENT_ADBLOCKS_INSTRUCTION,
  AVAILABLE_ADZONE_OPTIONS,
  SETUP_FALLBACK_BACKFILL_CODE_INSTRUCTION,
} from 'models/enum/link.enum';
import { HelperService } from 'common/helper.service';

@Component({
  selector: 'app-site-code-dialog',
  templateUrl: './site-code-dialog.component.html',
  styleUrls: ['./site-code-dialog.component.scss'],
})
export class SiteCodeDialogComponent extends HandleSubscriptionComponent implements OnInit {
  private readonly MINIMAL_DELAY_BETWEEN_CODE_REQUESTS = 500;
  faCopy = faCopy;

  currencyCode: string;
  codes?: SiteCodes = null;
  codeForm: FormGroup;
  loadingInfo: boolean = true;
  siteId: number;
  hasSitePops: boolean;
  isUserConfirmed: boolean;
  faExclamationTriangle = faExclamationTriangle;
  CIRCUMVENT_ADBLOCKS_INSTRUCTION = CIRCUMVENT_ADBLOCKS_INSTRUCTION;
  AVAILABLE_ADZONE_OPTIONS = AVAILABLE_ADZONE_OPTIONS;
  SETUP_FALLBACK_BACKFILL_CODE_INSTRUCTION = SETUP_FALLBACK_BACKFILL_CODE_INSTRUCTION;

  constructor(
    public dialogRef: MatDialogRef<SiteCodeDialogComponent>,
    private publisherService: PublisherService,
    private serverOptionsService: ServerOptionsService,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();

    this.siteId = data.siteId;
    this.hasSitePops = data.hasSitePops;
  }

  ngOnInit() {
    this.codeForm = new FormGroup({
      isProxy: new FormControl(false),
      isMinCpm: new FormControl(false),
      minCpm: new FormControl(0.5),
      isAdBlock: new FormControl(false),
      isFallback: new FormControl(false),
      fallbackRate: new FormControl(50, [Validators.min(0), Validators.max(100)]),
      popCount: new FormControl(1, [Validators.required, Validators.min(1)]),
      popInterval: new FormControl(1, [Validators.required, Validators.min(1)]),
      popBurst: new FormControl(1, [Validators.required, Validators.min(1)]),
    });

    this.currencyCode = this.serverOptionsService.getOptions().displayCurrency;

    const minCpmSubscription = this.codeForm.get('isMinCpm').valueChanges.subscribe(isMinCpm => {
      const minCpmControl = this.codeForm.get('minCpm');
      if (isMinCpm) {
        minCpmControl.setValidators([Validators.required, Validators.min(0.0001)]);
      } else {
        minCpmControl.clearValidators();
      }
      minCpmControl.updateValueAndValidity();
    });
    this.subscriptions.push(minCpmSubscription);

    const codeFormSubscription = this.codeForm.valueChanges
      .pipe(debounceTime(this.MINIMAL_DELAY_BETWEEN_CODE_REQUESTS))
      .subscribe(() => {
        if (this.codeForm.valid) {
          this.updateCodes();
        }
      });
    this.subscriptions.push(codeFormSubscription);

    const userDataSubscription = this.store.select('state', 'user', 'data').subscribe((user: User) => {
      this.isUserConfirmed = user.isConfirmed;
    });
    this.subscriptions.push(userDataSubscription);

    this.updateCodes();
  }

  updateCodes(): void {
    this.loadingInfo = true;

    this.publisherService
      .getSiteCodes(this.siteId, this.getCodeOptions())
      .pipe(take(1))
      .subscribe(
        response => {
          this.codes = response.codes;
          this.loadingInfo = false;
          setTimeout(() => this.onChangeTextArea(), 0);
        },
        () => {
          this.codes = null;
          this.loadingInfo = false;
        }
      );
  }

  getCodeOptions() {
    const values = this.codeForm.value;

    const options = {
      isProxy: values.isProxy ? 1 : 0,
      isBlock: values.isAdBlock ? 1 : 0,
      isFallback: values.isFallback ? 1 : 0,
    };

    if (values.isMinCpm) {
      options['minCpm'] = values.minCpm;
    }

    if (values.isFallback) {
      options['fallbackRate'] = values.fallbackRate / 100;
    }

    if (this.hasSitePops) {
      options['popCount'] = values.popCount;
      options['popInterval'] = values.popInterval;
      options['popBurst'] = values.popBurst;
    }

    return options;
  }

  copyCode(elementId: string): void {
    const input = <HTMLInputElement>document.getElementById(elementId);
    this.helperService.copyToClipboard(input.value);
  }

  onChangeAdvancedCircumvent($event): void {
    if (!$event.checked) {
      return;
    }

    this.codeForm.get('isProxy').setValue(false);

    this.dialog
      .open(UserConfirmResponseDialogComponent, {
        data: {
          message:
            'Circumventing ad blockers needs special integration on website backend.' +
            '<div class="ap-copy">' +
            '<a href="https://github.com/adshares/adserver/wiki/Serve-ad-zone-JS-code-locally-to-circumvent-adblocks" ' +
            'rel="noopener noreferrer" target="_blank">' +
            'Read instructions' +
            '</a>' +
            '</div>' +
            '<br>' +
            ' you want to enable this option?',
        },
      })
      .afterClosed()
      .subscribe(result => result && this.codeForm.get('isProxy').setValue(true));
  }

  onChangeTextArea(): void {
    const textAreas = document.getElementsByTagName('textarea');

    let paddingBottom = 0;
    if (textAreas.length > 0) {
      const textArea = textAreas.item(0);
      paddingBottom = parseInt(window.getComputedStyle(textArea).paddingBottom);
    }

    for (let i = 0; i < textAreas.length; i++) {
      const textArea = textAreas.item(i);
      textArea.style.height = '';
      const height = textArea.scrollHeight + paddingBottom;
      textArea.style.height = `${height}px`;
    }
  }
}
