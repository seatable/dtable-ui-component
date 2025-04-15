import React from 'react';
import PropTypes from 'prop-types';
import toaster from '../../../toaster';
import { isValidUrl, openUrlLink } from '../../../utils/utils';
import { getLocale } from '../../../lang';

import './index.css';

class Large extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row } = nextProps;
    if (row._id !== this.props.row._id) {
      this.setState({ value: row[column[this.props.valueKey]] || '' });
    }
  }

  onBlur = () => {
    const { onCommit } = this.props;
    onCommit(this.state.value.trim());
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
          value={value || ''}
          onKeyDown={this.onKeyDown}
        />
        {(value && value.trim()) && <span aria-hidden="true" className="dtable-font dtable-icon-url mobile-dtable-ui-row-expand-jump-link" onClick={this.onOpenUrlLink}></span>}
      </div>
    );
  }
}

Large.propTypes = {
  column: PropTypes.object,
  row: PropTypes.object,
  onCommit: PropTypes.func.isRequired,
};

export default Large;
