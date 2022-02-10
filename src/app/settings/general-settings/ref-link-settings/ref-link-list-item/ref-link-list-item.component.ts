import {Component, Input, OnInit, } from '@angular/core';
import {RefLink} from "models/settings.model";
import {CODE, CRYPTO, DATE_FORMAT} from "common/utilities/consts";
import {ShowSuccessSnackbar} from "store/common/common.actions";
import {Store} from "@ngrx/store";
import {AppState} from "models/app-state.model";
import {faExternalLinkSquareAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ref-link-list-item',
  templateUrl: './ref-link-list-item.component.html',
  styleUrls: ['./ref-link-list-item.component.scss']
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

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
    let refund = this.refLink.refund || this.defaultRefundCommission;
    this.refundCommission = refund * this.refLink.keptRefund;
    this.bonusCommission = refund * (1 - this.refLink.keptRefund);
  }

  getRefLinkUrl(): string
  {
    const domain = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    return`${domain}/ref/${this.refLink.token}`;
  }

  copyUrl(): void {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (this.getRefLinkUrl()));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this.store.dispatch(new ShowSuccessSnackbar('Copied!'))
  }
}
