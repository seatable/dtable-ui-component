import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

class DTableEmptyTip extends React.Component {

  render() {
    const { text, title, type } = this.props;
    return (
      <div className="empty-tip">
        <img src={this.props.src} alt="" width="100" height="100" className="no-items-img-tip" />
        {title && <span className="empty-tip-title">{title}</span>}
        {text && <span className="empty-tip-text" style={{color: type === 'error' ? 'red' : '#666'}}>{text}</span>}
        {this.props.children && this.props.children}
      </div>
    );
  }
}

DTableEmptyTip.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.element,
};

export default DTableEmptyTip;
