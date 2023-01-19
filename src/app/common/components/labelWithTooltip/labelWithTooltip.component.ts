import { Component, Input } from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';

@Component({
  selector: 'app-label',
  templateUrl: './labelWithTooltip.component.html',
  styleUrls: ['./labelWithTooltip.component.scss'],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { class: 'app-label' },
})
export class LabelWithTooltipComponent {
  @Input() label: string;
  @Input() forId: string;
  @Input() tooltip: string;
  @Input() tooltipPosition: TooltipPosition;
}
