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
    let { value } = this.props;
    if (Array.isArray(value.links) && value.links.length > 0) {
      let links = value.links;
      return (
        <span className="long-text-links">
          <i className="dtable-font dtable-icon-url"></i>&nbsp;
          {links.length}
        </span>
      );
    }
    return null;
  }

  renderImages = () => {
    let { value } = this.props;
    if (Array.isArray(value.images) && value.images.length > 0) {
      let images = value.images;
      return (
        <span className="long-text-images">
          <img src={images[0]} alt=""/>
          <i className="image-number">{images.length > 1 ? '+' + images.length : null}</i>
        </span>
      )
    }
    return null;
  }

  renderContent = () => {
    let { value } = this.props;
    return (<span className="long-text-content">{value.preview}</span>)
  }

  render() {
    let { containerClassName } = this.props;
    let classname = cn('cell-formatter-container long-text-formatter', containerClassName);
    return (
      <div className={classname}>
        {this.renderLinks()}
        {this.renderImages()}
        {this.renderContent()}
      </div>
    );
  }
}

LongTextFormatter.propTypes = propTypes;

export default LongTextFormatter;
