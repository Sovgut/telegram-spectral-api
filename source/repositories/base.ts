export abstract class Repository {
  protected isString(query: string | undefined): query is string {
    return typeof query === "string" && query.length > 0;
  }

  protected isNumber(query: number | undefined): query is number {
    return typeof query === "number";
  }

  protected isBoolean(query: boolean | undefined): query is boolean {
    return typeof query === "boolean";
  }

  protected isDate(query: Date | undefined): query is Date {
    return query instanceof Date;
  }

  protected isObject(query: object | undefined): query is object {
    return typeof query === "object" && query !== null;
  }

  protected isArray(query: any[] | undefined): query is any[] {
    return Array.isArray(query);
  }

  protected static isString(query: string | undefined): query is string {
    return typeof query === "string" && query.length > 0;
  }

  protected static isNumber(query: number | undefined): query is number {
    return typeof query === "number";
  }

  protected static isBoolean(query: boolean | undefined): query is boolean {
    return typeof query === "boolean";
  }

  protected static isDate(query: Date | undefined): query is Date {
    return query instanceof Date;
  }

  protected static isObject(query: object | undefined): query is object {
    return typeof query === "object" && query !== null;
  }

  protected static isArray(query: any[] | undefined): query is any[] {
    return Array.isArray(query);
  }
}
