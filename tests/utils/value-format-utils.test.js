import { formatNumberToString, formatStringToNumber } from '../../src/utils/value-format-utils'; 

describe('format string to number to save on the server', () => {
  it('format the value to common number', () => {
    const number = 1877333;
    const formattedValue = formatNumberToString(number, {format: 'number'});
    expect(formattedValue).toEqual('1877333');
  });
  
  it('format the value to percent', () => {
    const number = 1877333;
    const formattedValue = formatNumberToString(number, {format: 'percent'});
    expect(formattedValue).toBe('187733300%');
  });

  it('format the value to yuan', () => {
    const number = 1877333;
    const formattedValue = formatNumberToString(number, {format: 'yuan'});
    expect(formattedValue).toEqual('￥1877333.00');
  });

  it('format the value to number dollar', () => {
    const number = 1877333;
    const formattedValue = formatNumberToString(number, {format: 'dollar'});
    expect(formattedValue).toEqual('$1877333.00');
  });

  it('format the value to number euro', () => {
    const number = 1877333;
    const formattedValue = formatNumberToString(number, {format: 'euro'});
    expect(formattedValue).toEqual('€1877333.00');
  });

});

describe('format number to string display in the GUI', () => {

  it('format the value to common number', () => {
    const number = '1877333,lfjae33';
    const formattedValue = formatStringToNumber(number, {format: 'number'});
    expect(formattedValue).toEqual(187733333);
  });

  it('format the value to number-with-commas', () => {
    const number = '187733300%';
    const formattedValue = formatStringToNumber(number, {format: 'number'});
    expect(formattedValue).toEqual(1877333);
  });

  it('format the value to yuan', () => {
    const number = '¥1,877,333.00';
    const formattedValue = formatStringToNumber(number, {format: 'yuan'});
    expect(formattedValue).toEqual(1877333);
  });

  it('format the value to number dollar', () => {
    const number = '$1,877,333.00';
    const formattedValue = formatStringToNumber(number, {format: 'dollar'});
    expect(formattedValue).toEqual(1877333);
  });

  it('format the value to number euro', () => {
    const number = '€1,877,333.00';
    const formattedValue = formatStringToNumber(number, {format: 'euro'});
    expect(formattedValue).toEqual(1877333);
  });

});