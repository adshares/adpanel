import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HandleSubscription} from 'common/handle-subscription';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SessionService} from "../../../../session.service";
import {SettingsService} from "settings/settings.service";
import {RefLink} from "models/settings.model";

@Component({
  selector: 'app-ref-link-editor',
  templateUrl: './ref-link-editor.component.html',
  styleUrls: ['./ref-link-editor.component.scss'],
})
export class RefLinkEditorComponent extends HandleSubscription implements OnInit {
  @Output() public refLinkSaved = new EventEmitter<RefLink>();
  refundEnabled: boolean;
  defaultRefundCommission: number;
  refundCommission: number;
  bonusCommission: number;
  form: FormGroup;
  showLoader = false;
  formSubmitted = false;

  constructor(
    private session: SessionService,
    private settings: SettingsService,
  ) {
    super();
  }

  ngOnInit() {

    const user = this.session.getUser();
    this.refundEnabled = user.referralRefundEnabled;
    this.defaultRefundCommission = user.referralRefundCommission;

    this.session.isAdmin()

    this.form = new FormGroup({
      token: new FormControl(null, [Validators.minLength(6), Validators.maxLength(32)]),
      comment: new FormControl(null),
      keptRefund: new FormControl(1.0, [Validators.min(0), Validators.max(1)]),
    });

    // if (this.session.isAdmin()) {
    //   this.form.addControl('validUntil', new FormControl(null));
    //   this.form.addControl('singleUse', new FormControl(false));
    //   this.form.addControl('bonus', new FormControl(null, [Validators.min(0)]));
    //   this.form.addControl('refund', new FormControl(null, [Validators.min(0), Validators.min(1)]));
    //   this.form.addControl('refundValidUntil', new FormControl(null));
    // }

    this.subscriptions.push(this.form.valueChanges
      .subscribe(
        () => {
            this.updateCommission();
        }
      ));
    this.updateCommission();
  }

  updateCommission(): void {
    const keptRefund = this.form.get('keptRefund').value;
    this.refundCommission = this.getRefundCommission(keptRefund);
    this.bonusCommission = this.getBonusCommission(keptRefund);
  }

  getRefund(): number {
    if (this.form.get('refund') && this.form.get('refund').value !== null) {
      return this.form.get('refund').value;
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

    this.subscriptions.push(this.settings.saveRefLink(refLink)
      .subscribe(
        (data) => {
          this.refLinkSaved.emit(data)
        },
        (err) => {
          if (err.error.errors) {
            Object.keys(err.error.errors).forEach(key => this.form.get(key).setErrors({
              custom: err.error.errors[key][0]
            }));
          }
          this.showLoader = false
        },
        () => {
          this.showLoader = false
        }
      ));
  }
}
