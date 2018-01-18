interface TargetingOptionModel {
  key: string,
  label: string,
  value_type: string,
  allow_input: boolean,
  children?: TargetingOptionValue[],
  values?: TargetingOptionValue[]
}

interface TargetingOptionValue {
  key: string,
  label: string,
  parent_label: string,
  value: string,
  selected?: boolean,
  parentOptionLabel?: string
}

export { TargetingOptionModel, TargetingOptionValue };
