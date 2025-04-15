import React from 'react';
import PropTypes from 'prop-types';
import { KeyCodes } from '../../../constants';

import './index.css';

class Large extends React.Component {

  constructor(props) {
    super(props);
    const { row, column, valueKey } = props;
    this.state = {
      value: row[column[valueKey]] || '',
    };
  }

  componentDidMount() {
    if (this.props.isEditorFocus) {
      this.focusInput();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row, valueKey } = nextProps;
    if (row._id !== this.props.row._id) {
      this.setState({ value: row[column[valueKey]] || '' });
    }
    if (nextProps.isEditorFocus === true && this.props.isEditorFocus === false) {
      this.focusInput();
    } else if (nextProps.isEditorFocus === false && this.props.isEditorFocus === true) {
      this.blurInput();
    }
  }

  focusInput = () => {
    // use setTimeout to make sure real DOM is rendered
    setTimeout(() => {
      this.urlInputRef.focus();
    }, 1);
  };

  blurInput = () => {
    setTimeout(() => {
      this.urlInputRef.blur();
    }, 1);
  };

  onBlur = () => {
    const { onCommit } = this.props;
    const updated = this.state.value.trim();
    onCommit(updated);
  };

  onFocus = (e) => {
    this.props.updateTabIndex(this.props.columnIndex);
  };

  onChange = (e) => {
    const value = e.target.value;
    if (value === this.state.value) return;
    this.setState({ value });
  };

  onCut = (e) => {
    e.stopPropagation();
  };

  onPaste = (e) => {
    e.stopPropagation();
  };

  onKeyDown = (event) => {
    if (event.keyCode === KeyCodes.Esc) {
      event.stopPropagation();
      this.blurInput();
      return;
    }
    const { selectionStart, selectionEnd, value } = event.currentTarget;
    if (
      (event.keyCode === KeyCodes.ChineseInputMethod) ||
      (event.keyCode === KeyCodes.LeftArrow && selectionStart === 0) ||
      (event.keyCode === KeyCodes.RightArrow && selectionEnd === value.length)
    ) {
      event.stopPropagation();
    }
  };

  onOpenEmailLink = () => {
    const { value } = this.state;
    let newValue = value.trim();
    window.location.href = `mailto:${newValue}`;
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
          value={value}
          onKeyDown={this.onKeyDown}
        />
        {(value && value.trim()) && <span aria-hidden="true" className="dtable-font dtable-icon-email dtable-ui-row-expand-jump-link" onClick={this.onOpenEmailLink}></span>}
      </div>
    );
  }
}

Large.propTypes = {
  onCommit: PropTypes.func.isRequired,
  column: PropTypes.object,
  row: PropTypes.object,
  isEditorFocus: PropTypes.bool,
  columnIndex: PropTypes.number,
  updateTabIndex: PropTypes.func.isRequired,
};

export default Large;
