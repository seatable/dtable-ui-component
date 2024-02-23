import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import RowExpandImageImageFormatter from './row-expand-image-item-formatter';
import ImagePreviewerLightbox from '../ImagePreviewerLightbox';

import './index.css';

export default class RowExpandImageFormatter extends React.Component {

  static propTypes = {
    readOnly: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    server: PropTypes.string,
    containerClassName: PropTypes.string,
    deleteFile: PropTypes.func,
    downloadImage: PropTypes.func,
    rotateImage: PropTypes.func,
    moveToPrevRowImage: PropTypes.func,
    moveToNextRowImage: PropTypes.func,
    onCloseCallback: PropTypes.func,
    column: PropTypes.object,
  };

  static defaultProps = {
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
  }

  onImageClick = (index) => {
    this.setState({ isPreviewImage: true, previewImageIndex: index });
  };

  closeImagePopup = () => {
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

  render() {
    const { value, server, containerClassName, readOnly, column, downloadImage } = this.props;
    const { isPreviewImage, previewImageIndex } = this.state;
    if (!Array.isArray(value) || value.length === 0) {
      return null;
    }
    return (
      <Fragment>
        <div className={classnames('dtable-ui cell-formatter-container row-expand-image-formatter', containerClassName)}>
          {value.map((item, index) => {
            return (
              <RowExpandImageImageFormatter
                url={item}
                key={index}
                index={index}
                column={column}
                downloadFile={downloadImage}
                deleteFile={this.props.deleteFile}
                readOnly={readOnly}
                onImageClick={this.onImageClick}
              />
            );
          })}
        </div>
        {isPreviewImage && (
          <ImagePreviewerLightbox
            imageItems={value}
            imageIndex={previewImageIndex}
            closeImagePopup={this.closeImagePopup}
            moveToPrevImage={this.movePrev}
            moveToNextImage={this.moveNext}
            deleteImage={this.props.deleteFile}
            downloadImage={downloadImage}
            onRotateImage={this.props.rotateImage}
            readOnly={readOnly}
            server={server}
            moveToPrevRowImage={this.props.moveToPrevRowImage}
            moveToNextRowImage={this.props.moveToNextRowImage}
          />
        )}
      </Fragment>
    );
  }
}
