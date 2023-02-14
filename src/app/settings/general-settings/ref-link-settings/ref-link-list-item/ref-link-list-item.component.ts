import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';
import { faCopy, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { Store } from '@ngrx/store';
import { UserConfirmResponseDialogComponent } from 'common/dialog/user-confirm-response-dialog/user-confirm-response-dialog.component';
import { CODE, CRYPTO, DATE_FORMAT } from 'common/utilities/consts';
import { AppState } from 'models/app-state.model';
import { RefLink } from 'models/settings.model';
import { DeleteRefLink } from 'store/settings/settings.actions';
import { HelperService } from 'common/helper.service';

@Component({
  selector: 'app-ref-link-list-item',
  templateUrl: './ref-link-list-item.component.html',
  styleUrls: ['./ref-link-list-item.component.scss'],
})
export class RefLinkListItemComponent implements OnInit {
  @Input() refundEnabled: boolean;
  @Input() defaultRefundCommission: number;
  @Input() refLink: RefLink;
  refundCommission: number;
  bonusCommission: number;
  readonly crypto: string = CRYPTO;
  readonly code: string = CODE;
  readonly dateFormat: string = DATE_FORMAT;
  readonly faExternalLinkSquareAlt = faExternalLinkSquareAlt;
  readonly faTrash = faTrashAlt;
  readonly faCopy = faCopy;

  constructor(private dialog: MatDialog, private store: Store<AppState>, private helperService: HelperService) {}

  ngOnInit(): void {
    let refund = this.refLink.refund || this.defaultRefundCommission;
    this.refundCommission = refund * this.refLink.keptRefund;
    this.bonusCommission = refund * (1 - this.refLink.keptRefund);
  }

  getRefLinkUrl(): string {
    const domain = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    return `${domain}/ref/${this.refLink.token}`;
  }

  copyUrl(): void {
    this.helperService.copyToClipboard(this.getRefLinkUrl());
  }

  delete(): void {
    this.dialog
      .open(UserConfirmResponseDialogComponent, {
        data: {
          message: `Do you want delete referral link ${this.refLink.token}?`,
        },
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.store.dispatch(new DeleteRefLink(this.refLink.id));
        }
      });
  }
}
