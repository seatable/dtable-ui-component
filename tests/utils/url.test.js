import { getFileSuffix } from '../../src/utils/url';

describe('getFileSuffix', () => {
  it('should return the suffix of the filename in lowercase', () => {
    expect(getFileSuffix('example.TXT')).toBe('txt');
    expect(getFileSuffix('example.jpeg')).toBe('jpeg');
    expect(getFileSuffix('example.heic')).toBe('heic');
  });
  it('should return an empty string if input is not a valid string', () => {
    expect(getFileSuffix(null)).toBe('');
    expect(getFileSuffix(123)).toBe('');
    expect(getFileSuffix(undefined)).toBe('');
  });
});
