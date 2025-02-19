import { FORMAT_REG_EXP_LIST, LONG_TEXT_LENGTH_LIMIT } from '../constants';
import { getTrimmedString } from './utils';

export const checkValueConformityFormat = (columnData, value) => {
  const { format_specification_value, format_check_type } = columnData || {};
  let isMatched = false;
  if (format_check_type !== 'custom_format') {
    const reg = FORMAT_REG_EXP_LIST[format_check_type];
    isMatched = reg && reg.test(getTrimmedString(value));
  } else {
    const reg = new RegExp(format_specification_value);
    isMatched = reg.test(getTrimmedString(value));
  }
  return isMatched;
};

export const checkNumberValidation = (columnData, value) => {
  const { format_max_value, format_min_value } = columnData || {};
  const num = parseFloat(value);
  if (isNaN(num) || (!num && num !== 0)) {
    return false;
  }
  if ((format_max_value || format_max_value === 0) && num > format_max_value) {
    return false;
  }
  if ((format_min_value || format_min_value === 0) && num < format_min_value) {
    return false;
  }
  return true;
};

export const isLongTextValueExceedLimit = (value) => {
  if (!value) return false;
  if (typeof value === 'string') return value.length >= LONG_TEXT_LENGTH_LIMIT;
  const { text } = value || {};
  return text ? text.length >= LONG_TEXT_LENGTH_LIMIT : false;
};

export const isValidPosition = (lng, lat) => {
  return (lng || lng === 0) && (lat || lat === 0);
};
