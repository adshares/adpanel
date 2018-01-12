import { Component, ViewChild } from '@angular/core';
import { SettingsService } from '../../settings.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent {
  @ViewChild('changeEmailForm') changeEmailForm: NgForm;
  @ViewChild('changePasswordForm') changePasswordForm: NgForm;

  constructor(
    private settingsService: SettingsService
  ) {}

  onChangeEmail(newEmail) {
    if (!this.changeEmailForm.valid) {
      return;
    }
    this.settingsService.changeEmail(newEmail);
    this.changeEmailForm.value.email = '';
  }

  onChangePassword(currentPassword, newPassword, newPasswordConfirm) {
    if (!this.changePasswordForm.valid) {
      return;
    }
    this.settingsService.changePassword(currentPassword, newPassword, newPasswordConfirm);
    this.changePasswordForm.value.currentPassword = '';
    this.changePasswordForm.value.newPassword = '';
    this.changePasswordForm.value.newPasswordConfirm = '';
  }
}
