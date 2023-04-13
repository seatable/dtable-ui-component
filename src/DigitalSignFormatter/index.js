import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import ImagesLazyLoad from '../ImageFormatter/images-lazy-load';
import ImagePreviewerLightbox from '../ImagePreviewerLightbox';
import { getDigitalSignImageUrl } from './utils';
import { downloadFile } from '../utils/utils';

import './index.css';

class DigitalSignFormatter extends Component {

  static defaultProps = {
    isSample: false,
    isSupportPreview: false,
    readOnly: true,
    value: '',
    server: '',
    containerClassName: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      isPreviewSignImage: false,
      largeSignImageIndex: -1,
    };
  }

  getSignImages = () => {
    const { value } = this.props;
    return [ getDigitalSignImageUrl(value) ].filter(Boolean);
  }

  onClickSignImage = (index) => {
    if (!this.props.isSupportPreview) return;
    this.setState({ isPreviewSignImage:true, largeSignImageIndex: index });
  }

  hideLargeSignImage = () => {
    if (!this.props.isSupportPreview) return;
    if (this.props.onCloseCallback) {
      this.props.onCloseCallback();
    }
    this.setState({ isPreviewSignImage: false, largeSignImageIndex: -1 });
  }

  downloadImage = (url) => {
    let availableUrl = url;
    let rotateIndex = availableUrl.indexOf('?a=');
    if (rotateIndex > -1) {
      availableUrl = availableUrl.slice(0, rotateIndex);
    }
    const urlSuffix = availableUrl.indexOf('?dl=1');
    const downloadUrl = urlSuffix !== -1 ? availableUrl : availableUrl + '?dl=1';
    downloadFile(downloadUrl);
  }

  render() {
    const { server, containerClassName, readOnly } = this.props;
    const className = cn('dtable-ui cell-formatter-container digital-sign-formatter', containerClassName);
    const signImages = this.getSignImages();
    if (signImages.length === 0) return null;
    const { isPreviewSignImage, largeSignImageIndex } = this.state;

    return (
      <>
        <div className={className}>
          <ImagesLazyLoad images={signImages} server={server} onImageClick={this.onClickSignImage}/>
        </div>
        {isPreviewSignImage && (
          <ImagePreviewerLightbox
            className="digital-sign-formatter-image-previewer"
            readOnly={readOnly}
            server={server}
            imageItems={signImages}
            imageIndex={largeSignImageIndex}
            closeImagePopup={this.hideLargeSignImage}
            downloadImage={this.downloadImage}
            moveToPrevImage={() => {}}
            moveToNextImage={() => {}}
          />
        )}
      </>
    );
  }

}

DigitalSignFormatter.propTypes = {
  isSample: PropTypes.bool,
  readOnly: PropTypes.bool,
  isSupportPreview: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  server: PropTypes.string,
  containerClassName: PropTypes.string,
  onCloseCallback: PropTypes.func,
};

export default DigitalSignFormatter;
