import { formatNumberToString, formatStringToNumber } from '../../src/utils/value-format-utils'; 

describe('formate string to number to save on the server', () => {
  it('format the value to common number', () => {
    const number = 1877333;
    const formattedValue = formatNumberToString(number, {format: 'number'});
    expect(formattedValue).toEqual('1877333');
  });
  
  it('format the value to number-with-commas', () => {
    const number = 1877333;
    const formattedValue = formatNumberToString(number, {format: 'number-with-commas'});
    expect(formattedValue).toBe('1,877,333.00');
  });
  
  it('format the value to percent', () => {
    const number = 1877333;
    const formattedValue = formatNumberToString(number, {format: 'percent'});
    expect(formattedValue).toBe('187733300%');
  });

  it('format the value to yuan', () => {
    const number = 1877333;
    const formattedValue = formatNumberToString(number, {format: 'yuan'});
    expect(formattedValue).toEqual('¥1,877,333.00');
  });

  it('format the value to number dollar', () => {
    const number = 1877333;
    const formattedValue = formatNumberToString(number, {format: 'dollar'});
    expect(formattedValue).toEqual('$1,877,333.00');
  });

  it('format the value to number euro', () => {
    const number = 1877333;
    const format = 'euro';
    const formattedValue = formatNumberToString(number, format);
    expect(formattedValue).toEqual('€1,877,333.00');
  });

});

describe('formate number to string display in the GUI', () => {

  it('format the value to common number', () => {
    const number = '1877333,lfjae33';
    const format = 'number'
    const formattedValue = formatStringToNumber(number, format);
    expect(formattedValue).toEqual(187733333);
  });
  
  it('format the value to number-with-commas', () => {
    const number = '1,877,333.00';
    const format = 'number-with-commas';
    const formattedValue = formatStringToNumber(number, format);
    expect(formattedValue).toEqual(1877333);
  });

  it('format the value to number-with-commas', () => {
    const number = '187733300%';
    const format = 'number-with-commas';
    const formattedValue = formatStringToNumber(number, format);
    expect(formattedValue).toEqual(1877333);
  });

  it('format the value to yuan', () => {
    const number = '¥1,877,333.00';
    const format = 'yuan';
    const formattedValue = formatStringToNumber(number, format);
    expect(formattedValue).toEqual(1877333);
  });

  it('format the value to number dollar', () => {
    const number = '$1,877,333.00';
    const format = 'dollar';
    const formattedValue = formatStringToNumber(number, format);
    expect(formattedValue).toEqual(1877333);
  });

  it('format the value to number euro', () => {
    const number = '€1,877,333.00';
    const format = 'euro';
    const formattedValue = formatStringToNumber(number, format);
    expect(formattedValue).toEqual(1877333);
  });

});