import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { HandleSubscription } from 'common/handle-subscription';
import {
  GetPrivacySettings,
  GetTermsSettings,
  SetPrivacySettings,
  SetTermsSettings
} from "store/admin/admin.actions";
import {
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { TermsAndPrivacy } from "models/settings.model";

@Component({
  selector: 'app-privacy-and-terms-settings',
  templateUrl: './privacy-and-terms-settings.component.html',
  styleUrls: ['./privacy-and-terms-settings.component.scss'],
  host: {'class': 'app-finances'},
})
export class PrivacyAndTermsSettingsComponent extends HandleSubscription implements OnInit {
  terms: FormGroup;
  privacy: FormGroup;

  constructor(
    private store: Store<AppState>,
  ) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(new GetPrivacySettings());
    this.store.dispatch(new GetTermsSettings());

    const adminStoreSettingsSubscription = this.store.select('state', 'admin', 'termsAndPrivacy')
      .subscribe((privacyAndTerms: TermsAndPrivacy) => {
        this.privacy = new FormGroup({
            privacySettings: new FormControl(privacyAndTerms.privacy, [Validators.required])
          }
        );
        this.terms = new FormGroup({
          termsSettings: new FormControl(privacyAndTerms.terms, [Validators.required])
        });
      });
    this.subscriptions.push(adminStoreSettingsSubscription);
  }

  saveTerms(): void {
    this.store.dispatch(new SetTermsSettings(this.terms.value.termsSettings));
    this.terms.markAsPristine();
  }

  savePrivacy(): void {
    this.store.dispatch(new SetPrivacySettings(this.privacy.value.privacySettings));
    this.privacy.markAsPristine();
  }
}
