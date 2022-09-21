import { Action } from '@ngrx/store'
import {
  AdminIndexUpdateTimeResponse,
  AdminSettings,
  AdminSettingsResponse,
  AdminSiteOptionsResponse,
  AdminWalletResponse,
  AdvertiserInfo,
  License,
  PublisherInfo,
  UserBanDetails,
  UserInfo,
} from 'models/settings.model'

export const LOAD_USERS = 'Users loading';
export const LOAD_USERS_SUCCESS = 'Users loading success';
export const LOAD_USERS_FAILURE = 'Users loading failure';

export const LOAD_ADVERTISERS = 'Advertisers loading';
export const LOAD_ADVERTISERS_SUCCESS = 'Advertisers loading success';
export const LOAD_ADVERTISERS_FAILURE = 'Advertisers loading failure';

export const LOAD_PUBLISHERS = 'Publishers loading';
export const LOAD_PUBLISHERS_SUCCESS = 'Publishers loading success';
export const LOAD_PUBLISHERS_FAILURE = 'Publishers loading failure';

export const LOAD_ADMIN_SETTINGS = 'Admin settings loading';
export const LOAD_ADMIN_SETTINGS_SUCCESS = 'Admin settings loading success';
export const LOAD_ADMIN_SETTINGS_FAILURE = 'Admin settings loading failure';

export const LOAD_ADMIN_SITE_OPTIONS = 'Admin site options loading';
export const LOAD_ADMIN_SITE_OPTIONS_SUCCESS = 'Admin site options loading success';
export const LOAD_ADMIN_SITE_OPTIONS_FAILURE = 'Admin site options loading failure';

export const LOAD_ADMIN_WALLET = 'Admin wallet loading';
export const LOAD_ADMIN_WALLET_SUCCESS = 'Admin wallet loading success';
export const LOAD_ADMIN_WALLET_FAILURE = 'Admin wallet loading failure';

export const SET_ADMIN_SETTINGS = 'Save new admin settings';
export const SET_ADMIN_SETTINGS_SUCCESS = 'Save new admin settings success';

export const REQUEST_GET_INDEX = 'Request Get index';
export const GET_INDEX = 'Get index';
export const GET_INDEX_SUCCESS = 'Get index success';
export const GET_INDEX_FAILURE = 'Get index failure';

export const GET_LICENSE = 'Get license';
export const GET_LICENSE_SUCCESS = 'Get license success';
export const GET_LICENSE_FAILURE = 'Get license failure';

export const BAN_USER = 'Ban user';
export const BAN_USER_SUCCESS = 'Ban user success';

export const UNBAN_USER = 'Unban user';
export const UNBAN_USER_SUCCESS = 'Unban user success';

export const DELETE_USER = 'Delete user';
export const DELETE_USER_SUCCESS = 'Delete user success';


export class LoadUsers implements Action {
  readonly type: string = LOAD_USERS;

  constructor(public payload: { nextPage?: string, searchPhrase?: string, filters: string[], orderBy?: string, direction?: string }) {
  }
}

export class LoadUsersSuccess implements Action {
  readonly type: string = LOAD_USERS_SUCCESS;

  constructor(public payload: UserInfo[]) {
  }
}

export class LoadUsersFailure implements Action {
  readonly type: string = LOAD_USERS_FAILURE;

  constructor(public payload?: string) {
  }
}

export class LoadAdvertisers implements Action {
  readonly type: string = LOAD_ADVERTISERS;

  constructor(public payload: { groupBy?: string, interval?: string, searchPhrase?: string, minDailyViews?: number }) {
  }
}

export class LoadAdvertisersSuccess implements Action {
  readonly type: string = LOAD_ADVERTISERS_SUCCESS;

  constructor(public payload: AdvertiserInfo[]) {
  }
}

export class LoadAdvertisersFailure implements Action {
  readonly type: string = LOAD_ADVERTISERS_FAILURE;

  constructor(public payload?: string) {
  }
}

export class LoadPublishers implements Action {
  readonly type: string = LOAD_PUBLISHERS;

  constructor(public payload: { groupBy?: string, interval?: string, searchPhrase?: string, minDailyViews?: number }) {
  }
}

export class LoadPublishersSuccess implements Action {
  readonly type: string = LOAD_PUBLISHERS_SUCCESS;

  constructor(public payload: PublisherInfo[]) {
  }
}

export class LoadPublishersFailure implements Action {
  readonly type: string = LOAD_PUBLISHERS_FAILURE;

  constructor(public payload?: string) {
  }
}

export class LoadAdminSettings implements Action {
  readonly type: string = LOAD_ADMIN_SETTINGS;

  constructor(public payload?: any) {
  }
}

export class LoadAdminSettingsSuccess implements Action {
  readonly type: string = LOAD_ADMIN_SETTINGS_SUCCESS;

  constructor(public payload: AdminSettingsResponse) {
  }
}

export class LoadAdminSettingsFailure implements Action {
  readonly type: string = LOAD_ADMIN_SETTINGS_FAILURE;

  constructor(public payload?: string) {
  }
}

export class LoadAdminSiteOptions implements Action {
  readonly type: string = LOAD_ADMIN_SITE_OPTIONS;

  constructor(public payload?: any) {
  }
}

export class LoadAdminSiteOptionsSuccess implements Action {
  readonly type: string = LOAD_ADMIN_SITE_OPTIONS_SUCCESS;

  constructor(public payload: AdminSiteOptionsResponse) {
  }
}

export class LoadAdminSiteOptionsFailure implements Action {
  readonly type: string = LOAD_ADMIN_SITE_OPTIONS_FAILURE;

  constructor(public payload?: string) {
  }
}

export class LoadAdminWallet implements Action {
  readonly type: string = LOAD_ADMIN_WALLET;

  constructor(public payload?: any) {
  }
}

export class LoadAdminWalletSuccess implements Action {
  readonly type: string = LOAD_ADMIN_WALLET_SUCCESS;

  constructor(public payload: AdminWalletResponse) {
  }
}

export class LoadAdminWalletFailure implements Action {
  readonly type: string = LOAD_ADMIN_WALLET_FAILURE;

  constructor(public payload?: string) {
  }
}

export class SetAdminSettings implements Action {
  readonly type: string = SET_ADMIN_SETTINGS;

  constructor(public payload: AdminSettings) {
  }
}

export class SetAdminSettingsSuccess implements Action {
  readonly type: string = SET_ADMIN_SETTINGS_SUCCESS;

  constructor(public payload: AdminSettings) {
  }
}

export class RequestGetIndex implements Action {
  readonly type: string = REQUEST_GET_INDEX;

  constructor(public payload?: any) {
  }
}

export class GetIndex implements Action {
  readonly type: string = GET_INDEX;

  constructor(public payload?: any) {
  }
}

export class GetIndexSuccess implements Action {
  readonly type: string = GET_INDEX_SUCCESS;

  constructor(public payload: AdminIndexUpdateTimeResponse) {
  }
}

export class GetIndexFailure implements Action {
  readonly type: string = GET_INDEX_FAILURE;

  constructor(public payload?: any) {
  }
}

export class GetLicense implements Action {
  readonly type: string = GET_LICENSE;

  constructor(public payload?: any) {
  }
}

export class GetLicenseSuccess implements Action {
  readonly type: string = GET_LICENSE_SUCCESS;

  constructor(public payload: License | null) {
  }
}

export class GetLicenseFailure implements Action {
  readonly type: string = GET_LICENSE_FAILURE;

  constructor(public payload?: string) {
  }
}

export class BanUser implements Action {
  readonly type: string = BAN_USER;

  constructor (public payload: UserBanDetails) {
  }
}

export class BanUserSuccess implements Action {
  readonly type: string = BAN_USER_SUCCESS;

  constructor (public payload?: UserInfo) {
  }
}

export class UnbanUser implements Action {
  readonly type: string = UNBAN_USER;

  constructor (public payload: number) {
  }
}

export class UnbanUserSuccess implements Action {
  readonly type: string = UNBAN_USER_SUCCESS;

  constructor (public payload?: UserInfo) {
  }
}

export class DeleteUser implements Action {
  readonly type: string = DELETE_USER;

  constructor (public payload: number) {
  }
}

export class DeleteUserSuccess implements Action {
  readonly type: string = DELETE_USER_SUCCESS;

  constructor (public payload?: number) {
  }
}

export type actions =
  LoadUsers |
  LoadUsersSuccess |
  LoadUsersFailure |

  LoadAdvertisers |
  LoadAdvertisersSuccess |
  LoadAdvertisersFailure |

  LoadPublishers |
  LoadPublishersSuccess |
  LoadPublishersFailure |

  LoadAdminSettings |
  LoadAdminSettingsSuccess |
  LoadAdminSettingsFailure |

  LoadAdminSiteOptions |
  LoadAdminSiteOptionsSuccess |
  LoadAdminSiteOptionsFailure |

  LoadAdminWallet |
  LoadAdminWalletSuccess |
  LoadAdminWalletFailure |

  SetAdminSettings |
  SetAdminSettingsSuccess |

  RequestGetIndex |
  GetIndex |
  GetIndexSuccess |
  GetIndexFailure |

  GetLicense |
  GetLicenseSuccess |
  GetLicenseFailure |

  BanUser |
  BanUserSuccess |

  UnbanUser |
  UnbanUserSuccess |

  DeleteUser |
  DeleteUserSuccess ;
