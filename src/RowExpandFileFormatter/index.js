import React from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';
import RowExpandFileItemFormatter from './row-expand-file-item-formatter';

import './index.css';

export default class RowExpandFileFormatter extends React.PureComponent {

  static propTypes = {
    value: PropTypes.array,
    containerClassName: PropTypes.string,
    column: PropTypes.object,
    downloadFile: PropTypes.func,
    deleteFile: PropTypes.func,
    readOnly: PropTypes.bool,
  };

  static defaultProps = {
    value: [],
    containerClassName: ''
  }

  render() {
    let { value, containerClassName, column, downloadFile, deleteFile, readOnly } = this.props;
    if (!Array.isArray(value) || value.length === 0) {
      return null;
    }
    return (
      <div className={classname('dtable-ui cell-formatter-container row-expand-file-formatter', containerClassName)}>
        {value.map((item, index) => {
          return (
            <RowExpandFileItemFormatter
              file={item}
              key={index}
              index={index}
              column={column}
              downloadFile={downloadFile}
              deleteFile={deleteFile}
              readOnly={readOnly}
            />
          );
        })}
      </div>
    );
  }
}
