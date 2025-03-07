import React from 'react';
import PropTypes from 'prop-types';
import { getDurationDisplayString, formatDurationToNumber } from 'dtable-utils';
import classnames from 'classnames';
import { KeyCodes } from '../constants';

class DurationEditor extends React.Component {

  constructor(props) {
    super(props);
    let { value, column } = props;
    this.initValue = value || value === 0 ? getDurationDisplayString(value, column.data) : '';
    this.state = {
      value: this.initValue,
    };
  }

  componentDidMount() {
    if (this.props.isInModal) {
      this.input.focus();
    }
  }

  onChange = (event) => {
    let value = event.target.value.trim().replace(/[^.-\d:：]/g, '');
    if (value === this.state.value) {
      return;
    }
    this.setState({ value });
  };

  onKeyDown = (event) => {
    let { selectionStart, selectionEnd, value } = event.currentTarget;
    if (event.keyCode === KeyCodes.Enter) {
      event.preventDefault();
      this.onBlur();
      if (this.props.selectDownCell) this.props.selectDownCell();
    } else if ((event.keyCode === KeyCodes.LeftArrow && selectionStart === 0) ||
      (event.keyCode === KeyCodes.RightArrow && selectionEnd === value.length)
    ) {
      event.stopPropagation();
    }
  };

  getValue = () => {
    const { column } = this.props;
    const newDuration = formatDurationToNumber(this.getInputNode().value, column.data);
    return newDuration;
  };

  getInputNode = () => {
    if (!this.input) return null;
    if (this.input.tagName === 'INPUT') {
      return this.input;
    }
    return this.input.querySelector('input:not([type=hidden])');
  };

  onBlur = () => {
    this.props.isInModal ? this.props.onCommit(this.getValue()) : this.props.onBlur();
  };

  setInputRef = (input) => {
    this.input = input;
    return this.input;
  };

  onPaste = (e) => {
    e.stopPropagation();
  };

  onCut = (e) => {
    e.stopPropagation();
  };

  render() {
    const { column, isInModal, className } = this.props;
    const data = column.data || {};
    const { duration_format } = data;
    const style = isInModal ? { textAlign: 'left', width: '320px' } : { textAlign: 'right' };

    return (
      <input
        ref={this.setInputRef}
        type="text"
        className={classnames('form-control', className)}
        value={this.state.value}
        onBlur={this.onBlur}
        onPaste={this.onPaste}
        onCut={this.onCut}
        onKeyDown={this.onKeyDown}
        onChange={this.onChange}
        style={style}
        placeholder={duration_format}
      />
    );
  }
}

DurationEditor.propTypes = {
  onBlur: PropTypes.func,
  column: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isInModal: PropTypes.bool,
  className: PropTypes.string,
  onCommit: PropTypes.func,
  selectDownCell: PropTypes.func,
};

export default DurationEditor;
