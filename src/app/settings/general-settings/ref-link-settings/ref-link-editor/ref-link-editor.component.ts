import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../../../../session.service';
import { SettingsService } from 'settings/settings.service';
import { RefLink } from 'models/settings.model';
import { adsToClicks } from 'common/utilities/helpers';
import * as moment from 'moment';
import { CommonService } from 'common/common.service';
import { ServerOptionsService } from 'common/server-options.service';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-ref-link-editor',
  templateUrl: './ref-link-editor.component.html',
  styleUrls: ['./ref-link-editor.component.scss'],
})
export class RefLinkEditorComponent extends HandleSubscriptionComponent implements OnInit {
  @Output() public refLinkSaved = new EventEmitter<RefLink>();
  currencyCode: string;
  refundEnabled: boolean;
  defaultRefundCommission: number;
  refundCommission: number;
  bonusCommission: number;
  form: FormGroup;
  showLoader = false;
  formSubmitted = false;
  today = moment();
  validUntilControl: FormControl;
  refundValidUntilControl: FormControl;
  chooseUserRole: boolean = false;
  faCalendar = faCalendar;

  constructor(
    private serverOptionsService: ServerOptionsService,
    private session: SessionService,
    private settings: SettingsService,
    private common: CommonService
  ) {
    super();
  }

  ngOnInit(): void {
    const user = this.session.getUser();
    this.refundEnabled = user.referralRefundEnabled;
    this.defaultRefundCommission = user.referralRefundCommission;
    this.currencyCode = this.serverOptionsService.getOptions().displayCurrency;

    this.form = new FormGroup({
      token: new FormControl(null, [Validators.minLength(6), Validators.maxLength(32)]),
      comment: new FormControl(null),
      keptRefund: new FormControl(1.0, [Validators.min(0), Validators.max(1)]),
    });

    this.validUntilControl = new FormControl(null);
    this.refundValidUntilControl = new FormControl(null);

    if (this.session.isModerator()) {
      this.chooseUserRole = true;
      this.form.addControl('validUntil', this.validUntilControl);
      this.form.addControl('singleUse', new FormControl(false));
      this.form.addControl('bonus', new FormControl(null, [Validators.min(0)]));
      this.form.addControl('refund', new FormControl(null, [Validators.min(0), Validators.min(1)]));
      this.form.addControl('refundValidUntil', this.refundValidUntilControl);
      const rolesSubscription = this.settings.userRoles().subscribe(response => {
        const roles = response.defaultUserRoles.sort().join(',');
        this.form.addControl('userRoles', new FormControl(roles));
      });
      this.subscriptions.push(rolesSubscription);
    }

    this.subscriptions.push(
      this.form.valueChanges.subscribe(() => {
        this.updateCommission();
      })
    );
    this.updateCommission();
  }

  updateCommission(): void {
    const keptRefund = this.form.get('keptRefund').value;
    this.refundCommission = this.getRefundCommission(keptRefund);
    this.bonusCommission = this.getBonusCommission(keptRefund);
  }

  getRefund(): number {
    if (this.form.get('refund') && this.form.get('refund').value !== null) {
      return this.form.get('refund').value / 100;
    }
    return this.defaultRefundCommission;
  }

  getRefundCommission(keptRefund: number): number {
    return this.getRefund() * keptRefund;
  }

  getBonusCommission(keptRefund: number): number {
    return this.getRefund() * (1 - keptRefund);
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (!this.form.valid) {
      return;
    }

    this.showLoader = true;
    const refLink = this.form.getRawValue();
    Object.keys(refLink).forEach(key => refLink[key] == null && delete refLink[key]);

    if (refLink.refund) {
      refLink.refund /= 100.0;
    }
    if (refLink.bonus) {
      refLink.bonus = adsToClicks(refLink.bonus);
    }
    if (refLink.validUntil) {
      refLink.validUntil = moment(refLink.validUntil).endOf('day').format();
    }
    if (refLink.refundValidUntil) {
      refLink.refundValidUntil = moment(refLink.refundValidUntil).endOf('day').format();
    }

    this.subscriptions.push(
      this.common.saveRefLink(refLink).subscribe(
        data => {
          this.refLinkSaved.emit(data);
        },
        err => {
          if (err.error.errors) {
            Object.keys(err.error.errors).forEach(key =>
              this.form.get(key).setErrors({
                custom: err.error.errors[key][0],
              })
            );
          }
          this.showLoader = false;
        },
        () => {
          this.showLoader = false;
          this.formSubmitted = false;
        }
      )
    );
  }
}
