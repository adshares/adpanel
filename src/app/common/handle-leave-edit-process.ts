import { Observable } from 'rxjs/Observable';
import { CanComponentDeactivate } from '../advertiser/advertiser-guard.service';

export class HandleLeaveEditProcess implements CanComponentDeactivate {
  changesSaved = false;

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.changesSaved) {
      confirm('Are you sure you want to leave?');
    }
    return true;
  }
}
