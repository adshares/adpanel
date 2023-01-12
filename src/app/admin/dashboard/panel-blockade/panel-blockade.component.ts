import { Component, Input } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-panel-blockade',
  templateUrl: './panel-blockade.component.html',
  styleUrls: ['./panel.blockade.component.scss'],
})
export class PanelBlockadeComponent {
  @Input() url: string;

  adControllerUrl = environment.adControllerUrl;
}
