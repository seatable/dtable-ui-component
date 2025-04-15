import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

class Small extends React.Component {

  constructor(props) {
    super(props);
    const { row, column, valueKey } = props;
    this.state = {
      value: row[column[valueKey]] || '',
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row, valueKey } = nextProps;
    if (row._id !== this.props.row._id) {
      this.setState({ value: row[column[valueKey]] || '' });
    }
  }

  onBlur = () => {
    const { onCommit } = this.props;
    const updated = this.state.value.trim();
    onCommit(updated);
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

  onOpenEmailLink = () => {
    const { value } = this.state;
    let newValue = value.trim();
    window.location.href = `mailto:${newValue}`;
  };

  render() {
    const { value } = this.state;
    return (
      <div className="mobile-dtable-ui-row-expand-input-editor-container position-relative mobile-dtable-ui-row-expand-url-editor-container">
        <input
          type="text"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onCut={this.onCut}
          onPaste={this.onPaste}
          onChange={this.onChange}
          className="form-control mobile-dtable-ui-row-expand-url-input"
          value={value}
          onKeyDown={this.onKeyDown}
        />
        {(value && value.trim()) && <span aria-hidden="true" className="dtable-font dtable-icon-email mobile-dtable-ui-row-expand-jump-link" onClick={this.onOpenEmailLink}></span>}
      </div>
    );
  }
}

Small.propTypes = {
  column: PropTypes.object,
  row: PropTypes.object,
  onCommit: PropTypes.func.isRequired,
};

export default Small;
