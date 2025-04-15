import React from 'react';
import PropTypes from 'prop-types';
import { getDateDisplayString } from 'dtable-utils';
import DateEditor from '../../DateEditor';
import { getEventClassName } from '../../utils/utils';
import { getDateColumnFormat } from '../../utils/column-utils';
import { KeyCodes, ROW_EXPAND_FOCUS_STYLE } from '../../constants';

class Large extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowEditor: false,
      value: null,
    };
  }

  componentDidMount() {
    const { column, row, valueKey } = this.props;
    this.setState({ value: row[column[valueKey]] });
    document.addEventListener('keydown', this.onKeyDown);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row, valueKey } = nextProps;
    if (row._id !== this.props.row._id) {
      this.setState({ value: row[column[valueKey]], isShowEditor: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isShowEditor !== prevState.isShowEditor) {
      if (this.state.isShowEditor === true && this.props.onEditorOpen) {
        this.props.onEditorOpen();
      }
      if (this.state.isShowEditor === false && this.props.onEditorClose) {
        this.props.onEditorClose();
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (e) => {
    if (e.keyCode === KeyCodes.Enter && this.props.isEditorFocus && !this.state.isShowEditor) {
      if (getEventClassName(e).includes('rc-calendar')) return;
      this.setState({ isShowEditor: true });
    }
  };

  hideCalendar = () => {
    this.setState({ isShowEditor: false }, () => {
      this.dateContainerRef && this.dateContainerRef.focus();
    });
  };

  onFocus = () => {
    this.props.updateTabIndex(this.props.columnIndex);
  };

  toggleEditor = () => {
    this.props.updateTabIndex(this.props.columnIndex);
    this.setState({ isShowEditor: !this.state.isShowEditor });
  };

  onCommit = (value) => {
    this.props.onCommit(value);
    this.setState({ value });
  };

  onClear = () => {
    this.setState({ value: null });
    this.props.onCommit(null);
  };

  render() {
    let { column, isInModal, isEditorFocus, lang } = this.props;
    let { value, isShowEditor } = this.state;
    const format = getDateColumnFormat(column);
    return (
      <div ref={ref => this.dateSelectRef = ref}>
        {isShowEditor ? (
          <DateEditor
            isInModal={isInModal}
            value={value}
            lang={lang}
            column={column}
            onCommit={this.onCommit}
            hideCalendar={this.hideCalendar}
          />
        ) : (
          <div
            tabIndex={0}
            onFocus={this.onFocus}
            onClick={this.toggleEditor}
            ref={ref => this.dateContainerRef = ref}
            className="form-control"
            style={isEditorFocus ? Object.assign({ width: 320 }, ROW_EXPAND_FOCUS_STYLE) : { width: 320 }}
          >
            {value ? getDateDisplayString(value, format) : ''}
          </div>
        )}
      </div>
    );
  }
}

Large.propTypes = {
  onCommit: PropTypes.func,
  column: PropTypes.object,
  row: PropTypes.object,
  lang: PropTypes.string,
  isEditorFocus: PropTypes.bool,
  columnIndex: PropTypes.number,
  updateTabIndex: PropTypes.func.isRequired,
  onEditorOpen: PropTypes.func,
  onEditorClose: PropTypes.func,
};

export default Large;
