import { Component } from '@angular/core'
import { fadeAnimation } from 'common/animations/fade.animation'

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
  animations: [fadeAnimation],
})
export class GeneralSettingsComponent {
}
