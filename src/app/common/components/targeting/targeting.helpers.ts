import { AssetTargeting, TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { customTargetingActionsEnum } from 'models/enum/custom-targeting-actions.enum';
import { cloneDeep } from 'common/utilities/helpers';

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
  const nestedId = `${keyChain}-${option['value'] ? option['value'] : option['key']}`;
  const id = keyChain !== '' ? nestedId : option['key'];
  const choiceSublistName = option['children'] ?
    'children' : (option['values'] ? 'values' : null);

  Object.assign(targetingChoice, {id});

  if (choiceSublistName) {
    const targetingChoiceSublist = [];

    for (let i = 0; i < targetingChoice[choiceSublistName].length; i++) {
      targetingChoiceSublist.push(
        createTargetingChoice(targetingChoice[choiceSublistName][i], id, targetingChoice)
      );
    }

    Object.assign(targetingChoice[choiceSublistName], targetingChoiceSublist);
  }

  if (targetingChoice.value) {
    Object.assign(targetingChoice, {
      parent: {
        value_type: parentOption.value_type,
        allow_input: parentOption.allow_input
      }
    });
  }

  return targetingChoice;
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

export function getLabelPath(
  optionId: string,
  tageting: TargetingOption[]
): string {
  const arrayPath = optionId.split('-');

  return generateLabelPath(arrayPath, tageting);
}

function generateLabelPath(
  arrayPath: string[],
  targeting: TargetingOption[],
  partialPath: string = ''
): string {
  const keyForSearch = arrayPath[0];
  const searchedOption = targeting.find((option) => option.key === keyForSearch);
  const newArrayPath = arrayPath.splice(1, arrayPath.length - 1);

  partialPath += (partialPath === '' ? '' : ' / ') + searchedOption.label

  if (newArrayPath.length === 1) {
    return partialPath;
  }

  return generateLabelPath(newArrayPath, searchedOption.children, partialPath);
}

export function parseTargetingForBackend(chosenTargeting: AssetTargeting) {
  const parsedTargeting = {
    requires: {},
    excludes: {}
  };

  [chosenTargeting.requires, chosenTargeting.excludes].forEach((targetingList, index) => {
    targetingList.forEach(targeting => {
      const keyPartials = targeting.id.split('-');
      const lastPartial = keyPartials.pop();
      const parsedTargetingList = index === 0 ? parsedTargeting.requires : parsedTargeting.excludes;

      createPathObject(parsedTargetingList, keyPartials, lastPartial);
    });
  });

  return parsedTargeting;
}

function createPathObject(obj, keyPath, value) {
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

function addTargetingOptionToResult(resultKey, result, targetingOptions) {
  targetingOptions.forEach(targetingOption => {
    if (targetingOption.children) {
      addTargetingOptionToResult(resultKey, result, targetingOption.children);
    } else if (targetingOption.values) {
      const foundResult = targetingOption.values.find(
        targetingOptionValue => targetingOptionValue.id === resultKey
      );

      if (foundResult) {
        result.push(foundResult);
      }
    }
  });
}

function addCustomOptionToResult(optionKeys, results, targetingOptions) {
  optionKeys.forEach(optionKey => {
    const addedResultIndex = results.findIndex(result => result.id === optionKey);

    if (addedResultIndex === -1) {
      const parentKeyPathArray = optionKey.split('-');
      const lastKeyelement = parentKeyPathArray.splice(-1, 1)[0];
      const customOptionParent = findOption(parentKeyPathArray.join('-'), targetingOptions);
      const rawValue = customOptionParent && customOptionParent['value_type'] === 'number' ?
        parseKeyToNumber(lastKeyelement) : lastKeyelement;
      const action = customOptionParent['value_type'] === 'number' ?
        getActionFromKey(lastKeyelement) : -1;
      const customOption = prepareCustomOption(
        rawValue,
        customOptionParent,
        targetingOptions,
        action
      );

      results.push(customOption);
    }
  });
}

function parseKeyToNumber(lastKeyElement) {
  return lastKeyElement.replace(/[<,>\s]/g, '');
}

function getActionFromKey(lastKeyelement) {
  const commaIndex = lastKeyelement.indexOf(',');

  switch (commaIndex) {
    case -1:
      return customTargetingActionsEnum['Is'];
    case 1:
      return customTargetingActionsEnum['Less than'];
    default:
      return customTargetingActionsEnum['More than'];
  }
}

export function prepareCustomOption(
  value: string | number,
  parentOption: TargetingOption | TargetingOptionValue,
  targetingOptions: TargetingOption[],
  action: number
) {
  const optionLabel = parentOption['value_type'] === 'number' ?
    `${customTargetingActionsEnum[action]} ${value}` : value;
  const optionValue = parentOption['value_type'] === 'number' ?
    getnerateNumberOptionValue(value, action) : value;
  const targetingOptionTopKeys = targetingOptions.map(targeting => targeting.id);

  return {
    id: generateIdForCustomOption(parentOption, optionValue, targetingOptions, targetingOptionTopKeys),
    label: optionLabel,
    parent: {
      value_type: parentOption['value_type'],
      allow_input: parentOption['allow_input']
    },
    value: optionValue,
    isCustom: true
  }
}

function getnerateNumberOptionValue(value: string | number, action: number) {
  switch (action) {
    case 0:
      return `<,${value}>`;
    case 1:
      return `<${value}>`;
    default:
      return `<${value},>`;
  }
}

function generateIdForCustomOption(
  parentOption: TargetingOption | TargetingOptionValue,
  value: string | number,
  options: TargetingOption[] | Partial<TargetingOptionValue[]>,
  targetingOptionTopKeys: string[],
  partialKey: string = ''
) {
  let result = null;

  for (let i = 0; i < options.length; i++) {
    const isTopOption = targetingOptionTopKeys.indexOf(options[i].id) > -1;

    if (isTopOption) {
      partialKey = '';
    }

    if (options[i].children) {
      partialKey += (isTopOption ? '' : '-') + options[i].key;
      result = generateIdForCustomOption(
        parentOption,
        value,
        options[i].children,
        targetingOptionTopKeys,
        partialKey
      );

      if (result) {
        break;
      }
    } else if (options[i].values && options[i].id === parentOption.id) {
      result = partialKey + (isTopOption ? '' : '-') + parentOption['key'] + '-' + value;
      break;
    }
  }

  return result;
}
