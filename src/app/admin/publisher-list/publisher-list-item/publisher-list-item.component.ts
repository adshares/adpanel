import { Component, Input } from '@angular/core';
import { PublisherInfo } from 'models/settings.model';

@Component({
  selector: 'app-publisher-list-item',
  templateUrl: './publisher-list-item.component.html',
  styleUrls: ['./publisher-list-item.component.scss'],
})
export class PublisherListItemComponent {
  @Input() publisher: PublisherInfo;
}
