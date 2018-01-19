function cloneDeep(target) {
  return JSON.parse(JSON.stringify(target));
}

function enumToArray(enumInput) {
  const enumNamesArray: string[] = [];

  for (let enumMember in enumInput) {
    if (typeof enumInput[enumMember] === 'number') {
      enumNamesArray.push(enumMember.toLowerCase());
    }
  }

  return enumNamesArray;
}

export { cloneDeep, enumToArray };
