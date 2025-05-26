import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { CellType } from 'dtable-utils';
import ColumnContent from '../column-content';
import RowExpandEditor from '../../RowExpandEditor';
import RowExpandFormatter from '../../RowExpandFormatter';
import { getFormulaArrayValue, isArrayFormatColumn, downloadFile } from '../../utils/utils';

import './index.css';

class Body extends React.Component {

  downloadImage = (imageItemUrl) => {
    this.props.getDownLoadFiles([{ url: imageItemUrl }]).then(res => {
      const [downloadUrl] = res.data.urls;
      downloadFile(downloadUrl);
    }).catch(error => {
      // todo
    });
  };

  getCellValue = ({ row, column }) => {
    if (!row || !column) return null;
    const { valueKey } = this.props;
    return row[column[valueKey]];
  };

  renderColumnValue = (row, column) => {
    const { component, onChange, className, ...props } = this.props;
    const { getDownLoadFiles } = props;
    const { editable } = column;
    const { editor, formatter } = component || {};
    if (editable) {
      return (
        <RowExpandEditor
          {...props}
          column={column}
          row={row}
          component={editor}
          onCommit={(value) => onChange(column, value)}
        />
      );
    }
    return (
      <RowExpandFormatter
        {...props}
        className={classnames('dtable-ui-mobile-row-expand-formatter', `mobile-dtable-row-expand-${column.type}-formatter`, className)}
        column={column}
        row={row}
        component={formatter}
        downloadImage={getDownLoadFiles ? this.downloadImage : null}
      />
    );
  };

  render() {
    const { columns, row, placeholder } = this.props;
    return (
      <div className="dtable-ui-row-expand-body dtable-ui-mobile-row-expand-body">
        {columns.length === 0 && placeholder && (<>{placeholder}</>)}
        {columns.map((column) => {
          const { type, data } = column;
          let isHasMore = false;
          if (type === CellType.LINK_FORMULA) {
            let { array_type } = data || {};
            const value = this.getCellValue({ row, column });
            const cellValue = getFormulaArrayValue(value, !isArrayFormatColumn(array_type));
            if (cellValue.length >= 10) {
              isHasMore = true;
            }
          }
          return (
            <ColumnContent column={column} className={classnames('', { 'is-has-more': isHasMore })} key={column.key}>
              {this.renderColumnValue(row, column)}
            </ColumnContent>
          );
        })}
      </div>
    );
  }
}

Body.propTypes = {
  columns: PropTypes.array,
  row: PropTypes.object,
  placeholder: PropTypes.any,
  onChange: PropTypes.func,
  onToggle: PropTypes.func,
};

export default Body;
