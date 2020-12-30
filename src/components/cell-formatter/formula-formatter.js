import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import { FORMULA_RESULT_TYPE } from '../../utils/constants';
import cellFormatterFactory from '../cell-factory/cell-formatter-factory';
import * as CellTypes from '../../utils/cell-types';
import { formatNumberToString, formatDateToString } from '../../utils/value-format-utils';

const SIMPLE_CELL_FORMATTER_COLUMNS = [CellTypes.TEXT, CellTypes.NUMBER, CellTypes.DATE, CellTypes.CTIME, CellTypes.MTIME, CellTypes.GEOLOCATION,
  CellTypes.AUTO_NUMBER, CellTypes.URL, CellTypes.EMAIL, CellTypes.DURATION];
const ARRAY_FORMAL_COLUMNS = [CellTypes.IMAGE, CellTypes.FILE, CellTypes.MULTIPLE_SELECT, CellTypes.COLLABORATOR];

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object, PropTypes.bool]),
  column: PropTypes.Object,
  containerClassName: PropTypes.string,
  collaborators: PropTypes.array,
  tables: PropTypes.array,
};

class FormulaFormatter extends React.Component {

  getOtherColumnFormatter = (value, column) => {
    const { collaborators } = this.props;
    let formatterProps = { value };
    const { type: columnType } = column;
    switch(columnType) {
      case CellTypes.NUMBER: {
        formatterProps.data = column.data;
        break;
      }
      case CellTypes.DATE: {
        formatterProps.format = column.format;
        break;
      }
      case CellTypes.SINGLE_SELECT:
      case CellTypes.MULTIPLE_SELECT: {
        formatterProps.options = column.data.options;
        break;
      }
      case CellTypes.COLLABORATOR: {
        formatterProps.collaborators = collaborators;
        break;
      }
    }
    let Formatter = cellFormatterFactory.createFormatter(columnType);
    return React.cloneElement(Formatter, {...formatterProps});;
  }

  renderOtherColumnFormatter = () => {
    let { value, column, tables } = this.props;
    let { data: columnData } = column;
    let { display_column_key, linked_table_id } = columnData || {};
    let linkedTable = tables.find(table => table._id === linked_table_id);
    if (!linkedTable) return null;
    let linkedColumn = linkedTable.columns.find(column => column.key === display_column_key);
    if (!linkedColumn) return null;
    const linkedColumnType = linkedColumn.type;
    if (!ARRAY_FORMAL_COLUMNS.includes(linkedColumnType) && Object.prototype.toString.call(value) === '[object Array]') {
      const contentItemClassName = cn(
        'dtable-ui',
        'formula-formatter-content-item',
        {
          'simple-cell-formatter': SIMPLE_CELL_FORMATTER_COLUMNS.includes(linkedColumnType),
        }
      );
      return (
        <div className="formula-formatter multiple">
          {value.map((v, index) => {
            return (
              <div className={contentItemClassName} key={`formula-formatter-content-item-${index}`}>
                {this.getOtherColumnFormatter(v, linkedColumn)}
              </div>
            );
          })}
        </div>
      );
    }
    return this.getOtherColumnFormatter(value, linkedColumn);
  }

  getFormattedValue = (cellValue, columnData) => {
    if (!columnData) return '';
    const { result_type } = columnData;
    if (result_type === FORMULA_RESULT_TYPE.NUMBER) {
      return formatNumberToString(cellValue, columnData);
    } else if (result_type === FORMULA_RESULT_TYPE.DATE) {
      const { format } = columnData;
      return formatDateToString(cellValue, format);
    }
    let formattedValue = Object.prototype.toString.call(cellValue) === '[object Boolean]' ? cellValue + '' : cellValue;
    return formattedValue;
  }

  render() {
    const { value, containerClassName, column } = this.props;
    const { data: columnData } = column;
    const { result_type: resultType } = columnData;
    if (resultType === FORMULA_RESULT_TYPE.COLUMN) {
      return this.renderOtherColumnFormatter();
    }
    if (typeof value === 'object') {
      return null;
    }
    const isNumber = resultType === FORMULA_RESULT_TYPE.NUMBER;
    const classname = cn('dtable-ui cell-formatter-container formula-formatter', containerClassName, {"text-right": isNumber});

    const formattedValue = this.getFormattedValue(value, columnData);
    return <div className={classname}>{formattedValue}</div>;
  }
}

FormulaFormatter.propTypes = propTypes;

export default FormulaFormatter;