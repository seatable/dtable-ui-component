import React from 'react';
import PropTypes from 'prop-types';
import {
  CellType,
  DISPLAY_INTERNAL_ERRORS,
  FORMULA_RESULT_TYPE,
  getFormulaDisplayString,
} from 'dtable-utils';
import BaseFormatterConfig from '../formatterConfig/base-formatter-config';
import TextFormatter from '../TextFormatter';
import {
  isArrayFormatColumn, isSimpleCellFormatter, convertValueToDtableLongTextValue,
} from './utils';
import { isFunction } from '../utils/utils';
import cellValueValidator from './cell-value-validator';

import './index.css';

const propTypes = {
  value: PropTypes.any,
  column: PropTypes.object,
  containerClassName: PropTypes.string,
  collaborators: PropTypes.array,
};

class FormulaFormatter extends React.Component {

  getGridCellClassName = (resultType) => {
    switch (resultType) {
      case FORMULA_RESULT_TYPE.NUMBER:
      case FORMULA_RESULT_TYPE.DATE: {
        return 'text-right';
      }
      default: {
        return '';
      }
    }
  };

  renderCellValue = (cellValue, resultType) => {
    const { containerClassName } = this.props;
    const gridCellClassName = this.getGridCellClassName(resultType);
    return (
      <div
        className={`dtable-ui cell-formatter-container formula-formatter ${containerClassName} ${gridCellClassName}`}
        title={cellValue}
        aria-label={cellValue}
      >
        {cellValue}
      </div>
    );
  };

  renderInternalErrorValue = (errorValue, resultType) => {
    return this.renderCellValue(errorValue, resultType);
  };

  renderOtherColumnFormatter = () => {
    const { value, column, collaborators } = this.props;
    const { data: columnData } = column;
    const { array_type, array_data } = columnData;
    if (!array_type || array_type === CellType.LINK) {
      return null;
    }
    const Formatter = BaseFormatterConfig[array_type];
    let formatterProps = this.getFormatterProps(array_type, array_data, collaborators);

    if (isArrayFormatColumn(array_type)) {
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
  };

  createColumnFormatter(Formatter, formatterProps) {
    if (React.isValidElement(Formatter)) {
      return React.cloneElement(Formatter, { ...formatterProps });
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
  };

  render() {
    const { column, collaborators } = this.props;
    const { data } = column;
    let value = this.props.value;
    if (!data || (!value && value !== 0 && value !== false)) return null;

    const { array_type, result_type: resultType } = data;
    if (DISPLAY_INTERNAL_ERRORS.includes(value)) {
      return this.renderInternalErrorValue(value, resultType);
    }

    if (array_type && array_type === CellType.LONG_TEXT && Array.isArray(value)) {
      value = value.map(item => convertValueToDtableLongTextValue(item));
    }

    if (resultType === FORMULA_RESULT_TYPE.ARRAY) {
      return this.renderOtherColumnFormatter();
    }
    if (typeof value === 'object') {
      return null;
    }

    const formattedValue = getFormulaDisplayString(value, data, { collaborators });
    return this.renderCellValue(formattedValue, resultType);
  }
}

FormulaFormatter.propTypes = propTypes;

export default FormulaFormatter;
