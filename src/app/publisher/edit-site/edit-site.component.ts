import { Component } from '@angular/core';
import { fadeAnimation } from '../../common/animations/fade.animation';

@Component({
  selector: 'app-edit-site',
  templateUrl: './edit-site.component.html',
  styleUrls: ['./edit-site.component.scss'],
  animations: [fadeAnimation]
})
export class EditSiteComponent {
  getRouterOutletState = (outlet) => outlet.isActivated ? outlet.activatedRoute : '';
}
