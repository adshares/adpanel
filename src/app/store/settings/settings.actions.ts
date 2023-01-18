import { Action } from '@ngrx/store';
import { AccessToken, AccessTokenResponse, AccessTokenResponseWithSecret } from 'models/access-token.model';
import { BillingHistory, PaginatorResponse, RefLink } from 'models/settings.model';
import { User } from 'models/user.model';

export const GET_ACCESS_TOKENS = 'Get access tokens';
export const GET_ACCESS_TOKENS_SUCCESS = 'Get access tokens success';

export const ADD_ACCESS_TOKEN = 'Add access token';
export const ADD_ACCESS_TOKEN_SUCCESS = 'Add access token success';

export const DELETE_ACCESS_TOKEN = 'Delete access token';
export const DELETE_ACCESS_TOKEN_SUCCESS = 'Delete access token success';

export const GET_CURRENT_BALANCE = 'Get current balance';
export const GET_CURRENT_BALANCE_SUCCESS = 'Get current balance success';
export const GET_CURRENT_BALANCE_FAILURE = 'Get current balance failure';

export const CANCEL_AWAITING_TRANSACTION = 'Cancel awaiting transaction';
export const CANCEL_AWAITING_TRANSACTION_SUCCESS = 'Cancel awaiting transaction success';

export const GET_BILLING_HISTORY = 'Get billing history';
export const GET_BILLING_HISTORY_SUCCESS = 'Get billing history success';
export const GET_BILLING_HISTORY_FAILURE = 'Get billing history failure';

export const GET_REF_LINKS = 'Get ref links';
export const GET_REF_LINKS_SUCCESS = 'Get ref links success';
export const GET_REF_LINKS_FAILURE = 'Get ref links failure';

export const DELETE_REF_LINK = 'Delete ref link';
export const DELETE_REF_LINK_SUCCESS = 'Delete ref link success';

export const WITHDRAW_FUNDS_SUCCESS = 'Withdraw funds success';

export class GetAccessTokens implements Action {
  readonly type: string = GET_ACCESS_TOKENS;

  constructor(public payload?: any) {}
}

export class GetAccessTokensSuccess implements Action {
  readonly type: string = GET_ACCESS_TOKENS_SUCCESS;

  constructor(public payload: AccessTokenResponse[]) {}
}

export class AddAccessToken implements Action {
  readonly type: string = ADD_ACCESS_TOKEN;

  constructor(public payload: AccessToken) {}
}

export class AddAccessTokenSuccess implements Action {
  readonly type: string = ADD_ACCESS_TOKEN_SUCCESS;

  constructor(public payload: AccessTokenResponseWithSecret) {}
}

export class DeleteAccessToken implements Action {
  readonly type: string = DELETE_ACCESS_TOKEN;

  constructor(public payload: string) {}
}

export class DeleteAccessTokenSuccess implements Action {
  readonly type: string = DELETE_ACCESS_TOKEN_SUCCESS;

  constructor(public payload: string) {}
}

export class GetCurrentBalance implements Action {
  readonly type: string = GET_CURRENT_BALANCE;

  constructor(public payload?: any) {}
}

export class GetCurrentBalanceSuccess implements Action {
  readonly type: string = GET_CURRENT_BALANCE_SUCCESS;

  constructor(public payload: User) {}
}

export class GetCurrentBalanceFailure implements Action {
  readonly type: string = GET_CURRENT_BALANCE_FAILURE;

  constructor(public payload: any) {}
}

export class CancelAwaitingTransaction implements Action {
  readonly type: string = CANCEL_AWAITING_TRANSACTION;

  constructor(public payload: number) {}
}

export class CancelAwaitingTransactionSuccess implements Action {
  readonly type: string = CANCEL_AWAITING_TRANSACTION_SUCCESS;

  constructor(public payload?: number) {}
}

export class GetBillingHistory implements Action {
  readonly type: string = GET_BILLING_HISTORY;

  constructor(
    public payload?: {
      dateFrom: string;
      dateTo: string;
      types: number[];
      limit?: number;
      offset?: number;
    }
  ) {}
}

export class GetBillingHistorySuccess implements Action {
  readonly type: string = GET_BILLING_HISTORY_SUCCESS;

  constructor(public payload: BillingHistory) {}
}

export class GetBillingHistoryFailure implements Action {
  readonly type: string = GET_BILLING_HISTORY_FAILURE;

  constructor(public payload: string) {}
}

export class WithdrawFundsSuccess implements Action {
  readonly type: string = WITHDRAW_FUNDS_SUCCESS;

  constructor(public payload: any) {}
}

export class GetRefLinks implements Action {
  readonly type: string = GET_REF_LINKS;

  constructor(public payload: { pageUrl: string | undefined }) {}
}

export class GetRefLinksSuccess implements Action {
  readonly type: string = GET_REF_LINKS_SUCCESS;

  constructor(public payload: PaginatorResponse<RefLink>) {}
}

export class GetRefLinksFailure implements Action {
  readonly type: string = GET_REF_LINKS_FAILURE;

  constructor(public payload: string) {}
}

export class DeleteRefLink implements Action {
  readonly type: string = DELETE_REF_LINK;

  constructor(public payload: number) {}
}

export class DeleteRefLinkSuccess implements Action {
  readonly type: string = DELETE_REF_LINK_SUCCESS;

  constructor(public payload: number) {}
}

export type actions =
  | AddAccessToken
  | AddAccessTokenSuccess
  | GetCurrentBalance
  | GetCurrentBalanceSuccess
  | GetCurrentBalanceFailure
  | CancelAwaitingTransaction
  | CancelAwaitingTransactionSuccess
  | GetBillingHistory
  | GetBillingHistorySuccess
  | GetBillingHistoryFailure
  | WithdrawFundsSuccess
  | GetRefLinks
  | GetRefLinksSuccess
  | GetRefLinksFailure
  | DeleteRefLink
  | DeleteRefLinkSuccess;
