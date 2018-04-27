interface TargetingOption {
  id: string;
  key: string;
  label: string;
  value_type: string;
  allow_input: boolean;

  children?: TargetingOption[];
  values?: TargetingOptionValue[];
}

interface TargetingOptionValue {
  id: string;
  label: string;
  value: string;
  selected?: boolean;
  allow_input?: boolean;
  parent: Partial<TargetingOption>;

  isCustom?: boolean;
}


interface AssetTargeting {
  requires: TargetingOptionValue[];
  excludes: TargetingOptionValue[];
}

export { TargetingOption, TargetingOptionValue, AssetTargeting };
