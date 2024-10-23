import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ImagesLazyLoad from './images-lazy-load';
import { getImageThumbnailUrl } from './utils';
import ImagePreviewerLightbox from '../ImagePreviewerLightbox';

import './index.css';

class ImageFormatter extends React.Component {

  static defaultProps = {
    isSample: false,
    isSupportPreview: false,
    readOnly: true,
    value: [],
    server: '',
    containerClassName: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      isPreviewImage: false,
      previewImageIndex: -1,
    };
    this.canDelete = props.deleteImage && !props.readOnly;
    this.canRotate = props.rotateImage && !props.readOnly;
  }

  onImageClick = (index) => {
    if (!this.props.isSupportPreview) return;
    this.setState({ isPreviewImage: true, previewImageIndex: index });
  };

  closeImagePopup = () => {
    if (!this.props.isSupportPreview) return;
    if (this.props.onCloseCallback) {
      this.props.onCloseCallback();
    }
    this.setState({ isPreviewImage: false, previewImageIndex: -1 });
  };

  movePrev = () => {
    let images = this.props.value;
    this.setState(prevState => ({
      previewImageIndex: (prevState.previewImageIndex + images.length - 1) % images.length,
    }));
  };

  moveNext = () => {
    let images = this.props.value;
    this.setState(prevState => ({
      previewImageIndex: (prevState.previewImageIndex + 1) % images.length,
    }));
  };

  downloadImage = (imageItemUrl) => {
    if (!this.props.downloadImage) return;
    this.props.downloadImage(imageItemUrl);
  };

  deleteImage = (index) => {
    this.props.deleteImage(index);
  };

  onRotateImage = (index, degree) => {
    this.props.rotateImage(index, degree);
  };

  render() {
    const { isSample, value, server, containerClassName, readOnly } = this.props;
    const className = classnames('dtable-ui cell-formatter-container image-formatter', containerClassName);
    const { isPreviewImage, previewImageIndex } = this.state;
    if (!Array.isArray(value) || value.length === 0) {
      return null;
    }

    if (isSample) {
      let item = value[0];
      let url = getImageThumbnailUrl(item, server);
      return (
        <div className={className}>
          <img className="image-item" src={url} alt=""/>
          {value.length !== 1 && <span className="image-item-count">{`+${value.length}`}</span>}
        </div>
      );
    }

    return (
      <Fragment>
        <div className={className}>
          <ImagesLazyLoad images={value} server={server} onImageClick={this.onImageClick} renderItem={this.props.renderItem}/>
        </div>
        {isPreviewImage && (
          <ImagePreviewerLightbox
            imageItems={value}
            imageIndex={previewImageIndex}
            closeImagePopup={this.closeImagePopup}
            moveToPrevImage={this.movePrev}
            moveToNextImage={this.moveNext}
            deleteImage={this.canDelete ? this.deleteImage : null}
            downloadImage={this.downloadImage}
            onRotateImage={this.canRotate ? this.onRotateImage : null}
            readOnly={readOnly}
            server={server}
            moveToPrevRowImage={this.props.moveToPrevRowImage}
            moveToNextRowImage={this.props.moveToNextRowImage}
            onViewOriginal={this.props.onViewOriginal}
          />
        )}
      </Fragment>
    );
  }
}

ImageFormatter.propTypes = {
  isSample: PropTypes.bool,
  readOnly: PropTypes.bool,
  isSupportPreview: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  server: PropTypes.string,
  containerClassName: PropTypes.string,
  deleteImage: PropTypes.func,
  downloadImage: PropTypes.func,
  rotateImage: PropTypes.func,
  onViewOriginal: PropTypes.func,
  moveToPrevRowImage: PropTypes.func,
  moveToNextRowImage: PropTypes.func,
  onCloseCallback: PropTypes.func,
  renderItem: PropTypes.func,
};


export default ImageFormatter;
