import React from 'react';
import PropTypes from 'prop-types';
import { FORMULA_RESULT_TYPE, CellType } from '../constants';
import cellFormatterFactory from '../cellFormatterFactory';
import TextFormatter from '../TextFormatter';
import { isArrayFormalColumn, isSimpleCellFormatter, isFunction } from './utils';
import cellValueValidator from './cell-value-validator';
import { getFormulaDisplayString } from '../utils/value-format-utils';

import './index.css';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object, PropTypes.bool]),
  column: PropTypes.Object,
  containerClassName: PropTypes.string,
  collaborators: PropTypes.array,
};

class FormulaFormatter extends React.Component {

  getGridCellClassName = (resultType) => {
    switch(resultType) {
      case FORMULA_RESULT_TYPE.NUMBER: {
        return 'text-right';
      }
      default: {
        return '';
      }
    }
  }

  renderOtherColumnFormatter = () => {
    const { value, column, collaborators } = this.props;
    const { data: columnData } = column;
    const { array_type, array_data } = columnData;
    if (!array_type || array_type === CellType.LINK) {
      return null;
    }
    let Formatter = cellFormatterFactory.createFormatter(array_type);
    let formatterProps = this.getFormatterProps(array_type, array_data, collaborators);

    if (isArrayFormalColumn(array_type)) {
      formatterProps.value = value;
      return this.createColumnFormatter(Formatter, formatterProps);
    }

    const _isSimpleCellFormatterColumn = isSimpleCellFormatter(array_type);
    let cellValue = value;
    if (!Array.isArray(value)) {
      cellValue = cellValueValidator(value, array_type) ? [value] : [];
    }
    const contentItemClassName = `formula-formatter-content-item ${_isSimpleCellFormatterColumn ? 'simple-cell-formatter' : ''}`;
    return (
      <div className="dtable-ui formula-formatter multiple">
        {cellValue.map((v, index) => {
          formatterProps.value = v;
          return (
            <div className={contentItemClassName} key={`formula-formatter-content-item-${index}`}>
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
    } else if (isFunction(Formatter)) {
      return <Formatter {...formatterProps} />;
    }
    return <TextFormatter {...formatterProps} />;
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
    const { value, containerClassName, column, collaborators } = this.props;
    const { data: columnData } = column;
    const { result_type: resultType } = columnData;
    if (resultType === FORMULA_RESULT_TYPE.ARRAY) {
      return this.renderOtherColumnFormatter();
    }
    if (typeof value === 'object') {
      return null;
    }

    const gridCellClassName = this.getGridCellClassName(resultType);
    let formattedValue = getFormulaDisplayString(value, columnData, { collaborators });
    return <div className={`dtable-ui cell-formatter-container formula-formatter ${containerClassName} ${gridCellClassName}`} title={formattedValue} aria-label={formattedValue}>{formattedValue}</div>;
  }
}

FormulaFormatter.propTypes = propTypes;

export default FormulaFormatter;
