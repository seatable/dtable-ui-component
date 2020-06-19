import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import { FORMULA_RESULT_TYPE } from '../../utils/constants';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object, PropTypes.bool]),
  resultType: PropTypes.oneOf(['string', 'number', 'bool', 'date']),
  continerClassName: PropTypes.string,
};

class FormulaFormatter extends React.Component {

  static defaultProps = {
    resultType: 'string'
  }

  getFormattedValue = (val) => {
    let formattedValue = Object.prototype.toString.call(val) === '[object Boolean]' ? '' : val;
    return formattedValue;
  }

  render() {
    const { value, resultType, containerClassName } = this.props;
    
    if (typeof value === 'object') {
      return null;
    }
  
    let isNumber = resultType === FORMULA_RESULT_TYPE.NUMBER;
    let classname = cn('cell-formatter-container formula-formatter', containerClassName, {"text-right": isNumber});

    let formattedValue = this.getFormattedValue(value);
    return <div className={classname}>{formattedValue}</div>;
  }
}

FormulaFormatter.propTypes = propTypes;

export default FormulaFormatter;