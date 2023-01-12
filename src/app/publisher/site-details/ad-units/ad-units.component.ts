import { Component, Input } from '@angular/core';
import { AdUnit } from 'models/site.model';
import { adUnitTypesEnum } from 'models/enum/ad.enum';

@Component({
  selector: 'app-poster-units',
  templateUrl: './ad-units.component.html',
  styleUrls: ['./ad-units.component.scss'],
})
export class AdUnitsComponent {
  @Input() adUnit: AdUnit;
  adUnitTypesEnum = adUnitTypesEnum;
}
