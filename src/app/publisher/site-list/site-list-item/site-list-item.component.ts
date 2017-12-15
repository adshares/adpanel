import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-site-list-item',
  templateUrl: './site-list-item.component.html',
  styleUrls: ['./site-list-item.component.scss']
})
export class SiteListItemComponent implements OnInit {
  @Input() site;

  constructor() { }

  ngOnInit() {
  }

}
