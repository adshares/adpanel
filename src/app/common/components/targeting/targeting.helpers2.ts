import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';

const SEPARATOR = '/';

function createPathObject(obj: object, keyPath: string[], value: string): void {
  const lastKeyIndex = keyPath.length - 1;

  for (let i = 0; i < lastKeyIndex; ++i) {
    const key = keyPath[i];

    if (!(key in obj)) {
      obj[key] = {};
    }

    obj = obj[key];
  }

  if (!obj[keyPath[lastKeyIndex]]) {
    obj[keyPath[lastKeyIndex]] = [value];
  } else {
    obj[keyPath[lastKeyIndex]].push(value);
  }
}

function excludeSiteDomain(targetingOptions: TargetingOption[]): void {
  for (let i = 0; i < targetingOptions.length; i++) {
    const entry = targetingOptions[i];
    if (entry.key === 'site') {
      const index = entry.children.findIndex(option => option.key === 'domain');
      if (index !== -1) {
        if (entry.children.length > 1) {
          entry.children.splice(index, 1);
        } else {
          targetingOptions.splice(i, 1);
        }
      }
      break;
    }
  }
}

function prepareCustomOption(value: string, parentId: string, url?: string): TargetingOptionValue {
  const option: TargetingOptionValue = {
    id: `${parentId}${SEPARATOR}${value}`,
    label: value,
    value: value,
    parentId: parentId,
    isCustom: true,
  };
  if (url) {
    option.url = url;
  }
  return option;
}

export { SEPARATOR, createPathObject, excludeSiteDomain, prepareCustomOption };
