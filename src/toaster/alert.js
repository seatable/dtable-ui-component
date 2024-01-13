import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  intent: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  onRemove: PropTypes.func.isRequired,
  children: PropTypes.string,
  isRemovable: PropTypes.bool,
};

class Alert extends React.PureComponent {

  getIconClass(intent) {
    switch (intent) {
      case 'success':
        return 'dtable-font dtable-icon-check-circle';
      case 'warning':
        return 'dtable-font dtable-icon-exclamation-triangle';
      case 'none':
        return 'dtable-font dtable-icon-exclamation-circle';
      case 'danger':
        return 'dtable-font dtable-icon-exclamation-circle';
      default:
        return 'dtable-font dtable-icon-check-circle';
    }
  }

  render() {
    const { intent, title, children, isRemovable, onRemove } = this.props;
    const iconClass = this.getIconClass(intent);
    return (
      <div className={`dtable-toast-alert-container ${intent || 'success'}`}>
        <div className="toast-alert-icon"><i className={iconClass} /></div>
        <div className="toast-text-container">
          <p className="toast-text-title">{title}</p>
          {children ? <p className="toast-text-child">{children}</p> : null}
        </div>
        {isRemovable && (
          <div onClick={onRemove} className="toast-close">
            <span>&times;</span>
          </div>
        )}
      </div>
    );
  }
}

Alert.propTypes = propTypes;

export default Alert;
