import {generateGuid} from './guid';

describe('Guid generation testing', () => {
  let guid: string;

  beforeEach(() => {
    guid = generateGuid();
  });

  it('should generate a 36-character guid', () => {
    expect(guid.length).toBe(36);
  });

  it('should have proper guid format', () => {
    let dash = '-';

    let dashPositions = [8, 13, 18, 23];

    dashPositions.forEach((position) => {
      expect(guid[position]).toBe(dash);
    });
  });
});
