type Entry = {
  key: string
  value: string
}

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
  TargetingOptionValue,
  AssetTargeting,
  TargetingReachResponse,
  TargetingReachResponseCpmPercentiles,
};
