import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CampaignListComponent implements OnInit {
  numbers = [1,2,3,4,5];

  constructor() { }

  ngOnInit() {
  }

}
