type Entry = {
  key: string;
  value: string;
};

interface TargetingOption {
  id?: string;
  key: string;
  label: string;
  description?: string;
  valueType: string;
  allowInput: boolean;
  parentId?: string;

  children?: TargetingOption[];
  values?: TargetingOptionValue[];
}

const TargetingOptionType = {
  GROUP: 'group',
  STRING: 'string',
  PARCEL_COORDINATES: 'parcel_coordinates',
};

interface TargetingOptionValue {
  id: string;
  label: string;
  description?: string;
  value: string;
  parentId: string;

  selected?: boolean;
  subSelected?: boolean;
  allowInput?: boolean;
  isCustom?: boolean;
  values?: TargetingOptionValue[];
  /** URL - if URL is defined, option value can route to external resource */
  url?: string;
}

interface AssetTargeting {
  requires: TargetingOptionValue[];
  excludes: TargetingOptionValue[];
}

interface TargetingReachResponse {
  occurrences: number;
  cpmPercentiles: TargetingReachResponseCpmPercentiles;
}

interface TargetingReachResponseCpmPercentiles {
  [index: string]: number;
}

export {
  Entry,
  TargetingOption,
  TargetingOptionType,
  TargetingOptionValue,
  AssetTargeting,
  TargetingReachResponse,
  TargetingReachResponseCpmPercentiles,
};
