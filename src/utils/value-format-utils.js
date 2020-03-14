import { format } from 'number-currency-format';
import { NUMBER_TYPES } from './constants';


export const formatNumberToString = (value, currentType) => {
  let formatedValue = '';
  if (!value && value !== 0) {
    return formatedValue;
  }
  switch(currentType) {
    case NUMBER_TYPES.NUMBER:
      formatedValue = value;
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

export const formatDate = (value, format) => {

};