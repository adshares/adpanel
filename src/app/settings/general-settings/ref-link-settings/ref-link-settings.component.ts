import {Component, OnInit} from '@angular/core';
import {SessionService} from 'app/session.service';
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {RefLink} from "models/settings.model";
import {Store} from "@ngrx/store";
import {AppState} from "models/app-state.model";
import {HandleSubscription} from "common/handle-subscription";
import {GetRefLinks} from "store/settings/settings.actions";
import { MatDialog } from "@angular/material/dialog";
import {RefLinkEditorDialogComponent} from "settings/general-settings/ref-link-settings/ref-link-editor-dialog/ref-link-editor-dialog.component";

@Component({
  selector: 'app-ref-link-settings',
  templateUrl: './ref-link-settings.component.html',
  styleUrls: ['./ref-link-settings.component.scss']
})
export class RefLinkSettingsComponent extends HandleSubscription implements OnInit {
  refundEnabled: boolean;
  defaultRefundCommission: number;
  refLinks: RefLink[] = [];
  showLoader: boolean = true;
  createIcon = faPlus;
  isImpersonated: boolean = false;

  constructor(
    private session: SessionService,
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    const user = this.session.getUser();
    this.isImpersonated = this.session.isImpersonated();
    this.refundEnabled = user.referralRefundEnabled;
    this.defaultRefundCommission = user.referralRefundCommission;
    const dataSubscription = this.store.select('state', 'user', 'settings', 'refLinks')
      .subscribe((refLinks) => {
        this.refLinks = refLinks;
        this.showLoader = false;
      });
    this.subscriptions.push(dataSubscription);
    this.getRefLinks();
  }

  getRefLinks(): void {
    this.showLoader = true;
    this.store.dispatch(new GetRefLinks());
  }

  create(): void {
    const dialog = this.dialog.open(RefLinkEditorDialogComponent, {});
    dialog.componentInstance.refLinkSaved.subscribe(_refLink => this.getRefLinks())
  }
}
