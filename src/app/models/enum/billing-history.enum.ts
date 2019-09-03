export enum billingHistoryItemStatusEnum {
  ACCEPTED,
  PENDING,
  REJECTED,
  BLOCKED,
  PROCESSING,
  UNCONFIRMED,
  CANCELED,
  'SYS_ERROR' = 126,
  'NET_ERROR' = 127,
}

export enum billingHistoryItemTypeEnum {
  UNKNOWN,
  DEPOSIT,
  WITHDRAWAL,
  AD_INCOME,
  AD_EXPENDITURE,
  BONUS_INCOME,
  BONUS_EXPENDITURE,
}
