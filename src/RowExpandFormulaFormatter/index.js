import React from 'react';
import PropTypes from 'prop-types';
import { CellType, FORMULA_RESULT_TYPE, getFormulaDisplayString } from 'dtable-utils';
import BaseFormatterConfig from '../formatterConfig/base-formatter-config';
import TextFormatter from '../TextFormatter';
import { isArrayFormatColumn, isSimpleCellFormatter, isFunction, getFormulaArrayValue,
  convertValueToDtableLongTextValue } from '../FormulaFormatter/utils';
import cellValueValidator from '../FormulaFormatter/cell-value-validator';

import '../FormulaFormatter/index.css';

export default class RowExpandFormulaFormatter extends React.Component {

  static propTypes = {
    value: PropTypes.any,
    column: PropTypes.object,
    containerClassName: PropTypes.string,
    collaborators: PropTypes.array,
  };

  renderBorder = (dom) => {
    const { column } = this.props;
    const { result_type } = column.data;
    let style = { minHeight: '38px' };
    if (result_type === FORMULA_RESULT_TYPE.DATE || result_type === FORMULA_RESULT_TYPE.NUMBER) {
      style = { width: '320px' };
    }
    return (
      <div className="d-flex align-items-center form-control disabled h-auto" style={style}>{dom}</div>
    );
  }

  renderOtherColumnFormatter = () => {
    const { value, column, collaborators } = this.props;
    const { array_type, array_data } = column.data;
    if (!array_type || array_type === CellType.LINK) {
      return null;
    }
    const Formatter = BaseFormatterConfig[array_type];
    let formatterProps = this.getFormatterProps(array_type, array_data, collaborators);

    if (isArrayFormatColumn(array_type)) {
      formatterProps.value = value;
      return this.renderBorder(this.createColumnFormatter(Formatter, formatterProps));
    }

    let cellValue = value;
    if (!Array.isArray(value)) {
      cellValue = cellValueValidator(value, array_type) ? [value] : [];
    }
    return this.renderBorder(
      <div className="dtable-ui formula-formatter multiple">
        {cellValue.map((v, index) => {
          formatterProps.value = v;
          return (
            <div
              className={`formula-formatter-content-item ${isSimpleCellFormatter(array_type) ? 'simple-cell-formatter' : ''}`}
              key={`formula-formatter-content-item-${index}`}
            >
              {this.createColumnFormatter(Formatter, formatterProps)}
            </div>
          );
        })}
      </div>
    );
  }

  createColumnFormatter(Formatter, formatterProps) {
    if (React.isValidElement(Formatter)) {
      return React.cloneElement(Formatter, {...formatterProps});
    }
    else if (isFunction(Formatter)) {
      return <Formatter {...formatterProps} />;
    }
    else {
      return <TextFormatter {...formatterProps} />;
    }
  }

  getFormatterProps = (array_type, array_data, collaborators) => {
    switch (array_type) {
      case CellType.DURATION: {
        const { duration_format } = array_data;
        return { format: duration_format };
      }
      case CellType.NUMBER:
      case CellType.RATE:
      case CellType.GEOLOCATION: {
        return { data: array_data };
      }
      default: {
        return { ...array_data, collaborators };
      }
    }
  }

  render() {
    let { containerClassName, column, collaborators, value } = this.props;
    const { data } = column;
    const { array_type, result_type } = data;

    if (!value) return null;
    if (Array.isArray(value)) {
      value = getFormulaArrayValue(value);
      if (array_type === CellType.LONG_TEXT) {
        value = value.map(item => convertValueToDtableLongTextValue(item));
      }
    }

    if (result_type === FORMULA_RESULT_TYPE.ARRAY) {
      return this.renderOtherColumnFormatter();
    }

    if (typeof value === 'object') {
      return null;
    }

    const formattedValue = getFormulaDisplayString(value, data, { collaborators });

    let className = `dtable-ui cell-formatter-container formula-formatter ${containerClassName}`;
    if (result_type === FORMULA_RESULT_TYPE.NUMBER) {
      className = className + ' text-right';
    }

    return this.renderBorder(
      <div className={className} title={formattedValue} aria-label={formattedValue}>{formattedValue}</div>
    );
  }
}
