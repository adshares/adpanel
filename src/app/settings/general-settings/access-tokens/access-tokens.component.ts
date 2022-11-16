import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Store } from '@ngrx/store'
import { BaseListComponent } from 'admin/users/base-list/base-list.component'
import { AccessTokenScope } from 'models/access-token.model'
import { AppState } from 'models/app-state.model'
import { AddAccessToken, GetAccessTokens } from 'store/settings/settings.actions'

@Component({
  selector: 'app-access-tokens',
  templateUrl: './access-tokens.component.html',
  styleUrls: ['./access-tokens.component.scss']
})
export class AccessTokensComponent extends BaseListComponent implements OnInit {
  availableScopes: AccessTokenScope[] = []
  createIcon = faPlus
  newTokenForm: any

  constructor (
    activatedRoute: ActivatedRoute,
    router: Router,
    store: Store<AppState>,
  ) {
    super(store, router, activatedRoute)
  }

  onAddToken (): void {
    const token = {
      ...this.newTokenForm.value,
      scopes: Object.entries(this.newTokenForm.value.scopes).filter(value => value[1]).map(value => value[0]),
    }
    this.store.dispatch(new AddAccessToken(token))
  }

  ngOnInit (): void {
    this.availableScopes = this.activatedRoute.snapshot.data.scopes

    const scopesControls = {}
    this.availableScopes.forEach(availableScope => scopesControls[availableScope.id] = new FormControl())

    this.newTokenForm = new FormGroup({
      name: new FormControl('', Validators.required),
      scopes: new FormGroup(scopesControls),
    })

    const accessTokensSubscription = this.store.select('state', 'user', 'settings', 'accessTokens')
      .subscribe(accessTokens => {
        this.list = accessTokens
        this.pageSize = accessTokens.length
        this.isLoading = false
      })
    this.subscriptions.push(accessTokensSubscription)

    this.loadList()
  }

  get defaultQueryParams (): object {
    return {}
  }

  loadList (nextPage?): void {
    this.isLoading = true
    this.store.dispatch(new GetAccessTokens())
  }
}
