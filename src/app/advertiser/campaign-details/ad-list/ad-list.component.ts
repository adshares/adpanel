import { Component, Input } from '@angular/core';

import { Ad } from '../../../models/campaign.model';
import { sortArrayByColumnMetaData } from '../../../common/utilities/helpers';
import { TableColumnMetaData } from '../../../models/table.model';

@Component({
  selector: 'app-ad-list',
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.scss'],
})
export class AdListComponent {
  @Input() adList: Ad[];

  sortTable(columnMetaData: TableColumnMetaData) {
    this.adList = sortArrayByColumnMetaData(this.adList, columnMetaData);
  }
}
