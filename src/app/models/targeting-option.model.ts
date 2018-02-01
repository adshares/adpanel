interface TargetingOptionModel {
  key: string;
  label: string;
  value_type: string;
  allow_input: boolean;
  children?: TargetingOptionValue[];
  values?: TargetingOptionValue[];
}

interface TargetingOptionValue {
  label: string;
  value: string;
  selected?: boolean;
  key?: string;
  parent?: Partial<TargetingOptionModel>;
}

interface AssetTargeting {
  requires?: TargetingOptionValue[];
  excludes?: TargetingOptionValue[];
}

export { TargetingOptionModel, TargetingOptionValue, AssetTargeting };
