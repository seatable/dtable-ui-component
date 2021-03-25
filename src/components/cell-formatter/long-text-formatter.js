import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  containerClassName: PropTypes.string,
};

class LongTextFormatter extends React.Component {

  static defaultProps = {
    value: {
      text: '',
      images: [],
      links: [],
      preview: '',
    },
  }

  renderLinks = () => {
    const { value } = this.props;
    const links = value.links;
    if (!Array.isArray(links) || links.length === 0) return null;
    return (
      <span className="long-text-links">
        <i className="dtable-font dtable-icon-url"></i>
        {links.length}
      </span>
    );
  }

  renderCheckList = () => {
    const { value } = this.props;
    const checkList = value.checklist;
    if (!checkList || checkList.total === 0) return null;
    return (
      <span className="long-text-check-list">
        <i className={`dtable-font dtable-icon-check-square-solid ${checkList.completed === checkList.total ? 'long-text-check-list-completed' : ''}`}></i>
        {`${checkList.completed}/${checkList.total}`}
      </span>
    );
  }

  renderImages = () => {
    let { value } = this.props;
    const images = value.images;
    if (!Array.isArray(images) || images.length === 0) return null;
    return (
      <span className="long-text-images">
        <img src={images[0]} alt=""/>
        <i className="image-number">{images.length > 1 ? '+' + images.length : null}</i>
      </span>
    );
  }

  renderContent = () => {
    let { value } = this.props;
    return (<span className="long-text-content">{value.preview}</span>)
  }

  render() {
    let { containerClassName } = this.props;
    let classname = cn('dtable-ui cell-formatter-container long-text-formatter', containerClassName);
    return (
      <div className={classname}>
        {this.renderLinks()}
        {this.renderCheckList()}
        {this.renderImages()}
        {this.renderContent()}
      </div>
    );
  }
}

LongTextFormatter.propTypes = propTypes;

export default LongTextFormatter;
