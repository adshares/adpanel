import {
  AssetTargeting,
  TargetingOption,
  TargetingOptionType,
  TargetingOptionValue,
} from 'models/targeting-option.model';
import { cloneDeep } from 'common/utilities/helpers';
import { Medium, TargetingItem } from 'models/taxonomy-medium.model';
import { CampaignTargeting } from 'models/campaign.model';
import { CryptovoxelsConverter } from 'common/utilities/targeting-converter/cryptovoxels-converter';
import { DecentralandConverter } from 'common/utilities/targeting-converter/decentraland-converter';
import { createPathObject, prepareCustomOption, SEPARATOR } from 'common/components/targeting/targeting.helpers2';

export function prepareFilteringChoices(options: (TargetingOption | TargetingOptionValue)[]): TargetingOption[] {
  const result = [];

  for (let option of options) {
    result.push(createFilteringChoice(option));
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
      key += SEPARATOR;
    }
    key += option['key'];
  }
  const id = option['value'] ? `${key}${SEPARATOR}${option['value']}` : key;
  const choiceSublistName = () => {
    if (option['children']) {
      return 'children';
    } else if (option['values']) {
      return 'values';
    } else {
      return null;
    }
  };
  const sublistName = choiceSublistName();

  Object.assign(targetingChoice, { id });

  if (sublistName) {
    const targetingChoiceSublist = [];

    for (let targetingChoiceSublistItem of targetingChoice[sublistName]) {
      targetingChoiceSublist.push(createFilteringChoice(targetingChoiceSublistItem, key, targetingChoice));
    }

    Object.assign(targetingChoice[sublistName], targetingChoiceSublist);
  }

  if (targetingChoice.value) {
    targetingChoice.parentId = parentOption.id;
  }

  return targetingChoice;
}

export function processTargeting(medium: Medium): TargetingOption[] {
  const rootNodes = [
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
  ];

  const result = [];
  for (let rootNode of rootNodes) {
    const children = [];
    const targetingItems = medium.targeting[rootNode.key] as TargetingItem[];

    targetingItems.forEach(item => {
      const id = `${rootNode.key}${SEPARATOR}${item.name}`;
      const option: TargetingOption = {
        valueType: TargetingOptionType.STRING,
        key: item.name,
        label: item.label,
        allowInput: item.type === 'input',
        id,
        parentId: rootNode.key,
      };
      if (item.items) {
        option.values = processTargetingItems(item.items, id);
      }
      children.push(option);
    });

    const rootOption: TargetingOption = {
      valueType: TargetingOptionType.GROUP,
      key: rootNode.key,
      label: rootNode.label,
      allowInput: false,
      children: children,
      id: rootNode.key,
    };
    result.push(rootOption);
  }

  if (medium.vendor === DecentralandConverter.ID) {
    new DecentralandConverter().convertTargetingOptions(result);
  } else if (medium.vendor === CryptovoxelsConverter.ID) {
    new CryptovoxelsConverter().convertTargetingOptions(result);
  }

  return result;
}

function processTargetingItems(items: object, parentId: string, baseId?: string): TargetingOptionValue[] {
  const result = [];
  const currentBaseId = baseId === undefined ? parentId : baseId;
  Object.keys(items).forEach(key => {
    const id = `${currentBaseId}${SEPARATOR}${key}`;

    const option: TargetingOptionValue = {
      label: typeof items[key] === 'string' ? items[key] : items[key].label,
      value: key,
      id: id,
      parentId: parentId,
    };
    if (typeof items[key] !== 'string') {
      option.values = processTargetingItems(items[key].values, id, currentBaseId);
    }
    result.push(option);
  });
  return result;
}

export function findOptionList(
  optionId: string,
  options: (TargetingOption | TargetingOptionValue)[]
): (TargetingOption | TargetingOptionValue)[] {
  for (let option of options) {
    if (option.id === optionId) {
      return options;
    }

    const itemSublist = option['children'] || option['values'];

    if (itemSublist) {
      const result = findOptionList(optionId, itemSublist);
      if (result) {
        return result;
      }
    }
  }
}

export function findOption(
  optionId: string,
  options: (TargetingOption | TargetingOptionValue)[]
): TargetingOption | TargetingOptionValue {
  const optionList = findOptionList(optionId, options);

  return optionList && optionList.find(option => optionId === option.id);
}

export function getPathAndLabel(
  option: TargetingOption | TargetingOptionValue,
  targeting: TargetingOption[]
): string[] {
  const pathChain: string[] = [];
  const labelChain: string[] = [];

  do {
    if (option.hasOwnProperty('value')) {
      labelChain.unshift(option.label);
    } else {
      pathChain.unshift(option.label);
    }
  } while (option.parentId && (option = findOption(option.parentId, targeting)));

  return [pathChain, labelChain].map(array => array.join(' / '));
}

export function parseTargetingForBackend(chosenTargeting: AssetTargeting, vendor?: string | null): CampaignTargeting {
  const parsedTargeting: CampaignTargeting = {
    requires: {},
    excludes: {},
  };

  [chosenTargeting.requires, chosenTargeting.excludes].forEach((targetingList, index) => {
    targetingList.forEach(targeting => {
      const suffix = `${SEPARATOR}${targeting.value}`;

      if (targeting.id.endsWith(suffix)) {
        const keyPartials = targeting.id.slice(0, -suffix.length).split(SEPARATOR);
        const parsedTargetingList = index === 0 ? parsedTargeting.requires : parsedTargeting.excludes;
        createPathObject(parsedTargetingList, keyPartials, targeting.value);
      }
    });
  });

  if (vendor === DecentralandConverter.ID) {
    new DecentralandConverter().prepareCampaignTargetingForBackend(parsedTargeting);
  } else if (vendor === CryptovoxelsConverter.ID) {
    new CryptovoxelsConverter().prepareCampaignTargetingForBackend(parsedTargeting);
  }

  return parsedTargeting;
}

export function parseTargetingOptionsToArray(
  targetingObject: CampaignTargeting,
  targetingOptions: TargetingOption[]
): AssetTargeting {
  const requiresResult = [];
  const excludesResult = [];

  if (targetingObject) {
    addTargetingOptionToResult(targetingObject.requires, requiresResult, targetingOptions);
    addTargetingOptionToResult(targetingObject.excludes, excludesResult, targetingOptions);
  }

  return {
    requires: requiresResult,
    excludes: excludesResult,
  };
}

function targetingNeedsConversion(targetingOptions: any[], id: string) {
  return targetingOptions.some(option => option.key === id);
}

function addTargetingOptionToResult(
  targetingObject: object,
  result: TargetingOptionValue[],
  targetingOptions: any[],
  parent: TargetingOption | TargetingOptionValue = undefined
): void {
  Object.keys(targetingObject).forEach(key => {
    if (typeof targetingObject[key] === 'object') {
      const id = parent ? `${parent.id}${SEPARATOR}${key}` : key;
      const option = targetingOptions.find(targetingOption => targetingOption.id === id);
      if (option) {
        addTargetingOptionToResult(targetingObject[key], result, option.children || option.values, option);
      }
    } else {
      const value = targetingObject[key];

      if (parent && parent.allowInput) {
        result.push(
          prepareCustomOption(value, parent.id, 'site/domain' === parent.id ? `https://${value}` : undefined)
        );
        return;
      }

      const id = parent ? `${parent.id}${SEPARATOR}${value}` : value;
      const option = getTargetingOptionValueById(id, targetingOptions);
      if (option !== null) {
        result.push(option);
      }
    }
  });
  if (!parent) {
    if (targetingNeedsConversion(targetingOptions, DecentralandConverter.ID)) {
      new DecentralandConverter().convertSelectedTargetingOptionValues(targetingObject, result);
    } else if (targetingNeedsConversion(targetingOptions, CryptovoxelsConverter.ID)) {
      new CryptovoxelsConverter().convertSelectedTargetingOptionValues(targetingObject, result);
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
