export enum userRolesEnum {
  ADMIN,
  MODERATOR,
  AGENCY,
  ADVERTISER,
  PUBLISHER,
}

export enum UserRole {
  ADMIN = 'admin',
  ADVERTISER = 'advertiser',
  AGENCY = 'agency',
  MODERATOR = 'moderator',
  PUBLISHER = 'publisher',
}

export enum reportType {
  CAMPAIGNS = 'campaigns',
  SITES = 'sites',
}

export enum reportState {
  PREPARING = 'preparing',
  READY = 'ready',
  DELETED = 'deleted',
}
