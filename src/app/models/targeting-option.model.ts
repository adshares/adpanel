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
  allowInput?: boolean;
  isCustom?: boolean;
}

interface AssetTargeting {
  requires: TargetingOptionValue[];
  excludes: TargetingOptionValue[];
}

interface TargetingReachResponse {
  occurrences: number;
  percentiles: TargetingReachResponsePercentiles;
}

interface TargetingReachResponsePercentiles {
  [index: string]: number;
}

export {
  TargetingOption,
  TargetingOptionValue,
  AssetTargeting,
  TargetingReachResponse,
  TargetingReachResponsePercentiles,
};
