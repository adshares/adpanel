import { Component } from '@angular/core'
import { appSettings } from 'app-settings'

@Component({
  selector: 'app-registered',
  templateUrl: './registered.component.html',
  styleUrls: ['./registered.component.scss'],
})
export class RegisteredComponent {
  supportEmail = appSettings.SUPPORT_EMAIL
}
