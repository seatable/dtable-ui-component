import { format } from 'number-currency-format';
import { NUMBER_TYPES, DATE_TYPES } from './constants';


export const formatNumberToString = (value, currentType) => {
  let formatedValue = '';
  if (!value && value !== 0) {
    return formatedValue;
  }
  switch(currentType) {
    case NUMBER_TYPES.NUMBER:
      formatedValue = value.toString();
      break;
    case NUMBER_TYPES.PERCENT:
      let percentValue = Number.parseFloat((value * 100).toFixed(8));
      formatedValue = `${percentValue}%`;
      break;
    case NUMBER_TYPES.NUMBER_WITH_COMMAS:
      formatedValue = format(value);
      break;
    case NUMBER_TYPES.YUAN:
      formatedValue = format(value, {currency: '¥', spacing: false, currencyPosition: 'LEFT'});
      break;
    case NUMBER_TYPES.DOLLAR:
      formatedValue = format(value, {currency: '$', spacing: false, currencyPosition: 'LEFT'});
      break;
    case NUMBER_TYPES.EURO:
      formatedValue = format(value, {currency: '€', spacing: false, currencyPosition: 'LEFT'});
      break;
    default: 
      formatedValue = value;
  }
  return formatedValue;
};

export const fromatStringToNumber = (value) => {
  let isIncludePercent = value.indexOf('%') > -1;
  let newData = parseFloat(value.replace(/[^.-\d]/g, ''));
  if (isIncludePercent && !isNaN(newData)) {
    return newData / 100;
  }
  return isNaN(newData) ? '' : newData;
};

export const formatNumberString = (value, format) => {
  let formatedValue = '';
  switch(format) {
    case NUMBER_TYPES.NUMBER:
    case NUMBER_TYPES.NUMBER_WITH_COMMAS:
      formatedValue = value.replace(/[^.-\d,]/g,'');
      break;
    case NUMBER_TYPES.PERCENT:
      formatedValue = value.replace(/[^.-\d,%]/g, '');
      break;
    case NUMBER_TYPES.YUAN:
      formatedValue = value.replace(/[^.-\d￥,]/g, '');
      break;
    case NUMBER_TYPES.DOLLAR:
      formatedValue = value.replace(/[^.-\d$,]/g, '');
      break;
    case NUMBER_TYPES.EURO:
      formatedValue = value.replace(/[^.-\d€,]/g, '');
      break;
    default:
      formatedValue = value.replace(/[^.-\d,]/g,'');
  }

  return formatedValue;
}

export const formatDateToString = (value, format) => {
  let formatedValue = ''
  if (!value) { // value === '', value === undefine, value === null
    return formatedValue;
  }

  let newValue = value.split(' ');
  let cellDate = newValue[0].split('-');
  switch(format) {
    case DATE_TYPES['D/M/YYYY']:
      formatedValue = `${Number(cellDate[2])}/${Number(cellDate[1])}/${cellDate[0]}`;
      break;
    case DATE_TYPES['D/M/YYYY HH:mm']:
      formatedValue = `${Number(cellDate[2])}/${Number(cellDate[1])}/${cellDate[0]}`;
      if (newValue[1]) {
        formatedValue = `${formatedValue} ${newValue[1]}` 
      }
      break;
    case DATE_TYPES['M/D/YYYY']:
      formatedValue = `${Number(cellDate[1])}/${Number(cellDate[2])}/${cellDate[0]}`;
      break;
    case DATE_TYPES['M/D/YYYY HH:mm']:
      formatedValue = `${Number(cellDate[1])}/${Number(cellDate[2])}/${cellDate[0]}`;
      if (newValue[1]) {
        formatedValue = `${formatedValue} ${newValue[1]}`;
      }
      break;
    case DATE_TYPES['YYYY-MM-DD']:
      formatedValue = `${cellDate[0]}-${cellDate[1]}-${cellDate[2]}`;
      break;
    case DATE_TYPES['YYYY-MM-DD HH:mm']:
      formatedValue = value;
      break;
    default:
      formatedValue = value;
  }

  return formatedValue;
};