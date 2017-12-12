interface targetingOptionModel {
  key: string,
  label: string,
  value_type: string,
  allow_input: boolean,
  children?: targetingOptionModel[],
  values?: targetingOptionValue[]
}

interface targetingOptionValue {
  key: string,
  label: string,
  parent_label: string,
  selected?: boolean,
  parentOptionLabel?: string
}

export {targetingOptionModel, targetingOptionValue};
