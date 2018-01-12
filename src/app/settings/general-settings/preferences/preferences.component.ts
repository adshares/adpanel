import { Component, ViewChild } from '@angular/core';
import { SettingsService } from '../../settings.service';
import { NgForm } from '@angular/forms';
import { HandleSubscription } from '../../../common/handle-subscription';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent extends HandleSubscription {
  @ViewChild('changeEmailForm') changeEmailForm: NgForm;
  @ViewChild('changePasswordForm') changePasswordForm: NgForm;

  constructor(
    private settingsService: SettingsService
  ) {
    super(null);
  }

  onChangeEmail(newEmail) {
    if (!this.changeEmailForm.valid) {
      return;
    }

    // TODO
    const changeEmailSubscription = this.settingsService.changeEmail(newEmail)
      .subscribe((email) => {
        this.settingsService.changeEmail(email);
      });
    this.subscriptions.push(changeEmailSubscription);

    this.changeEmailForm.value.email = '';
  }

  onChangePassword(currentPassword, newPassword, newPasswordConfirm) {
    if (!this.changePasswordForm.valid) {
      return;
    }

    // TODO
    const changePasswordSubscription = this.settingsService.changePassword(
      currentPassword,
      newPassword,
      newPasswordConfirm
    )
      .subscribe((email) => {
        this.settingsService.changeEmail(email);
      });
    this.subscriptions.push(changePasswordSubscription);

    this.changePasswordForm.value.currentPassword = '';
    this.changePasswordForm.value.newPassword = '';
    this.changePasswordForm.value.newPasswordConfirm = '';
  }
}
