function cloneDeep(target) {
  return JSON.parse(JSON.stringify(target));
}

function enumToArray(enumInput: {[key: string]: number}) {
  return Object.keys(enumInput).map(key => key.toLowerCase());
}

export { cloneDeep, enumToArray };
