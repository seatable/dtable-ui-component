import { 
  formatNumberToString, 
  formatStringToNumber,
  getDurationDisplayString,
 } from '../../src/utils/value-format-utils'; 

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


describe('format duration to string display in the GUI', () => {
  it('the formatted value is 0', () => {
    const number = 0;
    const formattedValue = getDurationDisplayString(number, 'h:mm');
    expect(formattedValue).toEqual('0:00');
  });

  it('the formatted value is 0', () => {
    const number = 0;
    const formattedValue = getDurationDisplayString(number, 'h:mm:ss');
    expect(formattedValue).toEqual('0:00');
  });

  it('format the value to common number', () => {
    const number = 12300;
    const formattedValue = getDurationDisplayString(number, 'h:mm');
    expect(formattedValue).toEqual('3:25');
  });

  it('format the value to common number', () => {
    const number = 12300;
    const formattedValue = getDurationDisplayString(number, 'h:mm:ss');
    expect(formattedValue).toEqual('3:25:00');
  });

  it('format the value to common number', () => {
    const number = 660;
    const formattedValue = getDurationDisplayString(number, 'h:mm:ss');
    expect(formattedValue).toEqual('11:00');
  });

  it('format negative values as displayed strings', () => {
    const number = -12300;
    const formattedValue = getDurationDisplayString(number, 'h:mm');
    expect(formattedValue).toEqual('-3:25');
  });

  it('format negative values as displayed strings', () => {
    const number = -12300;
    const formattedValue = getDurationDisplayString(number, 'h:mm:ss');
    expect(formattedValue).toEqual('-3:25:00');
  });

});