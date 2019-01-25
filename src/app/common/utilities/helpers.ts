import {TableColumnMetaData} from 'models/table.model';

function adsToClicks(amount: any): number {
  if (typeof amount === 'number') {
    amount = amount.toFixed(12);
  }

  let arr = amount.split('.');
  arr[1] = arr[1].padEnd(11, '0').substring(0, 11);

  return parseInt(arr[0] + arr[1]);
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
  return Math.floor(budgetPerDay * 100000000000 / 24) / 100000000000;
}

function cloneDeep(target) {
  return JSON.parse(JSON.stringify(target));
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

function enumToObject(enumInput) {
  const enumNameObject = {};

  for (let enumMember in enumInput) {
    if (typeof enumInput[enumMember] === 'number') {
      enumNameObject[enumMember] = enumMember.toLowerCase();
    }
  }

  return enumNameObject;
}

function enumToObjectArray(enumInput) {
  const enumNameArrayObject = [];

  for (let enumMember in enumInput) {
    if (typeof enumInput[enumMember] === 'number') {
      enumNameArrayObject.push({id: enumInput[enumMember], name: enumMember.toLowerCase()});
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
  let v = ((value || '0') + '');

  let s = '';
  if (value < 0) {
    s = '-';
    v = v.substr(1);
  }

  v = v.padStart(11, '0');
  const l = v.length - 11;
  let a = v.substr(0, l) || '0';
  const j = a.length > 3 ? a.length % 3 : 0;
  let b = Math.round(
    parseInt((v + '0').substr(l, p + 1)) / 10
    ).toString()
  ;
  if (b.length > p) {
    b = '0';
    a = (parseInt(a) + 1).toString();
  }
  b = b.padStart(p, '0');
  if (r) {
    b = b.replace(/([0-9]{2})0+$/, '$1');
  }

  return (
    s +
    (j ? a.substr(0, j) + t : '') +
    a.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
    d +
    b
  );
}

function isUnixTimePastNow(unixTime): boolean {
  const nowUnix = (+new Date) / 1000 | 0;
  return unixTime < nowUnix;
}

function selectCompare(value, nextValue): boolean {
  return (value && nextValue) ? (value.id === nextValue.id) : (value === nextValue);
}

function createInitialArray(element, count) {
  const resultArray = [];

  for (let i = 0; i < count; i++) {
    resultArray.push(element);
  }

  return resultArray;
}

function sortArrayByColumnMetaData<assetItem>(
  sortArray: assetItem[],
  columnMetaData: TableColumnMetaData
): assetItem[] {
  if (!columnMetaData.keys || !columnMetaData.hasOwnProperty('sortAsc')) {
    return [...sortArray];
  }

  const sortOrder = columnMetaData.sortAsc ? -1 : 1;

  columnMetaData.sortAsc = !columnMetaData.sortAsc;

  return sortArray.slice().sort((item, nextItem) => {
    let sortItem = findValueByPathArray(item, columnMetaData.keys);
    let nextSortItem = findValueByPathArray(nextItem, columnMetaData.keys);

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
  return pathArray.reduce((obj, partialPath) => obj[partialPath], object);
}

const simpleValidateHtmlStr = (html: string): boolean =>  {
  const doc = document.createElement('div');
  doc.innerHTML = html;
  return (doc.innerHTML === html);
};

export {
  adsToClicks,
  calcCampaignBudgetPerDay,
  calcCampaignBudgetPerHour,
  cloneDeep,
  enumToArray,
  enumToObject,
  simpleValidateHtmlStr,
  enumToObjectArray,
  formatMoney,
  isUnixTimePastNow,
  selectCompare,
  createInitialArray,
  sortArrayByColumnMetaData,
};
