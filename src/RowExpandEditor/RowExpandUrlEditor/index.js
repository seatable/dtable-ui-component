import React from 'react';
import PropTypes from 'prop-types';
import toaster from '../../toaster';
import { isValidUrl, openUrlLink } from '../../utils/utils';
import { KeyCodes } from '../../constants';
import { getLocale } from '../../lang';

import './index.css';

class RowExpandUrlEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
    };
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.isEditorFocus) {
      this.focusInput();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row } = nextProps;
    if (row._id !== this.props.row._id) {
      this.setState({ value: row[column[this.props.valueKey]] || '' });
    }
    if (nextProps.isEditorFocus === true && this.props.isEditorFocus === false) {
      this.focusInput();
    }
    if (nextProps.isEditorFocus === false && this.props.isEditorFocus === true) {
      this.blurInput();
    }
  }

  focusInput = () => {
    // use setTimeout to make sure real DOM is rendered
    setTimeout(() => {
      this.urlInputRef && this.urlInputRef.focus();
    }, 1);
  };

  blurInput = () => {
    setTimeout(() => {
      this.urlInputRef && this.urlInputRef.blur();
    }, 1);
  };

  onBlur = () => {
    const { onCommit } = this.props;
    onCommit(this.state.value.trim());
  };

  onFocus = (e) => {
    this.props.updateTabIndex(this.props.columnIndex);
  };

  onChange = (e) => {
    let value = e.target.value;
    if (value === this.state.value) return;
    this.setState({ value });
  };

  onCut = (e) => {
    e.stopPropagation();
  };

  onPaste = (e) => {
    e.stopPropagation();
  };

  onKeyDown = (e) => {
    if (e.keyCode === KeyCodes.Esc) {
      e.stopPropagation();
      this.blurInput();
      return;
    }
    let { selectionStart, selectionEnd, value } = e.currentTarget;
    if (
      (e.keyCode === KeyCodes.ChineseInputMethod) ||
      (e.keyCode === KeyCodes.LeftArrow && selectionStart === 0) ||
      (e.keyCode === KeyCodes.RightArrow && selectionEnd === value.length)
    ) {
      e.stopPropagation();
    }
  };

  onOpenUrlLink = () => {
    const { value } = this.state;
    let newValue = value.trim();
    if (!isValidUrl(newValue)) {
      newValue = `http://${newValue}`;
    }
    try {
      openUrlLink(newValue);
    } catch {
      toaster.danger(getLocale('URL_is_invalid'));
    }
  };

  render() {
    let { value } = this.state;
    return (
      <div className="dtable-ui-row-expand-url-editor">
        <input
          ref={ref => this.urlInputRef = ref}
          type="text"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onCut={this.onCut}
          onPaste={this.onPaste}
          onChange={this.onChange}
          className="form-control dtable-ui-row-expand-url-input"
          value={value || ''}
          onKeyDown={this.onKeyDown}
        />
        {(value && value.trim()) && <span aria-hidden="true" className="dtable-font dtable-icon-url dtable-ui-row-expand-jump-link" onClick={this.onOpenUrlLink}></span>}
      </div>
    );
  }
}

RowExpandUrlEditor.propTypes = {
  isEditorFocus: PropTypes.bool,
  column: PropTypes.object,
  row: PropTypes.object,
  columnIndex: PropTypes.number,
  updateTabIndex: PropTypes.func.isRequired,
  onCommit: PropTypes.func.isRequired,
};

export default RowExpandUrlEditor;
