import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { HandleSubscription } from 'common/handle-subscription';
import { GetRejectedDomains, SetRejectedDomains } from 'store/admin/admin.actions';

@Component({
  selector: 'app-rejected-domains',
  templateUrl: './rejected-domains.component.html',
  styleUrls: ['./rejected-domains.component.scss'],
})
export class RejectedDomainsComponent extends HandleSubscription implements OnInit {
  formGroup: FormGroup;

  constructor(
    private store: Store<AppState>,
  ) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(new GetRejectedDomains());

    const adminStoreSettingsSubscription = this.store.select('state', 'admin', 'rejectedDomains')
      .subscribe((rejectedDomains) => {
        const content = rejectedDomains.join('\n');
        this.formGroup = new FormGroup({
          domainsSettings: new FormControl(content)
        });
      });
    this.subscriptions.push(adminStoreSettingsSubscription);
  }

  save(): void {
    const domains = this.formGroup.value.domainsSettings.replace(/,/, '\n').split('\n').filter(item => item.trim());
    this.store.dispatch(new SetRejectedDomains(domains));
    this.formGroup.markAsPristine();
  }
}
