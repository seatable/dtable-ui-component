import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

const propTypes = {
  value: PropTypes.string,
  containerClassName: PropTypes.string,
};

class UrlFormatter extends React.Component {

  isValidUrl = (url) => {
    const reg = /^(([-a-zA-Z0-9+.]+):\/\/)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;
    return reg.test(url);
  };

  getTrimmedString = () => {
    const { value } = this.props;
    return (typeof value === 'string') ? value.trim() : '';
  };

  onOpenUrlLink = () => {
    const { value } = this.props;
    const url = this.getTrimmedString(value);
    const validUrl = this.isValidUrl(url) ? url : `http://${url}`;
    try {
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.href = validUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
      document.body.removeChild(a);
    } catch {
      throw new Error('The url is invalid');
    }
  }

  render() {
    const { containerClassName, value } = this.props;
    let classname = classnames('dtable-ui cell-formatter-container url-formatter', containerClassName);
    return (
      <div className={classname}>
        <span className="url-formatter-value text-truncate">{value}</span>
        {this.getTrimmedString() &&
          <span className="dtable-font dtable-icon-url row-expand-jump-link" onClick={this.onOpenUrlLink}></span>
        }
      </div>
    );
  }
}

UrlFormatter.propTypes = propTypes;

export default UrlFormatter;
