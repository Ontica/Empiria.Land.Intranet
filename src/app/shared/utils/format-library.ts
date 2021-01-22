export class FormatLibrary {

  static stringToNumber(value: string): number {
    return Number(value.replace(/[^0-9.-]+/g, ''));
  }

}
