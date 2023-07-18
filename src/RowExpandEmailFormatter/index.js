import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

const propTypes = {
  value: PropTypes.string,
  containerClassName: PropTypes.string,
};

class RowExpandEmailFormatter extends React.Component {

  getTrimmedString = () => {
    const { value } = this.props;
    return (typeof value === 'string') ? value.trim() : '';
  };

  onOpenEmailLink = () => {
    const { value } = this.props;
    let newValue = value.trim();
    window.location.href = `mailto:${newValue}`;
  }

  render() {
    const { containerClassName, value } = this.props;
    let classname = classnames('dtable-ui cell-formatter-container email-formatter', containerClassName);
    return (
      <div className={classname}>
        <span className="email-formatter-value text-truncate">{value}</span>
        {this.getTrimmedString() &&
          <span className="dtable-font dtable-icon-email row-expand-jump-link" onClick={this.onOpenEmailLink}></span>
        }
      </div>
    );
  }
}

RowExpandEmailFormatter.propTypes = propTypes;

export default RowExpandEmailFormatter;
