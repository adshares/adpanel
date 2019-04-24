import { ADS_CODE, ADS_SYMBOL, DOLLAR_CODE, DOLLAR_SYMBOL } from "common/utilities/consts";

let serverUrl = 'https://test-server.e11.click'; // 'http://localhost:8101'; //

export const environment = {
  production: false,
  serverUrl: serverUrl,
  authUrl: serverUrl + '/auth',
  apiUrl: serverUrl + '/api',
  xdebug: false,
  version: "0",
  context: 'local',
  currencySymbol: DOLLAR_SYMBOL,
  currencyCode: DOLLAR_CODE,
  cryptoSymbol: ADS_SYMBOL,
  cryptoCode: ADS_CODE
};
