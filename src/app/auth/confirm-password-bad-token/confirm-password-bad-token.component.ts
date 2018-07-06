import {Component, ViewChild} from '@angular/core';
import { appSettings } from 'app-settings';
import { LocalStorageUser, User } from "models/user.model";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "auth/auth.service";
import { HandleSubscription } from "common/handle-subscription";

@Component({
  selector: 'app-confirm-password-bad-token.component',
  templateUrl: './confirm-password-bad-token.component.html',
  styleUrls: ['./confirm-password-bad-token.component.scss'],
})
export class ConfirmPasswordBadTokenComponent {
  constructor(
  ) {
  }
}
