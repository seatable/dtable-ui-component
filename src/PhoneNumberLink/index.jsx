import PropTypes from 'prop-types';
import classnames from 'classnames';
import DTableIcon from '../DTableIcon';

const PhoneNumberLink = ({ phoneNumber, className }) => {
  return (
    <a className={classnames(className)} href={`tel:${typeof phoneNumber === 'string' ? phoneNumber.trim() : ''}`} tabIndex={0} aria-label="" target="_blank" rel="noopener noreferrer">
      <DTableIcon className="jump-link-icon" symbol="telephone" />
    </a>
  );
};

PhoneNumberLink.propTypes = {
  phoneNumber: PropTypes.string,
  classNames: PropTypes.string,
};

export default PhoneNumberLink;
