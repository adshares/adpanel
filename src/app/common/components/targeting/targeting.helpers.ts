import { AssetTargeting, TargetingOption, TargetingOptionValue } from 'models/targeting-option.model'
import { cloneDeep } from 'common/utilities/helpers'
import { Medium, TargetingItem } from 'models/taxonomy-medium.model'
import { CampaignTargeting } from 'models/campaign.model'

const SEPARATOR = '/'

export const TargetingOptionType = {
  GROUP: 'group',
  STRING: 'string',
  PARCEL_COORDINATES: 'parcel_coordinates',
}

export function prepareFilteringChoices(
  options: (TargetingOption | TargetingOptionValue)[]
): TargetingOption[] {
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
  const choiceSublistName = option['children'] ?
    'children' : (option['values'] ? 'values' : null);

  Object.assign(targetingChoice, {id});

  if (choiceSublistName) {
    const targetingChoiceSublist = [];

    for (let targetingChoiceSublistItem of targetingChoice[choiceSublistName]) {
      targetingChoiceSublist.push(
        createFilteringChoice(targetingChoiceSublistItem, key, targetingChoice)
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
  ]

  const result = []
  for (let rootNode of rootNodes) {
    const children = []
    const targetingItems = medium.targeting[rootNode.key] as TargetingItem[]

    targetingItems.forEach(item => {
      const id = `${rootNode.key}${SEPARATOR}${item.name}`
      const option: TargetingOption = {
        valueType: TargetingOptionType.STRING,
        key: item.name,
        label: item.label,
        allowInput: item.type === 'input',
        id,
        parentId: rootNode.key
      }
      if (item.items) {
        option.values = processTargetingItems(item.items, id)
      }
      children.push(option)
    })

    const rootOption: TargetingOption = {
      valueType: TargetingOptionType.GROUP,
      key: rootNode.key,
      label: rootNode.label,
      allowInput: false,
      children: children,
      id: rootNode.key,
    }
    result.push(rootOption)
  }

  if (medium.vendor === DecentralandConverter.ID) {
    new DecentralandConverter().convertTargetingOptions(result)
  }

  return result
}

function processTargetingItems (items: object, parentId: string, baseId?: string): TargetingOptionValue[] {
  const result = []
  const currentBaseId = (baseId === undefined) ? parentId : baseId
  Object.keys(items).forEach(key => {
    const id = `${currentBaseId}${SEPARATOR}${key}`

    const option: TargetingOptionValue = {
      label: (typeof items[key] === 'string') ? items[key] : items[key].label,
      value: key,
      id: id,
      parentId: parentId,
    }
    if (typeof items[key] !== 'string') {
      option.values = processTargetingItems(items[key].values, id, currentBaseId)
    }
    result.push(option)
  })
  return result
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

  return optionList && optionList.find((option) => optionId === option.id);
}

export function getPathAndLabel (
  option: TargetingOption | TargetingOptionValue,
  targeting: TargetingOption[]
): string[] {
  let pathChain: string[] = []
  let labelChain: string[] = []

  do {
    if (option.hasOwnProperty('value')) {
      labelChain.push(option.label)
    } else {
      pathChain.push(option.label)
    }
  } while (option.parentId && (option = findOption(option.parentId, targeting)))

  return [pathChain, labelChain].map(array => array.reverse().join(' / '))
}

export function parseTargetingForBackend(chosenTargeting: AssetTargeting, vendor?: string | null): CampaignTargeting {
  const parsedTargeting: CampaignTargeting = {
    requires: {},
    excludes: {}
  };

  [chosenTargeting.requires, chosenTargeting.excludes].forEach((targetingList, index) => {
    targetingList.forEach(targeting => {
      const suffix = `${SEPARATOR}${targeting.value}`;

      if (targeting.id.endsWith(suffix)) {
        const keyPartials = targeting.id.slice(0, -(suffix.length)).split(SEPARATOR);
        const parsedTargetingList = index === 0 ? parsedTargeting.requires : parsedTargeting.excludes;
        createPathObject(parsedTargetingList, keyPartials, targeting.value);
      }
    });
  });

  if (vendor === DecentralandConverter.ID) {
    new DecentralandConverter().prepareCampaignTargetingForBackend(parsedTargeting)
  }

  return parsedTargeting;
}

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

export function parseTargetingOptionsToArray(
  targetingObject: CampaignTargeting,
  targetingOptions: TargetingOption[]
): AssetTargeting {
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
  parent: TargetingOption | TargetingOptionValue = undefined
): void {
  Object.keys(targetingObject)
    .forEach(key => {
      if (typeof targetingObject[key] === 'object') {
        const id = parent ? `${parent.id}${SEPARATOR}${key}` : key
        const option = targetingOptions.find(targetingOption => targetingOption.id === id)
        if (option) {
          addTargetingOptionToResult(targetingObject[key], result, option.children || option.values, option)
        }
      } else {
        const value = targetingObject[key]

        if (parent && parent.allowInput) {
          result.push(prepareCustomOption(value, parent.id))
          return
        }

        const id = parent ? `${parent.id}${SEPARATOR}${value}` : value
        const option = getTargetingOptionValueById(id, targetingOptions)
        if (option !== null) {
          result.push(option)
        }
      }
    })
  if (!parent) {
    const decentralandOptions = targetingOptions.some(option => option.key === DecentralandConverter.ID)
    if (decentralandOptions) {
      new DecentralandConverter().convertSelectedTargetingOptionValues(targetingObject, result)
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
  parentId: string,
): TargetingOptionValue {
  return {
    id: `${parentId}${SEPARATOR}${value}`,
    label: value,
    value: value,
    parentId: parentId,
    isCustom: true
  }
}

interface TargetingConverter {
  /**
   * Decode backend value to be used in panel
   * @param value
   */
  decodeValue(value: string): string

  /**
   * Encode value to be used in backend
   * @param value
   */
  encodeValue(value: string): string

  /**
   * Converts custom path keys to backend format
   * @param path array of custom keys
   */
  convertPath(path: string[]): string[]

  /**
   * Convert targeting options
   * @param targetingOptions targeting options
   */
  convertTargetingOptions(targetingOptions: TargetingOption[]): void

  /**
   * Extract custom options from targeting object and add them to selected options
   * @param targetingObject targeting object from backend
   * @param targetingOptionValues selected targeting options
   */
  convertSelectedTargetingOptionValues(targetingObject: object, targetingOptionValues: TargetingOptionValue[]): void

  /**
   * Process targeting object for backend, e.g. add default values if missing, change paths
   * @param targeting targeting object from backend
   */
  prepareCampaignTargetingForBackend(targeting: CampaignTargeting): void
}

class DecentralandConverter implements TargetingConverter {
  static ID = 'decentraland'

  decodeValue (value: string): string {
    const mappedCoordinates = value.slice('scene_'.length, -'.decentraland.org'.length)
    const coordinates = mappedCoordinates
      .split('_')
      .map(coordinate => coordinate.charAt(0) === 'n' ? `-${coordinate.substr(1)}` : coordinate).join(', ')
    return `(${coordinates})`
  }

  encodeValue (value: string): string {
    const mappedCoordinates = value.substring(1, value.length - 1).split(', ').map(coordinate => {
      const value = parseInt(coordinate)
      return value < 0 ? `n${Math.abs(value)}` : coordinate
    }).join('_')
    return `scene_${mappedCoordinates}.decentraland.org`
  }

  convertPath(path: string[]): string[] {
    return ['site', 'domain']
  }

  convertTargetingOptions (targetingOptions: TargetingOption[]): void {
    DecentralandConverter.excludeSiteDomain(targetingOptions)
    targetingOptions.push({
      allowInput: true,
      id: DecentralandConverter.ID,
      key: DecentralandConverter.ID,
      label: 'Parcel',
      valueType: TargetingOptionType.PARCEL_COORDINATES,
    })
  }

  convertSelectedTargetingOptionValues (targetingObject: object, result: TargetingOptionValue[]): void {
    if (targetingObject['site'] && targetingObject['site']['domain']) {
      for (let item of targetingObject['site']['domain']) {
        if (item === 'decentraland.org') {
          continue
        }
        result.push(prepareCustomOption(this.decodeValue(item), DecentralandConverter.ID))
      }
    }
  }

  prepareCampaignTargetingForBackend(targeting: CampaignTargeting): void {
    if (targeting.requires[DecentralandConverter.ID]) {
      for (let parcel of targeting.requires[DecentralandConverter.ID]) {
        createPathObject(targeting.requires, this.convertPath([DecentralandConverter.ID]), this.encodeValue(parcel))
      }
      delete targeting.requires[DecentralandConverter.ID]
    } else {
      createPathObject(targeting.requires, ['site', 'domain'], 'decentraland.org')
    }
    if (targeting.excludes[DecentralandConverter.ID]) {
      for (let parcel of targeting.excludes[DecentralandConverter.ID]) {
        createPathObject(targeting.excludes, this.convertPath([DecentralandConverter.ID]), this.encodeValue(parcel))
      }
      delete targeting.requires[DecentralandConverter.ID]
    }
  }

  private static excludeSiteDomain (targetingOptions: TargetingOption[]): void {
    for (let i = 0; i < targetingOptions.length; i++) {
      const entry = targetingOptions[i]
      if (entry.key === 'site') {
        const index = entry.children.findIndex(option => option.key === 'domain')
        if (index !== -1) {
          if (entry.children.length > 1) {
            entry.children.splice(index, 1)
          } else {
            targetingOptions.splice(i, 1)
          }
        }
        break
      }
    }
  }
}
