import { Action } from '@ngrx/store';
import {
  AdminIndexUpdateTimeResponse,
  AdminPrivacyAndTermsSettingsResponse,
  AdminSettings,
  AdminSettingsResponse,
  AdminWalletResponse,
  License, PublisherInfo,
  UserInfo
} from 'models/settings.model';

export const LOAD_USERS = 'Users loading';
export const LOAD_USERS_SUCCESS = 'Users loading success';
export const LOAD_USERS_FAILURE = 'Users loading failure';

export const LOAD_PUBLISHERS = 'Publishers loading';
export const LOAD_PUBLISHERS_SUCCESS = 'Publishers loading success';
export const LOAD_PUBLISHERS_FAILURE = 'Publishers loading failure';

export const LOAD_ADMIN_SETTINGS = 'Admin settings loading';
export const LOAD_ADMIN_SETTINGS_SUCCESS = 'Admin settings loading success';
export const LOAD_ADMIN_SETTINGS_FAILURE = 'Admin settings loading failure';

export const LOAD_ADMIN_WALLET = 'Admin wallet loading';
export const LOAD_ADMIN_WALLET_SUCCESS = 'Admin wallet loading success';
export const LOAD_ADMIN_WALLET_FAILURE = 'Admin wallet loading failure';

export const SET_ADMIN_SETTINGS = 'Save new admin settings';
export const SET_ADMIN_SETTINGS_SUCCESS = 'Save new admin settings success';
export const SET_ADMIN_SETTINGS_FAILURE = 'Save new admin settings failure';

export const GET_PRIVACY_SETTINGS = 'Get admin privacy settings';
export const GET_PRIVACY_SETTINGS_SUCCESS = 'Get admin privacy settings success';
export const GET_PRIVACY_SETTINGS_FAILURE = 'Get admin privacy settings failure';

export const SET_PRIVACY_SETTINGS = 'Set admin privacy settings';
export const SET_PRIVACY_SETTINGS_SUCCESS = 'Set admin privacy settings success';
export const SET_PRIVACY_SETTINGS_FAILURE = 'Set admin privacy settings failure';

export const GET_TERMS_SETTINGS = 'Get admin terms settings';
export const GET_TERMS_SETTINGS_SUCCESS = 'Get admin terms settings success';
export const GET_TERMS_SETTINGS_FAILURE = 'Get admin terms settings failure';

export const SET_TERMS_SETTINGS = 'Set admin terms settings';
export const SET_TERMS_SETTINGS_SUCCESS = 'Set admin terms settings success';
export const SET_TERMS_SETTINGS_FAILURE = 'Set admin terms settings failure';

export const REQUEST_GET_INDEX = 'Request Get index';
export const GET_INDEX = 'Get index';
export const GET_INDEX_SUCCESS = 'Get index success';
export const GET_INDEX_FAILURE = 'Get index failure';

export const GET_LICENSE = 'Get license';
export const GET_LICENSE_SUCCESS = 'Get license success';
export const GET_LICENSE_FAILURE = 'Get license failure';

export class LoadUsers implements Action {
  readonly type: string = LOAD_USERS;

  constructor(public payload: { nextPage?: string, searchPhrase?: string }) {
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

export class SetAdminSettingsFailure implements Action {
  readonly type: string = SET_ADMIN_SETTINGS_FAILURE;

  constructor(public payload?: string) {
  }
}

export class GetPrivacySettings implements Action {
  readonly type: string = GET_PRIVACY_SETTINGS;

  constructor(public payload?: any) {
  }
}

export class GetPrivacySettingsSuccess implements Action {
  readonly type: string = GET_PRIVACY_SETTINGS_SUCCESS;

  constructor(public payload: AdminPrivacyAndTermsSettingsResponse) {
  }
}

export class GetPrivacySettingsFailure implements Action {
  readonly type: string = GET_PRIVACY_SETTINGS_FAILURE;

  constructor(public payload?: string) {
  }
}

export class SetPrivacySettings implements Action {
  readonly type: string = SET_PRIVACY_SETTINGS;

  constructor(public payload: string) {
  }
}

export class SetPrivacySettingsSuccess implements Action {
  readonly type: string = SET_PRIVACY_SETTINGS_SUCCESS;

  constructor(public payload: string) {
  }
}

export class SetPrivacySettingsFailure implements Action {
  readonly type: string = SET_PRIVACY_SETTINGS_FAILURE;

  constructor(public payload?: string) {
  }
}

export class GetTermsSettings implements Action {
  readonly type: string = GET_TERMS_SETTINGS;

  constructor(public payload?: any) {
  }
}

export class GetTermsSettingsSuccess implements Action {
  readonly type: string = GET_TERMS_SETTINGS_SUCCESS;

  constructor(public payload: AdminPrivacyAndTermsSettingsResponse) {
  }
}

export class GetTermsSettingsFailure implements Action {
  readonly type: string = GET_TERMS_SETTINGS_FAILURE;

  constructor(public payload?: string) {
  }
}

export class SetTermsSettings implements Action {
  readonly type: string = SET_TERMS_SETTINGS;

  constructor(public payload: string) {
  }
}

export class SetTermsSettingsSuccess implements Action {
  readonly type: string = SET_TERMS_SETTINGS_SUCCESS;

  constructor(public payload: string) {
  }
}

export class SetTermsSettingsFailure implements Action {
  readonly type: string = SET_TERMS_SETTINGS_FAILURE;

  constructor(public payload?: string) {
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

export type actions =
  LoadUsers |
  LoadUsersSuccess |
  LoadUsersFailure |

  LoadPublishers |
  LoadPublishersSuccess |
  LoadPublishersFailure |

  LoadAdminSettings |
  LoadAdminSettingsSuccess |
  LoadAdminSettingsFailure |

  LoadAdminWallet |
  LoadAdminWalletSuccess |
  LoadAdminWalletFailure |

  SetAdminSettings |
  SetAdminSettingsSuccess |
  SetAdminSettingsFailure |

  GetPrivacySettings |
  GetPrivacySettingsSuccess |
  GetPrivacySettingsFailure |

  SetPrivacySettings |
  SetPrivacySettingsSuccess |
  SetPrivacySettingsFailure |

  GetTermsSettings |
  GetTermsSettingsSuccess |
  GetTermsSettingsFailure |

  SetTermsSettings |
  SetTermsSettingsSuccess |
  SetTermsSettingsFailure |

  RequestGetIndex |
  GetIndex |
  GetIndexSuccess |
  GetIndexFailure |

  GetLicense |
  GetLicenseSuccess |
  GetLicenseFailure;
