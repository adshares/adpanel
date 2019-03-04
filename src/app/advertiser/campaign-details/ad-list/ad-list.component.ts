import { Component, Input } from '@angular/core';

import {Ad, Campaign} from 'models/campaign.model';
import { sortArrayByColumnMetaData } from 'common/utilities/helpers';
import { TableColumnMetaData } from 'models/table.model';

@Component({
  selector: 'app-poster-list',
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.scss'],
})
export class AdListComponent {
  @Input() adList: Ad[];
  @Input() campaign: Campaign;

  sortTable(columnMetaData: TableColumnMetaData) {
    this.adList = sortArrayByColumnMetaData(this.campaign.ads, columnMetaData);
  }
}
