import React from 'react';
import PropTypes from 'prop-types';
import { getNumberDisplayString, isNumber } from 'dtable-utils';
import NumberEditor from '../../../NumberEditor';

import './index.css';

class RowExpandMBNumberEditor extends React.Component {

  constructor(props) {
    super(props);
    const { column, row } = props;
    this.state = {
      isShowEditor: false,
      value: row[column.key],
    };
  }

  toggleEditor = () => {
    if (this.props.readOnly) return;
    this.setState({ isShowEditor: !this.state.isShowEditor });
  };

  onCommit = (value) => {
    console.log(value);
    this.props.onCommit(value);
    this.setState({ value }, () => {
      this.setState({ isShowEditor: false });
    });
  };

  onBlur = () => {
    this.setState({ isShowEditor: false });
  };

  render() {
    const { column } = this.props;
    const { value, isShowEditor } = this.state;
    let formatValue = '';
    if (!isShowEditor && isNumber(value)) {
      const { data = {} } = column;
      formatValue = getNumberDisplayString(value, data);
    }
    const dom = isShowEditor ? (
      <NumberEditor isInModal={true} column={column} value={value} onBlur={this.onBlur} onCommit={this.onCommit} />
    ) : (
      <div className="w-100 h-100" onClick={this.toggleEditor}>
        {formatValue}
      </div>
    );

    return (
      <div className="dtable-ui-mobile-row-expand-input-editor-container dtable-ui-mobile-row-expand-number-editor-container">
        {dom}
      </div>
    );
  }
}

RowExpandMBNumberEditor.propTypes = {
  readOnly: PropTypes.bool,
  column: PropTypes.object,
  row: PropTypes.object,
  onCommit: PropTypes.func,
};

export default RowExpandMBNumberEditor;
