import { Component } from '@angular/core';
import { HandleSubscription } from 'common/handle-subscription';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends HandleSubscription {

}
