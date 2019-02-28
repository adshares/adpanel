interface TargetingOption {
  id: string;
  key: string;
  label: string;
  valueType: string;
  allow_input: boolean;

  children?: TargetingOption[];
  values?: TargetingOptionValue[];
}

interface TargetingOptionValue {
  id: string;
  label: string;
  value: string;
  parent: Partial<TargetingOption>;

  selected?: boolean;
  allow_input?: boolean;
  isCustom?: boolean;
}

interface AssetTargeting {
  requires: TargetingOptionValue[];
  excludes: TargetingOptionValue[];
}

interface SiteAssetTargeting extends AssetTargeting {
  requireClassified: boolean;
  excludeUnclassified: boolean;
}

export { TargetingOption, TargetingOptionValue, AssetTargeting, SiteAssetTargeting };
