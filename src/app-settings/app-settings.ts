import { environment } from 'environments/environment';

export const appSettings = {
  // ADS Operator URL
  ADS_OPERATOR_URL: environment.production ? 'https://operator.adshares.net' : 'https://operator1.e11.click',
  // milliseconds of transitioning effect between views
  ROUTER_TRANSITION_DURATION: 200,
  // max byte size of ad image
  MAX_AD_IMAGE_SIZE: 512000,
  // seconds of how long remembered user auth token will be stored
  REMEMBER_USER_EXPIRATION_SECONDS: 259200,
  // seconds of how long not remembered user auth token will be stored
  AUTH_TOKEN_EXPIRATION_SECONDS: 900,
  // time after which advertisers'/publishers' charts and tables will be automatically refreshed
  AUTOMATIC_REFRESH_INTERVAL: 60000,
  // update notification time in milliseconds
  UPDATE_NOTIFICATION_MILLISECONDS_INTERVAL: 60000,
  // dismiss push notification time in milliseconds
  DISMISS_PUSH_NOTIFICATION_INTERVAL: 10000,
  // withdraw amounts values
  WITHDRAWAL_AMOUNTS: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
  // privacy policy link
  PRIVACY_POLICY_LINK: environment.serverUrl + '/policies/privacy.html',
  // terms of service link
  TERMS_OF_SERVICE_LINK: environment.serverUrl + '/policies/terms.html',
  // get ADS faq link
  GET_ADS_FAQ_LINK: 'https://adshar.es/getADS',
  // withdraw ADS faq link
  WITHDRAW_ADS_FAQ_LINK: 'https://adshar.es/withdrawADS',
  // advertiser instruction wiki link
  ADVERTISER_INSTRUCTION_LINK: 'https://github.com/adshares/adserver/wiki/How-to-use-Advertising-Ecosystem#how-to-use-the-adserver--instruction-for-advertisers',
  // publisher instruction wiki link
  PUBLISHER_INSTRUCTION_LINK: 'https://github.com/adshares/adserver/wiki/How-to-use-Advertising-Ecosystem#how-to-use-the-adserver--instruction-for-publishers',
  // support email
  SUPPORT_EMAIL: 'office@adshares.net',
  // blockchain address validation regexp
  ADDRESS_REGEXP: '[0-9a-fA-F]{4}-[0-9a-fA-F]{8}-([0-9a-fA-F]{4}|XXXX)',
  // Bitcoin address validation regexp
  BTC_ADDRESS_REGEXP: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
  // url validation regexp
  TARGET_URL_REGEXP: `(?:(?:https?|ftp|http):\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9_]-*)*[a-z\u00a1-\uffff0-9_]+)(?:\\.(?:[a-z\u00a1-\uffff0-9_]-*)*[a-z\u00a1-\uffff0-9_]+)*(?:\\.(?:[a-z\u00a1-\uffff]{2,}))\\.?)(?::\\d{2,5})?(?:[\\/?#]\\S*)?`,
  // user types available for admin filtering
  USER_TYPES: ['Advertisers', 'Publishers', 'All']
};
