import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UserConfirmResponseDialogComponent } from 'common/dialog/user-confirm-response-dialog/user-confirm-response-dialog.component';
import { AccessTokenScope, AccessTokenStore } from 'models/access-token.model';
import { AppState } from 'models/app-state.model';
import { DeleteAccessToken } from 'store/settings/settings.actions';
import { ActivatedRoute } from '@angular/router';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-access-token-list-item',
  templateUrl: './access-token-list-item.component.html',
  styleUrls: ['./access-token-list-item.component.scss'],
})
export class AccessTokenListItemComponent implements OnInit {
  @Input() accessToken: AccessTokenStore;
  scopes = '';
  faTrashAlt = faTrashAlt;

  constructor(private activatedRoute: ActivatedRoute, private dialog: MatDialog, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.scopes = (<AccessTokenScope[]>this.activatedRoute.snapshot.data.scopes)
      .filter(scope => this.accessToken.scopes.includes(scope.id))
      .map(scope => scope.description)
      .join(', ');
  }

  onDelete(): void {
    this.dialog
      .open(UserConfirmResponseDialogComponent, {
        data: {
          message: `Do you want delete access token ${this.accessToken.name}?`,
        },
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.store.dispatch(new DeleteAccessToken(this.accessToken.id));
        }
      });
  }
}
