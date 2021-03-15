interface TargetingOption {
  id?: string;
  key: string;
  label: string;
  description?: string;
  valueType: string;
  allowInput: boolean;

  children?: TargetingOption[];
  values?: TargetingOptionValue[];
}

interface TargetingOptionValue {
  id: string;
  label: string;
  description?: string;
  value: string;
  parent: Partial<TargetingOption>;

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
  TargetingOption,
  TargetingOptionValue,
  AssetTargeting,
  TargetingReachResponse,
  TargetingReachResponseCpmPercentiles,
};
