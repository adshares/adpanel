import { Component, OnInit } from '@angular/core';
import { SetYourEarningsDialogComponent } from'../dialogs/set-your-earnings-dialog/set-your-earnings-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openSetEarningsDialog() {
    const dialogRef = this.dialog.open(SetYourEarningsDialogComponent);
  }
}
