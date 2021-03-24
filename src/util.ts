export function assertArg(condition: any, message: string) {
  if (!condition) {
    throw TypeError(`Invalid arguments: ${message}`);
  }
}

export function polyfill() {
  Element.prototype.matches = Element.prototype.matches ||
    // @ts-ignore: Property does not exist
    Element.prototype.matchesSelector ||
    // @ts-ignore: Property does not exist
    Element.prototype.webkitMatchesSelector ||
    // @ts-ignore: Property does not exist
    Element.prototype.mozMatchesSelector ||
    // @ts-ignore: Property does not exist
    Element.prototype.msMatchesSelector ||
    // @ts-ignore: Property does not exist
    Element.prototype.oMatchesSelector;

  Object.entries = /* Object.entries || */ ((obj: any) => {
    return Object.keys(obj).map(key => [key, obj[key]] as [string, any]);
  });

  Object.values = /* Object.values || */ ((obj: any) => {
    return Object.keys(obj).map(key => obj[key]);
  });

  Object.assign = Object.assign || ((first: any, ...objects: any[]) => {
    for (const obj of objects) {
      for (const [key, val] of Object.entries(obj)) {
        first[key] = val;
      }
    }

    return first;
  });

  Array.prototype.includes = function includes(value) {
    return this.indexOf(value) !== -1;
  };
}
