import { AssetTargeting, TargetingOption, TargetingOptionValue } from 'models/targeting-option.model'
import { cloneDeep } from 'common/utilities/helpers'
import { Medium, TargetingItem } from 'models/taxonomy-medium.model'

export function prepareTargetingChoices(
  options: (TargetingOption | TargetingOptionValue)[]
): TargetingOption[] {
  const result = [];

  for (let i = 0; i < options.length; i++) {
    result.push(createTargetingChoice(options[i]));
  }

  return result;
}

function createTargetingChoice(
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
        createTargetingChoice(targetingChoice[choiceSublistName][i], key, targetingChoice)
      );
    }

    Object.assign(targetingChoice[choiceSublistName], targetingChoiceSublist);
  }

  if (targetingChoice.value) {
    Object.assign(targetingChoice, {
      parent: {
        id: parentOption.id,
        valueType: parentOption.valueType,
        allowInput: parentOption.allowInput,
      }
    });
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
        parent: {
          id: parentId,
          valueType: 'string',//TODO remove if not needed
          allowInput: false,//TODO remove if not needed
        },
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

export function getParentId(optionId: string): string {
  const optionKeyArray = optionId.split('-');

  return optionKeyArray.splice(0, optionKeyArray.length - 1).join('-');
}

export function getLabelCompound(
  option: TargetingOption | TargetingOptionValue,
  options: TargetingOption[],
): string {
  let label = option.label;
  let currentOption = option;
  let hasValue;

  do {
    const parentOptionId = (<TargetingOptionValue>currentOption).parent ? (<TargetingOptionValue>currentOption).parent.id : getParentId(currentOption.id);
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

export function parseTargetingOptionsToArray(targetingObject, targetingOptions): AssetTargeting {
  const requiresResultKeys = [];
  const excludesResultKeys = [];
  const requiresResult = [];
  const excludesResult = [];
  const targetingOptionTopKeys = targetingOptions.map(targeting => targeting.id);

  if (targetingObject) {
    generateTargetingKeysArray(targetingObject.requires, requiresResultKeys, targetingOptionTopKeys);
    generateTargetingKeysArray(targetingObject.excludes, excludesResultKeys, targetingOptionTopKeys);
  }

  requiresResultKeys.forEach(
    requiresResultKey => addTargetingOptionToResult(requiresResultKey, requiresResult, targetingOptions)
  );

  excludesResultKeys.forEach(
    excludesResultKey => addTargetingOptionToResult(excludesResultKey, excludesResult, targetingOptions)
  );

  addCustomOptionToResult(requiresResultKeys, requiresResult, targetingOptions);
  addCustomOptionToResult(excludesResultKeys, excludesResult, targetingOptions);

  return {
    requires: requiresResult,
    excludes: excludesResult
  };
}

function generateTargetingKeysArray(targetingObject, result, targetingOptionTopKeys, key = '') {
  Object.keys(targetingObject).forEach((partialKey, keyIndex) => {
    if (typeof targetingObject[partialKey] === 'object') {
      if (targetingOptionTopKeys.indexOf(partialKey) > -1) {
        key = '';
      }

      if (Array.isArray(targetingObject[partialKey]) && keyIndex !== 0) {
        const temporaryKeyArray = key.split('-');

        temporaryKeyArray.splice(-1, 1);
        key = temporaryKeyArray.join('-');
      }

      key += (key === '' ? '' : '-') + partialKey;
      generateTargetingKeysArray(targetingObject[partialKey], result, targetingOptionTopKeys, key);

      return;
    }

    result.push(`${key}-${targetingObject[partialKey]}`);
  });
}

function getTargetingOptionValueById(id: string, targetingOptionValues: TargetingOptionValue[]): TargetingOptionValue|null {
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

function addTargetingOptionToResult(resultKey, result, targetingOptions) {
  targetingOptions.forEach(targetingOption => {
    if (targetingOption.children) {
      addTargetingOptionToResult(resultKey, result, targetingOption.children);
    } else if (targetingOption.values) {
      const foundResult = getTargetingOptionValueById(resultKey, targetingOption.values);
      if (foundResult) {
        result.push(foundResult);
      }
    }
  });
}

function addCustomOptionToResult(optionKeys, results, targetingOptions) {
  optionKeys.forEach(optionKey => {
    const addedResultIndex = !!results.length && results.findIndex(result => {
      return result.id === optionKey
    });

    if (addedResultIndex === -1 || addedResultIndex === false) {
      const parentKeyPathArray = optionKey.split('-');
      const lastKeyelement = parentKeyPathArray.splice(-1, 1)[0];
      let customOptionParent = findOption(parentKeyPathArray.join('-'), targetingOptions);
      let rawValue;
      if (!customOptionParent) {
        // if find element that contains custom value based on allow input parameter
        targetingOptions.forEach(res => {
          if (res.children && res.children.find(el => el.id.includes(parentKeyPathArray[0]) && el.allowInput)) {
            customOptionParent = res.children.find(el => {
              return el.id.includes(parentKeyPathArray[0]) && el.allowInput
            });
            // recreate 'pure value' from option key that contain categories and value connected with '-'
            rawValue = optionKey
              .split('-')
              .splice(customOptionParent.id.split('-').length, parentKeyPathArray.length)
              .join('-')
          }
        });

        if (!customOptionParent) {
          return;
        }
      } else {
        rawValue = lastKeyelement;
      }

      const customOption = prepareCustomOption(
        rawValue,
        customOptionParent,
      );
      results.push(customOption);
    }
  });
}

export function prepareCustomOption(
  value: string | number,
  parentOption: TargetingOption | TargetingOptionValue,
) {
  return {
    id: `${parentOption.id}-${value}`,
    key: `${value}`,
    label: value,
    parent: {
      id: parentOption.id,
      valueType: parentOption['valueType'],
      allowInput: parentOption['allowInput']
    },
    value: value,
    isCustom: true
  }
}
