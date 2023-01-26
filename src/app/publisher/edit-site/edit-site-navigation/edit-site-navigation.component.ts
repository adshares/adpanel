import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-edit-site-navigation',
  templateUrl: './edit-site-navigation.component.html',
  styleUrls: ['./edit-site-navigation.component.scss'],
})
export class EditSiteNavigationComponent implements OnChanges {
  steps: { id: number; name: string }[] = [];

  @Input() currentStep: number;
  @Input() medium: string;

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.medium !== 'metaverse') {
      this.steps = [
        { id: 1, name: 'Basic information' },
        { id: 2, name: 'Pops' },
        { id: 3, name: 'Placements' },
        { id: 4, name: 'Exclusions' },
        { id: 5, name: 'Summary' },
      ];
    } else {
      this.steps = [
        { id: 1, name: 'Basic information' },
        { id: 4, name: 'Exclusions' },
        { id: 5, name: 'Summary' },
      ];
    }
  }
}
