export interface Info {
  adsAddress: string;
  capabilities: string[];
  demandFee: number;
  inventoryUrl: string;
  landingUrl: string;
  mode: string;
  module: string;
  name: string;
  panelUrl: string;
  privacyUrl: string;
  registrationMode: string;
  serverUrl: string;
  supplyFee: number;
  supportEmail: string;
  termsUrl: string;
  version: string;
}

export interface Placeholders {
  advertiserApplyFormUrl: string | null;
  publisherApplyFormUrl: string | null;
  loginInfo: string | null;
}
