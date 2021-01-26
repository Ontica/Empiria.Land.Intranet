export class FormatLibrary {

  static stringToNumber(value: string): number {
    return Number(value.replace(/[^0-9.-]+/g, ''));
  }


  static removeEmptyValuesFrom(obj) {
    return Object
    .entries({ ...obj })
    .filter(([key, val]) => val !== '' && val !== null && val !== undefined )
    .reduce((prev, curr) => ({ ...prev, [curr[0]]: curr[1] }), {});
  }

}
