import { TableCoulmnMetaData } from '../../models/table.model';

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
      enumNameArrayObject.push({ id: enumInput[enumMember], name: enumMember.toLowerCase() });
    }
  }

  return enumNameArrayObject;
}

function isUnixTimePastNow(unixTime): boolean {
  const nowUnix = (+new Date) / 1000 | 0;

  return unixTime < nowUnix;
}

function selectCompare(value, nextValue): boolean {
  return value && nextValue ? value.id === nextValue.id : value === nextValue;
}

function createInitialArray(element, count) {
  const resultArray = [];

  for (let i = 0; i < count; i++) {
    resultArray.push(element);
  }

  return resultArray;
}

function sortArrayByColumnMetaData(sortArray, columnMetaData: TableCoulmnMetaData) {
  if (!columnMetaData.keys || !columnMetaData.hasOwnProperty('sortAsc')) {
    return;
  }

  const sortOrder = columnMetaData.sortAsc ? -1 : 1;

  sortArray.sort((item, nextItem) => {
    let sortItem = findValueByPathArray(item, columnMetaData.keys);
    let nextSortItem = findValueByPathArray(nextItem, columnMetaData.keys);

    if (typeof sortItem === 'string') {
      sortItem = sortItem.toLowerCase();
      nextSortItem = nextSortItem.toLowerCase();
    }

    if (sortItem < nextSortItem) {
      return sortOrder;
    } else if (sortItem > nextSortItem) {
      return - sortOrder;
    } else {
      return 0;
    }
  });

  columnMetaData.sortAsc = !columnMetaData.sortAsc;
}

function findValueByPathArray(object, pathArray) {
  return pathArray.reduce((obj, partialPath) => obj[partialPath], object);
}

export {
  cloneDeep,
  enumToArray,
  enumToObject,
  enumToObjectArray,
  isUnixTimePastNow,
  selectCompare,
  createInitialArray,
  sortArrayByColumnMetaData
};
