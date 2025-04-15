import React from 'react';
import PropTypes from 'prop-types';
import { getNumberDisplayString, isNumber } from 'dtable-utils';
import NumberEditor from '../../NumberEditor';

class Large extends React.Component {

  constructor(props) {
    super(props);
    const { column, row, isEditorFocus } = props;
    this.state = {
      isShowEditor: isEditorFocus || false,
      value: row[column.key],
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row } = nextProps;
    if (row._id !== this.props.row._id) {
      this.setState({
        value: row[column.key],
        isShowEditor: false
      });
    }
    if (nextProps.isEditorFocus !== this.props.isEditorFocus) {
      let activeInput = document.activeElement;
      if (nextProps.isEditorFocus === false && activeInput) {
        activeInput.blur();
      }
      this.setState({ isShowEditor: nextProps.isEditorFocus });
    }
  }

  toggleEditor = () => {
    this.props.updateTabIndex(this.props.columnIndex);
    if (this.props.readOnly) return;
    this.setState({ isShowEditor: !this.state.isShowEditor });
  };

  onCommit = (value) => {
    this.props.onCommit(value);
    this.setState({ value }, () => {
      this.setState({ isShowEditor: false });
    });
  };

  onBlur = () => {
    this.setState({ isShowEditor: false });
  };

  render() {
    let { column, isInModal } = this.props;
    let { value, isShowEditor } = this.state;
    if (isShowEditor) {
      return (
        <NumberEditor
          isInModal={isInModal}
          column={column}
          value={value}
          onBlur={this.onBlur}
          onCommit={this.onCommit}
        />
      );
    }
    let formatValue = '';
    if (isNumber(value)) {
      let { data = {} } = column;
      formatValue = getNumberDisplayString(value, data);
    }
    return (
      <div
        tabIndex={0}
        onClick={this.toggleEditor}
        onFocus={this.toggleEditor}
        className="form-control"
        style={{ width: 320, lineHeight: '1.625rem' }}
        aria-label={formatValue}
      >
        {formatValue}
      </div>
    );
  }
}

Large.propTypes = {
  onCommit: PropTypes.func,
  column: PropTypes.object,
  row: PropTypes.object,
  isEditorFocus: PropTypes.bool,
  columnIndex: PropTypes.number,
  updateTabIndex: PropTypes.func.isRequired,
  onEditorClose: PropTypes.func,
};

export default Large;
