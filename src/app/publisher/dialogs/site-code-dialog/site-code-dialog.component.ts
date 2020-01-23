import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HandleSubscription } from 'common/handle-subscription';
import { PublisherService } from 'publisher/publisher.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-site-code-dialog',
  templateUrl: './site-code-dialog.component.html',
  styleUrls: ['./site-code-dialog.component.scss']
})
export class SiteCodeDialogComponent extends HandleSubscription implements OnInit {
  private readonly MINIMAL_DELAY_BETWEEN_CODE_REQUESTS = 1500;
  readonly CURRENCY_CODE: string = environment.currencyCode;

  code: string = '';
  codeForm: FormGroup;
  loadingInfo: boolean = true;
  siteId: number;
  hasSitePops: boolean;

  constructor(
    public dialogRef: MatDialogRef<SiteCodeDialogComponent>,
    private publisherService: PublisherService,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
      popCount: new FormControl(1, [Validators.required, Validators.min(1)]),
      popInterval: new FormControl(1, [Validators.required, Validators.min(1)]),
      popBurst: new FormControl(1, [Validators.required, Validators.min(1)]),
    });

    const minCpmSubscription = this.codeForm.get('isMinCpm').valueChanges
      .subscribe(
        isMinCpm => isMinCpm
          ? this.codeForm.get('minCpm').setValidators([Validators.required, Validators.min(0.0001)])
          : this.codeForm.get('minCpm').setValidators(null)
      );
    this.subscriptions.push(minCpmSubscription);

    const codeFormSubscription = this.codeForm.valueChanges
      .debounceTime(this.MINIMAL_DELAY_BETWEEN_CODE_REQUESTS)
      .subscribe(
      () => {
        if (this.codeForm.valid) {
          this.updateCodes();
        }
      }
    );
    this.subscriptions.push(codeFormSubscription);

    this.updateCodes();
  }

  updateCodes(): void {
    this.loadingInfo = true;

    this.publisherService.getSiteCode(this.siteId, this.getCodeOptions())
      .take(1)
      .subscribe(
        response => {
          this.code = response.code ? response.code : '';
          this.loadingInfo = false;
        },
        () => {
          this.code = 'An error occurred. Please review options.';
          this.loadingInfo = false;
        }
      );
  }

  getCodeOptions() {
    const values = this.codeForm.value;

    const options = {
      'isProxy': values.isProxy ? 1 : 0,
      'isBlock': values.isAdBlock ? 1 : 0,
      'isFallback': values.isFallback ? 1 : 0,
    };

    if (values.isMinCpm) {
      options['minCpm'] = values.minCpm;
    }

    if (this.hasSitePops) {
      options['popCount'] = values.popCount;
      options['popInterval'] = values.popInterval;
      options['popBurst'] = values.popBurst;
    }

    return options;
  }

  copyCode(): void {
    const input = <HTMLInputElement>document.getElementById('code-container');
    input.focus();
    input.select();
    document.execCommand('copy');
    input.setSelectionRange(0, 0);
  }
}
