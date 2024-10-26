import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
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
    config: {},
    containerClassName: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      isPreviewSignImage: false,
      largeSignImageIndex: -1,
    };
  }

  getSignImages = () => {
    const { value, config } = this.props;
    return [getDigitalSignImageUrl(value, config)].filter(Boolean);
  };

  onClickSignImage = (index) => {
    if (!this.props.isSupportPreview) return;
    this.setState({
      isPreviewSignImage: true,
      largeSignImageIndex: index,
    });
  };

  hideLargeSignImage = () => {
    if (!this.props.isSupportPreview) return;
    if (this.props.onCloseCallback) {
      this.props.onCloseCallback();
    }
    this.setState({
      isPreviewSignImage: false,
      largeSignImageIndex: -1,
    });
  };

  downloadImage = (url) => {
    let availableUrl = url;
    let rotateIndex = availableUrl.indexOf('?a=');
    if (rotateIndex > -1) {
      availableUrl = availableUrl.slice(0, rotateIndex);
    }
    const urlSuffix = availableUrl.indexOf('?dl=1');
    const downloadUrl = urlSuffix !== -1 ? availableUrl : availableUrl + '?dl=1';
    downloadFile(downloadUrl);
  };

  render() {
    const { containerClassName, readOnly, config, isSample, renderItem } = this.props;
    const className = classnames('dtable-ui cell-formatter-container digital-sign-formatter', containerClassName);
    const signImages = this.getSignImages();
    if (signImages.length === 0) return null;
    const { isPreviewSignImage, largeSignImageIndex } = this.state;

    return (
      <>
        <div className={className}>
          <ImagesLazyLoad images={signImages} server={config.server} onImageClick={this.onClickSignImage} renderItem={renderItem} />
        </div>
        {isPreviewSignImage && (
          <ImagePreviewerLightbox
            className="digital-sign-formatter-image-previewer"
            readOnly={readOnly}
            server={isSample ? config.server : ''}
            imageItems={signImages}
            imageIndex={largeSignImageIndex}
            closeImagePopup={this.hideLargeSignImage}
            downloadImage={this.downloadImage}
            onViewOriginal={this.props.onViewOriginal}
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
  config: PropTypes.shape({
    server: PropTypes.string,
    workspaceID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dtableUuid: PropTypes.string,
  }),
  containerClassName: PropTypes.string,
  onCloseCallback: PropTypes.func,
  onViewOriginal: PropTypes.func,
  renderItem: PropTypes.func,
};

export default DigitalSignFormatter;
