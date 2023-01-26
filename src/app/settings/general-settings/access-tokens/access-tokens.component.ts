import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseListComponent } from 'admin/users/base-list/base-list.component';
import { AccessTokenScope } from 'models/access-token.model';
import { AppState } from 'models/app-state.model';
import { AccessTokenDialogComponent } from 'settings/dialogs/access-token-dialog/access-token-dialog.component';
import {
  ADD_ACCESS_TOKEN_SUCCESS,
  AddAccessToken,
  AddAccessTokenSuccess,
  GetAccessTokens,
} from 'store/settings/settings.actions';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-access-tokens',
  templateUrl: './access-tokens.component.html',
  styleUrls: ['./access-tokens.component.scss'],
})
export class AccessTokensComponent extends BaseListComponent implements OnInit {
  readonly faPlus = faPlus;
  availableScopes: AccessTokenScope[];
  newTokenForm: FormGroup;

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    store: Store<AppState>,
    private action$: Actions,
    private dialog: MatDialog
  ) {
    super(store, router, activatedRoute);
  }

  onAddToken(): void {
    const token = {
      ...this.newTokenForm.value,
      scopes: Object.entries(this.newTokenForm.value.scopes)
        .filter(value => value[1])
        .map(value => value[0]),
    };

    this.action$.pipe(ofType<AddAccessTokenSuccess>(ADD_ACCESS_TOKEN_SUCCESS), first()).subscribe(action => {
      this.dialog.open(AccessTokenDialogComponent, {
        data: action.payload.accessToken,
      });
    });

    this.store.dispatch(new AddAccessToken(token));
  }

  ngOnInit(): void {
    this.availableScopes = this.activatedRoute.snapshot.data.scopes || [];

    const scopesControls = {};
    this.availableScopes.forEach(availableScope => (scopesControls[availableScope.id] = new FormControl()));

    this.newTokenForm = new FormGroup({
      name: new FormControl('', Validators.required),
      scopes: new FormGroup(scopesControls),
    });

    const accessTokensSubscription = this.store
      .select('state', 'user', 'settings', 'accessTokens')
      .subscribe(accessTokens => {
        this.list = accessTokens;
        this.pageSize = accessTokens.length;
        this.isLoading = false;
      });
    this.subscriptions.push(accessTokensSubscription);

    this.loadList();
  }

  get defaultQueryParams(): object {
    return {};
  }

  loadList(_nextPage?): void {
    this.isLoading = true;
    this.store.dispatch(new GetAccessTokens());
  }
}
