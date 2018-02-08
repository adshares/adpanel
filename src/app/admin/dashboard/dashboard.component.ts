import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SetYourEarningsDialogComponent } from '../dialogs/set-your-earnings-dialog/set-your-earnings-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(private dialog: MatDialog) { }

}
