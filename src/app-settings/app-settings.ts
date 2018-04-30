export const appSettings = {
  ROUTER_TRANSITION_DURATION: 200,
  MAX_AD_IMAGE_SIZE: 512000,
  REMEMBER_USER_EXPIRATION_SECONDS: 259200,
  AUTH_TOKEN_EXPIRATION_SECONDS: 900,
  UPDATE_NOTIFICATION_MILLISECONDS_INTRERVAL: 120000,
  WITHDRAWAL_AMOUNTS: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
  PRIVACY_POLICY_LINK: 'https://adshares.net/privacy.txt',
  FAQ_LINK: 'https://adshares.net/faq.html',
  SUPPORT_EMAIL: 'office@adshares.net',
  TX_FEE: 0.002,
  ADDRESS_REGEXP: '[0-9a-fA-F]{4}-[0-9a-fA-F]{8}-([0-9a-fA-F]{4}|XXXX)',
  TARGET_URL_REGEXP: `((http|https)(:\/\/))?([a-zA-Z0-9]+[.]{1}){2}[a-zA-z0-9]+(\/{1}[a-zA-Z0-9]+)*\/?`,
  USER_TYPES: ['Advertisers', 'Publishers', 'All']
};
