import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-edit-site-navigation',
  templateUrl: './edit-site-navigation.component.html',
  styleUrls: ['./edit-site-navigation.component.scss'],
})
export class EditSiteNavigationComponent implements OnInit {
  steps = [];

  @Input() currentStep: number
  @Input() medium: string

  ngOnInit(): void {
    if (this.medium !== 'metaverse') {
      this.steps = [
        {id: 1, name: 'Basic information'},
        {id: 2, name: 'Pops'},
        {id: 3, name: 'Ad units'},
        {id: 4, name: 'Exclusions'},
        {id: 5, name: 'Summary'},
      ]
    } else {
      this.steps = [
        {id: 1, name: 'Basic information'},
        {id: 4, name: 'Exclusions'},
        {id: 5, name: 'Summary'},
      ]
    }
  }
}
