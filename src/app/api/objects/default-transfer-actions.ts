export class DefaultTransferActions {
  public static stringAction(value: string): string {
    if (!value) {
      return '';
    }

    return value;
  }

  public static arrayAction<T>(array: T[]): T[] {
    if (!array) {
      return [];
    }

    return array;
  }

  public static booleanAction(state: boolean): boolean {
    if (!state) {
      return false;
    }
    return state;
  }
}
