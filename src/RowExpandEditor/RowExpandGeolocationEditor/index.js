import React from 'react';
import PropTypes from 'prop-types';
import { isEmptyObject, getGeolocationDisplayString } from 'dtable-utils';
import { KeyCodes, ROW_EXPAND_BTN_FOCUS_STYLE } from '../../constants';
import RowExpandAddBtn from '../RowExpandAddBtn';
import { getLocale } from '../../lang';
import GeolocationEditor from '../../GeolocationEditor';

import './index.css';

class RowExpandGeolocationEditor extends React.Component {

  constructor(props) {
    super(props);
    const { row, column, valueKey } = props;
    this.state = {
      isShowEditor: false,
      value: row[column[valueKey]] || {}
    };
    this.addBtnRef = React.createRef();
    this.isGeolocationLargeMapOpen = false;
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.hideEditor);
    document.addEventListener('keydown', this.onKeyDown);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row, valueKey } = nextProps;
    if (row._id !== this.props.row._id) {
      this.setState({
        value: row[column[valueKey]] || {},
        isShowEditor: false
      });
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
    document.removeEventListener('mousedown', this.hideEditor);
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (e) => {
    if (e.keyCode === KeyCodes.Enter && this.props.isEditorFocus && !this.state.isShowEditor) {
      this.setState({ isShowEditor: true });
    }
  };

  hideEditor = (event) => {
    if (
      !this.state.isShowEditor
      || !event.target || event.target.tagName.toUpperCase() === 'INPUT'
      || this.editorContainer.contains(event.target)
    ) return;
    if (this.state.isShowEditor && this.geoEditor.getLargeEditorState()) return;
    this.setState({ isShowEditor: false });
  };

  toggleEditor = () => {
    this.props.updateTabIndex(this.props.columnIndex);
    this.setState({ isShowEditor: !this.state.isShowEditor }, () => {
      if (!this.state.isShowEditor) {
        if (isEmptyObject(this.state.value)) {
          // eslint-disable-next-line no-unused-expressions
          this.addBtnRef.current?.focus();
        } else {
          this.geoLocationRef.focus();
        }
      }
    });
  };

  onFocus = () => {
    this.props.updateTabIndex(this.props.columnIndex);
  };

  onCommit = (value) => {
    this.props.onCommit(value);
    this.setState({ value });
    this.toggleEditor();
  };

  renderGeoLocation = () => {
    let { isEditorFocus } = this.props;
    let { value } = this.state;
    if (!isEmptyObject(value)) {
      const displayContent = this.getLocationInfo(value);
      return (
        <div
          tabIndex={0}
          style={isEditorFocus ? ROW_EXPAND_BTN_FOCUS_STYLE : {}}
          onFocus={this.onFocus}
          role="button"
          ref={ref => this.geoLocationRef = ref}
          className="dtable-ui-row-expand-geolocation-value"
          onClick={this.toggleEditor}
        >
          {displayContent}
        </div>
      );
    }
    return (
      <RowExpandAddBtn
        ref={this.addBtnRef}
        onFocus={this.onFocus}
        onClick={this.toggleEditor}
        isFocus={isEditorFocus}
        text={getLocale('Edit_Location')}
      />
    );
  };

  getLocationInfo = (value) => {
    const { column } = this.props;
    const { dtableBaiduMapKey, dtableMineMapKey } = window.dtable;
    const isBaiduMap = !!(dtableBaiduMapKey || dtableMineMapKey);
    return getGeolocationDisplayString(value, column.data, { isBaiduMap, hyphen: ' ' });
  };

  render() {
    const { column, row } = this.props;
    const { value } = this.state;
    return (
      <div ref={ref => this.editorContainer = ref} className="mt-2">
        {this.renderGeoLocation()}
        {this.state.isShowEditor && (
          <GeolocationEditor
            ref={ref => this.geoEditor = ref}
            isInModal={true}
            column={column}
            row={row}
            value={value}
            onCommit={this.onCommit}
            onCommitCancel={this.toggleEditor}
            onPressTab={this.props.onPressTab}
          />
        )}
      </div>
    );
  }
}

RowExpandGeolocationEditor.propTypes = {
  column: PropTypes.object,
  row: PropTypes.object,
  onCommit: PropTypes.func,
  isEditorFocus: PropTypes.bool,
  columnIndex: PropTypes.number,
  updateTabIndex: PropTypes.func.isRequired,
  onEditorOpen: PropTypes.func,
  onEditorClose: PropTypes.func,
};

export default RowExpandGeolocationEditor;
