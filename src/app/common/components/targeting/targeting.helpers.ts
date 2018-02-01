export function prepareTargetingChoices(targetingOptions, choicePartialKey = '', parentOption = null) {
  targetingOptions.forEach((targetingOption) => {
    const optionSublist = targetingOption.values || targetingOption.children;

    if (optionSublist) {
      if (!parentOption) {
        choicePartialKey = '';
      }

      choicePartialKey += (choicePartialKey !== '' ? '-' : '') + targetingOption.key;
      prepareTargetingChoices(optionSublist, choicePartialKey, targetingOption);
    } else {
      Object.assign(targetingOption, {
        key: choicePartialKey + `-${targetingOption.value}`,
        parent: {
          label: parentOption.label,
          value_type: parentOption.value_type,
          allow_input: parentOption.allow_input
        }
      });
    }
  });
}
