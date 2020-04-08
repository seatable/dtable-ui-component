import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import ImagesLazyLoad from '../common/images-lazy-load';
import { getImageThumbnailUrl } from '../../utils/utils';

const propTypes = {
  isSample: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  server: PropTypes.string,
  containerClassName: PropTypes.string,
};

class ImageFormatter extends React.Component {

  static defaultProps = {
    isSample: false,
    value: [],
    server: '',
    containerClassName: '',
  }

  onImageClick = (index) => {
    // alert(index);
    // need provide image previewer component
  }

  render() {

    let { isSample, value, server, containerClassName } = this.props;
    let classname = cn('cell-formatter-container image-formatter', containerClassName);
    if (!Array.isArray(value) || value.length === 0) {
      return null;
    }

    if (isSample) {
      let item = value[0];
      let url = getImageThumbnailUrl(item, server);
      return (
        <div className={classname}>
          <img className="image-item" src={url} alt=""/>
          {value.length !== 1 && <span className="image-item-count">{`+${value.length}`}</span>}
        </div>
      );
    }

    return (
      <div className={classname}>
        <ImagesLazyLoad images={value} server={server} onImageClick={this.onImageClick}/>
      </div>
    );
  }
}

ImageFormatter.propTypes = propTypes;

export default ImageFormatter;
