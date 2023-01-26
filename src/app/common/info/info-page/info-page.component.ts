import { Component } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.scss'],
})
export class InfoPageComponent {
  source: string;
  version: string;

  constructor() {
    this.source = environment.name.toLowerCase().replace(/\s+/, '-');
    this.version = environment.version;
  }
}
