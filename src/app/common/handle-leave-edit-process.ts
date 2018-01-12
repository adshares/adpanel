import { Observable } from 'rxjs/Observable';
import {CanComponentDeactivate} from "../advertiser/advertiser-guard.service";

export class HandleLeaveEditProcess implements CanComponentDeactivate {
  changesSaved = false;

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.changesSaved) {
      return confirm('Do you want to discard changes');
    }
    return true;
  }
}
