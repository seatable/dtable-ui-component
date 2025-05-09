import React from 'react';
import PropTypes from 'prop-types';
import { getDurationDisplayString } from 'dtable-utils';
import DurationEditor from '../../DurationEditor';

class RowExpandMBDurationEditor extends React.Component {

  constructor(props) {
    super(props);
    let { row, column, valueKey } = props;
    this.state = {
      isShowEditor: false,
      value: row[column[valueKey]],
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row, valueKey } = nextProps;
    if (row._id !== this.props.row._id) {
      this.setState({ value: row[column[valueKey]], isShowEditor: false });
    }
  }

  toggleEditor = () => {
    this.setState({ isShowEditor: !this.state.isShowEditor });
  };

  onCommit = (value) => {
    this.props.onCommit(value);
    this.setState({ value, isShowEditor: false });
  };

  render() {
    const { column } = this.props;
    const { value, isShowEditor } = this.state;

    return (
      <div className="dtable-ui-mobile-row-expand-input-editor-container" >
        {isShowEditor ? (
          <DurationEditor isInModal={true} column={column} value={value} toggleEditor={this.toggleEditor} onCommit={this.onCommit} />
        ) : (
          <div className="w-100 h-100" onClick={this.toggleEditor}>
            {getDurationDisplayString(value, column.data)}
          </div>
        )}
      </div>
    );
  }
}

RowExpandMBDurationEditor.propTypes = {
  column: PropTypes.object,
  row: PropTypes.object,
  onCommit: PropTypes.func,
};

export default RowExpandMBDurationEditor;
