import { AssetTargeting, TargetingOption, TargetingOptionValue } from '../../../models/targeting-option.model';

export function prepareTargetingChoices(targetingOptions, choicePartialKey = '', parentOption = null) {
  targetingOptions.forEach((targetingOption) => {
    const optionSublist = targetingOption.values || targetingOption.children;

    if (optionSublist) {
      if (!parentOption) {
        choicePartialKey = '';
      }

      choicePartialKey += (choicePartialKey !== '' ? '-' : '') + targetingOption.key;
      prepareTargetingChoices(optionSublist, choicePartialKey, targetingOption);
    } else {
      Object.assign(targetingOption, {
        key: choicePartialKey + `-${targetingOption.value}`,
        parent: {
          label: parentOption.label,
          value_type: parentOption.value_type,
          allow_input: parentOption.allow_input
        }
      });
    }
  });
}

export function parseTargetingForBackend(choosedTargeting: AssetTargeting) {
  const parsedTargeting = {
    requires: {},
    excludes: {}
  };

  [choosedTargeting.requires, choosedTargeting.excludes].forEach((targetingList, index) => {
    targetingList.forEach((targeting) => {
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

export function parseTargetingOtionsToArray(targetingObject, targetingOtions): AssetTargeting {
  const requiresResultKeys = [];
  const excludesResultKeys = [];
  const requiresResult = [];
  const excludesResult = [];
  const targetingOtpitonTopKeys = targetingOtions.map((targeting) => targeting.key);

  generateTargetingKeysArray(targetingObject.requires, requiresResultKeys, targetingOtpitonTopKeys);
  generateTargetingKeysArray(targetingObject.excludes, excludesResultKeys, targetingOtpitonTopKeys);
  requiresResultKeys.forEach(
    (requiresResultKey) => addTargetingOptionToResult(requiresResultKey, requiresResult, targetingOtions)
  );
  excludesResultKeys.forEach(
    (excludesResultKey) => addTargetingOptionToResult(excludesResultKey, excludesResult, targetingOtions)
  );

  return {
    requires: requiresResult,
    excludes: excludesResult
  };
}

function generateTargetingKeysArray(targetingObject, result, targetingOtpitonTopKeys, key = '') {
  Object.keys(targetingObject).forEach((partialKey) => {
    if (typeof targetingObject[partialKey] === 'object') {
      if (targetingOtpitonTopKeys.indexOf(partialKey) > -1) {
        key = '';
      }

      key += (key === '' ? '': '-') + partialKey;
      generateTargetingKeysArray(targetingObject[partialKey], result, targetingOtpitonTopKeys, key);
    } else {
      result.push(`${key}-${targetingObject[partialKey]}`);
    }
  });
}

function addTargetingOptionToResult(resultKey, result, targetingOtions) {
  targetingOtions.forEach((targetingOption) => {
    if (targetingOption.children) {
      addTargetingOptionToResult(resultKey, result, targetingOption.children)
    } else if (targetingOption.values) {
      const foundResult = targetingOption.values.find(
        (targetingOptionValue) => targetingOptionValue.key === resultKey
      );

      if (foundResult) {
        result.push(foundResult);
      }
    }
  });
}
