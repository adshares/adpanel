import { AssetTargeting, TargetingOption, TargetingOptionValue } from 'models/targeting-option.model'
import { cloneDeep } from 'common/utilities/helpers'
import { Medium, TargetingItem } from 'models/taxonomy-medium.model'

export function prepareFilteringChoices(
  options: (TargetingOption | TargetingOptionValue)[]
): TargetingOption[] {
  const result = [];

  for (let i = 0; i < options.length; i++) {
    result.push(createFilteringChoice(options[i]));
  }

  return result;
}

function createFilteringChoice(
  option: TargetingOption | TargetingOptionValue,
  keyChain: string = '',
  parentOption: TargetingOption = null
): (TargetingOption | TargetingOptionValue)[] {
  const targetingChoice = cloneDeep(option);

  let key = keyChain;
  if (option['key']) {
    if (key.length > 0) {
      key += '-';
    }
    key += option['key'];
  }
  const id = option['value'] ? `${key}-${option['value']}` : key;
  const choiceSublistName = option['children'] ?
    'children' : (option['values'] ? 'values' : null);

  Object.assign(targetingChoice, {id});

  if (choiceSublistName) {
    const targetingChoiceSublist = [];

    for (let i = 0; i < targetingChoice[choiceSublistName].length; i++) {
      targetingChoiceSublist.push(
        createFilteringChoice(targetingChoice[choiceSublistName][i], key, targetingChoice)
      );
    }

    Object.assign(targetingChoice[choiceSublistName], targetingChoiceSublist);
  }

  if (targetingChoice.value) {
    targetingChoice.parentId = parentOption.id;
  }

  return targetingChoice;
}

export function processTargeting (medium: Medium): TargetingOption[] {
  const roots = [
    {
      key: 'user',
      label: 'User',
    },
    {
      key: 'site',
      label: 'Site',
    },
    {
      key: 'device',
      label: 'Device',
    },
  ]

  const result = []
  for (let i = 0; i < roots.length; i++) {
    const children = []
    const targetingItems = medium.targeting[roots[i].key] as TargetingItem[]

    targetingItems.forEach(item => {
      const id = `${roots[i].key}-${item.name}`
      const option: TargetingOption = {
        valueType: 'string',
        key: item.name,
        label: item.label,
        allowInput: item.type === 'input',
        id,
        parentId: roots[i].key
      }
      if (item.items) {
        option.values = processTargetingItems(item.items, id)
      }
      children.push(option)
    })

    const rootOption: TargetingOption = {
      valueType: 'group',
      key: roots[i].key,
      label: roots[i].label,
      allowInput: false,
      children: children,
      id: roots[i].key,
    }
    result.push(rootOption)
  }
  return result
}

function processTargetingItems (items: any, parentId: string, baseId?: string): TargetingOptionValue[] {
  const result = []
  for (let key in items) {
    if (items.hasOwnProperty(key)) {
      baseId = (baseId === undefined) ? parentId : baseId
      const id = `${baseId}-${key}`

      const option: TargetingOptionValue = {
        label: (typeof items[key] === 'string') ? items[key] : items[key].label,
        value: key,
        id: id,
        parentId: parentId,
      }
      if (typeof items[key] !== 'string') {
        option.values = processTargetingItems(items[key].values, id, baseId)
      }
      result.push(option)
    }
  }
  return result
}

export function findOptionList(
  optionId: string,
  options: (TargetingOption | TargetingOptionValue)[]
): (TargetingOption | TargetingOptionValue)[] {
  for (let i = 0; i < options.length; i++) {
    if (options[i].id === optionId) {
      return options;
    }

    let result;
    const itemSublist = options[i]['children'] || options[i]['values'];

    if (itemSublist) {
      result = findOptionList(optionId, itemSublist);
    }

    if (result) {
      return result;
    }
  }
}

export function findOption(
  optionId: string,
  options: (TargetingOption | TargetingOptionValue)[]
): TargetingOption | TargetingOptionValue {
  const optionList = findOptionList(optionId, options);

  return optionList && optionList.find((option) => optionId === option.id);
}

export function getLabelCompound(
  option: TargetingOption | TargetingOptionValue,
  options: TargetingOption[],
): string {
  let label = option.label;
  let currentOption = option;
  let hasValue;

  do {
    const parentOptionId = currentOption.parentId;
    const optionList = findOptionList(parentOptionId, options);
    if (!optionList) {
      break;
    }
    currentOption = optionList.find((option) => option.id === parentOptionId);
    if (!currentOption) {
      break;
    }
    hasValue = currentOption.hasOwnProperty('value');

    if (hasValue) {
      label = currentOption.label + ' / ' + label;
    }

  } while (hasValue);

  return label;
}

export function getLabelPath(
  optionId: string,
  targeting: TargetingOption[]
): string {
  const arrayPath = optionId.split('-');

  return generateLabelPath(arrayPath, targeting);
}

function generateLabelPath(
  arrayPath: string[],
  targeting: TargetingOption[],
  partialPath: string = ''
): string {
  const keyForSearch = arrayPath[0];
  const searchedOption = targeting.find((option) => option.key === keyForSearch);
  if (searchedOption.allowInput) {
    partialPath = searchedOption.id
      .split('-')
      .map(el => `${el.charAt(0).toUpperCase()}${el.slice(1)}`)
      .join(' / ');
    return partialPath
  }
  const newArrayPath = arrayPath.splice(1, arrayPath.length - 1);
  partialPath += (partialPath === '' ? '' : ' / ') + searchedOption.label;

  if (newArrayPath.length === 1 || !searchedOption.children) {
    return partialPath;
  }

  return generateLabelPath(newArrayPath, searchedOption.children ? searchedOption.children : [], partialPath);
}

export function parseTargetingForBackend(chosenTargeting: AssetTargeting) {
  const parsedTargeting = {
    requires: {},
    excludes: {}
  };

  [chosenTargeting.requires, chosenTargeting.excludes].forEach((targetingList, index) => {
    targetingList.forEach(targeting => {
      const suffix = `-${targeting.value}`;

      if (targeting.id.endsWith(suffix)) {
        const keyPartials = targeting.id.slice(0, -(suffix.length)).split('-');
        const parsedTargetingList = index === 0 ? parsedTargeting.requires : parsedTargeting.excludes;
        createPathObject(parsedTargetingList, keyPartials, targeting.value);
      }
    });
  });

  return parsedTargeting;
}

function createPathObject(obj: Object, keyPath: string[], value: string): void {
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

export function parseTargetingOptionsToArray(targetingObject, targetingOptions: TargetingOption[]): AssetTargeting {
  const requiresResult = [];
  const excludesResult = [];

  if (targetingObject) {
    addTargetingOptionToResult(targetingObject.requires, requiresResult, targetingOptions)
    addTargetingOptionToResult(targetingObject.excludes, excludesResult, targetingOptions)
  }

  return {
    requires: requiresResult,
    excludes: excludesResult
  };
}

function addTargetingOptionToResult (
  targetingObject: object,
  result: TargetingOptionValue[],
  targetingOptions: any[],
  parent: TargetingOption|TargetingOptionValue = undefined
): void {
  for (let key in targetingObject) {
    if (targetingObject.hasOwnProperty(key)) {
      if (typeof targetingObject[key] === 'object') {
        const id = parent ? `${parent.id}-${key}` : key
        const option = targetingOptions.find(targetingOption => targetingOption.id === id)
        if (option) {
          addTargetingOptionToResult(targetingObject[key], result, option.children || option.values, option)
        }
      } else {
        const value = targetingObject[key]

        if (parent && parent.allowInput) {
          result.push(prepareCustomOption(value, parent))
          continue
        }

        const id = parent ? `${parent.id}-${value}` : value
        const option = getTargetingOptionValueById(id, targetingOptions)
        if (option !== null) {
          result.push(option)
        }
      }
    }
  }
}

function getTargetingOptionValueById(
  id: string,
  targetingOptionValues: TargetingOptionValue[]
): TargetingOptionValue | null {
  for (let targetingOptionValue of targetingOptionValues) {
    if (targetingOptionValue.id === id) {
      return targetingOptionValue;
    }

    if (targetingOptionValue.values) {
      const value = getTargetingOptionValueById(id, targetingOptionValue.values);
      if (null !== value) {
        return value;
      }
    }
  }

  return null;
}

export function prepareCustomOption(
  value: string,
  parentOption: TargetingOption | TargetingOptionValue,
): TargetingOptionValue {
  return {
    id: `${parentOption.id}-${value}`,
    label: value,
    value: value,
    parentId: parentOption.id,
    isCustom: true
  }
}
