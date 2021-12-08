import { Component } from '@angular/core'
import { fadeAnimation } from 'common/animations/fade.animation'

@Component({
  selector: 'app-moderator',
  templateUrl: './moderator.component.html',
  styleUrls: ['./moderator.component.scss'],
  animations: [fadeAnimation],
})
export class ModeratorComponent {
  getRouterOutletState = (outlet) => outlet.isActivated
    ? outlet.activatedRoute
    : ''
}
