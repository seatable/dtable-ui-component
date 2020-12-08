import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import { FORMULA_RESULT_TYPE } from '../../utils/constants';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object, PropTypes.bool]),
  data: PropTypes.Object,
  continerClassName: PropTypes.string,
};

class FormulaFormatter extends React.Component {

  shouldComponentUpdate(nextProps) {
    let prevColumnData = this.props.data;
    let nextColumnData = nextProps.data;
    return nextProps.value !== this.props.value
      || nextProps.isCellSelected !== this.props.isCellSelected
      || nextColumnData.format !== prevColumnData.format
      || nextColumnData.decimal !== prevColumnData.decimal
      || nextColumnData.thousands !== prevColumnData.thousands
      || nextColumnData.linked_table_id !== prevColumnData.linked_table_id
      || nextColumnData.display_column_key !== prevColumnData.display_column_key
      || nextColumnData.result_type !== prevColumnData.result_type
      || nextColumnData.enable_precision !== prevColumnData.enable_precision
      || nextColumnData.precision !== prevColumnData.precision;
  }

  // need update: use `cellFormatterFactory.createFormatter`
  renderOtherColumnFormatter = () => {
    let { value, column, isCellSelected } = this.props;
    let { data: columnData } = column;
    let { linked_table_id, display_column_key } = columnData || {};
    let linkedTable = window.app.getLinkedTable(linked_table_id);
    if (!linkedTable) return null;
    let linkedColumn = TableUtils.getTableColumnByKey(linkedTable, display_column_key);
    if (!linkedColumn) return null;
    let { type: linkedColumnType } = linkedColumn;
    let Formatter = cellFormatterFactory.createFormatter(linkedColumnType);
    let formatterProps = {value, column: linkedColumn, isCellSelected, readOnly: true };
    if (React.isValidElement(Formatter)) {
      return React.cloneElement(Formatter, {...formatterProps});
    } else if (isFunction(Formatter)) {
      return <Formatter {...formatterProps} />;
    }
    return <SimpleCellFormatter {...formatterProps} />;
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
    let classname = cn('dtable-ui cell-formatter-container formula-formatter', containerClassName, {"text-right": isNumber});

    let formattedValue = this.getFormattedValue(value);
    return <div className={classname}>{formattedValue}</div>;
  }
}

FormulaFormatter.propTypes = propTypes;

export default FormulaFormatter;