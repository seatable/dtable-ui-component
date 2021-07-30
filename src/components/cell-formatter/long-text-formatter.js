import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import getPreviewContent from '../../utils/normalize-long-text-value';
import { getImageThumbnailUrl } from '../../utils/utils';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  containerClassName: PropTypes.string,
  server: PropTypes.string,
};

class LongTextFormatter extends React.Component {

  static defaultProps = {
    value: {
      text: '',
      images: [],
      links: [],
      preview: '',
    },
    server: '',
  }

  renderLinks = (value) => {
    const links = value.links;
    if (!Array.isArray(links) || links.length === 0) return null;
    return (
      <span className="long-text-links">
        <i className="dtable-font dtable-icon-url"></i>
        {links.length}
      </span>
    );
  }

  renderCheckList = (value) => {
    const checkList = value.checklist;
    if (!checkList || checkList.total === 0) return null;
    return (
      <span className="long-text-check-list">
        <i className={`dtable-font dtable-icon-check-square-solid ${checkList.completed === checkList.total ? 'long-text-check-list-completed' : ''}`}></i>
        {`${checkList.completed}/${checkList.total}`}
      </span>
    );
  }

  renderImages = (value) => {
    const images = value.images;
    if (!Array.isArray(images) || images.length === 0) return null;
    const thumbnailUrl = getImageThumbnailUrl(images[0], this.props.server);
    return (
      <span className="long-text-images">
        <img src={thumbnailUrl} alt=""/>
        <i className="image-number">{images.length > 1 ? '+' + images.length : null}</i>
      </span>
    );
  }

  renderContent = (value) => {
    return (<span className="long-text-content">{value.preview}</span>)
  }

  translateValue = () => {
    const { value } = this.props;
    if (!value) return {};
    const valueType = Object.prototype.toString.call(value);
    if (valueType === '[object String]') {
      return getPreviewContent(value);
    }
    if (valueType === '[object Object]') {
      return value;
    }
    return {};
  }

  render() {
    const { containerClassName } = this.props;
    const className = cn('dtable-ui cell-formatter-container long-text-formatter', containerClassName);
    const value = this.translateValue();
    return (
      <div className={className}>
        {this.renderLinks(value)}
        {this.renderCheckList(value)}
        {this.renderImages(value)}
        {this.renderContent(value)}
      </div>
    );
  }
}

LongTextFormatter.propTypes = propTypes;

export default LongTextFormatter;
