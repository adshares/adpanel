import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ad-list',
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.scss'],
})
export class AdListComponent {
  @Input() adList: Object;

}
