import { AssetTargeting, TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { customTargetingActionsEnum } from 'models/enum/custom-targeting-actions.enum';

export function prepareTargetingChoices(options, targetingOptions, parentOption = null) {
  options.forEach((option) => {
    const optionSublist = option.values || option.children;

    if (optionSublist) {
      prepareTargetingChoices(optionSublist, targetingOptions, option);

      return;
    }

    const targetingOptionTopKeys = targetingOptions.map(targeting => targeting.key);

    Object.assign(option, {
      key: generateKeyFromOption(parentOption, option.value, targetingOptions, targetingOptionTopKeys, ''),
      parent: {
        label: parentOption.label,
        value_type: parentOption.value_type,
        allow_input: parentOption.allow_input
      }
    });
  });
}

export function parseTargetingForBackend(choosedTargeting: AssetTargeting) {
  const parsedTargeting = {
    requires: {},
    excludes: {}
  };

  [choosedTargeting.requires, choosedTargeting.excludes].forEach((targetingList, index) => {
    targetingList.forEach(targeting => {
      const keyPartials = targeting.key.split('-');
      const lastPartial = keyPartials.pop();
      const parsedTargetingList = index === 0 ? parsedTargeting.requires : parsedTargeting.excludes;

      createPathObject(parsedTargetingList, keyPartials, lastPartial);
    });
  });

  return parsedTargeting;
}

function createPathObject(obj, keyPath, value) {
  const lastKeyIndex = keyPath.length - 1;

  for (let i = 0; i < lastKeyIndex; ++ i) {
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
  const targetingOptionTopKeys = targetingOptions.map(targeting => targeting.key);

  generateTargetingKeysArray(targetingObject.requires, requiresResultKeys, targetingOptionTopKeys);
  generateTargetingKeysArray(targetingObject.excludes, excludesResultKeys, targetingOptionTopKeys);
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

      key += (key === '' ? '': '-') + partialKey;
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
        targetingOptionValue => targetingOptionValue.key === resultKey
      );

      if (foundResult) {
        result.push(foundResult);
      }
    }
  });
}

function addCustomOptionToResult(optionKeys, results, targetingOptions) {
   optionKeys.forEach(optionKey => {
     const addedResultIndex = results.findIndex(result => result.key === optionKey);

     if (addedResultIndex === -1) {
       const parentKeyPathArray = optionKey.split('-');
       const lastKeyelement = parentKeyPathArray.splice(-1, 1);
       const customOptionParent = getCustomOptionParentByKey(parentKeyPathArray, targetingOptions);
       const rawValue = customOptionParent.value_type === 'number' ?
         parseKeyToNumber(lastKeyelement[0]) : lastKeyelement[0];
       const action =  customOptionParent.value_type === 'number' ?
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

function getCustomOptionParentByKey(parentKeyPathArray, targetingOptions) {
  let result = targetingOptions.find(option => option.key === parentKeyPathArray[0]);

  for (let i = 1; i < parentKeyPathArray.length; i++) {
    result = result.children.find(option => option.key === parentKeyPathArray[i]);
  }

  return result;
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
  parentOption: TargetingOption,
  targetingOptions: TargetingOption[],
  action: number
) {
  const optionLabel = parentOption.value_type === 'number' ?
    `${customTargetingActionsEnum[action]} ${value}` : value;
  const optionValue = parentOption.value_type === 'number' ?
    getnerateNumberOptionValue(value, action) : value;
  const targetingOptionTopKeys = targetingOptions.map(targeting => targeting.key);

  return {
    key: generateKeyFromOption(parentOption, optionValue, targetingOptions, targetingOptionTopKeys, ''),
    label: optionLabel,
    parent: {
      label: parentOption.label,
      value_type: parentOption.value_type,
      allow_input: parentOption.allow_input
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

function generateKeyFromOption(
  searchedOption: TargetingOption,
  value: string | number,
  options: TargetingOption[] | Partial<TargetingOptionValue[]>,
  targetingOptionTopKeys: string[],
  partialKey: string
) {
  let result = null;

  for (let i = 0; i < options.length; i++) {
    const isTopOption = targetingOptionTopKeys.indexOf(options[i].key) > -1;

    if (isTopOption) {
      partialKey = '';
    }

    if (options[i].children) {
      partialKey += (isTopOption ? '' : '-') + options[i].key;
      result = generateKeyFromOption(
        searchedOption,
        value,
        options[i].children,
        targetingOptionTopKeys,
        partialKey
      );

      if (result) {
        break;
      }
    } else if (options[i].values && options[i].key === searchedOption.key) {
      result = partialKey + (isTopOption ? '' : '-') + options[i].key + '-' + value;
      break;
    }
  }

  return result;
}
