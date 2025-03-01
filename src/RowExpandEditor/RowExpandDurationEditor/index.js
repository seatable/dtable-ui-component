import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { getDurationDisplayString } from 'dtable-utils';
import { ROW_EXPAND_FOCUS_STYLE, KeyCodes } from '../../constants';
import DurationEditor from '../../DurationEditor';

class RowExpandDurationEditor extends React.Component {

  constructor(props) {
    super(props);
    let { row, column, valueKey } = props;
    this.state = {
      isShowEditor: false,
      value: row[column[valueKey]],
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row, valueKey } = nextProps;
    if (row._id !== this.props.row._id) {
      this.setState({ value: row[column[valueKey]], isShowEditor: false });
    }
    if (nextProps.isEditorFocus !== this.props.isEditorFocus) {
      let activeInput = document.activeElement;
      if (nextProps.isEditorFocus === false && activeInput) {
        activeInput.blur();
      }
      this.setState({ isShowEditor: nextProps.isEditorFocus });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (e) => {
    if (e.keyCode === KeyCodes.Enter && this.props.isEditorFocus && !this.state.showCollaboratorSelect) {
      this.setState({ isShowEditor: true });
    }
  };

  toggleEditor = () => {
    this.props.updateTabIndex(this.props.columnIndex);
    this.setState({ isShowEditor: !this.state.isShowEditor });
  };

  onCommit = (value) => {
    this.props.onCommit(value);
    this.setState({ value, isShowEditor: false });
  };

  render() {
    let { column, isEditorFocus, isInModal } = this.props;
    let { value, isShowEditor } = this.state;
    let style = { width: 320 };
    if (isEditorFocus) {
      style = Object.assign({}, style, ROW_EXPAND_FOCUS_STYLE);
    }

    return (
      <Fragment>
        {isShowEditor ? (
          <DurationEditor
            isInModal={isInModal}
            column={column}
            value={value}
            toggleEditor={this.toggleEditor}
            onCommit={this.onCommit}
          />
        ) : (
          <div
            tabIndex={0}
            onFocus={this.toggleEditor}
            onClick={this.toggleEditor}
            className="form-control"
            style={style}
          >
            {getDurationDisplayString(value, column.data)}
          </div>
        )}
      </Fragment>
    );
  }
}

RowExpandDurationEditor.propTypes = {
  onCommit: PropTypes.func,
  column: PropTypes.object,
  row: PropTypes.object,
  isEditorFocus: PropTypes.bool,
  columnIndex: PropTypes.number,
  updateTabIndex: PropTypes.func.isRequired,
};

export default RowExpandDurationEditor;
