import { FORMULA_RESULT_TYPE, CellType } from '../constants';

const numberValidator = (value) => {
  return (value || value === 0) && Object.prototype.toString.call(value) === '[object Number]';
};

const textValidator = (value) => {
  return !!value;
};

const checkboxValidator = (value) => {
  return typeof value === 'boolean';
};

const validators = {
  [CellType.NUMBER]: numberValidator,
  [CellType.RATE]: numberValidator,
  [CellType.DURATION]: numberValidator,
  [CellType.CHECKBOX]: checkboxValidator,
  [CellType.TEXT]: textValidator,
  [CellType.DATE]: textValidator,
  [CellType.CTIME]: textValidator,
  [CellType.MTIME]: textValidator,
  [CellType.GEOLOCATION]: textValidator,
  [CellType.AUTO_NUMBER]: textValidator,
  [CellType.URL]: textValidator,
  [CellType.EMAIL]: textValidator,
  [FORMULA_RESULT_TYPE.DATE]: textValidator,
  [FORMULA_RESULT_TYPE.STRING]: textValidator,
  [FORMULA_RESULT_TYPE.NUMBER]: numberValidator,
  [FORMULA_RESULT_TYPE.BOOL]: checkboxValidator,
};

const cellValueValidator = (cellValue, type) => {
  const validator = validators[type];
  if (validator) {
    return validator(cellValue);
  }
  return true;
};

export default cellValueValidator;
