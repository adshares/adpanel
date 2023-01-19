import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { BaseListComponent } from 'admin/users/base-list/base-list.component';
import { SessionService } from 'app/session.service';
import { AppState } from 'models/app-state.model';
import { RefLinkEditorDialogComponent } from 'settings/general-settings/ref-link-settings/ref-link-editor-dialog/ref-link-editor-dialog.component';
import { GetRefLinks } from 'store/settings/settings.actions';

@Component({
  selector: 'app-ref-link-settings',
  templateUrl: './ref-link-settings.component.html',
  styleUrls: ['./ref-link-settings.component.scss'],
})
export class RefLinkSettingsComponent extends BaseListComponent implements OnInit {
  refundEnabled: boolean;
  defaultRefundCommission: number;
  createIcon = faPlus;
  isImpersonated: boolean = false;

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    store: Store<AppState>,
    private dialog: MatDialog,
    private session: SessionService
  ) {
    super(store, router, activatedRoute);
  }

  ngOnInit(): void {
    const user = this.session.getUser();
    this.isImpersonated = this.session.isImpersonated();
    this.refundEnabled = user.referralRefundEnabled;
    this.defaultRefundCommission = user.referralRefundCommission;
    const dataSubscription = this.store.select('state', 'user', 'settings', 'refLinks').subscribe(refLinks => {
      this.list = refLinks;
      this.pageSize = refLinks.perPage;
      if (refLinks.data.length < refLinks.perPage) {
        if (refLinks.currentPage < refLinks.lastPage) {
          const url = refLinks.links.find(link => link.active).url;
          this.store.dispatch(new GetRefLinks({ pageUrl: url }));
          return;
        } else {
          if (0 === refLinks.data.length && refLinks.prevPageUrl !== null) {
            this.store.dispatch(new GetRefLinks({ pageUrl: refLinks.prevPageUrl }));
            return;
          }
        }
      }
      this.isLoading = false;
    });
    this.subscriptions.push(dataSubscription);
    this.loadList();
  }

  create(): void {
    const dialog = this.dialog.open(RefLinkEditorDialogComponent, {});
    dialog.componentInstance.refLinkSaved.subscribe(_refLink => this.loadList());
  }

  get defaultQueryParams(): object {
    return {};
  }

  loadList(nextPage?): void {
    this.isLoading = true;
    this.store.dispatch(new GetRefLinks({ pageUrl: nextPage }));
  }
}
