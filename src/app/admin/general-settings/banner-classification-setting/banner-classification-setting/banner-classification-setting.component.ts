import { Component, OnInit } from '@angular/core'
import { AdminSiteOptions } from 'models/settings.model'
import { Store } from '@ngrx/store'
import { AppState } from 'models/app-state.model'
import { HandleSubscription } from 'common/handle-subscription'
import {SetAdminSiteOptions } from 'store/admin/admin.actions'

@Component({
  selector: 'app-banner-classification-setting',
  templateUrl: './banner-classification-setting.component.html',
  styleUrls: ['./banner-classification-setting.component.scss']
})
export class BannerClassificationSettingComponent extends HandleSubscription implements OnInit {
  siteOptions: AdminSiteOptions
  canSubmit: boolean = false

  constructor(
    private store: Store<AppState>
  ) {
    super()
  }

  ngOnInit() {
    const adminStoreSiteOptionsSubscription = this.store.select('state', 'admin',
      'siteOptions').subscribe((siteOptions: AdminSiteOptions) => {
      this.siteOptions = siteOptions
    })

    this.subscriptions.push(adminStoreSiteOptionsSubscription)
  }

  onOptionChange(value: number, key: string): void {
    this.siteOptions = {
      ...this.siteOptions,
      [key]: value,
    }
    this.canSubmit = true
  }

  saveSettings(){
    this.store.dispatch(new SetAdminSiteOptions(this.siteOptions))
    this.canSubmit = false
  }
}
