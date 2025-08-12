import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { checkIsDisplayAsPhoneNumberColumn } from 'dtable-utils';
import PhoneNumberLink from '../../PhoneNumberLink';
import { getTrimmedString } from '../../utils/editor-utils';

import './index.css';

const propTypes = {
  value: PropTypes.string,
  column: PropTypes.object,
  containerClassName: PropTypes.string,
};

class TextFormatter extends React.Component {
  getFormattedValue = (val) => {
    if (typeof val === 'object') {
      return null;
    }
    if (Object.prototype.toString.call(val) === '[object Boolean]') {
      return val + '';
    }
    return val;
  };

  render() {
    const { containerClassName, value, column } = this.props;
    const classname = classnames('dtable-ui cell-formatter-container row-expand-jump-link-container text-formatter', containerClassName);
    const formattedValue = this.getFormattedValue(value);
    const isDisplayAsAsPhoneNumber = column ? checkIsDisplayAsPhoneNumberColumn(column) : false;
    return (
      <div className={classname}>
        <span className="text-formatter-value row-expand-jump-link-value text-truncate">{formattedValue}</span>
        {(isDisplayAsAsPhoneNumber && !!getTrimmedString(value)) &&
          <PhoneNumberLink phoneNumber={value} className="row-expand-jump-link-btn" />
        }
      </div>
    );
  }
}

TextFormatter.propTypes = propTypes;

export default TextFormatter;
