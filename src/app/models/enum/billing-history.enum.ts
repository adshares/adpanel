export enum billingHistoryItemStatusEnum {
  ACCEPTED,
  PENDING,
  REJECTED,
  BLOCKED,
  PROCESSING,
  AWAITING,
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
}
