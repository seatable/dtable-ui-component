import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import * as CellTypes from '../../utils/cell-types';
import { formatNumberToString, formatDateToString } from '../../utils/value-format-utils';

const propTypes = {
  containerClassName: PropTypes.string,
  row: PropTypes.object.isRequired,
  column: PropTypes.object.isRequired,
  enableOpenLinkedRow: PropTypes.bool,
  currentTableId: PropTypes.string.isRequired,
  linkMetaData: PropTypes.shape({
    getLinkedTable: PropTypes.func.isRequired,
    getLinkedRows: PropTypes.func.isRequired,
    getLinkedCellValue: PropTypes.func.isRequired,
    expandLinkedTableRow: PropTypes.func.isRequired,
  }),
};

// link value is  get form parant's interface
class LinkFormatter extends React.Component {

  static defaultProps = {
    enableOpenLinkedRow: false,
    value: [],
  }

  constructor(props) {
    super(props);
    this.linkID = '';
    this.tableID = '';
    this.otherTableID = '';

    this.state = {
      value: this.getLinkedCellValue(),
    };
  }

  getLinkedCellValue = () => {
    const { column, currentTableId, linkMetaData, row } = this.props;
    const { link_id, table_id, other_table_id } = column.data || {};
    this.linkID = link_id;
    this.tableID = currentTableId === table_id ? table_id : other_table_id;
    this.otherTableID = this.tableID === table_id ? other_table_id : table_id;

    return linkMetaData.getLinkedCellValue(this.linkID, this.tableID, this.otherTableID, row._id);
  }

  expandLinkedTableRow = (row) => {
    let { enableOpenLinkedRow, linkMetaData } = this.props;
    if (enableOpenLinkedRow) {
      linkMetaData.expandLinkedTableRow(row, this.otherTableID);
    }
  }

  getDisplayValues = () => {
    let { column, linkMetaData } = this.props;
    let { value: rowIds } = this.state;
    if (rowIds && Array.isArray(rowIds) && rowIds.length > 0) {
      let linkedTable = linkMetaData.getLinkedTable(this.otherTableID);
      let linkedRows = linkMetaData.getLinkedRows(this.otherTableID, rowIds);
      let result = linkedRows.map((row, index) => {
        let { display_column_key: displayColumnKey } = column.data;
        let displayValue = this.getDisplayValue(linkedTable, row, displayColumnKey);
        return (
          <div key={index} className="link-item" onClick={this.expandLinkedTableRow.bind(this, row)}>
            <div className="link-name">{displayValue}</div>
          </div>
        );
      });
      return result;
    }
    return null;
  }

  getDisplayValue = (linkedTable, row, displayColumnKey) => {
    let value = row[displayColumnKey];
    let linkedColumn = linkedTable.columns.find(column => column.key === displayColumnKey);
    let { type, data } = linkedColumn;
    // todo: improve
    switch(type) {
      case CellTypes.NUMBER: {
        let { format } = data;
        return formatNumberToString(value, format);
      }
      case CellTypes.DATE: {
        let { format } = data;
        return formatDateToString(value, format);
      }
      default:
        return value;
    }
  }

  render() {
    const { containerClassName } = this.props;
    const classname = cn('cell-formatter link-formatter', containerClassName);

    let displayValues = this.getDisplayValues();
    return (
      <div className={classname}>{displayValues}</div>
    );
  }
}

LinkFormatter.propTypes = propTypes;

export default LinkFormatter;
