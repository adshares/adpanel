import { Component } from '@angular/core';
import { fadeAnimation } from 'common/animations/fade.animation';

@Component({
  selector: 'app-admin-rebranding',
  templateUrl: './rebranding.component.html',
  styleUrls: ['./rebranding.component.scss'],
  animations: [fadeAnimation]
})
export class RebrandingComponent {
}
