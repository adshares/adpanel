import { Observable } from 'rxjs/Observable';
import { CanComponentDeactivate } from '../advertiser/advertiser-guard.service';
import { LeaveEditProcessDialogComponent } from './dialog/leave-edit-process-dialog/leave-edit-process-dialog.component';
import { MatDialog } from '@angular/material';

export class HandleLeaveEditProcess implements CanComponentDeactivate {
  changesSaved = false;

  constructor(private dialog: MatDialog) {}

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.changesSaved) {
      this.dialog.open(LeaveEditProcessDialogComponent);
    }
    return true;
  }
}
