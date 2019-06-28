import { Component, Input, Output } from '@angular/core';
import { Subject } from "rxjs";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-label',
  templateUrl: './labelWithTooltip.component.html',
  styleUrls: ['./labelWithTooltip.component.scss'],
  host: {'class': 'app-label'},
})
export class LabelWithTooltipComponent {
  @Input() label: string;
  @Input() forId: string;
  @Input() tooltip: string;
  @Input() tooltipPosition: string ;
}
