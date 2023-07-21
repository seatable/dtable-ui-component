import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import toaster from '../toaster';
import { isValidUrl, getTrimmedString } from '../utils/editor-utils';

import './index.css';

const propTypes = {
  value: PropTypes.string,
  containerClassName: PropTypes.string,
};

class UrlFormatter extends React.Component {

  onOpenUrlLink = () => {
    const { value } = this.props;
    const url = getTrimmedString(value);
    const validUrl = isValidUrl(url) ? url : `http://${url}`;
    try {
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.href = validUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
      document.body.removeChild(a);
    } catch {
      toaster.danger('The url is invalid');
    }
  }

  render() {
    const { containerClassName, value } = this.props;
    let classname = classnames('dtable-ui cell-formatter-container url-formatter', containerClassName);
    return (
      <div className={classname}>
        <span className="url-formatter-value text-truncate">{value}</span>
        {getTrimmedString(value) &&
          <span className="dtable-font dtable-icon-url row-expand-jump-link" onClick={this.onOpenUrlLink}></span>
        }
      </div>
    );
  }
}

UrlFormatter.propTypes = propTypes;

export default UrlFormatter;
