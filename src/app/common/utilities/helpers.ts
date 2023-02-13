import * as moment from 'moment';
import { campaignStatusesEnum } from 'models/enum/campaign.enum';
import { Campaign, CampaignsConfig } from 'models/campaign.model';
import { User } from 'models/user.model';
import { ChartDataset } from 'chart.js';

function adsToClicks(amount: any): number {
  if (typeof amount === 'number') {
    amount = amount.toFixed(12);
  }

  let arr = amount.split('.');
  arr[1] = arr[1].padEnd(11, '0').substring(0, 11);

  return parseInt(arr[0] + arr[1]);
}

function clicksToAds(amount: number): number {
  return amount / 1e11;
}

/**
 * Calculates campaign budget per hour in ADS.
 * @param budgetPerHour budget/hour in ADS
 */
function calcCampaignBudgetPerDay(budgetPerHour: number): number {
  return budgetPerHour * 24;
}

/**
 * Calculates campaign budget per day in ADS.
 * @param budgetPerDay budget/day in ADS
 */
function calcCampaignBudgetPerHour(budgetPerDay: number): number {
  return Math.floor((budgetPerDay * 1e11) / 24) / 1e11;
}

function cloneDeep(target) {
  return JSON.parse(JSON.stringify(target));
}

function cutDirectAdSizeAnchor(url: string): string {
  const index = url.lastIndexOf('#');
  return -1 === index ? url : url.substring(0, index);
}

function enumToArray(enumInput) {
  const enumNamesArray: string[] = [];

  for (let enumMember in enumInput) {
    if (typeof enumInput[enumMember] === 'number') {
      enumNamesArray.push(enumMember.toLowerCase());
    }
  }

  return enumNamesArray;
}

function enumToObjectArray(enumInput) {
  const enumNameArrayObject = [];

  for (let enumMember in enumInput) {
    if (typeof enumInput[enumMember] === 'number') {
      enumNameArrayObject.push({
        id: enumInput[enumMember],
        name: enumMember.toLowerCase(),
      });
    }
  }

  return enumNameArrayObject;
}

function formatMoney(
  value,
  precision: number = 11,
  trim: boolean = false,
  decimal: string = '.',
  thousand: string = ','
): string {
  const r = trim;
  const p = Math.max(precision, 2);
  const d = decimal;
  const t = thousand;
  let v = (value || '0') + '';

  let s = '';
  if (value < 0) {
    s = '-';
    v = v.substring(1);
  }

  v = v.padStart(11, '0');
  const l = v.length - 11;
  let a = v.substring(0, l) || '0';
  const j = a.length > 3 ? a.length % 3 : 0;
  let b = Math.round(parseInt((v + '0').substring(l, p + l + 1)) / 10).toString();
  if (b.length > p) {
    b = '0';
    a = (parseInt(a) + 1).toString();
  }
  b = b.padStart(p, '0');
  if (r) {
    b = b.replace(/([0-9]{2})0+$/, '$1');
  }
  return s + (j ? a.substring(0, j) + t : '') + a.substring(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + d + b;
}

function isUnixTimePastNow(unixTime): boolean {
  const nowUnix = (+new Date() / 1000) | 0;
  return unixTime < nowUnix;
}

function createInitialDataSet(): ChartDataset<any>[] {
  return [{ data: [], label: '' }];
}

function sortArrayByKeys<assetItem>(
  sortArray: assetItem[],
  keys: string[] = [],
  sortDesc: boolean = false
): assetItem[] {
  if (!keys.length) {
    return [...sortArray];
  }

  const sortOrder = sortDesc ? 1 : -1;

  return sortArray.slice().sort((item, nextItem) => {
    let sortItem = findValueByPathArray(item, keys);
    let nextSortItem = findValueByPathArray(nextItem, keys);
    if (typeof sortItem === 'string') {
      sortItem = sortItem.toLowerCase();
      nextSortItem = nextSortItem.toLowerCase();
    }
    if (sortItem < nextSortItem) {
      return sortOrder;
    } else if (sortItem > nextSortItem) {
      return -sortOrder;
    } else {
      return 0;
    }
  });
}

function findValueByPathArray(object, pathArray) {
  return pathArray.length === 1
    ? object[pathArray[0]] || 0
    : pathArray.reduce((obj, partialPath) => obj[partialPath], object);
}

const adjustCampaignStatus = (campaignInfo, currentDate): number => {
  if (campaignInfo.dateEnd === null || campaignInfo.status !== campaignStatusesEnum.ACTIVE) {
    return campaignInfo.status;
  } else if (currentDate > moment(campaignInfo.dateEnd)) {
    return campaignStatusesEnum.OUTDATED;
  } else if (currentDate < moment(campaignInfo.dateStart)) {
    return campaignStatusesEnum.AWAITING;
  } else {
    return campaignInfo.status;
  }
};

const validCampaignBudget = (config: CampaignsConfig, campaign: Campaign, user: User): string[] => {
  let accountError = false;
  let budgetError = false;
  let cpmError = false;
  let cpaError = false;
  const isOutdated =
    campaign.basicInformation.dateEnd && moment(new Date()) > moment(campaign.basicInformation.dateEnd);
  const isDirectDeal = checkDirectedDeal(campaign);

  const currency = user.exchangeRate ? user.exchangeRate.currency : '';
  const rate = user.exchangeRate ? user.exchangeRate.value : 1;

  if (campaign.basicInformation.budget < config.minBudget) {
    budgetError = true;
  } else if (user.adserverWallet.totalFunds < campaign.basicInformation.budget / rate) {
    accountError = true;
  } else if (isDirectDeal && user.adserverWallet.walletBalance < campaign.basicInformation.budget / rate) {
    accountError = true;
  }

  const maxCpm = campaign.basicInformation.maxCpm;
  const maxCpa = campaign.conversions
    ? campaign.conversions.map(el => el.value).reduce((max, val) => Math.max(max, val), 0)
    : 0;

  if (maxCpm == 0 && maxCpa == 0) {
    cpmError = true;
    cpaError = true;
  }
  if (maxCpm > 0 && maxCpm < config.minCpm) {
    cpmError = true;
  }
  if (maxCpa > 0 && maxCpa < config.minCpa) {
    cpaError = true;
  }

  const campaignBudget = `${formatMoney(campaign.basicInformation.budget, 2)} ${currency}`;
  const minBudget = `${formatMoney(calcCampaignBudgetPerDay(config.minBudget), 2)} ${currency}`;
  const minCpm = `${formatMoney(config.minCpm, 2)} ${currency}`;
  const minCpa = `${formatMoney(config.minCpa, 2)} ${currency}`;

  let errors = [];
  if (budgetError) {
    errors.push(`The daily budget of the campaign must be set to a minimum of ${minBudget}.`);
  }

  if (accountError) {
    let error = `You need to have at least ${campaignBudget} in your account`;
    if (isDirectDeal) {
      error += ', excluding bonuses';
    }
    errors.push(`${error}.`);
  }

  if (cpmError) {
    let error = `The CPM of the campaign must be set to a minimum of ${minCpm}`;
    if (!cpaError) {
      error += '.';
    }
    errors.push(error);
  }

  if (cpaError) {
    let error = '';
    if (cpmError) {
      error += ' or a';
    } else {
      error += 'The';
    }
    errors.push(`${error} conversion value must be set to a minimum of ${minCpa}.`);
  }

  if (isOutdated) {
    errors.push('The campaign is outdated. Unset end date or change to a future date.');
  }

  return errors;
};

function downloadReport(data: any): void {
  const fileName = data.headers.get('content-disposition').split('filename=')[1] || 'report.xlsx';
  const type = data.headers.get('content-type');
  const blob = new Blob([data.body], { type });
  const link = document.createElement('a');
  link.setAttribute('download', fileName);
  link.setAttribute('href', URL.createObjectURL(blob));
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function mapToIterable(dict: Object): any[] {
  let a = [];

  for (const key in dict) {
    if (dict.hasOwnProperty(key)) {
      a.push({ key: key, value: dict[key] });
    }
  }

  return a;
}

function buildUrl(url: string, params: string[]): string {
  return `${url}${url.indexOf('?') >= 0 ? '&' : '?'}${params.join('&')}`;
}

function formatNumberWithComma(value) {
  return (value || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function checkDirectedDeal(campaign) {
  let isDirectDeal = false;
  if (campaign.basicInformation.medium === 'metaverse' && campaign.targeting.requires.site?.domain) {
    const isTargetingForParcel = campaign.targeting.requires.site.domain.find(domain => domain.startsWith('scene'));
    if (isTargetingForParcel) {
      isDirectDeal = true;
    }
  }
  return isDirectDeal;
}

function currencySymbolByCode(code: string): string {
  return code === 'USD' ? '$' : code;
}

export {
  adsToClicks,
  clicksToAds,
  calcCampaignBudgetPerDay,
  calcCampaignBudgetPerHour,
  cloneDeep,
  currencySymbolByCode,
  cutDirectAdSizeAnchor,
  enumToArray,
  enumToObjectArray,
  formatMoney,
  isUnixTimePastNow,
  createInitialDataSet,
  sortArrayByKeys,
  adjustCampaignStatus,
  validCampaignBudget,
  downloadReport,
  mapToIterable,
  buildUrl,
  formatNumberWithComma,
};
